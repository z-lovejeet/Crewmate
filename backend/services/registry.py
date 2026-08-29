import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from .firestore_client import save_document, get_document, list_documents, query_documents

logger = logging.getLogger(__name__)

AGENTS_COLLECTION = "agents"

# Master definitions of all 14 Fleet Agents
CANONICAL_AGENTS = [
    {
        "id": "orchestrator",
        "name": "Fleet Orchestrator (Captain)",
        "role": "Supervisor & Task Decomposition",
        "version": "2.4.0",
        "model": "gemini-2.5-pro",
        "status": "active",
        "health": "healthy",
        "category": "core",
        "capabilities": [
            "goal_decomposition",
            "multi_agent_routing",
            "cross_agent_synthesis",
            "circuit_breaker_monitoring"
        ],
        "description": "Decomposes complex creator goals into sub-tasks and orchestrates the 13 specialist workers.",
        "max_concurrency": 5,
        "timeout_seconds": 60,
    },
    {
        "id": "contract_reviewer",
        "name": "Contract Reviewer",
        "role": "Legal & Sponsorship Risk Auditor",
        "version": "2.1.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "business",
        "capabilities": [
            "pdf_clause_extraction",
            "risk_scoring",
            "counter_proposal_generation",
            "exclusivity_analysis"
        ],
        "description": "Audits brand contracts for exclusivity traps, unfavorable terms, and generates redline counter-proposals.",
        "max_concurrency": 3,
        "timeout_seconds": 30,
    },
    {
        "id": "content_compliance",
        "name": "Content Compliance",
        "role": "FTC & Copyright Guard",
        "version": "2.1.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "legal",
        "capabilities": [
            "ftc_disclosure_audit",
            "copyright_audio_scan",
            "platform_guidelines_check",
            "lyria_audio_replacement"
        ],
        "description": "Scans video metadata, scripts, and audio for FTC disclosure compliance and copyright strike risks.",
        "max_concurrency": 4,
        "timeout_seconds": 30,
    },
    {
        "id": "distribution_manager",
        "name": "Distribution Manager",
        "role": "YouTube & Instagram Optimizer",
        "version": "2.0.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "growth",
        "capabilities": [
            "youtube_metadata_seo",
            "instagram_caption_hashtags",
            "timing_optimization",
            "platform_spec_validation"
        ],
        "description": "Transforms raw video ideas into platform-optimized title, description, tags, and posting schedule packages.",
        "max_concurrency": 4,
        "timeout_seconds": 25,
    },
    {
        "id": "report_generator",
        "name": "Report Generator",
        "role": "Executive Summarizer",
        "version": "1.9.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "analytics",
        "capabilities": [
            "executive_summary_compilation",
            "pdf_report_export",
            "deal_audit_dossier",
            "veo_video_summary"
        ],
        "description": "Compiles cross-agent findings into sleek, downloadable PDF audit reports and executive dashboards.",
        "max_concurrency": 2,
        "timeout_seconds": 45,
    },
    {
        "id": "revenue_optimizer",
        "name": "Revenue Optimizer",
        "role": "Deal Economics & CPM Benchmarking",
        "version": "2.0.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "business",
        "capabilities": [
            "cpm_market_benchmarking",
            "revenue_projection",
            "deal_valuation",
            "negotiation_leverage_calc"
        ],
        "description": "Benchmarks brand deal valuations against live industry creator CPMs to ensure creators never leave money on the table.",
        "max_concurrency": 3,
        "timeout_seconds": 25,
    },
    {
        "id": "brand_safety",
        "name": "Brand Safety",
        "role": "Reputation & Sponsor Alignment",
        "version": "1.8.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "legal",
        "capabilities": [
            "controversy_scan",
            "brand_alignment_check",
            "audience_fit_evaluation"
        ],
        "description": "Screens prospective sponsors against creator ethics, past controversies, and audience trust boundaries.",
        "max_concurrency": 3,
        "timeout_seconds": 20,
    },
    {
        "id": "content_calendar",
        "name": "Content Calendar",
        "role": "Schedule & Cadence Architect",
        "version": "1.8.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "growth",
        "capabilities": [
            "schedule_conflict_detection",
            "cross_platform_cadence",
            "sponsor_obligation_tracker"
        ],
        "description": "Maintains harmonious posting frequency across YouTube Shorts, Long-form, and Instagram Reels without creator burnout.",
        "max_concurrency": 2,
        "timeout_seconds": 20,
    },
    {
        "id": "threat_sentinel",
        "name": "Threat Sentinel",
        "role": "Fleet Security & Anomaly Monitor",
        "version": "2.2.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "security",
        "capabilities": [
            "model_armor_anomaly_detection",
            "tool_poisoning_defense",
            "pii_leak_monitoring",
            "circuit_breaker_tripping"
        ],
        "description": "24/7 autonomous security sentry that monitors agent reasoning chains and input payloads for malicious activity.",
        "max_concurrency": 5,
        "timeout_seconds": 15,
    },
    {
        "id": "audience_analyst",
        "name": "Audience Analyst",
        "role": "Demographics & Retention Physicist",
        "version": "1.9.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "analytics",
        "capabilities": [
            "demographic_synthesis",
            "dropoff_curve_modeling",
            "topic_affinity_scoring"
        ],
        "description": "Decodes subscriber analytics into actionable retention physics and demographic insights.",
        "max_concurrency": 3,
        "timeout_seconds": 25,
    },
    {
        "id": "trend_radar",
        "name": "Trend Radar",
        "role": "Real-Time Viral Signal Hunter",
        "version": "2.1.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "growth",
        "capabilities": [
            "trending_topic_scan",
            "content_gap_analysis",
            "velocity_scoring",
            "content_brief_generation"
        ],
        "description": "Discovers breakout niche trends before saturation and generates high-velocity content briefs.",
        "max_concurrency": 3,
        "timeout_seconds": 30,
    },
    {
        "id": "hook_architect",
        "name": "Hook & Script Architect",
        "role": "First-3-Seconds & Script Engineer",
        "version": "2.0.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "growth",
        "capabilities": [
            "retention_hook_engineering",
            "beat_by_beat_scripting",
            "curiosity_gap_optimization",
            "pattern_interrupt_design"
        ],
        "description": "Engineers high-retention video hooks and timestamped scripts designed to prevent first-5-second drop-off.",
        "max_concurrency": 3,
        "timeout_seconds": 35,
    },
    {
        "id": "clipping_director",
        "name": "Smart Repurposing Director",
        "role": "Viral Moment & Short-Form Extractor",
        "version": "2.0.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "growth",
        "capabilities": [
            "transcript_energy_scoring",
            "viral_moment_extraction",
            "vertical_crop_planning",
            "shorts_caption_packaging"
        ],
        "description": "Turns a single 15-minute long-form YouTube video into 3-5 high-engagement Instagram Reels and Shorts.",
        "max_concurrency": 3,
        "timeout_seconds": 35,
    },
    {
        "id": "community_guardian",
        "name": "Community Sentiment Guardian",
        "role": "Comment Clustered Intelligence & Mod",
        "version": "2.1.0",
        "model": "gemini-2.5-flash",
        "status": "active",
        "health": "healthy",
        "category": "community",
        "capabilities": [
            "gemma_sentiment_clustering",
            "toxic_comment_filtering",
            "creator_voice_reply_generation",
            "viewer_feature_request_extraction"
        ],
        "description": "Clusters thousands of viewer comments into structured sentiment trends, moderates toxicity, and drafts personalized replies.",
        "max_concurrency": 4,
        "timeout_seconds": 25,
    },
]


async def seed_agent_registry() -> List[Dict[str, Any]]:
    """Seed the Firestore Agent Registry with all 14 canonical agents if not present."""
    registered = []
    for agent in CANONICAL_AGENTS:
        existing = await get_document(AGENTS_COLLECTION, agent["id"])
        if not existing:
            saved = await save_document(AGENTS_COLLECTION, agent["id"], agent)
            registered.append(saved)
        else:
            # Sync metadata while preserving runtime stats
            merged = {**agent, **existing}
            saved = await save_document(AGENTS_COLLECTION, agent["id"], merged)
            registered.append(saved)
    logger.info(f"Agent Registry seeded with {len(registered)} agents in Firestore.")
    return registered


async def get_all_agents() -> List[Dict[str, Any]]:
    """List all registered agents from Firestore."""
    agents = await list_documents(AGENTS_COLLECTION, limit=50, order_by=None)
    if not agents:
        agents = await seed_agent_registry()
    return agents


async def get_agent_by_id(agent_id: str) -> Optional[Dict[str, Any]]:
    """Fetch an agent definition by ID."""
    agent = await get_document(AGENTS_COLLECTION, agent_id)
    if not agent:
        # Check canonical
        match = next((a for a in CANONICAL_AGENTS if a["id"] == agent_id), None)
        if match:
            await save_document(AGENTS_COLLECTION, agent_id, match)
            return match
    return agent


async def update_agent_status(agent_id: str, status: str, health: str = "healthy", stats: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    """Update agent health, state, and metrics."""
    data = {"status": status, "health": health, "last_heartbeat": datetime.now(timezone.utc).isoformat()}
    if stats:
        data["stats"] = stats
    return await save_document(AGENTS_COLLECTION, agent_id, data)
