# System Architecture & Design — Crewmate

## 1. Architecture Overview (7-Layer Model)

```mermaid
flowchart TD
    subgraph Layer1[Layer 1: Presentation]
        UI[Next.js + 3D Claymorphism UI]
    end

    subgraph Layer2[Layer 2: API Gateway]
        API[FastAPI Gateway on Cloud Run]
    end

    subgraph Layer3[Layer 3: Security]
        MA[Google Model Armor]
        IAM[Agent Identity & RBAC]
    end

    subgraph Layer4[Layer 4: Orchestration]
        Orch[ADK SequentialAgent + ParallelAgent]
    end

    subgraph Layer5[Layer 5: Agent Fleet]
        direction LR
        A1[Contract Reviewer]
        A2[Content Compliance]
        A3[Distribution Mgr]
        A4[Report Generator]
        A5[Revenue Optimizer]
        A6[Brand Safety]
        A7[Content Calendar]
        A8[Threat Sentinel]
        A9[Audience Analyst]
        A10[Trend Radar]
        A11[Hook Architect]
        A12[Clipping Director]
        A13[Community Guardian]
    end

    subgraph Layer6[Layer 6: Data & State]
        FS[(Firestore)]
        PS[[Pub/Sub]]
    end

    subgraph Layer7[Layer 7: Observability]
        CT[Cloud Trace]
        OT[OpenTelemetry]
    end

    UI <--> API
    API <--> MA
    MA <--> Orch
    Orch <--> Layer5
    Layer5 <--> FS
    Layer5 <--> PS
    Layer5 --> CT
    Orch --> CT
```

## 2. Detailed Component Diagram

```mermaid
flowchart TD
    Client[Creator Dashboard UI] -- WebSocket/REST --> API[FastAPI Server]
    API -- Verify --> MA[Model Armor]
    MA -- Safe --> Orchestrator[Fleet Orchestrator]
    
    Orchestrator -- Task Dispatch --> PubSub[Google Pub/Sub]
    
    PubSub -- Consume --> Fleet[Agent Fleet Worker]
    Fleet -- Reason --> Gemini[Gemini 3.7 Flash API]
    Fleet -- Classify --> Gemma[Gemma Endpoint]
    
    Fleet -- Read/Write State --> Firestore[(Firebase Firestore)]
    Fleet -- Publish Results --> PubSub
    
    PubSub -- Push/Consume --> API
    API -- Push Updates --> Client
```

## 3. C4 Model Diagrams

### 3.1 Context Diagram
```mermaid
C4Context
    title System Context diagram for Crewmate
    Person(creator, "Solo Content Creator", "A YouTuber or Instagram creator managing their brand.")
    System(crewmate, "Crewmate", "Autonomous agent fleet managing brand contracts, compliance, and distribution.")
    System_Ext(youtube, "YouTube API", "Platform for video distribution.")
    System_Ext(instagram, "Instagram API", "Platform for social distribution.")
    System_Ext(gemini, "Gemini 3.7 API", "Core reasoning engine.")

    Rel(creator, crewmate, "Manages fleet, reviews contracts")
    Rel(crewmate, youtube, "Publishes content, gets analytics")
    Rel(crewmate, instagram, "Publishes posts, gets analytics")
    Rel(crewmate, gemini, "Sends prompts, gets agent reasoning")
```

### 3.2 Container Diagram
```mermaid
C4Container
    title Container diagram for Crewmate
    Container(web_app, "Web Application", "Next.js", "Provides the 3D claymorphism dashboard.")
    Container(api, "API Gateway", "FastAPI, Python", "Handles routing, WebSockets, and auth.")
    Container(orch, "Agent Orchestrator", "Google ADK", "Manages the multi-agent workflow.")
    ContainerDb(database, "Firestore", "NoSQL", "Stores user data, contracts, and agent states.")
    Container(pubsub, "Message Broker", "Google Pub/Sub", "Handles async event passing between agents.")

    Rel(web_app, api, "Uses", "JSON/HTTPS, WebSocket")
    Rel(api, orch, "Invokes", "Local Method")
    Rel(orch, pubsub, "Publishes Events", "gRPC")
    Rel(orch, database, "Reads/Writes", "gRPC")
```

### 3.3 Component Diagram (Backend API)
```mermaid
C4Component
    title Component diagram for Backend API
    Container_Boundary(api, "FastAPI Backend") {
        Component(router, "HTTP Router", "FastAPI Router", "Routes REST and WS requests.")
        Component(auth, "Auth Middleware", "Firebase Admin", "Validates tokens.")
        Component(fleet_mgr, "Fleet Manager", "ADK Orchestrator", "Coordinates agents.")
        Component(agents, "Agent Modules", "Python", "13 specialized agents.")
        Component(db_client, "DB Client", "Firestore Client", "Data access.")
    }

    Rel(router, auth, "Uses")
    Rel(router, fleet_mgr, "Delegates tasks to")
    Rel(fleet_mgr, agents, "Manages")
    Rel(agents, db_client, "Uses")
```

## 4. Architecture Decision Records (ADRs)

| ADR ID | Decision | Rationale |
|---|---|---|
| **ADR-001** | Hierarchical Supervisor over Peer Swarm | Deterministic routing, lower token costs, predictable state transitions. |
| **ADR-002** | Firebase/Firestore over Cloud SQL | Document-native agent state, real-time listeners out-of-the-box. |
| **ADR-003** | Pub/Sub over direct HTTP for agent events | Provides backpressure, automated retries, and DLQ for failing tasks. |
| **ADR-004** | 3D Claymorphism for UI | Warm, human-designed aesthetic with soft depth. Award-winning visual identity that feels approachable yet professional for non-technical creators. |
| **ADR-005** | Model tiering (Gemini 3.7 vs Gemma) | Gemini 3.7 Flash for deep reasoning, Gemma for fast, cheap classification. |
| **ADR-006** | Circuit breaker per agent | Prevents cascade failures. Max 3 retries, 30s timeout per agent task. |
| **ADR-007** | FastAPI over Flask/Django | Async support is crucial for GenAI, native Pydantic integration. |
| **ADR-008** | WebSocket over polling | Lower latency for real-time agent updates to the creator UI. |

## 5. Security Architecture

### Model Armor Integration
All inputs to agents pass through Model Armor to prevent prompt injection and sanitize PII.
```python
from google.cloud import modelarmor_v1
# Pseudocode implementation
def check_safety(prompt: str) -> bool:
    client = modelarmor_v1.ModelArmorClient()
    response = client.sanitize_user_prompt(
        request={"template_name": "projects/.../templates/crewmate", "text": prompt}
    )
    return response.safe
```

### Agent Identity RBAC
| Agent | Role | Data Access |
|---|---|---|
| Orchestrator | Admin | All |
| Contract Reviewer | ContractReader | Contracts (Read/Write) |
| Audience Analyst | AnalyticsReader | Analytics (Read Only) |
| Distribution Mgr | Publisher | Social Tokens (Read) |
| Trend Radar | Strategist | `content_history`, `trending_data` (Read), `content_briefs` (Write) |
| Hook Architect | Scripter | `content_briefs`, `retention_data` (Read), `scripts` (Write) |
| Clipping Director | Editor | `transcripts`, `video_metadata` (Read), `clips` (Write) |
| Community Guardian | Moderator | `comments` (Read), `moderation_actions`, `sentiment_reports` (Write) |

## 6. Error Handling & Resilience
- **Circuit Breaker:** If Gemini API fails 3 times, circuit opens, fallback to cached state.
- **DLQ:** Failed Pub/Sub messages routed to a Dead Letter Queue for manual review.
- **Graceful Degradation:** If optional agents (e.g., Audience Analyst, Agents 10-13) fail, core flow (Contract Review) continues.

## 7. Cross-Cutting Concerns
- **Logging/Monitoring:** Handled via OpenTelemetry exported to Google Cloud Trace.
- **Secrets:** Google Secret Manager for all API keys.
- **Config:** Environment-based overrides via Pydantic BaseSettings.

## 8. GEAP Component Implementation Map
- **Goal:** Managed by Orchestrator based on creator input.
- **Environment:** Monitored by Threat Sentinel and Brand Safety.
- **Action:** Executed by Distribution Manager and tools.
- **Perception:** Real-time listeners on Firestore and Webhooks.
