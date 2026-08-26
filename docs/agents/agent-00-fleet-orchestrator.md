# Agent 00: Fleet Orchestrator 🧠

## 1. Role
The Brain of Crewmate. It decomposes user goals into sub-tasks, routes them to the appropriate specialist agents, manages fleet state, and aggregates responses.

## 2. ADK Configuration
- Uses `SequentialAgent` for ordered pipelines.
- Uses `ParallelAgent` for concurrent task delegation to multiple specialist agents.

## 3. System Prompt
```text
You are the Fleet Orchestrator for Crewmate, an enterprise-grade AI assistant for solo content creators. 
Your role is to act as the primary brain and dispatcher. When a user provides a request, you must:
1. Decompose the request into logical sub-tasks.
2. Identify which of the 13 specialist agents (Contract Reviewer, Content Compliance, Trend Radar, Hook Architect, Clipping Director, Community Guardian, etc.) are needed.
3. Delegate tasks efficiently, using parallel execution when tasks are independent.
4. Aggregate the results into a cohesive, user-friendly response.
Do not attempt to perform specialized tasks yourself. Always delegate.
```

## 4. Input Schema
```python
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class UserRequest(BaseModel):
    command: str
    context: Dict[str, Any]
    attachments: List[str] = []
```

## 5. Output Schema
```python
class OrchestratorResponse(BaseModel):
    task_id: str
    delegations: List[Dict[str, str]] # e.g., [{"agent": "agent-01", "status": "completed"}]
    status: str # "success", "partial_success", "failed"
    result: Dict[str, Any]
```

## 6. Decision Logic
- **Intent Classification**: Uses Gemini to classify `UserRequest.command` against registered agent capabilities.
- **Keyword Matching**: Fast-path routing:
  - "contract" -> Contract Reviewer
  - "trend", "what to make", "next video", "content ideas" -> Trend Radar
  - "script", "hook", "write", "retention" -> Hook Architect
  - "clip", "repurpose", "shorts", "reels", "cut" -> Clipping Director
  - "comments", "feedback", "sentiment", "toxic", "community" -> Community Guardian

## 7. Tools
- `lookup_agent_registry()`: Find available agents.
- `delegate_task(agent_id, task)`: Send task to agent (via Pub/Sub).
- `check_agent_status(agent_id)`: Get agent health.
- `aggregate_results(task_ids)`: Merge results from parallel agents.
- `trigger_circuit_breaker(agent_id)`: Isolate failing agent.

## 8. Circuit Breaker Logic
- Max 3 retries per delegated task.
- 30s timeout per task.
- If timeout/failure, return a fallback template: *"The [Agent Name] is currently unavailable. Partial results have been processed."*

## 9. State Management
- In-flight tasks are tracked in Firestore `active_tasks` collection.
- Statuses: `pending`, `in_progress`, `completed`, `failed`.

## 10. Code Skeleton
```python
class FleetOrchestrator:
    def __init__(self, adk_client, firestore_client):
        self.adk = adk_client
        self.db = firestore_client
        self.registry = self.lookup_agent_registry()

    def process_request(self, request: UserRequest) -> OrchestratorResponse:
        pass

    def lookup_agent_registry(self) -> dict:
        pass

    def delegate_task(self, agent_id: str, task: dict) -> str:
        pass

    def check_agent_status(self, agent_id: str) -> dict:
        pass

    def aggregate_results(self, task_ids: List[str]) -> dict:
        pass

    def trigger_circuit_breaker(self, agent_id: str) -> None:
        pass
```

## 11. Example Flows
1. **"Review this contract and tell me if the pay is fair"** -> Decomposes into `Contract Reviewer` (analyze terms) + `Revenue Optimizer` (analyze pay).
2. **"Scan my new video for issues"** -> Decomposes into `Content Compliance` (scan rules) + `Brand Safety` (scan brand safety).
3. **"Generate my weekly report"** -> Decomposes into `Report Generator` (gather all metrics).
4. **"What should my next video be about?"** -> Decomposes into `Trend Radar` (scan trends) + `Audience Analyst` (validate audience fit) + `Hook Architect` (generate script).
5. **"Turn my latest YouTube video into Instagram Reels"** -> Decomposes into `Clipping Director` (extract clips) + `Content Compliance` (scan clips) + `Distribution Manager` (prepare for Instagram).
6. **"What are my viewers saying about my last video?"** -> Decomposes into `Community Guardian` (analyze comments) + `Audience Analyst` (update sentiment profile).
7. **"Write me a hook for a video about AI agents"** -> Decomposes into `Hook Architect` (generate 3 hook variants + full script).
