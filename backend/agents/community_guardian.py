from google.adk import Agent

def classify_sentiment(comments: str) -> dict:
    """Classify sentiment."""
    return {"status": "success", "positive": 80, "neutral": 15, "negative": 5}

def cluster_feedback(comments: str) -> dict:
    """Cluster feedback."""
    return {"status": "success", "clusters": ["Audio quality issues", "Loving the new format"]}

def detect_toxic_content(comment: str) -> dict:
    """Detect toxic content."""
    return {"status": "success", "is_toxic": False, "confidence": 0.99}

def generate_replies(comment: str, creator_tone: str) -> dict:
    """Generate replies."""
    return {"status": "success", "reply": "Thanks for the feedback! Glad you liked it."}

community_guardian_agent = Agent(
    name="community_guardian_agent",
    model="gemini-3.7-flash",
    description="Community intelligence specialist.",
    instruction="""Community intelligence specialist using sentiment analysis to cluster viewer comments, detect toxic content, and generate context-aware replies.""",
    tools=[classify_sentiment, cluster_feedback, detect_toxic_content, generate_replies],
)
