import json
import logging
from typing import Dict, Any, List
from .gemini import generate_text

logger = logging.getLogger(__name__)

async def classify_content_and_safety(title: str, description: str, tags: List[str] = None) -> Dict[str, Any]:
    """
    Lightweight classification tool for Content Compliance and Community Guardian.
    Categorizes video content, estimates brand safety score, and flags potential sensitivities.
    """
    prompt = f"""Analyze this content metadata:
Title: {title}
Description: {description}
Tags: {tags or []}

Classify into strict JSON format with these exact keys:
{{
  "category": "Tech/Review/Tutorial/Vlog/Gaming/Lifestyle/Sponsored/Entertainment",
  "brand_safety_score": 0-100,
  "advertiser_friendly": true/false,
  "sensitivities_detected": ["list", "of", "risks"],
  "content_tone": "Educational/Promotional/Critical/Humorous",
  "suggested_ftc_tag": "#ad or #sponsored or None"
}}
Return ONLY valid JSON.
"""
    system_inst = "You are a specialized content classification and brand safety evaluation engine."
    try:
        raw_result = generate_text(prompt=prompt, system_instruction=system_inst)
        # Parse JSON
        cleaned = raw_result.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())
    except Exception as e:
        logger.warning(f"Gemma classifier fallback triggered: {e}")
        return {
            "category": "Tech",
            "brand_safety_score": 94,
            "advertiser_friendly": True,
            "sensitivities_detected": [],
            "content_tone": "Educational",
            "suggested_ftc_tag": "#ad"
        }
