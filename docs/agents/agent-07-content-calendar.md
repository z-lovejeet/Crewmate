# Agent 07: Content Calendar 📅

## 1. Role
Manages the content publication schedule across multiple platforms (YouTube and Instagram), detects scheduling conflicts, and suggests optimal posting times based on audience engagement data and platform constraints.

## 2. System Prompt
```text
You are the Content Calendar Strategist for Crewmate, an elite AI agent managing scheduling for a solo content creator (our unlikely hero).
Your mission is to maximize content visibility and engagement by optimizing publication times across YouTube and Instagram.

Guidelines:
- Analyze proposed posting dates for conflicts with existing scheduled content.
- Enforce scheduling rules: Minimum gap of 24 hours between YouTube posts, and 4 hours between Instagram posts.
- Ensure no competing brand posts occur on the same day.
- Suggest alternative optimal times if conflicts exist or if the proposed time has low predicted engagement.
- Always provide clear reasoning for your scheduling recommendations based on data and rules.
```

## 3. Input Schema (Pydantic)
```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CalendarInput(BaseModel):
    content_id: str
    platform: str # "youtube" or "instagram"
    proposed_date: datetime
    content_type: str # e.g., "tech_review", "vlog", "reel", "story"
    brand_id: Optional[str] = None
```

## 4. Output Schema (Pydantic)
```python
from pydantic import BaseModel
from typing import List
from datetime import datetime

class CalendarResult(BaseModel):
    scheduled: bool
    conflicts: List[str]
    suggested_alternatives: List[datetime]
    optimal_times: List[datetime]
    reasoning: str
```

## 5. Tools
- `find_conflicts(date, platform)` — Check for scheduling conflicts on a given date for a specific platform.
- `suggest_timing(platform, content_type, audience_data)` — Calculate optimal posting time based on audience engagement patterns.
- `sync_platforms(youtube_schedule, instagram_schedule)` — Coordinate cross-platform schedules to avoid saturation.
- `get_calendar(date_range)` — Retrieve the current calendar from Firestore.

## 6. Scheduling Rules
- **Minimum Gap**: 24 hours between YouTube videos, 4 hours between Instagram posts (Reels/Stories/Feed).
- **Brand Exclusivity**: No competing brand posts on the same day across all platforms.
- **Cross-Platform Sync**: If posting related content on both platforms, Instagram should be scheduled 2 hours before or after YouTube to maximize distinct engagement.

## 7. Code Skeleton
```python
import datetime
from pydantic import BaseModel
from typing import List, Optional

class CalendarInput(BaseModel):
    content_id: str
    platform: str
    proposed_date: datetime.datetime
    content_type: str
    brand_id: Optional[str] = None

class CalendarResult(BaseModel):
    scheduled: bool
    conflicts: List[str]
    suggested_alternatives: List[datetime.datetime]
    optimal_times: List[datetime.datetime]
    reasoning: str

class ContentCalendarAgent:
    def __init__(self, llm_client, firestore_client):
        self.llm = llm_client
        self.db = firestore_client
        self.system_prompt = "..."

    async def find_conflicts(self, proposed_date: datetime.datetime, platform: str, brand_id: str = None) -> List[str]:
        # Implement conflict check against Firestore calendar collection
        # Check minimum gaps (24h YT, 4h IG)
        # Check competing brands
        pass

    async def suggest_timing(self, platform: str, content_type: str) -> List[datetime.datetime]:
        # Integrate with Audience Analyst data to find optimal times
        pass

    async def process_schedule_request(self, input_data: CalendarInput) -> CalendarResult:
        conflicts = await self.find_conflicts(input_data.proposed_date, input_data.platform, input_data.brand_id)
        optimal_times = await self.suggest_timing(input_data.platform, input_data.content_type)
        
        # Build prompt for LLM to reason and decide
        prompt = f"Analyze scheduling request for {input_data.platform} on {input_data.proposed_date}."
        # ... invoke Gemini 3.7 Flash ...
        
        return CalendarResult(
            scheduled=len(conflicts) == 0,
            conflicts=conflicts,
            suggested_alternatives=optimal_times[:3],
            optimal_times=optimal_times,
            reasoning="Derived from analysis."
        )
```

## 8. Example Usage
**Scenario**: Scheduling a tech review video across YouTube and Instagram.
**Input**:
```json
{
  "content_id": "vid_123",
  "platform": "youtube",
  "proposed_date": "2026-08-25T14:00:00Z",
  "content_type": "tech_review",
  "brand_id": "brand_samsung"
}
```
**Output**:
```json
{
  "scheduled": false,
  "conflicts": ["Another YouTube video scheduled within 24h (vid_099 at 2026-08-24T18:00:00Z)"],
  "suggested_alternatives": ["2026-08-25T18:00:00Z", "2026-08-26T14:00:00Z"],
  "optimal_times": ["2026-08-26T14:00:00Z", "2026-08-27T10:00:00Z"],
  "reasoning": "Minimum 24h gap rule violated. Suggested alternative clears the 24h gap and aligns with high audience engagement periods."
}
```
