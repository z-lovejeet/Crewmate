import logging
from typing import Optional
from google import genai
from ..config.settings import get_settings

logger = logging.getLogger(__name__)

_client: Optional[genai.Client] = None

def get_genai_client() -> genai.Client:
    """Get a cached GenAI client configured for Vertex AI."""
    global _client
    if _client is None:
        settings = get_settings()
        if settings.USE_VERTEX_AI:
            _client = genai.Client(
                vertexai=True,
                project=settings.GCP_PROJECT_ID,
                location=settings.GCP_REGION,
            )
            logger.info(f"GenAI client initialized with Vertex AI (project={settings.GCP_PROJECT_ID})")
        elif settings.GOOGLE_GENAI_API_KEY:
            _client = genai.Client(api_key=settings.GOOGLE_GENAI_API_KEY)
            logger.info("GenAI client initialized with API key")
        else:
            raise RuntimeError("No Vertex AI or API key configured")
    return _client


def generate_text(
    prompt: str,
    model: Optional[str] = None,
    system_instruction: Optional[str] = None,
) -> str:
    """Generate text using Gemini with automatic fallback across models.
    
    Uses Vertex AI by default (GCP credits), with API key as optional fallback.
    Tries PRIMARY_MODEL -> FALLBACK_MODEL -> REASONING_MODEL in sequence.
    """
    settings = get_settings()
    models_to_try = [
        model or settings.PRIMARY_MODEL,
        settings.FALLBACK_MODEL,
        settings.REASONING_MODEL,
    ]
    # Deduplicate while preserving order
    unique_models = list(dict.fromkeys(models_to_try))

    client = get_genai_client()
    last_error = None

    for candidate_model in unique_models:
        try:
            config = {}
            if system_instruction:
                config["system_instruction"] = system_instruction

            response = client.models.generate_content(
                model=candidate_model,
                contents=prompt,
                config=config if config else None,
            )
            if response and response.text:
                logger.info(f"Generated text with {candidate_model} ({len(response.text)} chars)")
                return response.text
        except Exception as e:
            last_error = e
            logger.warning(f"Model {candidate_model} failed: {e}. Trying fallback...")
            continue

    raise last_error or RuntimeError("All Gemini model attempts failed")
