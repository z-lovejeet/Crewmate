import logging
from typing import Optional
from google import genai
from google.genai import types
from ..config.settings import get_settings

logger = logging.getLogger(__name__)

_client: Optional[genai.Client] = None
_image_client: Optional[genai.Client] = None


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


def _get_image_client() -> genai.Client:
    """Get a cached GenAI client for image generation (requires us-central1)."""
    global _image_client
    if _image_client is None:
        settings = get_settings()
        if settings.USE_VERTEX_AI:
            # Image generation models require us-central1, not global
            _image_client = genai.Client(
                vertexai=True,
                project=settings.GCP_PROJECT_ID,
                location="us-central1",
            )
            logger.info("Image GenAI client initialized (us-central1)")
        elif settings.GOOGLE_GENAI_API_KEY:
            _image_client = genai.Client(api_key=settings.GOOGLE_GENAI_API_KEY)
            logger.info("Image GenAI client initialized with API key")
        else:
            raise RuntimeError("No Vertex AI or API key configured for image generation")
    return _image_client


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


def generate_image(
    prompt: str,
    model: Optional[str] = None,
) -> tuple[bytes, str]:
    """Generate a real image from scratch using Gemini native image generation.
    
    Uses gemini-2.5-flash-image via Vertex AI (us-central1).
    Returns (image_bytes, mime_type).
    """
    settings = get_settings()
    image_model = model or settings.IMAGE_MODEL
    client = _get_image_client()

    logger.info(f"Generating image with {image_model}: {prompt[:80]}...")

    response = client.models.generate_content(
        model=image_model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            img_bytes = part.inline_data.data
            mime_type = part.inline_data.mime_type
            logger.info(f"Image generated: {mime_type}, {len(img_bytes)} bytes")
            return img_bytes, mime_type

    raise RuntimeError(f"Model {image_model} returned no image data")


async def generate_text_async(
    prompt: str,
    model: Optional[str] = None,
    system_instruction: Optional[str] = None,
) -> str:
    """Async wrapper — runs synchronous generate_text in a thread pool to avoid blocking the event loop."""
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, lambda: generate_text(prompt, model, system_instruction)
    )


async def generate_image_async(
    prompt: str,
    model: Optional[str] = None,
) -> tuple[bytes, str]:
    """Async wrapper — runs synchronous generate_image in a thread pool."""
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, lambda: generate_image(prompt, model)
    )
