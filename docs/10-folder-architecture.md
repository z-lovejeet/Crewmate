# Folder Architecture — Crewmate

## 1. Full Tree

```
crewmate/
├── README.md                          # Project overview and entry point
├── ARCHITECTURE.md                    # Architecture decisions and diagrams
├── docker-compose.yml                 # Local development environment
├── .env.example                       # Template for environment variables
├── backend/                           # Python FastAPI Backend
│   ├── main.py                        # FastAPI application setup and WebSocket endpoints
│   ├── requirements.txt               # Python dependencies
│   ├── Dockerfile                     # Container definition for Cloud Run
│   ├── agents/                        # The Agent Fleet (Google ADK)
│   │   ├── __init__.py                # Package init
│   │   ├── orchestrator.py            # Hierarchical supervisor, coordinates tasks
│   │   ├── contract_reviewer.py       # Analyzes sponsorship contracts
│   │   ├── content_compliance.py      # Checks content against FTC/platform guidelines
│   │   ├── distribution_manager.py    # Publishes to YouTube/Instagram
│   │   ├── report_generator.py        # Summarizes fleet activity for creator
│   │   ├── revenue_optimizer.py       # Analyzes pricing and negotiation tactics
│   │   ├── brand_safety.py            # Ensures content matches brand voice
│   │   ├── content_calendar.py        # Schedules posts
│   │   ├── threat_sentinel.py         # Monitors for brand reputation risks
│   │   ├── audience_analyst.py        # Analyzes engagement metrics
│   │   ├── trend_radar.py             # Discovers breakout trends and generates personalized content briefs
│   │   ├── hook_architect.py          # Engineers retention hooks and drafts video scripts
│   │   ├── clipping_director.py       # Extracts viral moments from long-form to create Shorts/Reels
│   │   └── community_guardian.py      # Clusters comments for insights and handles moderation
│   ├── schemas/                       # Pydantic Models for Validation
│   │   ├── __init__.py
│   │   ├── base.py                    # Base models
│   │   ├── contracts.py               # Contract schemas
│   │   └── events.py                  # Pub/Sub event schemas
│   ├── services/                      # Core integration services
│   │   ├── __init__.py
│   │   ├── firestore.py               # Database client
│   │   ├── pubsub.py                  # Message broker client
│   │   ├── model_armor.py             # Security integration
│   │   └── observability.py           # Cloud Trace & OpenTelemetry
│   ├── tools/                         # Tools accessible by agents
│   │   ├── __init__.py
│   │   ├── youtube_api.py             # YouTube integration tool
│   │   ├── instagram_api.py           # Instagram integration tool
│   │   └── calculator.py              # Math utility for revenue
│   ├── config/                        # Configuration
│   │   ├── __init__.py
│   │   └── settings.py                # Pydantic BaseSettings loading .env
│   └── tests/                         # Test Suite
│       ├── __init__.py
│       ├── test_agents/               # Agent unit tests
│       │   ├── test_trend_radar.py
│       │   ├── test_hook_architect.py
│       │   ├── test_clipping_director.py
│       │   └── test_community_guardian.py
│       └── test_services/             # Integration tests
├── frontend/                          # React 19 + Vite 3D Claymorphism SPA
├── deploy/                            # Deployment scripts and config
│   ├── cloudbuild.yaml                # CI/CD pipeline definition
│   └── setup_gcp.sh                   # Script to provision GCP resources
├── docs/                              # Project Documentation
│   ├── 01-system-architecture.md
│   ├── 10-folder-architecture.md
│   └── 11-environment-deployment.md
├── demo/                              # Assets for hackathon demo
└── blog/                              # Devpost submission draft
```

## 2. Dependency Flow
- `main.py` -> `config/settings.py` -> `services/*`
- `main.py` -> `agents/orchestrator.py`
- `agents/orchestrator.py` -> `agents/*` (Specialized agents)
- `agents/*` -> `schemas/*`
- `agents/*` -> `tools/*`
- `services/*` <-> `agents/*` (State management via Firestore/PubSub)

## 3. Module Responsibility Matrix

| Module/Directory | Responsibility |
|---|---|
| `agents/` | Contains the logic, prompts, and ADK configuration for all 14 agents. |
| `schemas/` | Defines the data contracts (Pydantic) between the UI, API, and Agents. |
| `services/` | Wrappers for GCP services (Firestore, Pub/Sub, Model Armor). Keeps agent logic clean. |
| `tools/` | Deterministic functions (API calls, calculators) exposed to agents. |
| `config/` | Environment variable validation and global state configuration. |
