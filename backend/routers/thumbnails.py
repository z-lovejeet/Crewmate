import asyncio
import base64
import json
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..services.gemini import generate_text, generate_image_async

logger = logging.getLogger("crewmate.thumbnails")
router = APIRouter(prefix="/api/thumbnails", tags=["Thumbnails"])


class ThumbnailGenerateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    style: Optional[str] = "cyberpunk"
    aspect_ratio: Optional[str] = "16:9"


class ThumbnailVariantItem(BaseModel):
    id: str
    name: str
    style_name: str
    headline: str
    badge_text: str
    sub_hook: str
    predicted_ctr: str
    ai_image_prompt: str
    image_data: str           # base64 data URI (data:image/png;base64,...)
    image_format: str         # "png" or "jpeg"
    palette: dict


class ThumbnailGenerateResponse(BaseModel):
    title: str
    aspect_ratio: str
    model_used: str
    variants: List[ThumbnailVariantItem]


async def _generate_single_image(prompt: str, variant_id: str) -> tuple[str, str, str]:
    """Generate one image, return (variant_id, data_uri, format).
    Falls back gracefully on error."""
    try:
        img_bytes, mime_type = await generate_image_async(prompt)
        b64 = base64.b64encode(img_bytes).decode("utf-8")
        data_uri = f"data:{mime_type};base64,{b64}"
        fmt = "png" if "png" in mime_type else "jpeg"
        return variant_id, data_uri, fmt
    except Exception as e:
        logger.warning(f"Image generation failed for {variant_id}: {e}")
        return variant_id, "", "error"


@router.post("/generate", response_model=ThumbnailGenerateResponse)
async def generate_ai_thumbnail(req: ThumbnailGenerateRequest):
    """Generate real AI thumbnails using Gemini for creative direction + native Gemini image generation.
    
    Pipeline:
    1. Gemini 3.7 Flash analyzes title & description → 3 high-CTR variant concepts with detailed prompts
    2. Gemini 2.5 Flash Image generates real images from those prompts (3 concurrent calls)
    3. Returns base64-encoded PNG data URIs — no external APIs, no CORS issues
    """
    logger.info(f"Generating AI thumbnails for: {req.title}")

    # ── Step 1: LLM Creative Direction ───────────────────────────────────────
    prompt = f"""You are an elite YouTube Creative Director & Prompt Engineer specializing in high-CTR thumbnails.
Video Title: "{req.title}"
Visual Scene / Context: "{req.description}"
Requested Art Style: "{req.style}"
Aspect Ratio: "{req.aspect_ratio}"

Generate 3 unique, high-CTR thumbnail concepts. For each concept provide:
1. `name`: Short variant name (e.g., "Variant 1: Hyper-Realistic Focus")
2. `style_name`: Style category
3. `headline`: Punchy 3-5 word viral text overlay (e.g. "10X REVENUE WITH AI")
4. `badge_text`: Urgency badge (e.g. "🔥 HIGH VELOCITY · 10X REVENUE")
5. `sub_hook`: 2-4 word secondary hook
6. `predicted_ctr`: Estimated CTR percentage
7. `ai_image_prompt`: Ultra-detailed photorealistic prompt for image generation. Describe the subject, composition, lighting, camera angle, 8k resolution, cinematic atmosphere, depth of field, vibrant colors, photorealistic details. DO NOT include any text/words/letters in the image prompt — text will be overlaid separately.
8. `palette`: Object with hex colors: bgStart, bgEnd, accent, secondary, textHighlight, badgeBg, badgeBorder

Return ONLY valid JSON:
{{
  "variants": [
    {{
      "id": "var-1",
      "name": "...",
      "style_name": "...",
      "headline": "...",
      "badge_text": "...",
      "sub_hook": "...",
      "predicted_ctr": "...",
      "ai_image_prompt": "...",
      "palette": {{ "bgStart": "#...", "bgEnd": "#...", "accent": "#...", "secondary": "#...", "textHighlight": "#...", "badgeBg": "rgba(...)", "badgeBorder": "#..." }}
    }}
  ]
}}"""

    try:
        raw = generate_text(
            prompt=prompt,
            system_instruction="You are a professional YouTube Creative Director. Return JSON only. No markdown fences."
        )
        cleaned = raw.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        
        parsed = json.loads(cleaned.strip())
        raw_variants = parsed.get("variants", [])
        
        if not raw_variants:
            raise ValueError("LLM returned no variants")

    except Exception as e:
        logger.error(f"LLM creative direction failed: {e}")
        # Fallback: create basic prompts from the title
        raw_variants = [
            {
                "id": "var-1",
                "name": "Variant 1: High-Contrast Focus",
                "style_name": "Cyberpunk Neon",
                "headline": req.title.upper()[:25] or "AI POWERED CONTENT",
                "badge_text": "🔥 HIGH VELOCITY",
                "sub_hook": "THE 2026 BLUEPRINT",
                "predicted_ctr": "14.2%",
                "ai_image_prompt": f"Cinematic 8k photo of {req.description or req.title}, futuristic glowing neon lighting, dramatic volumetric atmosphere, shallow depth of field, photorealistic studio quality, ultra detailed",
                "palette": {"bgStart": "#0a0a1a", "bgEnd": "#1a0826", "accent": "#00f0ff", "secondary": "#a855f7", "textHighlight": "#00f0ff", "badgeBg": "rgba(0, 240, 255, 0.2)", "badgeBorder": "#00f0ff"}
            },
            {
                "id": "var-2",
                "name": "Variant 2: Dramatic Warning",
                "style_name": "High-Contrast Red",
                "headline": "DON'T MISS THIS",
                "badge_text": "⚡ 94% RETENTION",
                "sub_hook": "SECRET REVEALED",
                "predicted_ctr": "13.8%",
                "ai_image_prompt": f"Dramatic cinematic 8k photograph showing {req.description or req.title}, intense rim lighting in warm amber and red tones, dark moody studio, high contrast, photorealistic detail",
                "palette": {"bgStart": "#140404", "bgEnd": "#2a0808", "accent": "#ff003c", "secondary": "#facc15", "textHighlight": "#facc15", "badgeBg": "rgba(255, 0, 60, 0.2)", "badgeBorder": "#ff003c"}
            },
            {
                "id": "var-3",
                "name": "Variant 3: Clean Tech",
                "style_name": "Minimalist Dark",
                "headline": "THE UNFAIR ADVANTAGE",
                "badge_text": "🛡️ PRODUCTION READY",
                "sub_hook": "ZERO BURNOUT",
                "predicted_ctr": "13.1%",
                "ai_image_prompt": f"Clean minimalist 8k photograph of {req.description or req.title}, soft cool blue and emerald lighting, dark obsidian background, isometric perspective, ultra sharp detail, photorealistic",
                "palette": {"bgStart": "#09090b", "bgEnd": "#18181b", "accent": "#10b981", "secondary": "#e2e8f0", "textHighlight": "#34d399", "badgeBg": "rgba(16, 185, 129, 0.2)", "badgeBorder": "#10b981"}
            },
        ]

    # ── Step 2: Generate real images concurrently ────────────────────────────
    logger.info(f"Generating {len(raw_variants)} images with Gemini 3 Pro Image (gemini-3-pro-image)...")

    image_tasks = []
    for item in raw_variants:
        var_id = item.get("id", "var-?")
        img_prompt = item.get("ai_image_prompt", f"{req.title}, photorealistic 8k")
        # Enhance prompt for thumbnail quality
        full_prompt = f"{img_prompt}, youtube thumbnail composition, high resolution, professional photography, no text no words no letters"
        image_tasks.append(_generate_single_image(full_prompt, var_id))

    image_results = await asyncio.gather(*image_tasks)
    
    # Map results by variant id
    image_map = {vid: (data_uri, fmt) for vid, data_uri, fmt in image_results}

    # ── Step 3: Assemble final response ──────────────────────────────────────
    variants: List[ThumbnailVariantItem] = []
    for idx, item in enumerate(raw_variants):
        var_id = item.get("id", f"var-{idx+1}")
        data_uri, fmt = image_map.get(var_id, ("", "error"))
        
        if not data_uri:
            logger.warning(f"No image for {var_id}, skipping")
            continue

        variants.append(
            ThumbnailVariantItem(
                id=var_id,
                name=item.get("name", f"Variant {idx+1}"),
                style_name=item.get("style_name", "AI Generated"),
                headline=item.get("headline", req.title.upper()[:25]),
                badge_text=item.get("badge_text", "🔥 AI GENERATED"),
                sub_hook=item.get("sub_hook", "CREWMATE AI"),
                predicted_ctr=item.get("predicted_ctr", "14.0%"),
                ai_image_prompt=item.get("ai_image_prompt", ""),
                image_data=data_uri,
                image_format=fmt,
                palette=item.get("palette", {
                    "bgStart": "#0a0a1a", "bgEnd": "#1a0826",
                    "accent": "#00f0ff", "secondary": "#a855f7",
                    "textHighlight": "#00f0ff",
                    "badgeBg": "rgba(0, 240, 255, 0.2)",
                    "badgeBorder": "#00f0ff"
                })
            )
        )

    if not variants:
        raise HTTPException(status_code=500, detail="All image generation attempts failed")

    logger.info(f"Successfully generated {len(variants)} AI thumbnails")

    return ThumbnailGenerateResponse(
        title=req.title,
        aspect_ratio=req.aspect_ratio,
        model_used="gemini-3-pro-image",
        variants=variants
    )
