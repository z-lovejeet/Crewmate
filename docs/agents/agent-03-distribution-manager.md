# Agent 03: Distribution Manager 📡

## 1. Role
Checks content specs per platform, generates optimized metadata, and ensures publishing readiness for YouTube and Instagram. It acts as the final gatekeeper before content goes live, maximizing platform-specific reach and compliance.

## 2. System Prompt
```text
You are the Distribution Manager for Crewmate, a highly skilled social media distribution strategist. Your role is to ensure all content is flawlessly optimized for its target platforms (YouTube and Instagram). You rigorously verify media specifications, craft highly engaging and SEO-optimized metadata (titles, descriptions, captions, tags, hashtags), and provide an overall readiness score. You understand the nuances of platform algorithms, maximizing organic reach while adhering strictly to format requirements. Your output must be precise and actionable for an automated publishing pipeline.
```

## 3. Input Schema
```python
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class MediaSpecs(BaseModel):
    resolution: str
    aspect_ratio: str
    duration_seconds: int
    file_size_mb: float
    format: str

class DistributionInput(BaseModel):
    content_type: str = Field(..., description="Type of content (e.g., 'video', 'short', 'reel', 'image')")
    raw_title: str
    raw_description: str
    media_specs: MediaSpecs
    target_platforms: List[str] = Field(..., description="List of target platforms: ['youtube', 'instagram']")
```

## 4. Output Schema
```python
class ReadinessCheck(BaseModel):
    check_name: str
    passed: bool
    details: str

class PlatformMetadata(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags_hashtags: List[str] = []
    thumbnail_notes: Optional[str] = None
    optimal_length: Optional[str] = None

class PlatformReadiness(BaseModel):
    platform: str
    readiness_pct: int
    checks: List[ReadinessCheck]
    optimized_metadata: PlatformMetadata

class DistributionReadiness(BaseModel):
    platforms: Dict[str, PlatformReadiness]
    overall_score: int
```

## 5. Platform Spec Databases
**YouTube Specs:**
- Title: Max 100 characters (optimal: 60)
- Description: Max 5000 characters
- Tags: Max 500 characters total
- Video (Standard): 16:9, up to 4K, max 256GB / 12 hours
- Shorts: 9:16, max 60 seconds

**Instagram Specs:**
- Caption: Max 2200 characters
- Hashtags: Max 30
- Feed Video: 1:1 or 4:5, max 60 minutes
- Reels: 9:16, max 90 seconds
- Stories: 9:16, max 60 seconds

## 6. Tools

- `check_youtube_specs(media_specs: dict) -> list[ReadinessCheck]`: Verifies YouTube format requirements (resolution, duration, file size, aspect ratio).
- `check_instagram_specs(media_specs: dict) -> list[ReadinessCheck]`: Verifies Instagram format (Feed: 1:1/4:5, Reels: 9:16, Stories: 9:16, duration limits).
- `generate_youtube_metadata(raw_title: str, raw_description: str) -> PlatformMetadata`: Generates SEO-optimized title, description, and tags using Gemini.
- `generate_instagram_metadata(raw_title: str, raw_description: str) -> PlatformMetadata`: Generates highly engaging caption, hashtags, and alt text using Gemini.
- `optimize_seo(title: str, description: str, platform: str) -> dict`: Platform-specific SEO optimization logic.

## 7. Code Skeleton
```python
from google import genai
import os

class DistributionManagerAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        self.model = "gemini-3.7-flash"

    def check_youtube_specs(self, specs: MediaSpecs) -> list[ReadinessCheck]:
        # Implementation to check against YouTube database specs
        pass

    def check_instagram_specs(self, specs: MediaSpecs) -> list[ReadinessCheck]:
        # Implementation to check against Instagram database specs
        pass

    def process(self, input_data: DistributionInput) -> DistributionReadiness:
        # 1. Route to specific platform tools
        # 2. Call Gemini for metadata generation
        # 3. Compile ReadinessChecks
        # 4. Return DistributionReadiness
        pass
```

## 8. Example Output
For a 12-minute 16:9 Tech Review video:
```json
{
  "platforms": {
    "youtube": {
      "platform": "youtube",
      "readiness_pct": 100,
      "checks": [
        {"check_name": "Aspect Ratio", "passed": true, "details": "16:9 is standard for YouTube videos."},
        {"check_name": "Duration", "passed": true, "details": "12 minutes is within limits."}
      ],
      "optimized_metadata": {
        "title": "Unboxing the Future: iPhone 16 Pro Max Review",
        "description": "Is the new iPhone 16 Pro Max worth it? We dive deep into... [Full Review]",
        "tags_hashtags": ["tech review", "iphone 16", "apple", "smartphone"],
        "thumbnail_notes": "Use high-contrast text and a surprised face."
      }
    }
  },
  "overall_score": 100
}
```
