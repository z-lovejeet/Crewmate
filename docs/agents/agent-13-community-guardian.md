# Agent 13: Community Sentiment & Feedback Guardian

## 1. Role
**Name**: Community Sentiment & Feedback Guardian
**Agent ID**: 13
**Models**: `gemini-3.7-flash` (complex reasoning, reply generation, clustering) + `gemma-2-9b` (fast local sentiment classification & toxicity detection)
**Primary Responsibility**: Clusters and analyzes viewer comments across YouTube and Instagram to extract actionable audience feedback, moderate toxic content, and generate suggested replies in the creator's unique voice. Turns noisy comment sections into a structured feedback loop.
**Real Creator Value**: Creators with 50K+ subscribers get hundreds of comments per video. This agent reads ALL of them and surfaces: what viewers loved, what they want to see next, recurring complaints, and toxic content — saving hours of manual reading.
**Inter-Agent Collaboration**:
- Sends content idea signals to **Trend Radar (Agent 10)**.
- Feeds audience sentiment to **Audience Analyst (Agent 09)**.
- Flags toxic comments to **Brand Safety (Agent 06)**.

## 2. System Prompt
```text
You are Agent 13: Community Sentiment & Feedback Guardian on the Crewmate platform.
Your objective is to read through viewer comments from YouTube and Instagram, cluster them into actionable feedback, evaluate overall sentiment, detect toxic/spam content, and generate authentic replies.

Follow these strict guidelines:
1. Objectivity: Maintain an objective stance when evaluating sentiment. Do not let one highly emotional comment skew the overall cluster.
2. Voice Matching: When generating replies, strictly adhere to the creator's provided voice profile (e.g., formal, casual, humorous, Gen-Z). Do not sound robotic.
3. Actionable Insights: Your extraction of content signals must be specific. Instead of "They want more gaming," output "35% of viewers requested a dedicated playthrough of [Specific Game]."
4. Safety First: Apply the provided moderation sensitivity level to identify toxic content accurately, ensuring false positives are minimized but genuine hate/spam is flagged.

Use the provided tools to fetch, classify, cluster, and moderate comments. Return the final structured output matching the designated schemas.
```

## 3. Input Schema
```python
from pydantic import BaseModel, Field
from typing import List, Optional

class CreatorVoiceProfile(BaseModel):
    tone: str = Field(description="The general tone of the creator (e.g., 'casual', 'humorous', 'formal', 'snarky')")
    key_phrases: List[str] = Field(description="Catchphrases or common words the creator uses")
    emoji_usage: str = Field(description="How the creator uses emojis (e.g., 'heavy', 'minimal', 'only hearts')")

class Agent13InputSchema(BaseModel):
    content_ids: List[str] = Field(description="List of video/post IDs to analyze")
    platform: str = Field(description="Platform to fetch comments from ('youtube' or 'instagram')")
    creator_voice: CreatorVoiceProfile = Field(description="The creator's voice profile for generating replies")
    moderation_sensitivity: str = Field(description="Sensitivity level for toxicity detection ('low', 'medium', 'high')", default="medium")
```

## 4. Output Schema
```python
from pydantic import BaseModel, Field
from typing import List, Dict

class SentimentDashboard(BaseModel):
    positive_percentage: float
    negative_percentage: float
    neutral_percentage: float
    toxic_percentage: float

class FeedbackCluster(BaseModel):
    theme: str = Field(description="Theme of the cluster (e.g., 'Feature requests', 'Praise')")
    count: int = Field(description="Number of comments in this cluster")
    percentage: float = Field(description="Percentage of total comments")
    sample_comments: List[str] = Field(description="2-3 representative comments from this cluster")

class ToxicComment(BaseModel):
    comment_id: str
    text: str
    severity: str = Field(description="'low', 'medium', 'high'")
    reason: str = Field(description="Why it was flagged (e.g., 'spam', 'harassment')")

class SuggestedReply(BaseModel):
    original_comment: str
    suggested_response: str
    rationale: str = Field(description="Why this reply works based on the creator's voice")

class Agent13OutputSchema(BaseModel):
    sentiment_dashboard: SentimentDashboard
    feedback_clusters: List[FeedbackCluster]
    toxic_comments: List[ToxicComment]
    top_suggested_replies: List[SuggestedReply]
    content_ideas: List[str] = Field(description="Top 3 content ideas extracted from viewer requests")
```

## 5. Tools
- `fetch_comments(content_id: str, platform: str) -> List[Dict]`: Fetches comment data.
- `classify_sentiment(comments: List[Dict]) -> List[Dict]`: Classifies each comment as positive/negative/neutral/toxic. Uses `gemma-2-9b` for fast local processing.
- `cluster_feedback(comments: List[Dict]) -> List[Dict]`: Groups similar comments into themes ("Feature requests", "Praise", "Complaints", "Questions", "Content suggestions") with percentage distribution.
- `detect_toxic_content(comments: List[Dict], sensitivity: str) -> List[Dict]`: Flags hateful, spam, or harassing comments for moderation with severity levels.
- `generate_replies(comments: List[Dict], creator_voice: Dict) -> List[Dict]`: Drafts personalized replies in the creator's authentic voice/tone for top engaging comments.
- `extract_content_signals(clusters: List[Dict]) -> List[str]`: Analyzes feedback clusters to identify the top 3 content ideas viewers are explicitly requesting.

## 6. Mock Data Strategy
For the hackathon, avoid hitting real social media APIs.
- **Mock Comments Database**: JSON files containing 150+ pre-written realistic comments per mock video. These comments must cover a wide spectrum: glowing praise, constructive criticism, unrelated questions, obvious crypto spam, and specific feature requests.
- **Voice Profiles**: Maintain hardcoded mock profiles (e.g., a "Gen-Z Tech Reviewer" who uses 'cap' and 💀 emojis, vs a "Calm Productivity Guru" who uses complete sentences and 🌱 emojis).

## 7. Code Skeleton
```python
import asyncio
from typing import List, Dict, Any
from pydantic import BaseModel
# Assuming internal ADK imports
from crewmate.adk import Agent, Tool
from crewmate.models import Agent13InputSchema, Agent13OutputSchema

class CommunityGuardianAgent(Agent):
    def __init__(self):
        super().__init__(
            agent_id="13",
            name="Community Sentiment & Feedback Guardian",
            model="gemini-3.7-flash",
            fast_model="gemma-2-9b",
            system_prompt=self._load_system_prompt()
        )
        self.register_tools([
            self.fetch_comments,
            self.classify_sentiment,
            self.cluster_feedback,
            self.detect_toxic_content,
            self.generate_replies,
            self.extract_content_signals
        ])

    def _load_system_prompt(self) -> str:
        return "You are Agent 13..." # Load from prompt registry

    async def fetch_comments(self, content_id: str, platform: str) -> List[Dict]:
        \"\"\"Fetches comment data (mock for hackathon).\"\"\"
        # TODO: Load from mock JSON data based on content_id
        pass

    async def classify_sentiment(self, comments: List[Dict]) -> List[Dict]:
        \"\"\"Classifies sentiment using gemma-2-9b.\"\"\"
        # TODO: Batch inference call to gemma-2-9b
        pass

    async def cluster_feedback(self, comments: List[Dict]) -> List[Dict]:
        \"\"\"Groups comments into themes.\"\"\"
        # TODO: Use embeddings or fast LLM clustering
        pass

    async def detect_toxic_content(self, comments: List[Dict], sensitivity: str) -> List[Dict]:
        \"\"\"Flags toxic content based on sensitivity.\"\"\"
        # TODO: Toxicity classification logic
        pass

    async def generate_replies(self, comments: List[Dict], creator_voice: Dict) -> List[Dict]:
        \"\"\"Drafts personalized replies using gemini-3.7-flash.\"\"\"
        # TODO: LLM call with few-shot examples of creator voice
        pass

    async def extract_content_signals(self, clusters: List[Dict]) -> List[str]:
        \"\"\"Extracts top content ideas from clusters.\"\"\"
        # TODO: Summarization and extraction of actionable ideas
        pass

    async def process(self, input_data: Agent13InputSchema) -> Agent13OutputSchema:
        \"\"\"Main execution flow for the agent.\"\"\"
        all_comments = []
        for content_id in input_data.content_ids:
            comments = await self.fetch_comments(content_id, input_data.platform)
            all_comments.extend(comments)
        
        # Run classification and toxicity detection concurrently (fast local models)
        classified_task = asyncio.create_task(self.classify_sentiment(all_comments))
        toxic_task = asyncio.create_task(self.detect_toxic_content(all_comments, input_data.moderation_sensitivity))
        
        classified_comments, toxic_comments = await asyncio.gather(classified_task, toxic_task)
        
        # Calculate sentiment dashboard
        # ... logic to calculate percentages ...
        
        # Cluster feedback and extract ideas
        clusters = await self.cluster_feedback(classified_comments)
        content_ideas = await self.extract_content_signals(clusters)
        
        # Generate replies for top non-toxic comments
        top_comments = [c for c in classified_comments if c not in toxic_comments][:5] # Simplified
        suggested_replies = await self.generate_replies(top_comments, input_data.creator_voice.model_dump())
        
        # Construct and return final output
        # return Agent13OutputSchema(...)
        pass
```

## 8. Example Usage
```python
async def run_demo():
    agent = CommunityGuardianAgent()
    
    input_data = Agent13InputSchema(
        content_ids=["vid_hackathon_demo_01"],
        platform="youtube",
        creator_voice=CreatorVoiceProfile(
            tone="casual and enthusiastic",
            key_phrases=["what's up fleet", "let's dive in", "mind blown"],
            emoji_usage="moderate, mostly 🔥 and 🚀"
        ),
        moderation_sensitivity="high"
    )
    
    result = await agent.process(input_data)
    print(f"Positive Sentiment: {result.sentiment_dashboard.positive_percentage}%")
    print(f"Top Idea: {result.content_ideas[0]}")
    print(f"Toxic Comments Flagged: {len(result.toxic_comments)}")
    
# asyncio.run(run_demo())
```
