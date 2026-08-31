import json
import logging
import urllib.parse
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..services.gemini import generate_text

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
    image_url: str
    palette: dict

class ThumbnailGenerateResponse(BaseModel):
    title: str
    aspect_ratio: str
    variants: List[ThumbnailVariantItem]

@router.post("/generate", response_model=ThumbnailGenerateResponse)
async def generate_ai_thumbnail(req: ThumbnailGenerateRequest):
    """Generate real AI thumbnails using Gemini 3.7 Flash for visual direction + AI Image Generation model."""
    logger.info(f"Generating AI thumbnails for title: {req.title}")
    
    is_16_9 = req.aspect_ratio == "16:9"
    width = 1280 if is_16_9 else 720
    height = 720 if is_16_9 else 1280

    prompt = f"""You are an elite YouTube Creative Director & Prompt Engineer specializing in high-CTR thumbnails.
Video Title: "{req.title}"
Visual Scene / Context: "{req.description}"
Requested Art Style: "{req.style}"
Aspect Ratio: "{req.aspect_ratio}"

Generate 3 unique, high-CTR thumbnail concepts for an AI image generation model (like Imagen 3 / Flux).
Each concept must have:
1. `name`: Short variant name (e.g., "Variant 1: Hyper-Realistic Focus", "Variant 2: Dramatic Action & Glow", "Variant 3: Minimalist Cyber Blueprint")
2. `style_name`: Style name
3. `headline`: Punchy, viral 3-5 word high-impact text overlay (e.g. "10X REVENUE WITH AI", "WARNING: DON'T DO THIS")
4. `badge_text`: Urgency badge (e.g. "🔥 HIGH VELOCITY · 10X REVENUE", "⚡ 94% RETENTION")
5. `sub_hook`: 2-4 word secondary hook
6. `predicted_ctr`: Estimated CTR (e.g. "14.8%", "13.9%")
7. `ai_image_prompt`: An ultra-detailed photorealistic prompt for diffusion image generation. Describe the subject, lighting, 8k resolution, cinematic atmosphere, depth of field, vibrant colors, photorealistic details without text artifacts.
8. `palette`: Object containing `bgStart`, `bgEnd`, `accent`, `secondary`, `textHighlight`, `badgeBg`, `badgeBorder` hex codes.

Return ONLY a valid JSON object matching this schema:
{{
  "variants": [
    {{
      "id": "var-1",
      "name": "Variant 1: Hyper-Realistic Focus",
      "style_name": "Cyberpunk & AI Neon",
      "headline": "10X REVENUE WITH AI",
      "badge_text": "🔥 10X REVENUE",
      "sub_hook": "NEVER WORK ALONE IN 2026",
      "predicted_ctr": "14.8%",
      "ai_image_prompt": "Cinematic photo of a futuristic AI developer desk with glowing holographic neon code, cybernetic assistant interface, ultra detailed 8k photorealistic studio lighting",
      "palette": {{
        "bgStart": "#0a0a1a",
        "bgEnd": "#1a0826",
        "accent": "#00f0ff",
        "secondary": "#a855f7",
        "textHighlight": "#00f0ff",
        "badgeBg": "rgba(0, 240, 255, 0.2)",
        "badgeBorder": "#00f0ff"
      }}
    }}
  ]
}}
"""

    try:
        raw = generate_text(prompt=prompt, system_instruction="You are a professional YouTube Creative Director. Return JSON only.")
        cleaned = raw.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        
        parsed = json.loads(cleaned.strip())
        raw_variants = parsed.get("variants", [])
        
        variants: List[ThumbnailVariantItem] = []
        for idx, item in enumerate(raw_variants):
            img_prompt = item.get("ai_image_prompt", req.title)
            encoded_prompt = urllib.parse.quote(f"{img_prompt}, youtube thumbnail composition, 8k resolution, photorealistic, cinematic lighting")
            
            # Generate real dynamic AI image via Pollinations AI / Flux model
            image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true&seed={42 + idx * 7}"
            
            variants.append(
                ThumbnailVariantItem(
                    id=item.get("id", f"var-{idx+1}"),
                    name=item.get("name", f"Variant {idx+1}"),
                    style_name=item.get("style_name", "Cyberpunk Neon"),
                    headline=item.get("headline", req.title.upper()[:25]),
                    badge_text=item.get("badge_text", "🔥 HIGH VELOCITY"),
                    sub_hook=item.get("sub_hook", "CREWMATE AI STUDIO"),
                    predicted_ctr=item.get("predicted_ctr", "14.2%"),
                    ai_image_prompt=img_prompt,
                    image_url=image_url,
                    palette=item.get("palette", {
                        "bgStart": "#0a0a1a",
                        "bgEnd": "#1a0826",
                        "accent": "#00f0ff",
                        "secondary": "#a855f7",
                        "textHighlight": "#00f0ff",
                        "badgeBg": "rgba(0, 240, 255, 0.2)",
                        "badgeBorder": "#00f0ff"
                    })
                )
            )
            
        if not variants:
            raise ValueError("No variants parsed from LLM")
            
        return ThumbnailGenerateResponse(
            title=req.title,
            aspect_ratio=req.aspect_ratio,
            variants=variants
        )

    except Exception as e:
        logger.warning(f"Fallback thumbnail generation due to: {e}")
        # Fallback with real AI image endpoints tailored to the title
        encoded_1 = urllib.parse.quote(f"{req.title}, {req.description}, futuristic glowing cyber studio, cinematic lighting, 8k photorealistic")
        encoded_2 = urllib.parse.quote(f"warning dramatic shocked creator reaction looking at glowing viral chart, dark studio, high contrast neon, 8k")
        encoded_3 = urllib.parse.quote(f"minimalist technological blueprint glowing AI agent nodes, isometric 3D render, dark obsidian")

        fallback_variants = [
            ThumbnailVariantItem(
                id="var-1",
                name="Variant 1: High-Contrast AI Focus",
                style_name="Cyberpunk & AI Neon",
                headline=req.title.upper()[:26] or "10X REVENUE WITH AI",
                badge_text="🔥 10X REVENUE · HIGH VELOCITY",
                sub_hook="NEVER WORK ALONE IN 2026",
                predicted_ctr="14.8%",
                ai_image_prompt=f"{req.title}, {req.description}, futuristic glowing cyber studio, cinematic lighting, 8k photorealistic",
                image_url=f"https://image.pollinations.ai/prompt/{encoded_1}?width={width}&height={height}&nologo=true&seed=101",
                palette={
                    "bgStart": "#0a0a1a",
                    "bgEnd": "#1a0826",
                    "accent": "#00f0ff",
                    "secondary": "#a855f7",
                    "textHighlight": "#00f0ff",
                    "badgeBg": "rgba(0, 240, 255, 0.2)",
                    "badgeBorder": "#00f0ff"
                }
            ),
            ThumbnailVariantItem(
                id="var-2",
                name="Variant 2: Dramatic High-Impact Warning",
                style_name="High-Contrast Red & Amber",
                headline="WARNING: DON'T MISS THIS",
                badge_text="⚡ 94% RETENTION FORMULA",
                sub_hook="THE 2026 CREATOR BLUEPRINT",
                predicted_ctr="14.1%",
                ai_image_prompt="Warning dramatic shocked creator reaction looking at glowing viral chart, dark studio, high contrast neon, 8k",
                image_url=f"https://image.pollinations.ai/prompt/{encoded_2}?width={width}&height={height}&nologo=true&seed=202",
                palette={
                    "bgStart": "#140404",
                    "bgEnd": "#2a0808",
                    "accent": "#ff003c",
                    "secondary": "#facc15",
                    "textHighlight": "#facc15",
                    "badgeBg": "rgba(255, 0, 60, 0.2)",
                    "badgeBorder": "#ff003c"
                }
            ),
            ThumbnailVariantItem(
                id="var-3",
                name="Variant 3: Dark Minimalist Tech Blueprint",
                style_name="Cinematic Dark Studio",
                headline="BUILD YOUR AI FLEET",
                badge_text="🛡️ 100% PRODUCTION READY",
                sub_hook="ZERO BURNOUT BLUEPRINT",
                predicted_ctr="13.2%",
                ai_image_prompt="Minimalist technological blueprint glowing AI agent nodes, isometric 3D render, dark obsidian",
                image_url=f"https://image.pollinations.ai/prompt/{encoded_3}?width={width}&height={height}&nologo=true&seed=303",
                palette={
                    "bgStart": "#09090b",
                    "bgEnd": "#18181b",
                    "accent": "#f59e0b",
                    "secondary": "#e2e8f0",
                    "textHighlight": "#fbbf24",
                    "badgeBg": "rgba(245, 158, 11, 0.2)",
                    "badgeBorder": "#f59e0b"
                }
            )
        ]

        return ThumbnailGenerateResponse(
            title=req.title,
            aspect_ratio=req.aspect_ratio,
            variants=fallback_variants
        )
