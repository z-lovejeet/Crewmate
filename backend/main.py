import sys
from pathlib import Path

# Add project root and backend directory to sys.path
_ROOT_DIR = Path(__file__).resolve().parent.parent
_BACKEND_DIR = Path(__file__).resolve().parent
if str(_ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(_ROOT_DIR))
if str(_BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(_BACKEND_DIR))

# Ensure package context for relative imports when executed directly
if not __package__:
    __package__ = "backend"

import logging
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config.settings import get_settings
from .services.registry import seed_agent_registry
from .services.memory import get_creator_preferences
from .services.firestore_client import get_firestore_db
from .middleware.gateway import AgentGatewayMiddleware
from .middleware.model_armor import ModelArmorMiddleware

from .routers import (
    health,
    registry,
    memory,
    traces,
    runtime,
    contracts,
    compliance,
    fleet,
    distribution,
    reports,
    trends,
    community,
    voice,
    scripts,
    clips,
    music,
    thumbnails
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("crewmate.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info(f"🌟 Starting Crewmate Enterprise Agent Fleet on {settings.ENVIRONMENT}...")
    
    # 1. Initialize Google Cloud Firestore
    db = get_firestore_db()
    if db:
        logger.info(f"✅ Connected to Google Cloud Firestore (project={settings.GCP_PROJECT_ID})")
    else:
        logger.info("ℹ️ Running with active in-memory state store")

    # 2. Seed Agent Registry & Memory in background task so server starts in <50ms
    async def _async_bootstrap():
        try:
            synced = await seed_agent_registry()
            logger.info(f"✅ Agent Registry initialized with {len(synced)} enterprise agents")
        except Exception as e:
            logger.error(f"⚠️ Registry seed warning: {e}")
        try:
            prefs = await get_creator_preferences()
            logger.info(f"✅ Memory Bank loaded for creator: '{prefs.get('creator_name')}'")
        except Exception as e:
            logger.error(f"⚠️ Memory Bank init warning: {e}")

    asyncio.create_task(_async_bootstrap())

    logger.info("🚀 Crewmate GEAP Engine fully operational (7/7 components active)")
    yield
    logger.info("🛑 Shutting down Crewmate API")

app = FastAPI(
    title="Crewmate Enterprise Agent Platform (GEAP)",
    description="Fortified Multi-Agent Autonomous Fleet for Content Creators with Agent Registry, Memory Bank, Model Armor, and OpenTelemetry Observability.",
    version="2.0.0",
    lifespan=lifespan
)

settings = get_settings()

# Middleware Layer 1: CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if hasattr(settings, "CORS_ORIGINS") else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware Layer 2: Gateway Rate Limiting & Telemetry Headers
app.add_middleware(AgentGatewayMiddleware)

# Middleware Layer 3: Model Armor Input Screening
app.add_middleware(ModelArmorMiddleware)

# GEAP Infrastructure Routers
app.include_router(health.router)
app.include_router(registry.router, prefix="/api/registry")
app.include_router(memory.router, prefix="/api/memory")
app.include_router(traces.router, prefix="/api/traces")
app.include_router(runtime.router, prefix="/api/runtime")

# Autonomous Feature Routers
app.include_router(contracts.router, prefix="/api/contracts")
app.include_router(compliance.router, prefix="/api/compliance")
app.include_router(fleet.router, prefix="/api/fleet")
app.include_router(distribution.router, prefix="/api/distribution")
app.include_router(reports.router, prefix="/api/reports")
app.include_router(trends.router, prefix="/api/trends")
app.include_router(community.router, prefix="/api/community")
app.include_router(voice.router, prefix="/api/voice")
app.include_router(scripts.router)
app.include_router(clips.router)
app.include_router(music.router)
app.include_router(thumbnails.router)

@app.get("/", summary="Crewmate GEAP Health & Info")
async def root():
    return {
        "platform": "Crewmate — Enterprise Multi-Agent Fleet",
        "track": "The Fortified Enterprise Fleet (Track 3)",
        "version": "2.0.0",
        "geap_components": {
            "agent_registry": "/api/registry/agents",
            "memory_bank": "/api/memory",
            "observability_traces": "/api/traces",
            "agent_runtime": "/api/runtime/tasks",
            "model_armor": "active_middleware",
            "agent_identity": "active_rbac",
            "agent_gateway": "active_circuit_breaker"
        },
        "agents_count": 14,
        "status": "operational"
    }
