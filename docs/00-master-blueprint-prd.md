# 🎯 Crewmate — Master Blueprint (PRD)

> **Product Requirements Document v1.0**
> **Project**: Crewmate — Enterprise Agent Fleet for Content Creators
> **Track**: The Fortified Enterprise Fleet (Track 3)
> **Builder**: Solo / Hobbyist
> **Hackathon**: All Things Agentic Hackathon 2026
> **Deadline**: August 31, 2026

---

## 1. Vision & Problem Statement

### The Problem
The creator economy is worth $250B+ with 50M+ content creators worldwide. Yet solo creators managing brand sponsorships, content compliance, and multi-platform distribution rely on spreadsheets, manual checklists, and gut instinct. They face:

- **Brand deal contracts** with buried exclusivity traps, below-market rates, and unfavorable payment terms — creators sign bad deals because they can't afford legal review
- **Content compliance minefields** — FTC disclosure requirements, copyright claims, platform-specific community guidelines across YouTube and Instagram — a single violation can mean demonetization or account suspension
- **Multi-platform chaos** — different specs, metadata, posting schedules, and audience behaviors across YouTube and Instagram — managed manually
- **Zero governance** — no security, no audit trails, no memory of past interactions, no threat detection

### The "Unlikely Hero"
Enterprise-grade agent fleets are built for Fortune 500 CIOs. **Crewmate builds one for the solo YouTuber** — the unlikely hero who needs enterprise governance but has zero corporate support. This directly addresses Track 3's hidden judging criterion.

### The Solution
**Crewmate** is an autonomous multi-agent fleet powered by Google ADK and the Gemini Enterprise Agent Platform (GEAP) that gives every solo content creator:
- **13 specialized AI agents** that autonomously review contracts, scan content compliance, optimize distribution, analyze revenue, monitor threats, and generate client-ready reports
- **Enterprise governance** — Model Armor security, per-agent identity/RBAC, full observability traces, circuit breakers, Memory Bank for cross-session context
- **Multimodal UX** — voice commands, document vision (PDF analysis), video analysis, 3D claymorphism dashboard with soft clay-like depth, warm light theme, premium animations, and award-winning human-designed aesthetic
- **Bonus AI models** — Gemma for content classification, Veo for video summaries, Lyria for royalty-free music alternatives

---

## 2. Target Prizes & Scoring Strategy

### Prize Targeting (One Prize Per Submission Rule)
| Priority | Prize | Value | How Crewmate Wins |
|:---|:---|:---|:---|
| 1 | Grand Prize | $50,000 | Highest scorer across ALL tracks — 12+ Google technologies, 13 agents, full GEAP |
| 2 | Track 3: Enterprise Fleet | $20,000 | Perfect "Unlikely Hero", all GEAP components, multi-agent fleet |
| 3 | Individual/Hobbyist | $10,000 × 2 | Solo-built, impressive scope for one person |
| 4 | Best Architecture | $5,000 × 2 | 7-layer architecture, ADRs, hexagonal separation, circuit breakers |
| 5 | Best Multimodal UX | $5,000 × 2 | Voice + Vision + 3D Claymorphism dashboard + Veo + Lyria |

### Scoring Criteria
| Criterion | Weight | Our Strategy |
|:---|:---|:---|
| Innovation & Operational Utility | 40% | "Unlikely Hero" content creator + autonomous multi-step pipelines + measurable output |
| Architectural Discipline & Tech Stack | 30% | 7-layer architecture, 14 agents, all GEAP components, circuit breakers, ADRs |
| Demo & Production Readiness | 30% | Live unedited demo, Cloud Console proof, hosted URL, reproducible README |

### Bonus Points (Max +1.0)
| Bonus | Points | Integration |
|:---|:---|:---|
| Gemma | +0.2 | Content categorization agent tool |
| Veo | +0.2 | Video summary generation in Report Agent |
| Lyria | +0.2 | Royalty-free music alternatives in Compliance Agent |
| Blog post | +0.2 | Medium article with hackathon attribution |
| Social post | +0.2 | LinkedIn with #AllThingsAgenticHackathon |

---

## 3. Functional Requirements

### FR-1: Contract Review Pipeline
- **FR-1.1**: Upload PDF brand deal contracts (drag-and-drop or file picker)
- **FR-1.2**: Agent extracts all clauses and categorizes them (exclusivity, payment, usage rights, termination, performance)
- **FR-1.3**: Agent assigns risk severity per clause (Low / Medium / High / Critical)
- **FR-1.4**: Agent generates negotiation counter-suggestions for risky clauses
- **FR-1.5**: Revenue Agent benchmarks deal value against market rates
- **FR-1.6**: Memory Bank stores brand interaction history for future context
- **FR-1.7**: Report Agent generates branded PDF compliance report

### FR-2: Content Compliance Scanning
- **FR-2.1**: Submit content metadata (title, description, tags, audio info, thumbnail)
- **FR-2.2**: Agent checks FTC disclosure requirements (#ad, #sponsored, branded content tags)
- **FR-2.3**: Agent checks platform-specific rules (YouTube Community Guidelines, Instagram Branded Content Policy)
- **FR-2.4**: Agent scans for copyright issues in audio tracks
- **FR-2.5**: Lyria generates royalty-free music alternatives when copyright detected
- **FR-2.6**: Gemma classifies content category (review, tutorial, vlog, sponsored, etc.)
- **FR-2.7**: Real-time compliance score gauge per platform

### FR-3: Multi-Platform Distribution
- **FR-3.1**: Check content readiness per platform (YouTube specs, Instagram specs)
- **FR-3.2**: Generate optimized metadata per platform (titles, descriptions, hashtags, tags)
- **FR-3.3**: Content Calendar management with scheduling and conflict detection
- **FR-3.4**: Audience Agent suggests optimal posting times
- **FR-3.5**: Distribution readiness gauge per platform

### FR-4: Revenue & Analytics
- **FR-4.1**: Analyze deal economics (CPM, flat rate, hybrid models)
- **FR-4.2**: Compare deal value against historical data and market benchmarks
- **FR-4.3**: Generate revenue projections
- **FR-4.4**: Suggest negotiation talking points

### FR-5: Fleet Governance & Security
- **FR-5.1**: Model Armor screens ALL user inputs for prompt injection, jailbreaks
- **FR-5.2**: Model Armor screens ALL agent outputs for PII leaks, harmful content
- **FR-5.3**: Per-agent identity with scoped permissions (Contract Agent: READ-only, Distribution Agent: PUBLISH capability)
- **FR-5.4**: Circuit breakers: max 3 retries per agent, 30-second timeout, fallback responses
- **FR-5.5**: Threat Sentinel monitors all agent traffic in background
- **FR-5.6**: Full observability traces via OpenTelemetry + Cloud Trace

### FR-6: Multimodal UX
- **FR-6.1**: Voice commands via Web Speech API → Gemini text processing → agent routing
- **FR-6.2**: Document vision — upload PDF → Gemini Vision extracts and analyzes
- **FR-6.3**: 3D claymorphism dashboard with soft clay-depth UI components, warm light theme, premium micro-animations, and award-winning human-designed aesthetic
- **FR-6.4**: Real-time agent status via WebSocket (live ticker tape, status lights)
- **FR-6.5**: Veo-generated 30-second video summaries for brand partners

### FR-7: Memory & Persistence
- **FR-7.1**: Memory Bank stores creator preferences (min deal value, max exclusivity, preferred terms)
- **FR-7.2**: Brand history tracking (past contracts, risk patterns, deal values)
- **FR-7.3**: Content pattern analysis (posting frequency, engagement patterns, top categories)
- **FR-7.4**: Cross-session context — agents remember past interactions

### FR-8: Trend & Content Strategy
- **FR-8.1**: Scan trending topics, generate content briefs with velocity scores, identify content gaps

### FR-9: Script & Hook Generation
- **FR-9.1**: Generate retention-optimized hooks and full video scripts with timestamped beats

### FR-10: Content Repurposing
- **FR-10.1**: Extract viral moments from long-form videos, prepare clip packages for Shorts/Reels

### FR-11: Community Intelligence
- **FR-11.1**: Cluster viewer comments, detect toxic content, generate context-aware replies

---

## 4. Non-Functional Requirements

| Category | Requirement |
|:---|:---|
| **Performance** | Agent response within 10 seconds for simple tasks, 30 seconds for complex analysis |
| **Scalability** | Cloud Run auto-scaling 0-3 instances (hackathon demo scope) |
| **Security** | Model Armor on ALL I/O, no hardcoded API keys, Firebase Auth for user authentication |
| **Reliability** | Circuit breakers, retry with exponential backoff, fallback responses |
| **Observability** | Every agent action traced via OpenTelemetry, viewable in dashboard |
| **Deployment** | One-command Docker Compose local setup, Cloud Run production deployment |
| **Testing** | Reproducible testing instructions in README (Devpost requirement) |

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS | 3D Claymorphism dashboard SPA |
| **Backend** | Python 3.11 + FastAPI | API Gateway + Agent runtime |
| **Agent Framework** | Google ADK (SequentialAgent, ParallelAgent) | Multi-agent orchestration |
| **Agent Runtime** | Antigravity SDK | Safety policies, budget governance, hooks |
| **AI Model** | Gemini 3.7 Flash (via GenAI SDK) | Primary reasoning engine |
| **Database** | Firebase / Firestore | Agent registry, state, memory, traces |
| **Messaging** | Google Cloud Pub/Sub | Async agent-to-agent events |
| **Security** | Model Armor | I/O screening for all agents |
| **Observability** | Cloud Trace + OpenTelemetry | Reasoning chain audit trail |
| **Hosting** | Google Cloud Run | Serverless container deployment |
| **Storage** | Google Cloud Storage | Uploaded contracts, generated reports |
| **Bonus: Classification** | Gemma | Lightweight content categorization |
| **Bonus: Video** | Veo | Auto-generated video summaries |
| **Bonus: Audio** | Lyria | Royalty-free music alternatives |

---

## 6. Agent Fleet Summary

| # | Agent | Primary Responsibility | Key Tools |
|:---|:---|:---|:---|
| 0 | 🧠 Fleet Orchestrator | Goal decomposition, task routing, state management | Registry lookup, circuit breaker, state manager |
| 1 | 📋 Contract Reviewer | Brand deal analysis, risk scoring | extract_clauses, score_risk, draft_counter |
| 2 | 🛡️ Content Compliance | FTC, copyright, platform rules checking | check_ftc, scan_copyright, check_platform_rules |
| 3 | 📡 Distribution Manager | Multi-platform readiness, metadata optimization | check_specs, generate_metadata, optimize_seo |
| 4 | 📊 Report Generator | Compliance reports, video summaries | compile_report, generate_pdf, call_veo |
| 5 | 💰 Revenue Optimizer | Deal economics, market benchmarking | benchmark_rates, project_revenue, suggest_negotiation |
| 6 | 🎯 Brand Safety | Brand alignment, content appropriateness | check_alignment, scan_controversial, verify_guidelines |
| 7 | 📅 Content Calendar | Scheduling, conflict detection, timing optimization | find_conflicts, suggest_timing, sync_platforms |
| 8 | 🔒 Threat Sentinel | Security monitoring, anomaly detection | model_armor_scan, detect_anomaly, circuit_breaker |
| 9 | 👥 Audience Analyst | Demographics analysis, engagement prediction | analyze_demographics, predict_engagement, suggest_topics |
| 10 | Trend Radar & Content Strategist | Trend discovery, content gap analysis, weekly content briefs | scan_trending, analyze_content_gap, generate_brief, score_velocity |
| 11 | Hook & Script Architect | Video hook engineering, structured script drafting, retention optimization | analyze_retention, generate_hooks, draft_script, optimize_retention |
| 12 | Smart Repurposing & Clipping Director | Viral moment detection, short-form clip extraction, cross-platform repurposing | analyze_transcript_energy, detect_viral_moments, generate_clip_package |
| 13 | Community Sentiment & Feedback Guardian | Comment clustering, sentiment analysis, toxic content moderation, reply drafting | classify_sentiment, cluster_feedback, detect_toxic, generate_replies |

> Full specs for each agent in `docs/agents/agent-XX-*.md`

---

## 7. GEAP Component Mapping

| GEAP Component | Crewmate Implementation |
|:---|:---|
| Agent Registry | Firestore `agents` collection with metadata, versions, capabilities, health |
| Agent Runtime | Cloud Run containers + ADK orchestrator with async Pub/Sub execution |
| Memory Bank | Firestore `memory` collection — creator preferences, brand history, content patterns |
| Agent Identity | Per-agent scoped Firestore rules + custom JWT claims |
| Agent Gateway | FastAPI service on Cloud Run with auth, rate limiting, routing |
| Model Armor | `google-cloud-modelarmor` SDK — input sanitization + output screening |
| Agent Observability | OpenTelemetry SDK → Cloud Trace — full reasoning chain per agent |

---

## 8. Platforms Supported

| Platform | Compliance Checks | Distribution Features |
|:---|:---|:---|
| **YouTube** | FTC disclosure, copyright audio scan, Community Guidelines, branded content | Title/description SEO, tags, thumbnail review, subtitle/caption check |
| **Instagram** | FTC disclosure, branded content tag, image rights, hashtag requirements | Caption optimization, hashtag generation, aspect ratio check, Story format |

---

## 9. Document References

All detailed specifications are in separate documents:

| Document | File | Contains |
|:---|:---|:---|
| System Architecture | [`01-system-architecture.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/01-system-architecture.md) | 7-layer architecture, ADRs, Mermaid diagrams |
| API Contracts | [`02-api-contracts.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/02-api-contracts.md) | All REST + WebSocket endpoints |
| Database Design | [`03-database-design.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/03-database-design.md) | Firestore schemas, indexes, security rules |
| Agent Workflow | [`04-agent-workflow-overview.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/04-agent-workflow-overview.md) | Agent communication, orchestration patterns |
| Individual Agents | [`agents/agent-XX-*.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/agents/) | Per-agent detailed specs (14 docs) |
| Automation Workflows | [`05-automation-workflows.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/05-automation-workflows.md) | 9 autonomous pipelines |
| UI/UX + Figma Prompt | [`06-ui-ux-figma-prompt.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/06-ui-ux-figma-prompt.md) | 3D Claymorphism design system, Figma master prompt |
| State Management | [`07-state-management.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/07-state-management.md) | State flow, Firestore patterns, caching |
| Demo & Polish | [`08-demo-and-polish.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/08-demo-and-polish.md) | Video script, Devpost copy, blog outline |
| Development Roadmap | [`09-development-roadmap.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/09-development-roadmap.md) | Day-by-day timeline, milestones |
| Folder Architecture | [`10-folder-architecture.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/10-folder-architecture.md) | Complete file tree (backend focus) |
| Environment & Deploy | [`11-environment-deployment.md`](file:///Users/lovejeetsingh1/Documents/Hackathons/crewmate/docs/11-environment-deployment.md) | GCP setup, Docker, CI/CD |

---

## 10. Success Metrics

| Metric | Target |
|:---|:---|
| Agents functional | 13/13 agents responding correctly |
| Contract analysis accuracy | Correctly flags risky clauses in sample contracts |
| Compliance scan coverage | YouTube + Instagram rules fully checked |
| Demo video length | 4 minutes, unedited, live execution |
| Architecture diagram | Professional PNG uploaded to Devpost |
| Hosted URL | Live Cloud Run deployment accessible |
| Bonus points | All +1.0 (Gemma + Veo + Lyria + blog + social) |
| Google technologies used | 12+ (3 SDKs + 3 Cloud services + Model Armor + Trace + 3 bonus models + Cloud Storage + Firebase Auth) |
