from google.adk import Agent

def extract_clauses(contract_text: str) -> dict:
    """Extract and categorize all clauses from a contract."""
    return {"status": "success", "clauses": [{"id": "c1", "type": "exclusivity", "text": "Creator shall not work with competitors."}]}

def score_risk(clauses_json: str) -> dict:
    """Assign risk severity per clause (low/medium/high/critical)."""
    return {"status": "success", "scores": [{"id": "c1", "risk": "high", "reason": "Broad exclusivity terms"}]}

def draft_counter_proposal(clause_id: str, clause_text: str, risk_level: str) -> dict:
    """Generate negotiation counter-proposal."""
    return {"status": "success", "counter_proposal": "Limit exclusivity to directly competing products for 30 days."}

def benchmark_market_rate(deal_type: str, creator_tier: str, deliverables: str) -> dict:
    """Compare deal value against market rates."""
    return {"status": "success", "market_rate": "$5000", "deal_status": "Below Market"}

contract_reviewer_agent = Agent(
    name="contract_reviewer_agent",
    model="gemini-3.7-flash",
    description="Expert contract analyst for creator sponsorship deals.",
    instruction="""Expert contract analyst for creator sponsorship deals. Extracts clauses, identifies predatory terms (exclusivity traps, below-market rates, unfavorable payment terms), scores risk, and drafts counter-proposals.""",
    tools=[extract_clauses, score_risk, draft_counter_proposal, benchmark_market_rate],
)
