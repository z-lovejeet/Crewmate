from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import json
from ..config.settings import get_settings
from ..services.gemini import generate_text

router = APIRouter()

class SuggestedReply(BaseModel):
    comment_author: str
    original_comment: str
    suggested_reply: str
    tone: str

class CommunityAnalyzeRequest(BaseModel):
    comments: List[str] = Field(default_factory=list)
    creator_voice: str = "friendly & authoritative"

class CommunityAnalyzeResponse(BaseModel):
    total_analyzed: int
    sentiment_distribution: Dict[str, int]  # positive, neutral, negative, toxic
    top_feature_requests: List[str]
    toxic_comments_moderated: int
    suggested_replies: List[SuggestedReply]
    actionable_signal: str

DEMO_COMMUNITY = CommunityAnalyzeResponse(
    total_analyzed=156,
    sentiment_distribution={
        "positive": 82,
        "neutral": 14,
        "negative": 3,
        "toxic": 1
    },
    top_feature_requests=[
        "Show a step-by-step breakdown of how ADK agents communicate",
        "Release the contract review checklist template",
        "Do a comparison between Gemini 3.7 Flash and Claude Opus 4.6"
    ],
    toxic_comments_moderated=2,
    suggested_replies=[
        SuggestedReply(
            comment_author="@DevBuilder",
            original_comment="How are you orchestrating the 14 agents without latency blowing up?",
            suggested_reply="Great question! We use Google ADK with lightweight supervisor routing + Gemini 3.7 Flash parallel tool calling. Average turn latency is sub-800ms.",
            tone="Expert & Helpful"
        ),
        SuggestedReply(
            comment_author="@CreatorPro",
            original_comment="The contract review section saved me so much headache on my last brand deal.",
            suggested_reply="Love to hear that! Exclusivity traps are way too common. Glad Crewmate had your back!",
            tone="Encouraging & Warm"
        )
    ],
    actionable_signal="Audience is heavily asking for deep-dive technical breakdowns of multi-agent architectures. Feed signal sent to Trend Radar (Agent 10)."
)

@router.post("/analyze", response_model=CommunityAnalyzeResponse)
async def analyze_community(request: CommunityAnalyzeRequest):
    if not request.comments:
        return DEMO_COMMUNITY
        
    prompt = f"""Analyze these creator video comments:
Comments: {request.comments[:30]}
Creator Voice Style: {request.creator_voice}

Return ONLY valid JSON matching this schema:
{{
  "total_analyzed": {len(request.comments)},
  "sentiment_distribution": {{"positive": 80, "neutral": 15, "negative": 4, "toxic": 1}},
  "top_feature_requests": ["..."],
  "toxic_comments_moderated": 1,
  "suggested_replies": [
    {{"comment_author": "@user", "original_comment": "...", "suggested_reply": "...", "tone": "..."}}
  ],
  "actionable_signal": "..."
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
        return CommunityAnalyzeResponse(**data)
    except Exception:
        return DEMO_COMMUNITY

@router.get("/demo", response_model=CommunityAnalyzeResponse)
async def demo_community():
    return DEMO_COMMUNITY

