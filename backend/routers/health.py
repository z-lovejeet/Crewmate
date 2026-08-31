from fastapi import APIRouter
from pydantic import BaseModel
from ..config.settings import get_settings

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    agents: int
    version: str
    environment: str

@router.get("/health", response_model=HealthResponse)
async def health_check():
    settings = get_settings()
    return HealthResponse(
        status="ok",
        agents=15,
        version="1.0.0",
        environment=getattr(settings, "ENVIRONMENT", "development")
    )
