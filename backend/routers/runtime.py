from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from ..services.runtime import create_runtime_task, get_task_status, list_runtime_tasks, update_task_progress
from ..services.gemini import generate_text
from ..services.memory import build_agent_context_prompt
from ..services.observability import record_trace_span
import time

router = APIRouter(tags=["Agent Runtime (GEAP)"])

class SubmitTaskRequest(BaseModel):
    agent_id: str = Field(..., description="Target agent id, e.g. 'contract_reviewer' or 'orchestrator'")
    goal: str = Field(..., description="Task objective in natural language")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Input parameters")

async def execute_task_worker(task_id: str, agent_id: str, goal: str, payload: Dict[str, Any]):
    """Background worker executing the task asynchronously."""
    start_time = time.time()
    try:
        await update_task_progress(task_id, "running", 25, "Agent initialized context from Memory Bank")
        
        # Pull persistent context
        context = await build_agent_context_prompt(brand_name=payload.get("brand_name"))
        await update_task_progress(task_id, "running", 50, "Executing reasoning and tool synthesis")

        prompt = f"{context}\n\nTask Goal: {goal}\nInput Data: {payload}\n\nExecute this task and provide structured findings."
        system_inst = f"You are the Crewmate {agent_id.replace('_', ' ').title()} agent. Deliver concise, high-impact enterprise results."
        
        response_text = generate_text(prompt=prompt, system_instruction=system_inst)
        
        await update_task_progress(
            task_id,
            status="completed",
            progress=100,
            step_note="Task completed successfully",
            result={"summary": response_text, "executed_by": agent_id}
        )

        latency_ms = (time.time() - start_time) * 1000
        await record_trace_span(
            trace_id=task_id,
            agent_id=agent_id,
            action="async_task_execution",
            latency_ms=latency_ms,
            output_summary=response_text[:200]
        )
    except Exception as e:
        await update_task_progress(task_id, "failed", 100, f"Execution failed: {e}", error=str(e))

@router.post("/submit", summary="Submit an asynchronous background task to the Agent Runtime")
async def submit_task(payload: SubmitTaskRequest, background_tasks: BackgroundTasks):
    """Enqueue a long-running task to the Agent Runtime."""
    task = await create_runtime_task(
        agent_id=payload.agent_id,
        goal=payload.goal,
        payload=payload.payload
    )
    background_tasks.add_task(
        execute_task_worker,
        task["task_id"],
        payload.agent_id,
        payload.goal,
        payload.payload
    )
    return {
        "status": "queued",
        "task_id": task["task_id"],
        "agent_id": payload.agent_id,
        "message": "Task accepted by Agent Runtime. Poll /api/runtime/tasks/{task_id} for status."
    }

@router.get("/tasks", summary="List all runtime tasks")
async def list_tasks():
    """Retrieve history of background tasks."""
    tasks = await list_runtime_tasks(limit=30)
    return {"count": len(tasks), "tasks": tasks}

@router.get("/tasks/{task_id}", summary="Get task progress and execution result")
async def get_task(task_id: str):
    """Check status and retrieve generated results for a background task."""
    task = await get_task_status(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
    return task
