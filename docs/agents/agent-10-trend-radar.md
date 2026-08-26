# Agent 10: Trend Radar & Content Strategist

## 1. Role
Discovers breakout trends, viral formats, surging topics, and trending audio in the creator's specific niche BEFORE they peak. Generates actionable weekly Content Briefs. Solves the #1 creator anxiety — "What should I make next?" — with data-backed ideas instead of guesswork.

## 2. System Prompt
```text
You are the Trend Radar & Content Strategist for Crewmate. Your objective is to discover breakout trends, surging topics, and viral formats before they peak in a creator's specific niche.
You will receive the platform, niche, creator's historical content summary, and a time window.
Using your tools, you must:
1. Scan for trending topics with high velocity.
2. Analyze content gaps against the creator's past work.
3. Check competitor coverage to avoid oversaturated topics.
4. Generate comprehensive Content Briefs with title ideas, formats, viral angles, and timing recommendations.

Your output must be a ranked list of 3-5 Content Briefs, prioritizing high-velocity trends with low competitor saturation. Focus on actionable insights that maximize estimated reach and engagement.
```

## 3. Input Schema (Pydantic)
```python
from pydantic import BaseModel, Field
from typing import List, Literal

class CreatorHistorySummary(BaseModel):
    recent_topics: List[str] = Field(..., description="List of topics the creator covered recently")
    top_performing_formats: List[str] = Field(..., description="Formats that perform best (e.g., 'Shorts', 'Long-form')")

class TrendRadarInput(BaseModel):
    platform: Literal["youtube", "instagram", "both"] = Field(..., description="Target platform")
    niche: str = Field(..., description="Creator's specific niche (e.g., 'tech', 'lifestyle', 'gaming')")
    creator_history: CreatorHistorySummary = Field(..., description="Summary of creator's past content")
    time_window: Literal["daily", "weekly", "monthly"] = Field(default="weekly", description="Lookback window for trend analysis")
```

## 4. Output Schema (Pydantic)
```python
from pydantic import BaseModel, Field
from typing import List, Literal

class ContentBrief(BaseModel):
    topic: str = Field(..., description="The trending topic")
    title_ideas: List[str] = Field(..., min_items=3, max_items=3, description="3 engaging title ideas")
    format_recommendation: Literal["Short", "Long", "Reel"] = Field(..., description="Recommended format")
    viral_angle: str = Field(..., description="The unique angle or hook to capture attention")
    target_audience_segment: str = Field(..., description="Specific audience segment this appeals to")
    estimated_reach_multiplier: float = Field(..., description="Multiplier for expected reach compared to average (e.g., 1.5x)")
    timing_recommendation: Literal["Immediate", "Within 3 days", "Within 1 week"] = Field(..., description="When to publish to catch the trend")
    competitor_saturation: int = Field(..., ge=0, le=100, description="0-100 score of how saturated the topic is")
    opportunity_score: float = Field(..., description="Calculated score based on velocity and saturation (0-100)")

class TrendRadarOutput(BaseModel):
    briefs: List[ContentBrief] = Field(..., min_items=3, max_items=5, description="Ranked list of content briefs")
```

## 5. Tools
- `scan_trending_topics(niche, platform)` — Scans mock trending data (simulating YouTube Search velocity, Google Trends signals, Instagram Explore)
- `analyze_content_gap(niche, creator_history)` — Identifies topics the creator hasn't covered yet that are surging
- `generate_content_brief(topic, format, platform)` — Produces a structured brief with: Title ideas (3), Format recommendation (Short/Long/Reel), Viral angle, Target audience segment, Estimated reach multiplier
- `score_trend_velocity(topic)` — Returns a 0-100 velocity score indicating if a trend is rising, peaking, or declining
- `get_competitor_coverage(topic, niche)` — Checks how many creators in the niche have already covered this topic (saturation score)

## 6. Mock Data Strategy
For the hackathon demo, we bypass real YouTube/Instagram API OAuth and use hardcoded trending datasets tailored per niche (tech, lifestyle, gaming, beauty). These datasets include realistic velocity curves that rotate weekly to simulate freshness. The tools will return predefined responses based on the selected niche, allowing the agent to evaluate trends and generate briefs without live API latency or rate limits.

## 7. Code Skeleton
```python
import asyncio
from typing import List, Dict, Any
from schemas import TrendRadarInput, TrendRadarOutput, ContentBrief

class TrendRadarAgent:
    def __init__(self, model_name: str = "gemini-3.7-flash"):
        self.model_name = model_name
        self.system_prompt = self._load_system_prompt()
        
    def _load_system_prompt(self) -> str:
        return "You are the Trend Radar & Content Strategist..." # Full system prompt

    async def scan_trending_topics(self, niche: str, platform: str) -> List[Dict[str, Any]]:
        # Mock implementation returning hardcoded trends per niche
        await asyncio.sleep(0.5)
        return [{"topic": "AI in 2026", "platform_signals": "high"}]

    async def analyze_content_gap(self, niche: str, creator_history: Dict[str, Any]) -> List[str]:
        # Mock gap analysis
        await asyncio.sleep(0.5)
        return ["AI agents for productivity"]

    async def generate_content_brief(self, topic: str, format_rec: str, platform: str) -> Dict[str, Any]:
        # Mock brief generation
        await asyncio.sleep(1)
        return {
            "title_ideas": ["How AI Agents Work", "My AI Agent Workflow", "Top 5 AI Agents"],
            "viral_angle": "Focus on time saved",
            "target_audience_segment": "Productivity enthusiasts",
            "estimated_reach_multiplier": 2.5
        }

    async def score_trend_velocity(self, topic: str) -> int:
        # Mock velocity scoring (0-100)
        await asyncio.sleep(0.2)
        return 85

    async def get_competitor_coverage(self, topic: str, niche: str) -> int:
        # Mock competitor saturation (0-100)
        await asyncio.sleep(0.3)
        return 20

    async def process(self, input_data: TrendRadarInput) -> TrendRadarOutput:
        # 1. Scan for topics
        topics = await self.scan_trending_topics(input_data.niche, input_data.platform)
        
        # 2. Check gaps
        gaps = await self.analyze_content_gap(input_data.niche, input_data.creator_history.dict())
        
        briefs = []
        # 3. Score and Generate Briefs
        for t in topics[:5]:
            topic_name = t["topic"]
            velocity = await self.score_trend_velocity(topic_name)
            saturation = await self.get_competitor_coverage(topic_name, input_data.niche)
            
            if velocity > 50 and saturation < 80:
                brief_data = await self.generate_content_brief(topic_name, "Long", input_data.platform)
                
                # Calculate opportunity score
                opp_score = velocity - (saturation * 0.5)
                
                briefs.append(ContentBrief(
                    topic=topic_name,
                    title_ideas=brief_data["title_ideas"],
                    format_recommendation="Long",
                    viral_angle=brief_data["viral_angle"],
                    target_audience_segment=brief_data["target_audience_segment"],
                    estimated_reach_multiplier=brief_data["estimated_reach_multiplier"],
                    timing_recommendation="Within 3 days",
                    competitor_saturation=saturation,
                    opportunity_score=opp_score
                ))
                
        # Rank by opportunity score
        briefs.sort(key=lambda x: x.opportunity_score, reverse=True)
        
        return TrendRadarOutput(briefs=briefs[:5])
```

## 8. Example Usage
```json
// Input
{
  "platform": "youtube",
  "niche": "tech",
  "creator_history": {
    "recent_topics": ["smartphone reviews", "laptop setups"],
    "top_performing_formats": ["Long"]
  },
  "time_window": "weekly"
}

// Output
{
  "briefs": [
    {
      "topic": "AI Agents for Productivity",
      "title_ideas": [
        "How I Automated My Life with AI Agents",
        "The Only AI Agent Workflow You Need in 2026",
        "Stop Doing Manual Work: AI Agents Explained"
      ],
      "format_recommendation": "Long",
      "viral_angle": "Focus on exactly how much time is saved per week (quantifiable ROI).",
      "target_audience_segment": "Productivity enthusiasts and creators",
      "estimated_reach_multiplier": 2.5,
      "timing_recommendation": "Immediate",
      "competitor_saturation": 20,
      "opportunity_score": 88.5
    }
  ]
}
```
