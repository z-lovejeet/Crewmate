from functools import lru_cache
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env relative to this file's parent directory (backend/)
_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):
    # Vertex AI configuration (uses GCP credits directly)
    GCP_PROJECT_ID: str = "crewmate-507013"
    GCP_REGION: str = "us-central1"
    USE_VERTEX_AI: bool = True

    # Optional API key fallback (AI Studio)
    GOOGLE_GENAI_API_KEY: Optional[str] = None

    # Model configuration
    PRIMARY_MODEL: str = "gemini-2.5-flash"
    REASONING_MODEL: str = "gemini-2.5-pro"
    FALLBACK_MODEL: str = "gemini-2.5-flash"
    CLASSIFICATION_MODEL: str = "gemini-2.5-flash"  # For lightweight classification tasks

    # App configuration
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "*"]

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
    )

@lru_cache
def get_settings() -> Settings:
    return Settings()
