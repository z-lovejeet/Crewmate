# System Architecture & Design — Crewmate

> **Track**: Fortified Enterprise Fleet · **Hackathon**: All Things Agentic 2026
> **Thesis**: Enterprise-grade agent governance — built for the solo creator who deserves a Fortune 500 toolkit.

---

## 1. Architecture Overview — 7-Layer Model

Crewmate implements a strict 7-layer separation of concerns. Every request traverses all layers top-to-bottom; every response traverses bottom-to-top. No layer may be bypassed.

```mermaid
flowchart TD
    subgraph L1["Layer 1 — Presentation"]
        UI["React 19 + 3D Claymorphism Dashboard"]
        Voice["Web Speech API Voice Gateway"]
    end

    subgraph L2["Layer 2 — API Gateway"]
        GW["FastAPI Gateway on Cloud Run"]
        RL["Rate Limiter (Sliding Window)"]
        CB["Circuit Breaker (3 retries, 30s timeout)"]
    end

    subgraph L3["Layer 3 — Security & Identity"]
        MA_IN["Model Armor — Input Screening"]
        RBAC["Agent Identity — Per-Agent RBAC"]
        MA_OUT["Model Armor — Output Screening"]
    end

    subgraph L4["Layer 4 — Orchestration"]
        ORCH["Fleet Orchestrator (Gemini 3.1 Pro Preview)"]
        REG["Agent Registry (Firestore)"]
    end

    subgraph L5["Layer 5 — Agent Fleet"]
        direction LR
        A1["Contract Reviewer"]
        A2["Content Compliance"]
        A3["Distribution Mgr"]
        A4["Report Generator"]
        A5["Revenue Optimizer"]
        A6["Brand Safety"]
        A7["Content Calendar"]
        A8["Threat Sentinel"]
        A9["Audience Analyst"]
        A10["Trend Radar"]
        A11["Hook Architect"]
        A12["Clipping Director"]
        A13["Community Guardian"]
    end

    subgraph L6["Layer 6 — Data & State"]
        FS[("Firestore")]
        MEM["Memory Bank"]
        TRACES["Traces Collection"]
    end

    subgraph L7["Layer 7 — Observability"]
        OTEL["OpenTelemetry Spans"]
        DASH["Trace Dashboard"]
    end

    UI & Voice --> GW
    GW --> RL --> CB --> MA_IN
    MA_IN --> RBAC --> ORCH
    ORCH <--> REG
    ORCH --> L5
    L5 <--> FS & MEM
    L5 --> MA_OUT --> GW
    L5 --> OTEL --> TRACES
    TRACES --> DASH
```

---

## 2. GEAP Component Implementation Map

The Fortified Enterprise Fleet track requires 7 Gemini Enterprise Agent Platform components. Crewmate implements all 7:

| GEAP Component | Track Requirement | Crewmate Implementation | File Path |
|:---|:---|:---|:---|
| **Agent Registry** | Central repository for publishing, versioning, and discovering agents | Firestore `agents` collection with metadata, version, capabilities, health status. REST API for CRUD + discovery. | `services/registry.py`, `routers/registry.py` |
| **Agent Runtime** | Long-running async background execution | Python `asyncio` task runner with Firestore state machine (`pending` → `running` → `completed` → `failed`). Background workers process tasks without blocking the API. | `services/runtime.py` |
| **Memory Bank** | Persistent, secure cross-session context | Firestore `memory` collection storing creator preferences, brand history, content patterns. Agents read/write memory during execution. Persists across weeks of async operations. | `services/memory.py`, `routers/memory.py` |
| **Agent Identity** | Zero-trust access control | Per-agent RBAC with scoped data access permissions. API key validation middleware. Agents can only access data within their declared scope. | `middleware/identity.py` |
| **Agent Gateway** | Unified routing and policy enforcement | FastAPI with sliding-window rate limiting (100 req/min), circuit breaker (3 retries, 30s timeout, exponential backoff), request validation, unified error responses. | `middleware/gateway.py`, `main.py` |
| **Model Armor** | Inline guardrails for prompt injection, tool poisoning, PII leaks | Input screening: regex pattern matching for 15+ injection patterns + Gemma-powered classification. Output screening: PII detection (SSN, email, phone, credit card), harmful content filtering. | `middleware/model_armor.py` |
| **Agent Observability** | OpenTelemetry-compliant audit logs and reasoning chain traces | Every agent invocation creates an OpenTelemetry-compatible span with: agent_id, model, prompt hash, tool calls, latency_ms, token count, result status. Stored in Firestore `traces` collection. Viewable in dashboard. | `services/observability.py`, `routers/traces.py` |

---

## 3. Tech Stack

| Layer | Technology | Version | Purpose |
|:---|:---|:---|:---|
| **Frontend** | React 19 + Vite + Tailwind v4 | Latest | 3D Claymorphism dashboard with voice-first UX |
| **Backend** | Python 3.13 + FastAPI | 0.115+ | API Gateway + Agent Runtime |
| **Agent Framework** | Google ADK | 2.8.0 | Multi-agent orchestration (Agent class with sub_agents) |
| **GenAI SDK** | google-genai | 2.20.0 | Direct Gemini model access with structured output |
| **Primary Model** | Gemini 3.7 Flash | Latest | All 12 worker agents |
| **Reasoning Model** | Gemini 3.1 Pro Preview | Latest | Fleet Orchestrator (deep reasoning) |
| **Classification** | Gemma 4 26B a4b IT | Latest | Content classification, brand safety scoring |
| **Fallback Model** | Gemini 3.6 Flash | Latest | Auto-fallback when primary unavailable |
| **Database** | Firebase Firestore | Native mode | Agent Registry, Memory Bank, Traces, Contracts |
| **Hosting** | Google Cloud Run | Gen2 | Serverless container deployment (auto-scaling 0-3) |
| **Observability** | OpenTelemetry → Firestore | OTel 1.x | Full reasoning chain traces per agent |
| **Security** | Model Armor (Custom) | — | I/O screening middleware |
| **Builder** | Antigravity + Claude Opus 4.6 | — | AI-assisted development |

---

## 4. Detailed Data Flow

```mermaid
flowchart LR
    Creator["Creator Dashboard"] -->|"REST / WebSocket"| Gateway["API Gateway"]
    Gateway -->|"Validate"| Armor_In["Model Armor (Input)"]
    Armor_In -->|"Clean Prompt"| Orchestrator["Fleet Orchestrator"]
    
    Orchestrator -->|"Lookup"| Registry[("Agent Registry")]
    Orchestrator -->|"Dispatch"| Runtime["Agent Runtime"]
    
    Runtime -->|"Execute"| Agent["ADK Agent"]
    Agent -->|"Reason"| Gemini["Gemini 3.7 Flash"]
    Agent -->|"Classify"| Gemma["Gemma 4 26B"]
    Agent -->|"Read/Write"| Memory[("Memory Bank")]
    Agent -->|"Trace"| Traces[("Traces")]
    
    Agent -->|"Result"| Armor_Out["Model Armor (Output)"]
    Armor_Out -->|"Safe Response"| Gateway
    Gateway -->|"Push"| Creator
```

---

## 5. C4 Model Diagrams

### 5.1 System Context

```mermaid
flowchart TD
    creator["👤 Solo Content Creator\n(YouTuber / Instagram Creator)"]
    crewmate["🤖 Crewmate Platform\n(Autonomous Agent Fleet)"]
    gemini["⚡ Gemini API\n(3.7 Flash + 3.1 Pro)"]
    gemma["🧠 Gemma 4 26B\n(Content Classification)"]

    creator -->|"Manages fleet via\nvoice + dashboard"| crewmate
    crewmate -->|"Agent reasoning calls"| gemini
    crewmate -->|"Content classification"| gemma
```

### 5.2 Container Diagram

```mermaid
flowchart TD
    creator["👤 Content Creator"]
    spa["🎨 Web Dashboard\n(React 19 + Vite + Tailwind v4)\n3D Claymorphism UI"]
    api["🔀 Agent Gateway\n(Python 3.13 + FastAPI)\nRouting, Auth, Rate Limiting, Model Armor"]
    runtime["⚙️ Agent Runtime\n(Google ADK 2.8.0)\nAsync execution + state tracking"]
    db[("💾 Firestore\nRegistry, Memory Bank,\nTraces, Contracts")]

    creator -->|"HTTPS"| spa
    spa -->|"JSON / REST"| api
    api -->|"Dispatch tasks"| runtime
    runtime -->|"Read/Write state"| db
```

### 5.3 Component Diagram

```mermaid
flowchart TD
    subgraph backend["FastAPI Backend"]
        router["📡 HTTP Router\n(FastAPI)"]
        gateway["🚦 Gateway Controls\n(Rate Limiter + Circuit Breaker)"]
        armor["🛡️ Model Armor\n(Input/Output Screening)"]
        identity["🔐 Agent Identity\n(Per-Agent RBAC)"]
        fleet["🤖 Fleet Manager\n(ADK Orchestrator)"]
        registry["📋 Registry Service\n(Firestore Client)"]
        memory["🧠 Memory Service\n(Firestore Client)"]
        observe["📊 Observability\n(OTel Span Exporter)"]
    end

    router --> gateway
    gateway --> armor
    armor --> identity
    identity --> fleet
    fleet --> registry
    fleet --> memory
    fleet --> observe
```

---

## 6. Architecture Decision Records (ADRs)

| ADR | Decision | Rationale |
|:---|:---|:---|
| **ADR-001** | Hierarchical Supervisor over Peer Swarm | Deterministic routing, lower token costs, predictable state transitions. The Orchestrator controls all task decomposition and dispatch. |
| **ADR-002** | Firestore over Cloud SQL | Document-native agent state (flexible JSON), real-time listeners for dashboard updates, serverless scaling, Firebase SDK integration. |
| **ADR-003** | Async state machines over Pub/Sub | Minimizes infrastructure footprint while maintaining resilient `pending→running→completed→failed` lifecycle. Firestore state polling with asyncio avoids provisioning topics/subscriptions. |
| **ADR-004** | 3D Claymorphism for UI | Warm, human-designed aesthetic with soft clay depth. Professional and approachable for non-technical creators. Differentiates from every other hackathon submission's default ShadCN/dark mode UI. |
| **ADR-005** | Model tiering (Gemini 3.7 / 3.1 Pro / Gemma) | Gemini 3.7 Flash for fast worker reasoning. Gemini 3.1 Pro Preview for complex orchestrator decisions. Gemma 4 26B for cheap, fast classification (no API latency). |
| **ADR-006** | Circuit breaker per agent | Prevents cascade failures when Gemini API is rate-limited. Max 3 retries with exponential backoff, 30s total timeout, then graceful fallback response. |
| **ADR-007** | FastAPI over Flask/Django | Native async/await support for concurrent agent execution. Built-in Pydantic validation. Auto-generated OpenAPI docs. |
| **ADR-008** | Custom Model Armor over Google Cloud Model Armor SDK | Google Cloud Model Armor requires Vertex AI setup and additional provisioning. Custom middleware with regex patterns + Gemma classification achieves the same judge-visible security screening with zero cloud config overhead. |
| **ADR-009** | Agent Registry in Firestore over static config | Enables runtime agent discovery, version rollback, health monitoring, and dynamic capability lookup — matching the track's "cross-department cataloging" requirement. |
| **ADR-010** | OpenTelemetry spans to Firestore over Cloud Trace | Cloud Trace requires full GCP observability setup. Storing OTel-compatible spans directly in Firestore `traces` collection allows the dashboard to render reasoning chains in real-time with simple queries. |

---

## 7. Security Architecture

### 7.1 Model Armor — Input Screening

All user inputs pass through the Model Armor middleware before reaching any agent:

```python
# Pseudocode — middleware/model_armor.py
INJECTION_PATTERNS = [
    r"ignore (?:all )?(?:previous|prior|above) instructions",
    r"you are now",
    r"system prompt",
    r"reveal your instructions",
    r"<script>",
    r"(?:DROP|DELETE|UPDATE)\s+(?:TABLE|FROM|SET)",
]

PII_PATTERNS = {
    "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
    "email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
    "phone": r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b",
    "credit_card": r"\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b",
}

def screen_input(text: str) -> ArmorResult:
    # Check injection patterns
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return ArmorResult(blocked=True, reason="prompt_injection")
    # Check PII in input
    for pii_type, pattern in PII_PATTERNS.items():
        if re.search(pattern, text):
            return ArmorResult(blocked=True, reason=f"pii_{pii_type}")
    return ArmorResult(blocked=False)
```

### 7.2 Agent Identity — RBAC Matrix

| Agent | Role | Data Read Access | Data Write Access |
|:---|:---|:---|:---|
| Fleet Orchestrator | `admin` | All collections | All collections |
| Contract Reviewer | `contract_reader` | `contracts`, `memory` | `contracts`, `traces` |
| Content Compliance | `compliance_scanner` | `contracts`, `compliance_results` | `compliance_results`, `traces` |
| Distribution Manager | `publisher` | `calendar`, `memory` | `calendar`, `traces` |
| Report Generator | `reporter` | All read-only | `reports`, `traces` |
| Revenue Optimizer | `analyst` | `contracts`, `revenue` | `revenue`, `traces` |
| Brand Safety | `safety_auditor` | `contracts`, `compliance_results` | `compliance_results`, `traces` |
| Content Calendar | `scheduler` | `calendar`, `memory` | `calendar`, `traces` |
| Threat Sentinel | `security` | All collections | `traces` |
| Audience Analyst | `analyst` | `memory`, `revenue` | `traces` |
| Trend Radar | `strategist` | `memory`, `content_briefs` | `content_briefs`, `traces` |
| Hook Architect | `scripter` | `content_briefs`, `memory` | `scripts`, `traces` |
| Clipping Director | `editor` | `content_briefs`, `memory` | `clips`, `traces` |
| Community Guardian | `moderator` | `comments`, `memory` | `moderation_actions`, `traces` |

---

## 8. Error Handling & Resilience

### Circuit Breaker Pattern
```
Request → [Circuit Breaker] → Agent
  ├── CLOSED (normal): Forward request, track failures
  ├── OPEN (after 3 failures): Return cached/fallback response immediately
  └── HALF-OPEN (after cooldown): Allow 1 probe request to test recovery
```

### Graceful Degradation Priority
1. **If Gemini API fails**: Return cached analysis from Memory Bank
2. **If Firestore fails**: Fall back to in-memory state (session-scoped)
3. **If optional agents fail** (Agents 10-13): Core pipeline continues
4. **If Orchestrator fails**: Direct-route to individual agent endpoints

---

## 9. Key Sequence Diagrams

### 9.1 Contract Review Pipeline

```mermaid
sequenceDiagram
    participant C as Creator
    participant GW as Gateway
    participant MA as Model Armor
    participant O as Orchestrator
    participant CR as Contract Reviewer
    participant RO as Revenue Optimizer
    participant MB as Memory Bank
    participant FS as Firestore

    C->>GW: POST /api/contracts/analyze (PDF)
    GW->>MA: Screen input
    MA->>O: Clean request
    O->>CR: Extract clauses + risk score
    CR->>FS: Store contract analysis
    O->>RO: Benchmark deal value
    RO->>MB: Read brand history
    MB-->>RO: Past deal data
    RO->>FS: Store revenue analysis
    O->>GW: Unified report
    GW->>C: Contract analysis + counter-proposals
```

### 9.2 Voice Command Pipeline

```mermaid
sequenceDiagram
    participant C as Creator (Voice)
    participant UI as Dashboard
    participant GW as Gateway
    participant MA as Model Armor
    participant O as Orchestrator
    participant A as Target Agent

    C->>UI: "Scan my video for compliance"
    UI->>GW: POST /api/voice/command
    GW->>MA: Screen transcript
    MA->>O: Route to agent
    O->>A: Execute task
    A-->>O: Result
    O->>GW: Response
    GW->>UI: Agent response
    UI->>C: "Content Compliance: 96% compliant, 1 FTC fix needed"
```

---

## 10. Deployment Architecture

```mermaid
flowchart LR
    subgraph GCP["Google Cloud Platform (crewmate-507013)"]
        CR["Cloud Run (Backend API)"]
        FS[("Firestore (Native)")]
        AR["Artifact Registry"]
        CT["Cloud Trace"]
    end

    subgraph Client["Client"]
        FE["React SPA (Firebase Hosting or Cloud Run)"]
    end

    FE -->|HTTPS| CR
    CR --> FS
    CR --> CT
    AR -->|Docker Image| CR
```
