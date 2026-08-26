# Agent 09: Audience Analyst 👥

## 1. Role
Analyzes audience demographics, engagement patterns, and historical content performance. Suggests new content topics and provides optimal posting times to the Content Calendar agent.

## 2. System Prompt
```text
You are the Audience Analyst for Crewmate, an AI agent specialized in social media analytics and audience behavior.
Your mission is to decode audience data to provide actionable insights for content strategy.

Guidelines:
- Analyze demographic data to understand who is watching.
- Evaluate engagement metrics (views, likes, watch time) to identify what content resonates.
- Suggest trending topics within the creator's niche based on data.
- Provide data-backed recommendations for optimal posting times.
- Present insights clearly and concisely for use by other agents and the creator dashboard.
```

## 3. Input Schema (Pydantic)
```python
from pydantic import BaseModel
from typing import List, Optional

class AudienceInput(BaseModel):
    platform: str # "youtube", "instagram", "both"
    date_range: str # e.g., "last_30_days", "ytd"
    content_ids: Optional[List[str]] = None
    niche: str
```

## 4. Output Schema (Pydantic)
```python
from pydantic import BaseModel
from typing import Dict, List, Any

class AudienceInsight(BaseModel):
    demographics: Dict[str, Any]
    engagement_metrics: Dict[str, Any]
    optimal_times: List[str]
    trending_topics: List[str]
    recommendations: List[str]
```

## 5. Tools
- `analyze_demographics(platform, data)` — Generate demographic breakdowns (age, gender, geography) using mock data.
- `predict_engagement(content_type, posting_time, platform)` — Predict engagement rate using a mock heuristic model.
- `suggest_topics(niche, trending_data)` — Extract trending topic suggestions based on the creator's niche.
- `get_historical_performance(content_type, platform)` — Fetch past content performance stats from Firestore.

## 6. Mock Data Strategy
Since real-time YouTube/Instagram APIs require complex OAuth and approvals not feasible for a hackathon, we will use highly realistic mock datasets stored in Firestore or generated dynamically:
- **Demographics**: Static JSON structures varying slightly by platform.
- **Engagement**: Time-series mock data with predictable peaks (e.g., weekends, evenings).
- **Trends**: Hardcoded list of current trends related to the creator's niche (e.g., "AI tools 2026", "Tech unboxing").

## 7. Code Skeleton
```python
from pydantic import BaseModel
from typing import List, Dict, Any

class AudienceInput(BaseModel):
    platform: str
    date_range: str
    niche: str

class AudienceInsight(BaseModel):
    demographics: Dict[str, Any]
    engagement_metrics: Dict[str, Any]
    optimal_times: List[str]
    trending_topics: List[str]
    recommendations: List[str]

class AudienceAnalystAgent:
    def __init__(self, llm_client, firestore_client):
        self.llm = llm_client
        self.db = firestore_client

    async def get_mock_demographics(self, platform: str) -> Dict[str, Any]:
        # Return mock age/gender/location data
        return {"18-24": "40%", "25-34": "35%", "top_geo": "US"}

    async def predict_optimal_times(self, platform: str) -> List[str]:
        # Return mock optimal times based on platform
        return ["Thursday 14:00 EST", "Sunday 10:00 EST"]

    async def analyze(self, input_data: AudienceInput) -> AudienceInsight:
        demographics = await self.get_mock_demographics(input_data.platform)
        times = await self.predict_optimal_times(input_data.platform)
        
        # Use LLM to generate natural language recommendations based on the data
        prompt = f"Given demographics {demographics} in niche {input_data.niche}, suggest 3 trending topics."
        # ... invoke Gemini ...
        
        return AudienceInsight(
            demographics=demographics,
            engagement_metrics={"avg_view_duration": "4m 12s", "ctr": "6.8%"},
            optimal_times=times,
            trending_topics=["AI Agents in 2026", "Automating YouTube workflows"],
            recommendations=["Focus on short-form content for the 18-24 demographic."]
        )
```

## 8. Example Usage
**Scenario**: Analyzing audience for a tech creator on YouTube.
**Input**:
```json
{
  "platform": "youtube",
  "date_range": "last_30_days",
  "niche": "technology"
}
```
**Output**:
```json
{
  "demographics": {"18-24": "45%", "25-34": "30%", "male": "70%"},
  "engagement_metrics": {"avg_ctr": "5.5%", "retention_rate": "42%"},
  "optimal_times": ["Friday 15:00 UTC", "Saturday 12:00 UTC"],
  "trending_topics": ["Gemini 3.7 Flash Reviews", "Local LLMs on Mac"],
  "recommendations": ["High engagement from 18-24 bracket; incorporate more fast-paced editing.", "Publish on Friday afternoons to capture weekend viewing spikes."]
}
```
