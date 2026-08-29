from google.adk import Agent

def check_brand_alignment(brand_name: str, content_summary: str) -> dict:
    """Check brand alignment."""
    return {"status": "success", "alignment_score": 90, "notes": "Good fit for family-friendly brand."}

def scan_controversial_topics(content_text: str) -> dict:
    """Scan controversial topics."""
    return {"status": "success", "flags": [], "risk_level": "low"}

brand_safety_agent = Agent(
    name="brand_safety_agent",
    model="gemini-3.7-flash",
    description="Brand safety evaluator.",
    instruction="""Brand safety evaluator ensuring content-brand alignment.""",
    tools=[check_brand_alignment, scan_controversial_topics],
)
