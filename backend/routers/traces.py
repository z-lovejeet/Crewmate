from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..services.observability import get_recent_traces, get_traces_for_agent, get_observability_overview

router = APIRouter(tags=["Agent Observability & Telemetry (GEAP)"])

@router.get("", summary="List recent OpenTelemetry agent traces")
async def list_traces(limit: int = Query(30, ge=1, le=100)):
    """Retrieve end-to-end reasoning chain traces across the agent fleet."""
    traces = await get_recent_traces(limit=limit)
    return {
        "count": len(traces),
        "traces": traces
    }

@router.get("/overview", summary="Get fleet observability metrics and telemetry summary")
async def get_overview():
    """Retrieve aggregate telemetry: average latencies, success rates, tool calls."""
    return await get_observability_overview()

@router.get("/agent/{agent_id}", summary="Get execution traces for a specific agent")
async def get_agent_traces(agent_id: str, limit: int = Query(20, ge=1, le=50)):
    """Retrieve traces and tool executions filtered by agent ID."""
    traces = await get_traces_for_agent(agent_id, limit=limit)
    return {
        "agent_id": agent_id,
        "count": len(traces),
        "traces": traces
    }
