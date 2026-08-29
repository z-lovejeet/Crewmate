from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
import json
from ..config.settings import get_settings
from ..services.gemini import generate_text

router = APIRouter()

class ContentBrief(BaseModel):
    title_concept: str
    format: str  # Short, Long-form, Reel
    velocity_score: int  # 0-100
    saturation_score: str  # Low, Moderate, Peaking
    viral_hook: str
    target_demographic: str

class TrendScanRequest(BaseModel):
    niche: str = "AI & Tech"
    platform: str = "youtube"

class TrendScanResponse(BaseModel):
    niche: str
    platform: str
    briefs: List[ContentBrief]
    trend_summary: str

DEMO_TRENDS = TrendScanResponse(
    niche="AI & Tech Creation",
    platform="YouTube + Instagram",
    briefs=[
        ContentBrief(
            title_concept="I Replaced My Entire Content Team with Google ADK Agents",
            format="YouTube Long-Form (12-14 mins)",
            velocity_score=96,
            saturation_score="Low (First-Mover Window)",
            viral_hook="Nobody talks about this, but 90% of your video prep time is about to become completely automated.",
            target_demographic="Tech Enthusiasts & Solo Builders (18-35)"
        ),
        ContentBrief(
            title_concept="Stop Signing These 3 Creator Contract Traps",
            format="Instagram Reel / YouTube Short (45s)",
            velocity_score=92,
            saturation_score="Moderate (High Engagement)",
            viral_hook="If a brand sends you a contract with clause 4.2 in it, they own your likeness forever.",
            target_demographic="Content Creators & Freelancers"
        ),
        ContentBrief(
            title_concept="How I Use Gemini 3.7 Flash to Clip 1 Video into 5 Viral Shorts",
            format="YouTube Short (30s)",
            velocity_score=89,
            saturation_score="Low (Surging)",
            viral_hook="This single AI workflow just 4x'd my channel impressions in 48 hours.",
            target_demographic="Short-form Video Creators"
        )
    ],
    trend_summary="Massive surge in viewer appetite for practical multi-agent AI workflows and creator contract protection. Opportunity score: 95/100."
)

@router.post("/scan", response_model=TrendScanResponse)
async def scan_trends(request: TrendScanRequest):
    prompt = f"""Discover surging, breakout content trends for the {request.niche} niche on {request.platform}.
Provide 3 ranked Content Briefs with title_concept, format, velocity_score (0-100), saturation_score, viral_hook, and target_demographic.

Return ONLY valid JSON matching this schema:
{{
  "niche": "{request.niche}",
  "platform": "{request.platform}",
  "briefs": [
    {{
      "title_concept": "...",
      "format": "...",
      "velocity_score": 95,
      "saturation_score": "...",
      "viral_hook": "...",
      "target_demographic": "..."
    }}
  ],
  "trend_summary": "..."
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
        return TrendScanResponse(**data)
    except Exception:
        return DEMO_TRENDS

@router.get("/demo", response_model=TrendScanResponse)
async def demo_trends():
    return DEMO_TRENDS

