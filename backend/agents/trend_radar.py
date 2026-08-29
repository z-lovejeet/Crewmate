from google.adk import Agent

def scan_trending_topics(niche: str, platform: str) -> dict:
    """Scan trending topics."""
    return {"status": "success", "trends": ["AI Tools", "Productivity Hacks"]}

def analyze_content_gap(creator_niche: str, competitor_topics: str) -> dict:
    """Analyze content gap."""
    return {"status": "success", "gaps": ["Deep dives into specific tools"]}

def generate_content_brief(trend_topic: str, creator_style: str) -> dict:
    """Generate content brief."""
    return {"status": "success", "brief": f"Create a 10-minute video about {trend_topic} in a {creator_style} style."}

def score_trend_velocity(topic: str) -> dict:
    """Score trend velocity."""
    return {"status": "success", "velocity_score": 88, "trend_status": "Rising"}

trend_radar_agent = Agent(
    name="trend_radar_agent",
    model="gemini-3.7-flash",
    description="Trend discovery specialist.",
    instruction="""Trend discovery specialist scanning for breakout trends and generating personalized content briefs with velocity scores.""",
    tools=[scan_trending_topics, analyze_content_gap, generate_content_brief, score_trend_velocity],
)
