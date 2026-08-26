# Agent 12: Smart Repurposing & Clipping Director ✂️

## 1. Role
Automatically identifies the most viral-worthy 30-60 second moments from long-form YouTube videos and prepares them for repurposing as Instagram Reels and YouTube Shorts. A single long-form video should generate 3-5 clip candidates, turning 1 video into 5+ pieces of short-form content automatically, multiplying reach by 3-5x with zero extra effort. Works with Distribution Manager (Agent 03) for publishing, Content Calendar (Agent 07) for scheduling clips across the week, and Content Compliance (Agent 02) to verify clips don't violate platform rules.

## 2. System Prompt
```text
You are the Smart Repurposing & Clipping Director for Crewmate, a master at identifying viral moments within long-form content. Your role is to analyze video transcripts and metadata to extract the most engaging 30-60 second segments suitable for YouTube Shorts and Instagram Reels. You look for high energy, punchlines, surprising revelations, emotional moments, and key takeaways that work well independently without context. For each extracted clip, you provide precise vertical crop guides, engaging titles, platform-specific hooks, and performance predictions.
```

## 3. Input Schema
```python
from pydantic import BaseModel, Field
from typing import List, Dict, Any

class TranscriptSegment(BaseModel):
    start: str
    end: str
    text: str

class VideoInput(BaseModel):
    video_id: str = Field(..., description="Unique identifier for the long-form video")
    original_title: str = Field(..., description="Title of the original long-form video")
    transcript: List[TranscriptSegment] = Field(..., description="List of transcript segments with text and timestamps")
    target_platforms: List[str] = Field(..., description="Platforms to target, e.g., ['shorts', 'reels', 'both']")
```

## 4. Output Schema
```python
from pydantic import BaseModel
from typing import List

class ClipPlatformData(BaseModel):
    platform: str
    hook_text: str
    titles: List[str]
    hashtags: List[str]

class ClipCandidate(BaseModel):
    start_time: str
    end_time: str
    duration_seconds: int
    standalone_summary: str
    vertical_crop_guide: str
    caption_overlays: List[str]
    platform_data: List[ClipPlatformData]
    performance_prediction_score: int

class ClippingResult(BaseModel):
    video_id: str
    clips: List[ClipCandidate]
```

## 5. Tools

- `analyze_transcript_energy(transcript: list, timestamps: list) -> list`: Identifies high-energy segments (humor peaks, surprising revelations, emotional moments, key takeaways) by analyzing transcript sentiment and pacing.
- `detect_viral_moments(video_id: str, transcript: list) -> list`: Scores each 30-60s segment on standalone shareability (Does it work without context? Is there a punchline or insight?).
- `generate_clip_package(segment: dict, platform: str) -> dict`: For each selected clip, generates: vertical crop coordinates (9:16), suggested caption overlay text, platform-specific hook text (different for Reels vs Shorts), and hashtag recommendations.
- `suggest_clip_titles(clip_segment: dict, original_title: str) -> list`: Creates 3 title/caption variations optimized for short-form discovery.
- `estimate_clip_performance(clip_data: dict) -> int`: Predicts relative performance score (1-100) based on content type, length, and hook strength.

## 6. Mock Data Strategy
- **Pre-built transcript datasets**: We use static JSON files containing simulated video transcripts with predefined timestamps and mock energy scores.
- **Simulated video analysis**: Since real video processing (downloading, chunking, analyzing) is too slow for the demo, we mock the `detect_viral_moments` and `analyze_transcript_energy` tools to return pre-selected timestamps and scores based on the `video_id`.

## 7. Code Skeleton
```python
import os
from google import genai
import asyncio

class ClippingDirectorAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", ""))
        self.model = "gemini-3.7-flash"

    async def analyze_transcript_energy(self, transcript: list, timestamps: list) -> list:
        # Mock implementation returning high-energy segments
        await asyncio.sleep(0.1)
        return []

    async def detect_viral_moments(self, video_id: str, transcript: list) -> list:
        # Mock implementation returning scored segments for shareability
        await asyncio.sleep(0.1)
        return []

    async def generate_clip_package(self, segment: dict, platform: str) -> dict:
        # Call Gemini to generate vertical crop, captions, hooks, and hashtags
        await asyncio.sleep(0.1)
        return {}

    async def suggest_clip_titles(self, clip_segment: dict, original_title: str) -> list:
        # Generate optimized title variations
        await asyncio.sleep(0.1)
        return []
        
    async def estimate_clip_performance(self, clip_data: dict) -> int:
        # Predict relative performance score
        await asyncio.sleep(0.1)
        return 85

    async def process(self, input_data: VideoInput) -> ClippingResult:
        # 1. Analyze transcript and detect viral moments
        energy_data = await self.analyze_transcript_energy(input_data.transcript, [])
        viral_moments = await self.detect_viral_moments(input_data.video_id, input_data.transcript)
        
        # 2. For the top 3-5 candidates, generate clip packages and titles
        # 3. Estimate performance for each
        # 4. Return list of ClipCandidate objects in ClippingResult
        
        # Dummy response to satisfy skeleton
        return ClippingResult(video_id=input_data.video_id, clips=[])
```

## 8. Example Usage
```json
{
  "video_id": "vid_789",
  "clips": [
    {
      "start_time": "12:00",
      "end_time": "12:35",
      "duration_seconds": 35,
      "standalone_summary": "The exact moment the AI model figured out how to bypass its constraints.",
      "vertical_crop_guide": "Center on speaker's face, pan slightly right when screen recording appears.",
      "caption_overlays": ["Wait for it...", "AI bypasses security!"],
      "platform_data": [
        {
          "platform": "shorts",
          "hook_text": "You won't believe what this AI just did 🤯",
          "titles": ["AI Breaks Out of Sandbox", "How to bypass AI limits", "Crazy AI moment"],
          "hashtags": ["#AI", "#Tech", "#Shorts"]
        },
        {
          "platform": "reels",
          "hook_text": "This AI breakout is wild 😱 Watch till the end!",
          "titles": ["AI Escapes Sandbox", "Insane AI behavior", "Future is here"],
          "hashtags": ["#ArtificialIntelligence", "#TechTrends", "#Reels"]
        }
      ],
      "performance_prediction_score": 92
    }
  ]
}
```
