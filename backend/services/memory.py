import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from .firestore_client import save_document, get_document, list_documents, query_documents, delete_document

logger = logging.getLogger(__name__)

MEMORY_COLLECTION = "memory"
DEFAULT_CREATOR_ID = "solo_creator_main"

# Default baseline memory for the creator to bootstrap rich demos
DEFAULT_CREATOR_PREFERENCES = {
    "creator_id": DEFAULT_CREATOR_ID,
    "creator_name": "Alex 'TechVoyager' Rivera",
    "channel_niche": "Tech & AI Productivity",
    "platforms": ["YouTube", "Instagram"],
    "subscriber_count": 185000,
    "minimum_deal_value_usd": 6500,
    "target_cpm_usd": 45.0,
    "maximum_exclusivity_days": 30,
    "strictly_forbidden_categories": [
        "gambling",
        "unregulated_crypto_casinos",
        "miracle_supplements",
        "payday_loans"
    ],
    "preferred_payment_terms": "50% upfront on script approval, 50% Net 15 on publication",
    "voice_tone": "Analytical, warm, authentic, transparent with audience",
    "ftc_strict_policy": True
}

DEFAULT_BRAND_HISTORIES = [
    {
        "creator_id": DEFAULT_CREATOR_ID,
        "brand_name": "NordVPN",
        "past_deals_count": 3,
        "last_deal_value": 7500,
        "historical_cpm": 42.5,
        "payment_reliability": "excellent_net15",
        "contract_quirks": "Often tries to slip 60-day competitor exclusivity; always counter to 21 days category-only.",
        "performance_rating": 4.9,
        "notes": "Always fast on script approvals, great long-term partner."
    },
    {
        "creator_id": DEFAULT_CREATOR_ID,
        "brand_name": "BrandX Gaming Gear",
        "past_deals_count": 1,
        "last_deal_value": 4500,
        "historical_cpm": 30.0,
        "payment_reliability": "slow_net45",
        "contract_quirks": "Buried perpetual rights-in-all-media clause in 2025 contract. Required heavy redline.",
        "performance_rating": 3.2,
        "notes": "High risk of scope creep. Insist on exact revision caps."
    }
]


async def get_creator_preferences(creator_id: str = DEFAULT_CREATOR_ID) -> Dict[str, Any]:
    """Retrieve persistent creator preferences and policy rules."""
    doc_id = f"prefs_{creator_id}"
    prefs = await get_document(MEMORY_COLLECTION, doc_id)
    if not prefs:
        prefs = await save_document(MEMORY_COLLECTION, doc_id, DEFAULT_CREATOR_PREFERENCES)
    return prefs


async def update_creator_preferences(creator_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    """Update creator baseline preferences."""
    doc_id = f"prefs_{creator_id}"
    existing = await get_creator_preferences(creator_id)
    merged = {**existing, **updates, "creator_id": creator_id}
    return await save_document(MEMORY_COLLECTION, doc_id, merged)


async def get_brand_history(brand_name: str, creator_id: str = DEFAULT_CREATOR_ID) -> Optional[Dict[str, Any]]:
    """Retrieve historical negotiation and contract performance with a specific sponsor."""
    doc_id = f"brand_{creator_id}_{brand_name.lower().replace(' ', '_')}"
    history = await get_document(MEMORY_COLLECTION, doc_id)
    if not history:
        # Check initial default brands
        match = next((b for b in DEFAULT_BRAND_HISTORIES if b["brand_name"].lower() == brand_name.lower()), None)
        if match:
            await save_document(MEMORY_COLLECTION, doc_id, match)
            return match
    return history


async def record_brand_interaction(brand_name: str, deal_data: Dict[str, Any], creator_id: str = DEFAULT_CREATOR_ID) -> Dict[str, Any]:
    """Record a newly audited deal or negotiation outcome into the Memory Bank."""
    doc_id = f"brand_{creator_id}_{brand_name.lower().replace(' ', '_')}"
    existing = await get_brand_history(brand_name, creator_id) or {
        "creator_id": creator_id,
        "brand_name": brand_name,
        "past_deals_count": 0
    }
    
    count = existing.get("past_deals_count", 0) + 1
    updated_data = {
        **existing,
        **deal_data,
        "past_deals_count": count,
        "last_interaction": datetime.now(timezone.utc).isoformat()
    }
    return await save_document(MEMORY_COLLECTION, doc_id, updated_data)


async def list_all_memory(creator_id: str = DEFAULT_CREATOR_ID) -> Dict[str, Any]:
    """List all memories across preferences, brand histories, and content notes."""
    docs = await list_documents(MEMORY_COLLECTION, limit=100)
    prefs = await get_creator_preferences(creator_id)
    brands = [d for d in docs if d.get("id", "").startswith("brand_")]
    
    # Ensure default brands exist if none found
    if not brands:
        for b in DEFAULT_BRAND_HISTORIES:
            doc_id = f"brand_{creator_id}_{b['brand_name'].lower().replace(' ', '_')}"
            saved = await save_document(MEMORY_COLLECTION, doc_id, b)
            brands.append(saved)

    return {
        "creator_preferences": prefs,
        "brand_histories": brands,
        "total_memory_entries": len(docs) + len(brands)
    }


async def build_agent_context_prompt(creator_id: str = DEFAULT_CREATOR_ID, brand_name: Optional[str] = None) -> str:
    """Generate a structured system prompt context block from the Memory Bank."""
    prefs = await get_creator_preferences(creator_id)
    prompt_lines = [
        "=== CREATOR MEMORY BANK (PERSISTENT CONTEXT) ===",
        f"- Creator: {prefs.get('creator_name')} ({prefs.get('channel_niche')})",
        f"- Minimum Acceptable Deal: ${prefs.get('minimum_deal_value_usd', 0):,}",
        f"- Target CPM Benchmark: ${prefs.get('target_cpm_usd', 45.0)}/1,000 views",
        f"- Max Allowed Exclusivity: {prefs.get('maximum_exclusivity_days', 30)} days",
        f"- Forbidden Categories: {', '.join(prefs.get('strictly_forbidden_categories', []))}",
        f"- Standard Payment Terms: {prefs.get('preferred_payment_terms')}",
        f"- Creator Tone: {prefs.get('voice_tone')}"
    ]

    if brand_name:
        history = await get_brand_history(brand_name, creator_id)
        if history:
            prompt_lines.extend([
                f"=== HISTORICAL CONTEXT WITH {brand_name.upper()} ===",
                f"- Past Deals: {history.get('past_deals_count', 1)}",
                f"- Past Pricing: ${history.get('last_deal_value', 0):,} (CPM: ${history.get('historical_cpm', 0)})",
                f"- Known Red Flags/Quirks: {history.get('contract_quirks', 'None noted.')}",
                f"- Partner Reliability: {history.get('payment_reliability', 'standard')}"
            ])
    
    return "\n".join(prompt_lines)
