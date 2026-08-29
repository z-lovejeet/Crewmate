import logging
from typing import Dict, Any, List, Optional
from fastapi import Request, HTTPException, Security, status
from fastapi.security import APIKeyHeader

logger = logging.getLogger(__name__)

API_KEY_HEADER = APIKeyHeader(name="X-Agent-Identity-Key", auto_error=False)

# Fine-grained Role-Based Access Control matrix for the 14 Fleet Agents
AGENT_RBAC_MATRIX: Dict[str, Dict[str, Any]] = {
    "orchestrator": {
        "role": "fleet_captain",
        "allowed_actions": ["dispatch_all", "read_all", "write_all", "synthesize"],
        "readable_collections": ["*"],
        "writable_collections": ["*"],
        "execution_tier": "pro_reasoning"
    },
    "contract_reviewer": {
        "role": "legal_auditor",
        "allowed_actions": ["extract_clauses", "score_risk", "draft_counters"],
        "readable_collections": ["contracts", "memory", "agents"],
        "writable_collections": ["contracts", "traces"],
        "execution_tier": "flash_fast"
    },
    "content_compliance": {
        "role": "compliance_guard",
        "allowed_actions": ["scan_ftc", "scan_copyright", "audit_guidelines"],
        "readable_collections": ["compliance_results", "memory", "contracts"],
        "writable_collections": ["compliance_results", "traces"],
        "execution_tier": "flash_fast"
    },
    "distribution_manager": {
        "role": "publisher",
        "allowed_actions": ["generate_metadata", "optimize_seo", "schedule_posts"],
        "readable_collections": ["calendar", "memory", "content_briefs"],
        "writable_collections": ["calendar", "traces"],
        "execution_tier": "flash_fast"
    },
    "report_generator": {
        "role": "reporter",
        "allowed_actions": ["compile_executive_summary", "export_pdf"],
        "readable_collections": ["contracts", "compliance_results", "revenue", "memory"],
        "writable_collections": ["reports", "traces"],
        "execution_tier": "flash_fast"
    },
    "revenue_optimizer": {
        "role": "financial_analyst",
        "allowed_actions": ["benchmark_cpm", "calculate_deal_valuation"],
        "readable_collections": ["contracts", "revenue", "memory"],
        "writable_collections": ["revenue", "traces"],
        "execution_tier": "flash_fast"
    },
    "brand_safety": {
        "role": "safety_auditor",
        "allowed_actions": ["screen_sponsor", "brand_alignment_check"],
        "readable_collections": ["contracts", "memory"],
        "writable_collections": ["compliance_results", "traces"],
        "execution_tier": "flash_fast"
    },
    "content_calendar": {
        "role": "scheduler",
        "allowed_actions": ["check_conflicts", "sync_dates"],
        "readable_collections": ["calendar", "memory"],
        "writable_collections": ["calendar", "traces"],
        "execution_tier": "flash_fast"
    },
    "threat_sentinel": {
        "role": "security_sentry",
        "allowed_actions": ["scan_threats", "trip_circuit_breaker"],
        "readable_collections": ["armor_logs", "traces", "agents"],
        "writable_collections": ["armor_logs", "traces"],
        "execution_tier": "flash_fast"
    },
    "audience_analyst": {
        "role": "demographics_analyst",
        "allowed_actions": ["analyze_retention", "predict_engagement"],
        "readable_collections": ["memory", "revenue"],
        "writable_collections": ["traces"],
        "execution_tier": "flash_fast"
    },
    "trend_radar": {
        "role": "trend_hunter",
        "allowed_actions": ["scan_trending", "generate_briefs"],
        "readable_collections": ["memory", "content_briefs"],
        "writable_collections": ["content_briefs", "traces"],
        "execution_tier": "flash_fast"
    },
    "hook_architect": {
        "role": "script_engineer",
        "allowed_actions": ["engineer_hooks", "draft_scripts"],
        "readable_collections": ["content_briefs", "memory"],
        "writable_collections": ["scripts", "traces"],
        "execution_tier": "flash_fast"
    },
    "clipping_director": {
        "role": "repurposing_editor",
        "allowed_actions": ["score_energy", "extract_clips"],
        "readable_collections": ["content_briefs", "memory"],
        "writable_collections": ["clips", "traces"],
        "execution_tier": "flash_fast"
    },
    "community_guardian": {
        "role": "sentiment_moderator",
        "allowed_actions": ["cluster_comments", "filter_toxicity", "draft_replies"],
        "readable_collections": ["comments", "memory"],
        "writable_collections": ["moderation_actions", "traces"],
        "execution_tier": "flash_fast"
    }
}


def verify_agent_permission(agent_id: str, action: str, collection: Optional[str] = None, is_write: bool = False) -> bool:
    """Validate whether an agent has authorization to perform an action on a target collection."""
    agent_perms = AGENT_RBAC_MATRIX.get(agent_id)
    if not agent_perms:
        logger.warning(f"❌ Unknown agent identity '{agent_id}' attempted action '{action}'")
        return False

    # Captain has unrestricted access
    if agent_perms.get("role") == "fleet_captain":
        return True

    # Validate action
    allowed_actions = agent_perms.get("allowed_actions", [])
    if action not in allowed_actions and "all" not in allowed_actions:
        logger.warning(f"❌ Agent '{agent_id}' denied action '{action}' (allowed: {allowed_actions})")
        return False

    # Validate collection access
    if collection:
        target_list = agent_perms.get("writable_collections" if is_write else "readable_collections", [])
        if "*" not in target_list and collection not in target_list:
            logger.warning(f"❌ Agent '{agent_id}' denied {'write' if is_write else 'read'} on collection '{collection}'")
            return False

    return True


def get_agent_identity_metadata(agent_id: str) -> Dict[str, Any]:
    """Retrieve identity and security scope for an agent."""
    perms = AGENT_RBAC_MATRIX.get(agent_id, {
        "role": "guest_agent",
        "allowed_actions": [],
        "readable_collections": [],
        "writable_collections": [],
        "execution_tier": "sandboxed"
    })
    return {
        "agent_id": agent_id,
        "identity_verified": agent_id in AGENT_RBAC_MATRIX,
        **perms
    }
