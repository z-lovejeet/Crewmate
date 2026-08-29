from fastapi import APIRouter, HTTPException
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
    minimum_deal_value_usd: Optional[float] = Field(None, description="Minimum USD for sponsorships")
    target_cpm_usd: Optional[float] = Field(None, description="Target CPM benchmark")
    maximum_exclusivity_days: Optional[int] = Field(None, description="Max allowed exclusivity")
    voice_tone: Optional[str] = Field(None, description="Creator voice style")
    preferred_payment_terms: Optional[str] = Field(None, description="Payment schedule preference")

class RecordBrandHistoryRequest(BaseModel):
    brand_name: str
    deal_value: float
    cpm: Optional[float] = None
    contract_quirks: Optional[str] = None
    payment_reliability: Optional[str] = "net15"
    notes: Optional[str] = None

@router.get("", summary="Get all persistent creator memory and brand histories")
async def get_all_memory():
    """Retrieve full persistent context from Firestore Memory Bank."""
    return await list_all_memory(DEFAULT_CREATOR_ID)

@router.get("/preferences", summary="Get creator baseline preferences")
async def get_preferences():
    """Get creator rules, rate thresholds, and policy guardrails."""
    return await get_creator_preferences(DEFAULT_CREATOR_ID)

@router.put("/preferences", summary="Update creator baseline preferences")
async def update_preferences(payload: UpdatePreferencesRequest):
    """Update creator rules in the persistent Memory Bank."""
    updates = payload.model_dump(exclude_unset=True)
    return await update_creator_preferences(DEFAULT_CREATOR_ID, updates)

@router.get("/brands/{brand_name}", summary="Get brand history and past contract traps")
async def get_brand(brand_name: str):
    """Retrieve historical deal data and negotiation quirks for a specific brand."""
    history = await get_brand_history(brand_name, DEFAULT_CREATOR_ID)
    if not history:
        raise HTTPException(status_code=404, detail=f"No past history recorded for '{brand_name}'")
    return history

@router.post("/brands", summary="Record a new brand interaction or deal outcome")
async def add_brand_record(payload: RecordBrandHistoryRequest):
    """Append a newly analyzed deal or negotiation result to brand memory."""
    deal_data = {
        "last_deal_value": payload.deal_value,
        "historical_cpm": payload.cpm or (payload.deal_value / 185.0),
        "contract_quirks": payload.contract_quirks,
        "payment_reliability": payload.payment_reliability,
        "notes": payload.notes
    }
    return await record_brand_interaction(payload.brand_name, deal_data, DEFAULT_CREATOR_ID)
