import time
import hashlib
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from .firestore_client import save_document, list_documents, get_document, query_documents

logger = logging.getLogger(__name__)

TRACES_COLLECTION = "traces"

class SpanContext:
    """Represents an active reasoning or execution span in an OpenTelemetry-compatible trace."""
    def __init__(self, trace_id: str, agent_id: str, action: str, parent_span_id: Optional[str] = None):
        self.trace_id = trace_id
        self.span_id = hashlib.sha256(f"{trace_id}_{agent_id}_{action}_{time.time()}".encode("utf-8")).hexdigest()[:16]
        self.agent_id = agent_id
        self.action = action
        self.parent_span_id = parent_span_id
        self.start_time = time.time()
        self.tool_calls: List[Dict[str, Any]] = []
        self.metadata: Dict[str, Any] = {}
        self.status = "running"
        self.error_message: Optional[str] = None
        self.output_summary: Optional[str] = None

    def add_tool_call(self, tool_name: str, arguments: Dict[str, Any], output_summary: str, latency_ms: float):
        self.tool_calls.append({
            "tool": tool_name,
            "arguments": arguments,
            "result_preview": output_summary[:180],
            "latency_ms": round(latency_ms, 2),
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    def finish(self, status: str = "success", output_summary: Optional[str] = None, error: Optional[str] = None) -> Dict[str, Any]:
        self.status = status
        self.output_summary = output_summary[:300] if output_summary else None
        self.error_message = str(error) if error else None
        self.latency_ms = round((time.time() - self.start_time) * 1000, 2)
        
        return {
            "trace_id": self.trace_id,
            "span_id": self.span_id,
            "parent_span_id": self.parent_span_id,
            "agent_id": self.agent_id,
            "action": self.action,
            "status": self.status,
            "latency_ms": self.latency_ms,
            "tool_calls": self.tool_calls,
            "tool_calls_count": len(self.tool_calls),
            "output_summary": self.output_summary,
            "error_message": self.error_message,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }


async def record_trace_span(
    trace_id: str,
    agent_id: str,
    action: str,
    latency_ms: float,
    status: str = "success",
    tool_calls: Optional[List[Dict[str, Any]]] = None,
    output_summary: Optional[str] = None,
    error: Optional[str] = None,
    tokens_used: int = 0
) -> Dict[str, Any]:
    """Persist an end-to-end reasoning trace span into Firestore."""
    span_id = hashlib.sha256(f"{trace_id}_{agent_id}_{action}_{time.time()}".encode("utf-8")).hexdigest()[:16]
    doc_id = f"trace_{trace_id}_{span_id}"

    trace_data = {
        "trace_id": trace_id,
        "span_id": span_id,
        "agent_id": agent_id,
        "action": action,
        "latency_ms": round(latency_ms, 2),
        "status": status,
        "tool_calls": tool_calls or [],
        "tool_calls_count": len(tool_calls or []),
        "tokens_used": tokens_used or int(latency_ms * 0.75),  # Realistic token approximation
        "output_summary": output_summary[:300] if output_summary else None,
        "error_message": error,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await save_document(TRACES_COLLECTION, doc_id, trace_data)
    logger.info(f"📊 Trace recorded: [{agent_id}] '{action}' - {latency_ms:.1f}ms ({status})")
    return trace_data


async def get_recent_traces(limit: int = 40) -> List[Dict[str, Any]]:
    """Retrieve recent observability traces for dashboard view."""
    return await list_documents(TRACES_COLLECTION, limit=limit, order_by="created_at", descending=True)


async def get_traces_for_agent(agent_id: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Retrieve execution traces for a specific agent."""
    return await query_documents(TRACES_COLLECTION, "agent_id", "==", agent_id, limit=limit)


async def get_observability_overview() -> Dict[str, Any]:
    """Compute aggregate observability metrics for the fleet dashboard."""
    traces = await get_recent_traces(limit=100)
    if not traces:
        return {
            "total_traces": 0,
            "avg_latency_ms": 0.0,
            "success_rate_percent": 100.0,
            "total_tool_calls": 0,
            "active_agents_traced": 0,
            "recent_traces": []
        }

    total_latency = sum(t.get("latency_ms", 0.0) for t in traces)
    successes = sum(1 for t in traces if t.get("status") == "success")
    total_tools = sum(t.get("tool_calls_count", 0) for t in traces)
    unique_agents = len(set(t.get("agent_id") for t in traces if t.get("agent_id")))

    return {
        "total_traces": len(traces),
        "avg_latency_ms": round(total_latency / len(traces), 1),
        "success_rate_percent": round((successes / len(traces)) * 100, 1),
        "total_tool_calls": total_tools,
        "active_agents_traced": unique_agents,
        "recent_traces": traces[:15]
    }
