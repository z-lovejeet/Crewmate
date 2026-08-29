from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from ..services.registry import get_all_agents, get_agent_by_id, update_agent_status, seed_agent_registry

router = APIRouter(tags=["Agent Registry (GEAP)"])

class AgentHeartbeatRequest(BaseModel):
    status: str = "active"
    health: str = "healthy"
    latency_ms: Optional[float] = None
    tasks_processed: Optional[int] = None

@router.get("/agents", summary="List all registered fleet agents")
async def list_registry_agents():
    """Retrieve all enterprise-registered agents from the Firestore Agent Registry."""
    agents = await get_all_agents()
    return {
        "registry": "Crewmate Enterprise Agent Registry (GEAP)",
        "count": len(agents),
        "agents": agents
    }

@router.get("/agents/{agent_id}", summary="Get specific agent details")
async def get_agent_details(agent_id: str):
    """Retrieve full metadata, versioning, and capabilities of a specific agent."""
    agent = await get_agent_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found in registry")
    return agent

@router.post("/agents/{agent_id}/heartbeat", summary="Record agent heartbeat and health status")
async def record_heartbeat(agent_id: str, payload: AgentHeartbeatRequest):
    """Update runtime health status and telemetry for an agent."""
    updated = await update_agent_status(
        agent_id=agent_id,
        status=payload.status,
        health=payload.health,
        stats={
            "last_latency_ms": payload.latency_ms,
            "tasks_processed": payload.tasks_processed
        } if payload.latency_ms is not None or payload.tasks_processed is not None else None
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
    return {"status": "ok", "agent": updated}

@router.post("/sync", summary="Force sync canonical agent registry to Firestore")
async def sync_registry():
    """Seed or update all 14 canonical agents into Firestore."""
    synced = await seed_agent_registry()
    return {
        "status": "success",
        "synced_agents_count": len(synced),
        "timestamp": synced[0].get("updated_at") if synced else None
    }
