from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from ..services.memory import (
    get_creator_preferences,
    update_creator_preferences,
    get_brand_history,
    record_brand_interaction,
    list_all_memory,
    DEFAULT_CREATOR_ID
)

router = APIRouter(tags=["Memory Bank (GEAP)"])

class UpdatePreferencesRequest(BaseModel):
    channel_name: Optional[str] = None
    creator_name: Optional[str] = None
    primary_niche: Optional[str] = None
    secondary_topics: Optional[str] = None
    target_audience: Optional[str] = None
    audience_level: Optional[str] = None
    creator_tone: Optional[str] = None
    content_format: Optional[str] = None
    subscribers: Optional[str] = None
    publishing_cadence: Optional[str] = None
    min_sponsorship_floor: Optional[str] = None
    custom_directives: Optional[str] = None
    minimum_deal_value_usd: Optional[float] = None
    target_cpm_usd: Optional[float] = None
    maximum_exclusivity_days: Optional[int] = None
    voice_tone: Optional[str] = None
    preferred_payment_terms: Optional[str] = None

@router.get("", summary="Get all persistent creator memory and brand histories")
async def get_all_memory():
    """Retrieve full persistent context from Firestore Memory Bank."""
    return await list_all_memory(DEFAULT_CREATOR_ID)

@router.get("/preferences", summary="Get creator baseline preferences")
async def get_preferences():
    """Get creator rules, rate thresholds, and policy guardrails."""
    return await get_creator_preferences(DEFAULT_CREATOR_ID)

@router.put("/preferences", summary="Update creator baseline preferences")
async def update_preferences_put(payload: Dict[str, Any] = Body(...)):
    """Update creator rules in the persistent Memory Bank."""
    return await update_creator_preferences(DEFAULT_CREATOR_ID, payload)

@router.post("/preferences", summary="Save creator baseline preferences")
async def update_preferences_post(payload: Dict[str, Any] = Body(...)):
    """Save creator rules in the persistent Memory Bank."""
    return await update_creator_preferences(DEFAULT_CREATOR_ID, payload)

@router.post("/update", summary="Save creator memory update")
async def update_memory_post(payload: Dict[str, Any] = Body(...)):
    """Save creator memory updates into Firestore."""
    prefs = payload.get("creator_preferences", payload)
    return await update_creator_preferences(DEFAULT_CREATOR_ID, prefs)

@router.get("/brands/{brand_name}", summary="Get brand history and past contract traps")
async def get_brand(brand_name: str):
    """Retrieve historical deal data and negotiation quirks for a specific brand."""
    history = await get_brand_history(brand_name, DEFAULT_CREATOR_ID)
    if not history:
        raise HTTPException(status_code=404, detail=f"No past history recorded for '{brand_name}'")
    return history

@router.post("/brands", summary="Record a new brand interaction or deal outcome")
async def add_brand_record(payload: Dict[str, Any] = Body(...)):
    """Append a newly analyzed deal or negotiation result to brand memory."""
    brand_name = payload.get("brand_name", "Brand Partner")
    deal_data = {
        "last_deal_value": payload.get("deal_value", 8500),
        "historical_cpm": payload.get("cpm", 45.0),
        "contract_quirks": payload.get("contract_quirks"),
        "payment_reliability": payload.get("payment_reliability", "net30"),
        "notes": payload.get("notes")
    }
    return await record_brand_interaction(brand_name, deal_data, DEFAULT_CREATOR_ID)
