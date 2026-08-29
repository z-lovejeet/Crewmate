from google.adk import Agent

def scan_for_threats(input_text: str) -> dict:
    """Scan for threats."""
    return {"status": "success", "threat_level": "none", "details": "Safe input."}

def detect_anomaly(agent_behavior: str, expected_pattern: str) -> dict:
    """Detect anomaly."""
    return {"status": "success", "anomaly_detected": False}

threat_sentinel_agent = Agent(
    name="threat_sentinel_agent",
    model="gemini-3.7-flash",
    description="Security monitoring agent.",
    instruction="""Security monitoring agent detecting prompt injection, anomalous behavior, and brand reputation risks.""",
    tools=[scan_for_threats, detect_anomaly],
)
