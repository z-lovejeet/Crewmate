# 🏛️ Crewmate — System Architecture Document

> **Track**: The Fortified Enterprise Fleet (Track 3) · **Hackathon**: All Things Agentic 2026  
> **GCP Project**: `crewmate-507013` · **Version**: 2.0.0  
> **Live Deployment**: Google Cloud Run (us-central1)  
> **Architecture Pattern**: 7-Layer Decoupled Enterprise Multi-Agent Platform (GEAP)

---

## Table of Contents

- [1. Architecture Vision](#1-architecture-vision)
- [2. High-Level System Architecture](#2-high-level-system-architecture)
- [3. Layer-by-Layer Deep Dive](#3-layer-by-layer-deep-dive)
  - [Layer 1 — Presentation](#layer-1--presentation)
  - [Layer 2 — API Gateway](#layer-2--api-gateway)
  - [Layer 3 — Security & Identity (GEAP)](#layer-3--security--identity-geap)
  - [Layer 4 — Orchestration Engine](#layer-4--orchestration-engine)
  - [Layer 5 — Autonomous Agent Fleet](#layer-5--autonomous-agent-fleet)
  - [Layer 6 — State & Memory Bank](#layer-6--state--memory-bank)
  - [Layer 7 — Observability & Telemetry](#layer-7--observability--telemetry)
- [4. Request Lifecycle Flow](#4-request-lifecycle-flow)
- [5. Agent Fleet Roster & Capabilities](#5-agent-fleet-roster--capabilities)
- [6. GEAP Component Matrix](#6-geap-component-matrix)
- [7. Security Architecture](#7-security-architecture)
- [8. Data Architecture & Firestore Schema](#8-data-architecture--firestore-schema)
- [9. Google Cloud Deployment Topology](#9-google-cloud-deployment-topology)
- [10. Google Technologies Stack](#10-google-technologies-stack)
- [11. Frontend Architecture](#11-frontend-architecture)
- [12. Project Structure](#12-project-structure)
- [13. Installation & Setup Guide](#13-installation--setup-guide)
- [14. API Reference](#14-api-reference)

---

## 1. Architecture Vision

Enterprise agent fleets and governance frameworks are traditionally built for Fortune 500 CIOs. **Crewmate builds one for the solo content creator** — the unlikely hero who manages a multi-million-view business alone with spreadsheets and gut instinct.

Solo YouTubers and Instagram creators face:
- **Predatory sponsorship contracts** with hidden 12-month exclusivity traps
- **FTC compliance minefields** (16 CFR § 255) and copyright takedown risks
- **Multi-platform chaos** across YouTube, Instagram Reels, and Shorts
- **Zero governance** — no security, no audit trails, no memory of past interactions

Crewmate equips every solo creator with an **autonomous 15-agent enterprise fleet** governed by the full **Gemini Enterprise Agent Platform (GEAP)** — 7 infrastructure components, enterprise-grade security, persistent cross-session memory, and real-time observability.

---

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph L1["🎨 Layer 1 — Presentation"]
        UI["React 19 + 3D Claymorphism Dashboard"]
        Voice["🎙️ Web Speech API Voice Gateway"]
        Auth["🔐 Firebase Auth (Google SSO)"]
    end

    subgraph L2["🔀 Layer 2 — API Gateway"]
        GW["FastAPI Gateway (Cloud Run)"]
        RL["⏱️ Sliding-Window Rate Limiter\n120 req/min per IP"]
        CB["⚡ Circuit Breaker\nCLOSED → OPEN → HALF_OPEN"]
    end

    subgraph L3["🛡️ Layer 3 — Security & Identity"]
        MA_IN["Model Armor — Input Screening\n15+ Injection Patterns + PII Filters"]
        RBAC["Agent Identity — RBAC\n15 Scoped Permission Matrices"]
        MA_OUT["Model Armor — Output Sanitization\nPII Redaction"]
    end

    subgraph L4["🧠 Layer 4 — Orchestration Engine"]
        ORCH["Fleet Orchestrator Captain\ngemini-3.1-pro-preview"]
        REG["Agent Registry Service\nFirestore Catalog"]
    end

    subgraph L5["🤖 Layer 5 — Autonomous Agent Fleet"]
        direction LR
        A1["Contract\nReviewer"]
        A2["Content\nCompliance"]
        A3["Distribution\nManager"]
        A4["Report\nGenerator"]
        A5["Revenue\nOptimizer"]
        A6["Brand\nSafety"]
        A7["Content\nCalendar"]
        A8["Threat\nSentinel"]
        A9["Audience\nAnalyst"]
        A10["Trend\nRadar"]
        A11["Hook\nArchitect"]
        A12["Video\nCinematographer"]
        A13["Thumbnail\nDirector"]
        A14["Community\nGuardian"]
    end

    subgraph L6["💾 Layer 6 — State & Memory Bank"]
        FS[("Google Cloud Firestore\nNative Mode")]
        MEM["🧠 Persistent Memory Bank\nCreator Context + Brand History"]
        TRACES["📊 Traces Collection\nOpenTelemetry Spans"]
    end

    subgraph L7["📈 Layer 7 — Observability & Telemetry"]
        OTEL["Live Reasoning Spans\nLatency • Tokens • Tool Calls"]
        AUDIT["🚨 Security Audit Log\nModel Armor Events"]
    end

    UI & Voice --> GW
    Auth -.-> UI
    GW --> RL --> CB --> MA_IN
    MA_IN --> RBAC --> ORCH
    ORCH <--> REG
    ORCH --> L5
    L5 <--> FS & MEM
    L5 --> MA_OUT --> GW
    L5 --> OTEL --> TRACES
    MA_IN --> AUDIT
```

---

## 3. Layer-by-Layer Deep Dive

### Layer 1 — Presentation

The user-facing layer built with **React 19** and a custom **3D Claymorphism** design system.

| Component | Technology | Details |
|:---|:---|:---|
| **Dashboard Framework** | React 19 + TypeScript 7 | Single-page application with route-based code splitting |
| **Build System** | Vite 8 | Hot module replacement, `@` path aliasing, dev server on port `5173` |
| **Styling** | TailwindCSS v4 | Custom CSS variables (`--bg-app`, `--surface`, `--primary`) powering the clay theme |
| **Animations** | Framer Motion 13 | Page transitions, spring-based toast notifications, AnimatePresence |
| **State Management** | Zustand 5 | `useStudioStore` managing global workspace state |
| **Routing** | React Router v7 | 14 routes with `AnimatePresence` cross-fade transitions |
| **Auth** | Firebase Auth | Google SSO with `AuthContext` provider & `ProtectedRoute` wrapper |
| **Voice** | Web Speech API | Real-time voice commands routed to the Fleet Orchestrator |
| **Icons** | Lucide React + HugeIcons + Phosphor | Triple icon library for maximum visual variety |
| **Hosting** | Firebase Hosting | CDN-backed SPA serving with custom domain support |

**Pages:**

| Route | Page Component | Function |
|:---|:---|:---|
| `/` | `Landing` | Marketing landing page with 3D animations |
| `/dashboard` | `CommandCenter` | Central AI command center |
| `/contracts` | `Contracts` | Contract review & risk analysis |
| `/compliance` | `Compliance` | FTC & copyright scanning |
| `/fleet` | `Fleet` | Agent fleet status & health |
| `/trends` | `Distribution` | Trend radar & distribution |
| `/scripts` | `ScriptsStudio` | Hook & script engineering |
| `/media` | `MediaStudio` | Thumbnail & video generation |
| `/channel` | `ChannelProfile` | Creator profile & memory bank |
| `/about` | `About` | Project info & architecture |

---

### Layer 2 — API Gateway

The unified entrypoint enforcing enterprise traffic governance before any request reaches business logic.

```mermaid
flowchart LR
    REQ["Incoming HTTP Request"] --> IP["Extract Client IP"]
    IP --> SW["Sliding Window\nRate Check"]
    SW -->|"≤ 120 req/60s"| PASS["✅ Forward to\nMiddleware Stack"]
    SW -->|"> 120 req/60s"| BLOCK["❌ 429\nGATEWAY_RATE_LIMIT"]
    PASS --> EXEC["Execute Handler"]
    EXEC --> HEADERS["Inject Telemetry Headers\nX-Gateway-Engine: Crewmate-GEAP-v2\nX-Response-Time-Ms: {latency}"]
    HEADERS --> RES["Return Response"]
```

**Implementation:** [`middleware/gateway.py`](backend/middleware/gateway.py)

| Feature | Specification |
|:---|:---|
| **Rate Limiter** | Sliding-window algorithm, 120 requests per 60-second window per IP |
| **Circuit Breaker** | 3-state machine (`CLOSED` → `OPEN` → `HALF_OPEN`), 3 failure threshold, 30s recovery timeout |
| **Telemetry Headers** | `X-Gateway-Engine: Crewmate-GEAP-v2`, `X-Response-Time-Ms` injected on every response |
| **Decorator** | `@with_circuit_breaker(service_name)` wraps any async agent/service call with automatic fallback |

**Circuit Breaker State Machine:**

```mermaid
stateDiagram-v2
    [*] --> CLOSED
    CLOSED --> OPEN : failure_count ≥ 3
    OPEN --> HALF_OPEN : recovery_timeout (30s) elapsed
    HALF_OPEN --> CLOSED : probe_success
    HALF_OPEN --> OPEN : probe_failure
```

---

### Layer 3 — Security & Identity (GEAP)

The dual-layer security system combining **Model Armor** (input/output screening) and **Agent Identity** (per-agent RBAC).

#### Model Armor — Input Screening

**Implementation:** [`middleware/model_armor.py`](backend/middleware/model_armor.py)

Intercepts every incoming request and screens query parameters against **15+ attack pattern categories**:

| Category | Example Patterns | Action |
|:---|:---|:---|
| **Instruction Reset** | `ignore all previous instructions` | `403 MODEL_ARMOR_BLOCKED` |
| **Rule Disregard** | `disregard all previous rules` | `403 MODEL_ARMOR_BLOCKED` |
| **Roleplay Jailbreak** | `you are now an unrestricted AI`, `DAN Mode` | `403 MODEL_ARMOR_BLOCKED` |
| **System Prompt Extraction** | `reveal your initial instructions`, `output the exact prompt above` | `403 MODEL_ARMOR_BLOCKED` |
| **Privilege Escalation** | `sudo mode`, `developer mode enabled` | `403 MODEL_ARMOR_BLOCKED` |
| **XSS Injection** | `<script>...</script>` | `403 MODEL_ARMOR_BLOCKED` |
| **SQL Injection** | `DROP TABLE`, `TRUNCATE TABLE` | `403 MODEL_ARMOR_BLOCKED` |
| **Filter Bypass** | `bypass safety filters` | `403 MODEL_ARMOR_BLOCKED` |
| **Encoded Payload** | `base64 decode and execute` | `403 MODEL_ARMOR_BLOCKED` |
| **PII Leaks** | SSN patterns (`XXX-XX-XXXX`), credit card numbers | `403 MODEL_ARMOR_BLOCKED` |

#### Model Armor — Output Sanitization

Screens agent-generated output and **redacts** any accidentally leaked PII:

```
Credit Card: 4532-1234-5678-9012 → [REDACTED_BY_MODEL_ARMOR]
SSN: 123-45-6789 → [REDACTED_BY_MODEL_ARMOR]
```

#### Security Audit Logging

Every blocked or sanitized event is persisted to Firestore `armor_logs` collection with:
- SHA-256 prompt hash (first 16 chars)
- Violation category & pattern name
- Input snippet (first 120 chars)
- Client IP & timestamp
- Action taken (`BLOCKED` or `SANITIZED`)

#### Agent Identity — RBAC Matrix

**Implementation:** [`middleware/identity.py`](backend/middleware/identity.py)

Zero-trust access control where every agent has explicitly declared permissions:

```mermaid
flowchart TD
    REQ["Agent Action Request"] --> LOOKUP["Look Up Agent\nin RBAC Matrix"]
    LOOKUP -->|"Found"| CHECK["Validate:\n1. Action Allowed?\n2. Collection Access?"]
    LOOKUP -->|"Not Found"| DENY["❌ Unknown Agent\nDENIED"]
    CHECK -->|"Authorized"| EXEC["✅ Execute"]
    CHECK -->|"Unauthorized"| LOG["❌ Log Violation\n& DENY"]
```

**Permission Matrix (all 15 agents):**

| Agent | Role | Allowed Actions | Readable Collections | Writable Collections | Tier |
|:---|:---|:---|:---|:---|:---|
| **Orchestrator** | `fleet_captain` | `dispatch_all`, `read_all`, `write_all`, `synthesize` | `*` (all) | `*` (all) | `pro_reasoning` |
| **Contract Reviewer** | `legal_auditor` | `extract_clauses`, `score_risk`, `draft_counters` | `contracts`, `memory`, `agents` | `contracts`, `traces` | `flash_fast` |
| **Content Compliance** | `compliance_guard` | `scan_ftc`, `scan_copyright`, `audit_guidelines` | `compliance_results`, `memory`, `contracts` | `compliance_results`, `traces` | `flash_fast` |
| **Distribution Manager** | `publisher` | `generate_metadata`, `optimize_seo`, `schedule_posts` | `calendar`, `memory`, `content_briefs` | `calendar`, `traces` | `flash_fast` |
| **Report Generator** | `reporter` | `compile_executive_summary`, `export_pdf` | `contracts`, `compliance_results`, `revenue`, `memory` | `reports`, `traces` | `flash_fast` |
| **Revenue Optimizer** | `financial_analyst` | `benchmark_cpm`, `calculate_deal_valuation` | `contracts`, `revenue`, `memory` | `revenue`, `traces` | `flash_fast` |
| **Brand Safety** | `safety_auditor` | `screen_sponsor`, `brand_alignment_check` | `contracts`, `memory` | `compliance_results`, `traces` | `flash_fast` |
| **Content Calendar** | `scheduler` | `check_conflicts`, `sync_dates` | `calendar`, `memory` | `calendar`, `traces` | `flash_fast` |
| **Threat Sentinel** | `security_sentry` | `scan_threats`, `trip_circuit_breaker` | `armor_logs`, `traces`, `agents` | `armor_logs`, `traces` | `flash_fast` |
| **Audience Analyst** | `demographics_analyst` | `analyze_retention`, `predict_engagement` | `memory`, `revenue` | `traces` | `flash_fast` |
| **Trend Radar** | `trend_hunter` | `scan_trending`, `generate_briefs` | `memory`, `content_briefs` | `content_briefs`, `traces` | `flash_fast` |
| **Hook Architect** | `script_engineer` | `engineer_hooks`, `draft_scripts` | `content_briefs`, `memory` | `scripts`, `traces` | `flash_fast` |
| **Clipping Director** | `repurposing_editor` | `score_energy`, `extract_clips` | `content_briefs`, `memory` | `clips`, `traces` | `flash_fast` |
| **Community Guardian** | `sentiment_moderator` | `cluster_comments`, `filter_toxicity`, `draft_replies` | `comments`, `memory` | `moderation_actions`, `traces` | `flash_fast` |

---

### Layer 4 — Orchestration Engine

The **Fleet Orchestrator** acts as the Captain and Supervisor of the entire agent fleet.

**Implementation:** [`agents/orchestrator.py`](backend/agents/orchestrator.py)

```mermaid
flowchart TD
    GOAL["Creator Goal\n'Review this NordVPN contract'"] --> CAPTAIN["🧠 Fleet Orchestrator\ngemini-3.1-pro-preview"]
    
    CAPTAIN --> DECOMPOSE["Goal Decomposition\nBreak into sub-tasks"]
    
    DECOMPOSE --> DISPATCH["Multi-Agent Dispatch"]
    
    DISPATCH --> T1["📄 Contract Reviewer\nExtract & score clauses"]
    DISPATCH --> T2["💰 Revenue Optimizer\nBenchmark deal value"]
    DISPATCH --> T3["🛡️ Brand Safety\nScreen sponsor reputation"]
    DISPATCH --> T4["🧠 Memory Bank\nRecall NordVPN history"]
    
    T1 & T2 & T3 & T4 --> SYNTH["Cross-Agent Synthesis\nMerge findings"]
    
    SYNTH --> REPORT["📊 Report Generator\nCompile executive summary"]
    REPORT --> RESULT["Final Response\nwith traces & recommendations"]
```

**Architecture Pattern:** Google ADK `Agent` with hierarchical `sub_agents` delegation:

```python
fleet_orchestrator = Agent(
    name="fleet_orchestrator",
    model="gemini-3.1-pro-preview",
    sub_agents=[
        contract_reviewer_agent,      # Legal audit
        content_compliance_agent,      # FTC & copyright
        distribution_manager_agent,    # Platform SEO
        report_generator_agent,        # Executive summaries
        revenue_optimizer_agent,       # Deal economics
        brand_safety_agent,            # Sponsor screening
        content_calendar_agent,        # Scheduling
        threat_sentinel_agent,         # Security monitoring
        audience_analyst_agent,        # Demographics
        trend_radar_agent,             # Viral signal detection
        hook_architect_agent,          # Script engineering
        video_cinematographer_agent,   # Veo 3.1 video synthesis
        thumbnail_director_agent,      # Gemini 3 Pro image generation
        community_guardian_agent       # Comment moderation
    ]
)
```

**Agent Registry Service:** [`services/registry.py`](backend/services/registry.py)

Central Firestore catalog storing metadata, versioning, health status, and capability arrays for all 15 agents. Seeded in parallel on application startup with automatic fallback to in-memory store.

---

### Layer 5 — Autonomous Agent Fleet

15 specialized agents, each built with **Google ADK** and equipped with domain-specific tools.

```mermaid
flowchart LR
    subgraph BUSINESS["💼 Business Intelligence"]
        CR["Contract Reviewer\ngemini-3.7-flash"]
        RO["Revenue Optimizer\ngemini-3.7-flash"]
    end

    subgraph LEGAL["⚖️ Legal & Compliance"]
        CC["Content Compliance\ngemini-3.7-flash"]
        BS["Brand Safety\ngemini-3.7-flash"]
    end

    subgraph GROWTH["📈 Growth Engine"]
        DM["Distribution Manager\ngemini-3.7-flash"]
        CAL["Content Calendar\ngemini-3.7-flash"]
        TR["Trend Radar\ngemini-3.7-flash"]
        HA["Hook Architect\ngemini-3.7-flash"]
    end

    subgraph CREATION["🎬 Media Creation"]
        VC["Video Cinematographer\nveo-3.1-fast-generate-001"]
        TD["Thumbnail Director\ngemini-3-pro-image"]
        CD["Clipping Director\ngemini-3.7-flash"]
    end

    subgraph ANALYTICS["📊 Analytics"]
        AA["Audience Analyst\ngemini-3.7-flash"]
        RG["Report Generator\ngemini-3.7-flash"]
    end

    subgraph SECURITY["🛡️ Security"]
        TS["Threat Sentinel\ngemini-3.7-flash"]
    end

    subgraph COMMUNITY["👥 Community"]
        CG["Community Guardian\ngemini-3.7-flash + Gemma"]
    end

    CAPTAIN["🧠 Fleet Orchestrator\ngemini-3.1-pro-preview"] --> BUSINESS & LEGAL & GROWTH & CREATION & ANALYTICS & SECURITY & COMMUNITY
```

Each agent is equipped with registered function tools:

| Agent | Tool Functions | Capabilities |
|:---|:---|:---|
| **Contract Reviewer** | `extract_clauses()`, `score_risk()`, `draft_counter_proposal()`, `benchmark_market_rate()` | PDF clause extraction, risk scoring, counter-proposal generation |
| **Content Compliance** | `check_ftc_disclosure()`, `scan_copyright_audio()`, `check_platform_rules()`, `suggest_lyria_replacement()` | FTC 16 CFR § 255 audit, copyright detection, Lyria AI alternatives |
| **Community Guardian** | `classify_sentiment()`, `cluster_feedback()`, `detect_toxic_content()`, `generate_replies()` | Gemma sentiment clustering, toxic moderation, creator-voice replies |
| **Video Cinematographer** | `plan_cinematography()`, `synthesize_veo_prompt()` | Camera direction, Veo 3.1 prompt engineering, 8-second clip synthesis |
| **Thumbnail Director** | `plan_thumbnail_composition()`, `engineer_diffusion_prompt()` | Rule-of-thirds framing, CTR prediction, Gemini 3 Pro diffusion prompts |

---

### Layer 6 — State & Memory Bank

**Implementation:** [`services/firestore_client.py`](backend/services/firestore_client.py) · [`services/memory.py`](backend/services/memory.py)

```mermaid
flowchart TD
    subgraph FIRESTORE["Google Cloud Firestore (Native Mode)"]
        AGENTS_COL["📋 agents\n15 agent registrations"]
        MEMORY_COL["🧠 memory\nCreator preferences +\nBrand deal histories"]
        TRACES_COL["📊 traces\nOpenTelemetry spans"]
        TASKS_COL["⚙️ tasks\nRuntime lifecycle records"]
        ARMOR_COL["🛡️ armor_logs\nSecurity audit events"]
    end

    subgraph MEMORY_BANK["Persistent Memory Bank"]
        PREFS["Creator Preferences\n• Min deal value: $6,500\n• Max exclusivity: 30 days\n• Target CPM: $45\n• Forbidden categories\n• Voice tone"]
        BRANDS["Brand Histories\n• NordVPN: 3 deals, $7,500 last\n• BrandX: 1 deal, red flags\n• Past CPMs & quirks"]
    end

    MEMORY_BANK --> MEMORY_COL
    
    APP["Application Layer"] --> |"async CRUD via\nasyncio.to_thread()"| FIRESTORE
    APP -.-> |"Graceful Fallback"| INMEM["In-Memory Store\n(when Firestore unavailable)"]
```

**Firestore Client Features:**
- **Async-safe**: All synchronous Firestore SDK calls wrapped with `asyncio.to_thread()` to avoid blocking the event loop
- **Graceful degradation**: Automatic fallback to in-memory `Dict` store when Firestore connection fails
- **Universal CRUD**: `save_document()`, `get_document()`, `list_documents()`, `query_documents()`, `delete_document()`
- **Auto-timestamps**: `created_at` and `updated_at` injected on every write
- **Merge writes**: Firestore `set(data, merge=True)` preserves existing fields

**Memory Bank Capabilities:**
- **Creator preferences**: Min deal value, max exclusivity days, target CPM, forbidden categories, voice tone
- **Brand deal histories**: Past deal counts, historical CPMs, payment reliability, contract quirks
- **Agent context injection**: `build_agent_context_prompt()` generates structured system prompts from persistent memory

---

### Layer 7 — Observability & Telemetry

**Implementation:** [`services/observability.py`](backend/services/observability.py)

```mermaid
flowchart LR
    AGENT["Agent Execution"] --> SPAN["Create SpanContext\ntrace_id + span_id"]
    SPAN --> TOOLS["Record Tool Calls\nname • args • latency"]
    TOOLS --> FINISH["Finish Span\nstatus • output • error"]
    FINISH --> STORE["Persist to Firestore\ntraces collection"]
    STORE --> DASH["Fleet Dashboard\nReal-time metrics"]
```

**Trace Schema:**
```json
{
  "trace_id": "contract_review_abc123",
  "span_id": "8f3a2b1c...",
  "agent_id": "contract_reviewer",
  "action": "extract_clauses",
  "latency_ms": 1247.35,
  "status": "success",
  "tool_calls": [
    {
      "tool": "extract_clauses",
      "latency_ms": 450.2,
      "result_preview": "Found 8 clauses including exclusivity..."
    }
  ],
  "tool_calls_count": 1,
  "tokens_used": 935,
  "output_summary": "Extracted 8 clauses, 2 high-risk...",
  "created_at": "2026-08-31T16:48:23Z"
}
```

**Observability Dashboard Metrics:**
- Total traces processed
- Average latency (ms) across all agents
- Success rate (%)
- Total tool calls executed
- Active agents traced
- 15 most recent traces

---

## 4. Request Lifecycle Flow

Every request traverses all 7 layers. **No layer may be bypassed.**

```mermaid
sequenceDiagram
    actor User
    participant UI as React Dashboard
    participant GW as API Gateway
    participant MA as Model Armor
    participant RBAC as Agent Identity
    participant ORCH as Fleet Orchestrator
    participant AGENT as Specialist Agent
    participant FS as Firestore
    participant MEM as Memory Bank
    participant OTEL as Observability

    User->>UI: "Review this NordVPN contract"
    UI->>GW: POST /api/contracts/review
    
    Note over GW: Layer 2: Rate Limit Check
    GW->>GW: Sliding window: 47/120 ✅
    
    Note over MA: Layer 3a: Input Screening
    GW->>MA: Screen query params & body
    MA->>MA: 15+ regex patterns → PASS ✅
    
    Note over RBAC: Layer 3b: Identity Verification
    MA->>RBAC: Verify contract_reviewer permissions
    RBAC->>RBAC: Action: extract_clauses ✅
    RBAC->>RBAC: Collection: contracts (read) ✅
    
    Note over ORCH: Layer 4: Task Decomposition
    RBAC->>ORCH: Authorized request
    ORCH->>ORCH: Decompose goal into sub-tasks
    
    Note over AGENT: Layer 5: Agent Execution
    ORCH->>AGENT: Dispatch contract_reviewer
    AGENT->>MEM: Recall NordVPN brand history
    MEM-->>AGENT: 3 past deals, $7,500 last, 60-day exclusivity quirk
    AGENT->>AGENT: Extract clauses, score risk
    
    Note over OTEL: Layer 7: Record Trace
    AGENT->>OTEL: Record span (1,247ms, success)
    OTEL->>FS: Persist to traces collection
    
    Note over MA: Layer 3c: Output Sanitization
    AGENT->>MA: Screen output for PII
    MA->>MA: Check SSN/CC patterns → CLEAN ✅
    
    MA->>GW: Sanitized response
    Note over GW: Inject telemetry headers
    GW->>UI: Response + X-Response-Time-Ms
    UI->>User: Contract analysis with risk scores
```

---

## 5. Agent Fleet Roster & Capabilities

| # | ID | Name | Role | Model | Category | Max Concurrency | Timeout |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 0 | `orchestrator` | **Fleet Orchestrator** | Captain & Supervisor | `gemini-3.1-pro-preview` | Core | 5 | 60s |
| 1 | `contract_reviewer` | **Contract Reviewer** | Legal & Sponsorship Risk Auditor | `gemini-3.7-flash` | Business | 3 | 30s |
| 2 | `content_compliance` | **Content Compliance** | FTC & Copyright Guard | `gemini-3.7-flash` | Legal | 4 | 30s |
| 3 | `distribution_manager` | **Distribution Manager** | YouTube & Instagram Optimizer | `gemini-3.7-flash` | Growth | 4 | 25s |
| 4 | `report_generator` | **Report Generator** | Executive Summarizer | `gemini-3.7-flash` | Analytics | 2 | 45s |
| 5 | `revenue_optimizer` | **Revenue Optimizer** | Deal Economics & CPM Benchmarking | `gemini-3.7-flash` | Business | 3 | 25s |
| 6 | `brand_safety` | **Brand Safety** | Reputation & Sponsor Alignment | `gemini-3.7-flash` | Legal | 3 | 20s |
| 7 | `content_calendar` | **Content Calendar** | Schedule & Cadence Architect | `gemini-3.7-flash` | Growth | 2 | 20s |
| 8 | `threat_sentinel` | **Threat Sentinel** | Fleet Security & Anomaly Monitor | `gemini-3.7-flash` | Security | 5 | 15s |
| 9 | `audience_analyst` | **Audience Analyst** | Demographics & Retention Physicist | `gemini-3.7-flash` | Analytics | 3 | 25s |
| 10 | `trend_radar` | **Trend Radar** | Real-Time Viral Signal Hunter | `gemini-3.7-flash` | Growth | 3 | 30s |
| 11 | `hook_architect` | **Hook & Script Architect** | First-3-Seconds & Script Engineer | `gemini-3.7-flash` | Growth | 3 | 35s |
| 12 | `video_cinematographer` | **AI Video Cinematographer** | Veo 3.1 Video & Camera Director | `veo-3.1-fast-generate-001` | Creation | 2 | 90s |
| 13 | `thumbnail_director` | **Master Thumbnail Director** | Visual Hook & Gemini 3 Pro Diffusion | `gemini-3-pro-image` | Creation | 3 | 30s |
| 14 | `community_guardian` | **Community Sentiment Guardian** | Comment Clustered Intelligence & Mod | `gemini-3.7-flash` | Community | 4 | 25s |

---

## 6. GEAP Component Matrix

Crewmate implements **100% of the 7 Gemini Enterprise Agent Platform (GEAP) requirements**:

| # | GEAP Requirement | Implementation | Source Code | Firestore Collection |
|:---|:---|:---|:---|:---|
| 1 | **Agent Registry** | Central Firestore catalog with metadata, versioning, health, capabilities for all 15 agents. Parallel-seeded on startup. | [`services/registry.py`](backend/services/registry.py) | `agents` |
| 2 | **Memory Bank** | Persistent cross-session context: creator preferences ($6,500 min deal, 30-day max exclusivity) + historical brand deal interactions. | [`services/memory.py`](backend/services/memory.py) | `memory` |
| 3 | **Model Armor** | Pre/post-execution guardrails screening 15+ prompt injection regexes, jailbreaks, and PII leaks. Blocked requests return `403 MODEL_ARMOR_BLOCKED`. | [`middleware/model_armor.py`](backend/middleware/model_armor.py) | `armor_logs` |
| 4 | **Agent Identity** | Zero-trust RBAC with declared read/write scopes per agent across Firestore collections. Fleet Captain has unrestricted `*` access. | [`middleware/identity.py`](backend/middleware/identity.py) | — |
| 5 | **Agent Gateway** | Unified entrypoint with sliding-window rate limiting (120 req/min), 3-state circuit breakers, and standardized telemetry headers. | [`middleware/gateway.py`](backend/middleware/gateway.py) | — |
| 6 | **Agent Observability** | OpenTelemetry-compliant `SpanContext` tracking tool execution timelines, latencies, token metrics, stored in Firestore. | [`services/observability.py`](backend/services/observability.py) | `traces` |
| 7 | **Agent Runtime** | Background task engine with Firestore lifecycle state machine (`pending` → `running` → `completed` / `failed`). | [`services/runtime.py`](backend/services/runtime.py) | `tasks` |

---

## 7. Security Architecture

```mermaid
flowchart TD
    subgraph PERIMETER["🔒 Perimeter Defense"]
        CORS["CORS Middleware\nConfigurable Origins"]
        RATE["Rate Limiter\n120 req/min/IP"]
        CB["Circuit Breaker\nCascade Failure Prevention"]
    end

    subgraph INPUT_SCREEN["🛡️ Input Screening"]
        INJ["Prompt Injection Detection\n12 pattern categories"]
        PII_IN["PII Input Filter\nSSN + Credit Card"]
        AUDIT_IN["Audit Logger\nFirestore armor_logs"]
    end

    subgraph IDENTITY["🔐 Identity & Access"]
        RBAC_CHK["Per-Agent RBAC\n15 permission matrices"]
        ACTION_CHK["Action Authorization\nDeclared allowed_actions"]
        COL_CHK["Collection Access Control\nRead/Write scope validation"]
    end

    subgraph OUTPUT_SCREEN["🛡️ Output Sanitization"]
        PII_OUT["PII Output Redaction\n[REDACTED_BY_MODEL_ARMOR]"]
        AUDIT_OUT["Sanitization Audit Log"]
    end

    subgraph AUTH["🔐 User Authentication"]
        FIREBASE["Firebase Auth\nGoogle SSO Provider"]
        CONTEXT["AuthContext\nProtectedRoute wrapper"]
    end

    PERIMETER --> INPUT_SCREEN --> IDENTITY --> OUTPUT_SCREEN
    AUTH -.-> PERIMETER
```

**Security Event Response Codes:**

| Code | Name | Trigger |
|:---|:---|:---|
| `403` | `MODEL_ARMOR_BLOCKED` | Prompt injection or PII detected in input |
| `429` | `GATEWAY_RATE_LIMIT` | More than 120 requests in 60-second window |
| `503` | `CIRCUIT_BREAKER_OPEN` | Service in `OPEN` state after 3+ consecutive failures |

---

## 8. Data Architecture & Firestore Schema

```mermaid
erDiagram
    AGENTS {
        string id PK "e.g. contract_reviewer"
        string name "Contract Reviewer"
        string role "Legal & Sponsorship Risk Auditor"
        string version "2.1.0"
        string model "gemini-3.7-flash"
        string status "active"
        string health "healthy"
        string category "business"
        array capabilities "['pdf_clause_extraction', ...]"
        int max_concurrency "3"
        int timeout_seconds "30"
        string last_heartbeat "ISO 8601"
    }

    MEMORY {
        string id PK "prefs_{creator_id} or brand_{creator_id}_{brand}"
        string creator_id "solo_creator_main"
        string creator_name "Alex TechVoyager Rivera"
        int minimum_deal_value_usd "6500"
        float target_cpm_usd "45.0"
        int maximum_exclusivity_days "30"
        array strictly_forbidden_categories "['gambling', ...]"
        string preferred_payment_terms "50% upfront..."
        string voice_tone "Analytical, warm..."
    }

    TRACES {
        string trace_id PK
        string span_id
        string agent_id FK
        string action
        float latency_ms
        string status "success | error"
        array tool_calls
        int tokens_used
        string output_summary
        string created_at "ISO 8601"
    }

    TASKS {
        string task_id PK "task_{uuid}"
        string agent_id FK
        string creator_id
        string goal
        string status "pending | running | completed | failed"
        int progress_percent "0-100"
        array steps_completed
        object result
        string error
        string created_at "ISO 8601"
        string started_at "ISO 8601"
        string completed_at "ISO 8601"
    }

    ARMOR_LOGS {
        string id PK "armor_{timestamp}_{hash}"
        string event_type "input_blocked | output_sanitized"
        string violation "prompt_injection | pii_violation"
        string detail "Pattern name"
        string prompt_hash "SHA-256 first 16 chars"
        string snippet "First 120 chars"
        string client_ip
        string action_taken "BLOCKED | SANITIZED"
        string timestamp "ISO 8601"
    }

    AGENTS ||--o{ TRACES : "generates"
    AGENTS ||--o{ TASKS : "executes"
    MEMORY ||--o{ AGENTS : "provides context to"
```

---

## 9. Google Cloud Deployment Topology

```mermaid
flowchart TD
    subgraph USER["End Users"]
        BROWSER["🌐 Browser"]
    end

    subgraph FIREBASE_HOSTING["Firebase Hosting (CDN)"]
        SPA["React 19 SPA\nClaymorphism Dashboard"]
        FAUTH["Firebase Auth\nGoogle SSO"]
    end

    subgraph CLOUD_RUN["Google Cloud Run (us-central1)"]
        CONTAINER["🐳 Docker Container\nPython 3.13-slim"]
        FASTAPI["FastAPI + Uvicorn\nPort 8080"]
        MIDDLEWARE["Gateway → Model Armor → RBAC"]
        AGENTS_RT["15 ADK Agents"]
    end

    subgraph GCP_SERVICES["Google Cloud Platform"]
        VERTEX["Vertex AI\nGemini 3.7 Flash\nGemini 3.1 Pro Preview\nVeo 3.1\nGemini 3 Pro Image"]
        FIRESTORE_DB[("Cloud Firestore\nNative Mode\n5 Collections")]
        ARTIFACT["Artifact Registry\nus-central1-docker.pkg.dev"]
        SECRET["Secret Manager\nAPI keys & credentials"]
        IAM["IAM\nService accounts"]
        TRACE["Cloud Trace\nDistributed tracing"]
    end

    BROWSER --> SPA
    SPA --> FAUTH
    SPA -->|"API calls"| FASTAPI
    CONTAINER --> FASTAPI --> MIDDLEWARE --> AGENTS_RT
    AGENTS_RT --> VERTEX
    AGENTS_RT --> FIRESTORE_DB
    ARTIFACT -->|"Container image"| CONTAINER
    SECRET -.-> CONTAINER
    IAM -.-> CONTAINER
    AGENTS_RT --> TRACE
```

**Cloud Run Configuration:**

| Setting | Value |
|:---|:---|
| **Image** | `us-central1-docker.pkg.dev/crewmate-507013/crewmate/backend:latest` |
| **Base Image** | `python:3.13-slim` |
| **Port** | `8080` |
| **Region** | `us-central1` |
| **Platform** | Managed (fully serverless) |
| **Auth** | Allow unauthenticated |
| **Scaling** | Auto-scale (0 to N instances) |

---

## 10. Google Technologies Stack

Crewmate integrates **12+ Google Cloud and AI technologies**:

| # | Technology | Usage in Crewmate | Integration Point |
|:---|:---|:---|:---|
| 1 | **Google ADK** (Agent Development Kit) | Multi-agent supervisor pattern with hierarchical `sub_agents` decomposition | [`agents/orchestrator.py`](backend/agents/orchestrator.py) |
| 2 | **Gemini 3.7 Flash** (Vertex AI) | High-speed worker agent reasoning for all 13 specialist agents | [`config/settings.py`](backend/config/settings.py) → `PRIMARY_MODEL` |
| 3 | **Gemini 3.1 Pro Preview** (Vertex AI) | Deep orchestrator planning and complex goal decomposition | [`config/settings.py`](backend/config/settings.py) → `REASONING_MODEL` |
| 4 | **Gemini 3 Pro Image** | Native image diffusion for high-CTR 1376×768 widescreen thumbnails | [`agents/thumbnail_director.py`](backend/agents/thumbnail_director.py) |
| 5 | **Veo 3.1** | 8-second cinematic video synthesis with camera direction control | [`agents/video_cinematographer.py`](backend/agents/video_cinematographer.py) |
| 6 | **Google GenAI SDK** | Unified `genai.Client` with Vertex AI and API key dual support | [`services/gemini.py`](backend/services/gemini.py) |
| 7 | **Google Cloud Firestore** (Native Mode) | Serverless document database for state, memory, registry, traces, and audit logs | [`services/firestore_client.py`](backend/services/firestore_client.py) |
| 8 | **Google Cloud Run** | Serverless container execution with auto-scaling | [`Dockerfile`](backend/Dockerfile) |
| 9 | **Google Cloud Artifact Registry** | Secure Docker container image management | Deployment pipeline |
| 10 | **Google Cloud Trace + OpenTelemetry** | Distributed tracing and reasoning step observability | [`services/observability.py`](backend/services/observability.py) |
| 11 | **Google Cloud Secret Manager + IAM** | Fine-grained role permissions and service account security | GCP project configuration |
| 12 | **Gemma** | Lightweight content categorization and brand safety classification | [`services/gemma_classifier.py`](backend/services/gemma_classifier.py) |
| 13 | **Lyria AI** | Intelligent royalty-free audio replacement for copyright-flagged segments | Content compliance agent tools |
| 14 | **Firebase Auth** | Google SSO authentication for the React dashboard | [`frontend/src/services/firebase.ts`](frontend/src/services/firebase.ts) |
| 15 | **Firebase Hosting** | CDN-backed SPA delivery | Frontend deployment |

**Model Fallback Chain:**

```mermaid
flowchart LR
    PRIMARY["gemini-3.7-flash\n(Primary)"] -->|"fails"| FALLBACK["gemini-3.5-flash\n(Fallback)"]
    FALLBACK -->|"fails"| REASONING["gemini-3.1-pro-preview\n(Deep Reasoning)"]
    REASONING -->|"fails"| ERROR["❌ RuntimeError"]
```

---

## 11. Frontend Architecture

```mermaid
flowchart TD
    subgraph REACT["React 19 Application"]
        ROUTER["React Router v7\n14 Routes"]
        ANIM["Framer Motion\nPage Transitions"]
        ERRB["Error Boundary\nGraceful Recovery"]
    end

    subgraph STATE["State Layer"]
        ZUSTAND["Zustand Store\nuseStudioStore"]
        AUTH_CTX["Auth Context\nFirebase Auth State"]
    end

    subgraph PAGES["Dashboard Pages"]
        CMD["Command Center"]
        CONT["Contracts"]
        COMP["Compliance"]
        FLEET["Fleet Status"]
        TREND["Trends & Distribution"]
        SCRIPT["Scripts Studio"]
        MEDIA["Media Studio"]
        CHAN["Channel Profile"]
    end

    subgraph COMPONENTS["Shared Components"]
        NAV["Navbar"]
        FOOT["Footer"]
        HEADER["Page Header"]
        CLAY["Clay Design System"]
    end

    subgraph SERVICES["Data Services"]
        API["API Client\nlib/api.ts"]
        FIREBASE_SVC["Firebase Service\nAuth + Firestore"]
    end

    ROUTER --> PAGES
    ANIM --> ROUTER
    ERRB --> ROUTER
    STATE --> PAGES
    COMPONENTS --> PAGES
    SERVICES --> PAGES
```

**Design System: 3D Claymorphism**
- Soft, clay-like depth with warm light theme
- CSS custom properties: `--bg-app`, `--surface`, `--primary`, `--border`
- `.clay-lg` utility class for elevated card components
- Spring-based toast notifications with 5-second auto-dismiss

---

## 12. Project Structure

```
Crewmate/
├── ARCHITECTURE.md              ← You are here
├── README.md                    ← Project overview & quickstart
│
├── backend/                     ← FastAPI + Google ADK Backend
│   ├── Dockerfile               ← Cloud Run container (python:3.13-slim)
│   ├── pyproject.toml           ← Python dependencies (uv/hatch)
│   ├── main.py                  ← FastAPI app, middleware stack, router registry
│   ├── __init__.py
│   │
│   ├── agents/                  ← Google ADK Agent Definitions (15 agents)
│   │   ├── orchestrator.py      ← Fleet Captain (gemini-3.1-pro-preview)
│   │   ├── contract_reviewer.py
│   │   ├── content_compliance.py
│   │   ├── distribution_manager.py
│   │   ├── report_generator.py
│   │   ├── revenue_optimizer.py
│   │   ├── brand_safety.py
│   │   ├── content_calendar.py
│   │   ├── threat_sentinel.py
│   │   ├── audience_analyst.py
│   │   ├── trend_radar.py
│   │   ├── hook_architect.py
│   │   ├── video_cinematographer.py   ← Veo 3.1 video synthesis
│   │   ├── thumbnail_director.py      ← Gemini 3 Pro image generation
│   │   └── community_guardian.py      ← Gemma sentiment analysis
│   │
│   ├── config/
│   │   └── settings.py          ← Pydantic Settings (GCP, models, CORS)
│   │
│   ├── middleware/              ← GEAP Security & Gateway Layer
│   │   ├── gateway.py           ← Rate Limiter + Circuit Breaker
│   │   ├── model_armor.py       ← Input/Output screening (15+ patterns)
│   │   └── identity.py          ← Per-agent RBAC matrix
│   │
│   ├── services/                ← Core Business Services
│   │   ├── firestore_client.py  ← Async Firestore CRUD + in-memory fallback
│   │   ├── gemini.py            ← GenAI SDK (text, image, video generation)
│   │   ├── gemma_classifier.py  ← Content categorization
│   │   ├── registry.py          ← Agent Registry (15 canonical agents)
│   │   ├── memory.py            ← Persistent Memory Bank
│   │   ├── observability.py     ← OpenTelemetry SpanContext
│   │   └── runtime.py           ← Background task lifecycle
│   │
│   ├── routers/                 ← API Route Handlers (19 modules)
│   │   ├── health.py            ← /health
│   │   ├── registry.py          ← /api/registry/*
│   │   ├── memory.py            ← /api/memory/*
│   │   ├── traces.py            ← /api/traces/*
│   │   ├── runtime.py           ← /api/runtime/*
│   │   ├── contracts.py         ← /api/contracts/*
│   │   ├── compliance.py        ← /api/compliance/*
│   │   ├── fleet.py             ← /api/fleet/*
│   │   ├── distribution.py      ← /api/distribution/*
│   │   ├── reports.py           ← /api/reports/*
│   │   ├── trends.py            ← /api/trends/*
│   │   ├── community.py         ← /api/community/*
│   │   ├── voice.py             ← /api/voice/*
│   │   ├── scripts.py           ← /api/scripts/*
│   │   ├── clips.py             ← /api/clips/*
│   │   ├── music.py             ← /api/music/*
│   │   ├── thumbnails.py        ← /api/thumbnails/*
│   │   └── videos.py            ← /api/videos/*
│   │
│   ├── schemas/                 ← Pydantic request/response models
│   │   ├── base.py
│   │   ├── compliance.py
│   │   └── contracts.py
│   │
│   ├── tools/
│   │   └── pdf_extractor.py     ← PDF contract text extraction
│   │
│   └── scripts/                 ← Audit & data seeding utilities
│       ├── seed_data.py
│       ├── audit_sprint1a.py
│       ├── audit_sprint1b.py
│       ├── audit_sprint1c.py
│       └── audit_phase2.py
│
├── frontend/                    ← React 19 + Vite + TailwindCSS v4
│   ├── package.json             ← Dependencies (React 19, Framer Motion, Zustand)
│   ├── vite.config.ts           ← Build config with @ path aliasing
│   ├── tsconfig.json
│   ├── index.html
│   │
│   └── src/
│       ├── App.tsx              ← Root app with routing, error boundary, toasts
│       ├── main.tsx             ← React DOM entry point
│       ├── index.css            ← Global styles + clay design tokens
│       │
│       ├── pages/               ← 13 page components
│       │   ├── Landing.tsx      ← Marketing page (83KB — full 3D animations)
│       │   ├── CommandCenter.tsx ← AI command dashboard
│       │   ├── Contracts.tsx    ← Contract review interface
│       │   ├── Compliance.tsx   ← FTC & copyright scanner
│       │   ├── Fleet.tsx        ← Agent fleet status
│       │   ├── Distribution.tsx ← Trend & distribution tools
│       │   ├── ScriptsStudio.tsx ← Hook & script generator
│       │   ├── MediaStudio.tsx  ← Thumbnail & video studio
│       │   ├── ChannelProfile.tsx ← Creator profile & memory
│       │   ├── About.tsx
│       │   ├── Privacy.tsx
│       │   ├── Terms.tsx
│       │   └── Security.tsx
│       │
│       ├── components/
│       │   ├── auth/            ← Auth modal & guards
│       │   ├── calendar/        ← Content calendar widgets
│       │   ├── clay/            ← Claymorphism design system
│       │   ├── layout/          ← Navbar, Footer, PageHeader
│       │   └── media/           ← Media studio components
│       │
│       ├── context/
│       │   └── AuthContext.tsx   ← Firebase Auth context provider
│       │
│       ├── services/
│       │   └── firebase.ts      ← Firebase initialization & auth
│       │
│       ├── store/
│       │   └── useStudioStore.ts ← Zustand global state
│       │
│       └── lib/
│           ├── api.ts           ← Backend API client (21KB)
│           ├── nav.ts           ← Navigation config
│           └── icons.tsx        ← Custom icon components
│
└── docs/                        ← Internal planning & design documents
    ├── 00-master-blueprint-prd.md
    ├── 01-system-architecture.md
    ├── 02-api-contracts.md
    ├── 03-database-design.md
    ├── 04-agent-workflow-overview.md
    ├── 05-automation-workflows.md
    ├── 06-ui-ux-figma-prompt.md
    ├── 07-state-management.md
    ├── 08-demo-and-polish.md
    ├── 09-development-roadmap.md
    ├── 10-folder-architecture.md
    ├── 11-environment-deployment.md
    └── agents/                  ← 14 individual agent specification docs
```

---

## 13. Installation & Setup Guide

### Prerequisites

| Requirement | Minimum Version | Purpose |
|:---|:---|:---|
| **Python** | 3.11+ | Backend runtime |
| **Node.js** | 18+ | Frontend build toolchain |
| **pnpm** | 8+ | Frontend package manager |
| **Google Cloud CLI** | Latest | `gcloud` for GCP authentication & deployment |
| **Docker** | 20+ | Container builds for Cloud Run |
| **Git** | 2.30+ | Source control |

### Step 1 — Clone the Repository

```bash
git clone https://github.com/z-lovejeet/Crewmate.git
cd Crewmate
```

### Step 2 — Backend Setup

```bash
cd backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS / Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies via pip (from pyproject.toml)
pip install -e .
# OR using uv (faster):
# uv sync

# Copy environment config
cp .env.example .env
```

**Configure `.env`:**

```env
# Option A: Vertex AI (recommended for GCP deployment)
GCP_PROJECT_ID=your_gcp_project_id
GCP_REGION=us-central1
USE_VERTEX_AI=true

# Option B: API Key (for local development without GCP)
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# App config
ENVIRONMENT=development
```

**Start the backend:**

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The API server will start at **`http://localhost:8000`** with:
- ✅ Agent Registry seeded with 15 agents
- ✅ Memory Bank loaded with creator preferences
- ✅ Model Armor middleware active
- ✅ Gateway rate limiter active

### Step 3 — Frontend Setup

```bash
cd ../frontend

# Install dependencies
pnpm install

# Copy environment config
cp .env.example .env
```

**Configure `.env`:**

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Start the frontend:**

```bash
pnpm dev
```

The dashboard will open at **`http://localhost:5173`**

### Step 4 — Verify Installation

Test the live GEAP endpoints:

```bash
# Health check
curl http://localhost:8000/

# Agent Registry (15 agents)
curl http://localhost:8000/api/registry/agents

# Memory Bank (creator context)
curl http://localhost:8000/api/memory

# Model Armor test (should return 403)
curl "http://localhost:8000/api/registry/agents?q=ignore%20all%20previous%20instructions"

# OpenTelemetry overview
curl http://localhost:8000/api/traces/overview

# Fleet status
curl http://localhost:8000/api/fleet/status
```

### Step 5 — Deploy to Google Cloud Run

```bash
# 1. Authenticate with Google Cloud
gcloud auth login
gcloud config set project crewmate-507013
gcloud auth configure-docker us-central1-docker.pkg.dev

# 2. Build Docker image
docker build -t us-central1-docker.pkg.dev/crewmate-507013/crewmate/backend:latest ./backend

# 3. Push to Artifact Registry
docker push us-central1-docker.pkg.dev/crewmate-507013/crewmate/backend:latest

# 4. Deploy to Cloud Run
gcloud run deploy crewmate-api \
    --image=us-central1-docker.pkg.dev/crewmate-507013/crewmate/backend:latest \
    --region=us-central1 \
    --platform=managed \
    --allow-unauthenticated \
    --set-env-vars=GCP_PROJECT_ID=crewmate-507013,USE_VERTEX_AI=true
```

### Step 6 — Deploy Frontend to Firebase Hosting

```bash
cd frontend

# Build production bundle
pnpm build

# Deploy to Firebase
firebase deploy --only hosting
```

---

## 14. API Reference

### GEAP Infrastructure Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/` | Platform health & GEAP component links |
| `GET` | `/health` | Health check |
| `GET` | `/api/registry/agents` | List all 15 registered agents |
| `GET` | `/api/memory` | Retrieve full memory bank (preferences + brand histories) |
| `GET` | `/api/traces/overview` | Aggregated observability metrics |
| `GET` | `/api/runtime/tasks` | List background runtime tasks |

### Autonomous Feature Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/contracts/review` | AI contract review with clause extraction & risk scoring |
| `POST` | `/api/compliance/scan` | FTC disclosure & copyright compliance scan |
| `POST` | `/api/fleet/dispatch` | Dispatch multi-agent fleet for complex goals |
| `GET` | `/api/fleet/status` | Real-time fleet health & agent status |
| `POST` | `/api/distribution/optimize` | Platform-specific metadata & SEO optimization |
| `POST` | `/api/reports/generate` | Compile executive summary reports |
| `POST` | `/api/trends/scan` | Scan for viral trending topics |
| `POST` | `/api/community/analyze` | Sentiment analysis & comment clustering |
| `POST` | `/api/voice/command` | Process voice commands via orchestrator |
| `POST` | `/api/scripts/generate` | Hook & script generation |
| `POST` | `/api/clips/extract` | Video clipping & repurposing |
| `POST` | `/api/music/suggest` | Lyria AI music replacement suggestions |
| `POST` | `/api/thumbnails/generate` | AI thumbnail generation (Gemini 3 Pro Image) |
| `POST` | `/api/videos/generate` | AI video synthesis (Veo 3.1) |

---

> **Built with ❤️ by Lovejeet Singh & Sachit Babbar for the All Things Agentic Hackathon 2026**  
> **Track**: The Fortified Enterprise Fleet (Track 3)
