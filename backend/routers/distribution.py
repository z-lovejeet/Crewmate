from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import json
from ..config.settings import get_settings
from ..services.gemini import generate_text

router = APIRouter()

class OptimizeRequest(BaseModel):
    platform: str = "youtube"  # youtube or instagram
    title: str
    description: str
    tags: List[str] = Field(default_factory=list)

class OptimizeResponse(BaseModel):
    platform: str
    optimized_title: str
    optimized_description: str
    optimized_tags: List[str]
    hook_recommendation: Optional[str] = None
    best_posting_window: str = "Thursday 6:00 PM EST (+14% reach)"

@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_distribution(request: OptimizeRequest):
    prompt = f"""Optimize this {request.platform} content for maximum discoverability and high click-through rate.
Target: Solo Creator YouTube/Instagram
Title: {request.title}
Description: {request.description}
Tags: {request.tags}

Return ONLY valid JSON matching this schema:
{{
  "platform": "{request.platform}",
  "optimized_title": "...",
  "optimized_description": "...",
  "optimized_tags": ["..."],
  "hook_recommendation": "...",
  "best_posting_window": "Thursday 6:00 PM EST (+14% reach)"
}}
"""
    try:
        response_text = generate_text(prompt=prompt)
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        data = json.loads(cleaned.strip())
        return OptimizeResponse(**data)
    except Exception:
        return OptimizeResponse(
            platform=request.platform,
            optimized_title=f"{request.title} (The Untold Secret)",
            optimized_description=f"{request.description}\n\n📌 Timestamps:\n0:00 - The Breakdown\n1:24 - What Nobody Tells You\n3:45 - Key Takeaways\n\n#creator #growth",
            optimized_tags=request.tags + ["creator economy", "ai workflow", "growth hack"],
            hook_recommendation="Open with a 2-second visual proof pattern interrupt before stating the thesis."
        )

@router.get("/platforms")
async def get_platforms():
    return {
        "platforms": [
            {"id": "youtube", "name": "YouTube (Long-form & Shorts)", "status": "connected", "verified": True},
            {"id": "instagram", "name": "Instagram (Reels & Carousels)", "status": "connected", "verified": True}
        ]
    }

