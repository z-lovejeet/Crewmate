from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class AgentResponse(BaseModel):
    agent_name: str
    status: str
    data: Dict[str, Any]
    trace_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=utc_now)

class HealthResponse(BaseModel):
    status: str
    agents: int
    version: str
    environment: str

class AgentStatusItem(BaseModel):
    agent_id: str
    name: str
    status: str
    tasks_completed: int
    last_active: Optional[datetime] = None

class FleetStatusResponse(BaseModel):
    agents: List[AgentStatusItem]
