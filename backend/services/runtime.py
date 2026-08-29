import time
import uuid
import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from .firestore_client import save_document, get_document, list_documents, query_documents
from .observability import record_trace_span

logger = logging.getLogger(__name__)

TASKS_COLLECTION = "tasks"

async def create_runtime_task(
    agent_id: str,
    goal: str,
    payload: Dict[str, Any],
    creator_id: str = "solo_creator_main"
) -> Dict[str, Any]:
    """Submit a new asynchronous background task to the Agent Runtime."""
    task_id = f"task_{uuid.uuid4().hex[:12]}"
    task_record = {
        "task_id": task_id,
        "agent_id": agent_id,
        "creator_id": creator_id,
        "goal": goal,
        "payload": payload,
        "status": "pending",
        "progress_percent": 0,
        "steps_completed": [],
        "result": None,
        "error": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "started_at": None,
        "completed_at": None
    }
    await save_document(TASKS_COLLECTION, task_id, task_record)
    logger.info(f"🚀 Runtime task '{task_id}' queued for agent '{agent_id}': {goal[:60]}")
    return task_record


async def update_task_progress(
    task_id: str,
    status: str,
    progress: int,
    step_note: Optional[str] = None,
    result: Optional[Dict[str, Any]] = None,
    error: Optional[str] = None
) -> Dict[str, Any]:
    """Update task lifecycle state in Firestore."""
    existing = await get_document(TASKS_COLLECTION, task_id) or {}
    steps = existing.get("steps_completed", [])
    if step_note:
        steps.append({
            "step": step_note,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    updates = {
        **existing,
        "status": status,
        "progress_percent": progress,
        "steps_completed": steps,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if status == "running" and not existing.get("started_at"):
        updates["started_at"] = datetime.now(timezone.utc).isoformat()
    if status in ["completed", "failed"]:
        updates["completed_at"] = datetime.now(timezone.utc).isoformat()
    if result:
        updates["result"] = result
    if error:
        updates["error"] = error

    return await save_document(TASKS_COLLECTION, task_id, updates)


async def get_task_status(task_id: str) -> Optional[Dict[str, Any]]:
    """Fetch live status of a running or completed task."""
    return await get_document(TASKS_COLLECTION, task_id)


async def list_runtime_tasks(limit: int = 30) -> List[Dict[str, Any]]:
    """List recent background tasks."""
    return await list_documents(TASKS_COLLECTION, limit=limit, order_by="created_at", descending=True)
