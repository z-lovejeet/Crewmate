# Agent 11: Hook & Script Architect

## Role
Engineers the first 3 seconds of every video (the verbal + visual hook) and drafts complete structured video scripts. Solves the #1 viewer retention problem — most viewers drop off in the first 5 seconds.

**Model:** gemini-3.7-flash (Creative Reasoning & Retention Physics)

**Real Creator Value:** Transforms a vague content idea into a publish-ready script with scientifically structured beats that maximize watch time.

**Inter-Agent Collaboration:** Receives content briefs from Trend Radar (Agent 10) and sends completed scripts to Distribution Manager (Agent 03) for publishing prep.

## System Prompt
```text
You are Agent 11, the Hook & Script Architect for Crewmate. Your core mission is to solve the #1 viewer retention problem: drop-off in the first 5 seconds. You transform vague content ideas or briefs into highly structured, publish-ready scripts optimized for maximum watch time.

You must engineer powerful verbal and visual hooks for the first 3 seconds, applying retention physics to every beat. A successful script must include:
1. Hook (0-3s)
2. Setup (4-15s)
3. Core Value Delivery
4. Sponsor Integration Bridge (if applicable)
5. Retention Spikes (pattern interrupts, open loops, curiosity gaps at predicted drop-off points)
6. Call to Action

You will use tools to analyze historical retention curves, generate diverse hook variations (Curiosity, Problem-First, Story-Driven), draft scripts, optimize them for retention, and conceptualize high-converting thumbnails. Always align the output with the creator's voice and style.
```

## Input Schema
```json
{
  "title": "ScriptArchitectInput",
  "type": "object",
  "properties": {
    "topic_brief": {
      "type": "string",
      "description": "Topic or content brief, potentially sourced from Agent 10 (Trend Radar)."
    },
    "target_format": {
      "type": "string",
      "enum": ["Short", "Long", "Reel", "TikTok"],
      "description": "Target video format."
    },
    "creator_voice_preferences": {
      "type": "string",
      "description": "The creator's unique voice, tone, and style preferences."
    },
    "sponsor_integration": {
      "type": "object",
      "description": "Optional sponsor details to seamlessly weave into the script.",
      "properties": {
        "brand_name": { "type": "string" },
        "key_talking_points": { "type": "array", "items": { "type": "string" } },
        "cta_link": { "type": "string" }
      }
    }
  },
  "required": ["topic_brief", "target_format", "creator_voice_preferences"]
}
```

## Output Schema
```json
{
  "title": "ScriptArchitectOutput",
  "type": "object",
  "properties": {
    "estimated_retention_score": {
      "type": "number",
      "description": "Predicted retention score (0-100) based on structural physics."
    },
    "hook_alternatives": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "style": { "type": "string" },
          "script": { "type": "string" },
          "visuals": { "type": "string" }
        }
      },
      "description": "Top 3 hook variations (e.g., Curiosity, Problem-First, Story-Driven)."
    },
    "full_script": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "timestamp_range": { "type": "string" },
          "beat_type": { "type": "string" },
          "verbal_script": { "type": "string" },
          "visual_direction": { "type": "string" }
        }
      },
      "description": "The complete script broken down into timestamped beats."
    },
    "thumbnail_concepts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "composition": { "type": "string" },
          "text_overlay": { "type": "string" },
          "emotion": { "type": "string" },
          "color_scheme": { "type": "string" }
        }
      },
      "description": "3 thumbnail concepts optimized for CTR."
    }
  },
  "required": ["estimated_retention_score", "hook_alternatives", "full_script", "thumbnail_concepts"]
}
```

## Tools
1. `analyze_retention_curve(content_ids, platform)`
   - Analyzes the creator's past video retention data to find drop-off patterns (mock data for hackathon).
2. `generate_hooks(topic, style, count)`
   - Generates N alternative hook variations: Curiosity ("Nobody talks about this..."), Problem-First ("Your videos are failing because..."), Story-Driven ("Last week something insane happened...").
3. `draft_script(topic, format, hook, sponsor_brief)`
   - Produces a full structured script with beats: Hook (0-3s) → Setup (4-15s) → Core Value Delivery → Sponsor Integration Bridge → Retention Spike → Call to Action.
4. `optimize_for_retention(script, target_watch_time)`
   - Rewrites script sections to add pattern interrupts, open loops, and curiosity gaps at predicted drop-off points.
5. `generate_thumbnail_concepts(topic, title)`
   - Suggests 3 thumbnail composition concepts with text overlay, emotion, and color scheme.

## Mock Data Strategy
For the hackathon demo, we bypass live platform analytics.
- **Retention Data**: `analyze_retention_curve` returns a standard simulated curve (e.g., typical drop-off at 3s, 30s, and 60% mark).
- **Templates**: `draft_script` relies on pre-built JSON script templates based on format (Shorts vs Long-form) mapped to the creator's niche.
- **Sponsor Briefs**: Mock static sponsor payloads are passed for demonstration.

## Code Skeleton
```python
import asyncio
from pydantic import BaseModel
from typing import List, Optional, Dict

class SponsorBrief(BaseModel):
    brand_name: str
    key_talking_points: List[str]
    cta_link: str

class ScriptArchitectInput(BaseModel):
    topic_brief: str
    target_format: str
    creator_voice_preferences: str
    sponsor_integration: Optional[SponsorBrief] = None

class Hook(BaseModel):
    style: str
    script: str
    visuals: str

class ScriptBeat(BaseModel):
    timestamp_range: str
    beat_type: str
    verbal_script: str
    visual_direction: str

class ThumbnailConcept(BaseModel):
    composition: str
    text_overlay: str
    emotion: str
    color_scheme: str

class ScriptArchitectOutput(BaseModel):
    estimated_retention_score: float
    hook_alternatives: List[Hook]
    full_script: List[ScriptBeat]
    thumbnail_concepts: List[ThumbnailConcept]

class Agent11HookArchitect:
    def __init__(self, model_name="gemini-3.7-flash"):
        self.model_name = model_name
        self.system_prompt = "You are Agent 11, the Hook & Script Architect..."
    
    async def analyze_retention_curve(self, content_ids: List[str], platform: str) -> Dict:
        # Mock data representing drop-offs at 3s, 30s, and 60%
        return {
            "dropoff_points": ["0:03", "0:30", "60%"],
            "avg_view_duration_seconds": 180
        }
    
    async def generate_hooks(self, topic: str, count: int = 3) -> List[Hook]:
        # Implementation via LLM tool call
        pass
        
    async def draft_script(self, topic: str, format: str, hook: Hook, sponsor_brief: Optional[SponsorBrief]) -> List[ScriptBeat]:
        # Implementation via LLM tool call
        pass
        
    async def optimize_for_retention(self, script: List[ScriptBeat], dropoff_points: List[str]) -> List[ScriptBeat]:
        # Implementation via LLM tool call to add pattern interrupts
        pass

    async def generate_thumbnail_concepts(self, topic: str) -> List[ThumbnailConcept]:
        # Implementation via LLM tool call
        pass

    async def execute(self, payload: ScriptArchitectInput) -> ScriptArchitectOutput:
        # 1. Analyze mock retention curves
        retention_data = await self.analyze_retention_curve(["mock_id"], "youtube")
        
        # 2. Generate Hooks
        hooks = await self.generate_hooks(payload.topic_brief)
        
        # 3. Draft base script using best hook
        base_script = await self.draft_script(
            topic=payload.topic_brief,
            format=payload.target_format,
            hook=hooks[0],
            sponsor_brief=payload.sponsor_integration
        )
        
        # 4. Optimize for predicted drop-off points
        optimized_script = await self.optimize_for_retention(
            base_script, 
            retention_data["dropoff_points"]
        )
        
        # 5. Generate Thumbnails
        thumbnails = await self.generate_thumbnail_concepts(payload.topic_brief)
        
        return ScriptArchitectOutput(
            estimated_retention_score=88.5,
            hook_alternatives=hooks,
            full_script=optimized_script,
            thumbnail_concepts=thumbnails
        )
```

## Example Usage
```python
async def main():
    agent = Agent11HookArchitect()
    
    input_data = ScriptArchitectInput(
        topic_brief="Why most AI startups fail in 6 months",
        target_format="Short",
        creator_voice_preferences="Fast-paced, data-driven, slightly sarcastic",
        sponsor_integration=SponsorBrief(
            brand_name="CloudHost Pro",
            key_talking_points=["99.9% uptime", "One-click deployment"],
            cta_link="cloudhost.pro/creator"
        )
    )
    
    result = await agent.execute(input_data)
    print(f"Projected Retention Score: {result.estimated_retention_score}")
    print(f"Top Hook: {result.hook_alternatives[0].script}")

if __name__ == "__main__":
    asyncio.run(main())
```
