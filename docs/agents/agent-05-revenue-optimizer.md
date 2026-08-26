# Agent 05: Revenue Optimizer 💰

## 1. Role
Analyzes deal economics, benchmarks deal values against market rates, projects revenue, and suggests negotiation strategies. It empowers the solo creator to maximize their earning potential.

## 2. System Prompt
```text
You are the Revenue Optimizer for Crewmate, a seasoned creator economy financial analyst. Your expertise lies in valuing sponsorships, benchmarking rates against market data, and crafting compelling negotiation strategies. You analyze deal terms, audience metrics, and historical data to ensure the creator never leaves money on the table. Your advice is tactical, data-driven, and designed to maximize ROI for the creator.
```

## 3. Input Schema
```python
from pydantic import BaseModel
from typing import List

class RevenueInput(BaseModel):
    deal_type: str # e.g., 'flat_rate', 'cpa', 'hybrid'
    deal_value: float
    deliverables: List[str] # e.g., ['1x YouTube Integration', '2x IG Stories']
    audience_size: int
    engagement_rate: float
    niche: str # e.g., 'tech', 'lifestyle', 'finance'
```

## 4. Output Schema
```python
class RevenueInsight(BaseModel):
    deal_assessment: str # 'below_market', 'fair', 'above_market'
    market_benchmark: float
    below_market_pct: float
    projected_revenue: float
    negotiation_points: List[str]
```

## 5. Tools
- `benchmark_rates(niche: str, audience_size: int, platform: str) -> float`: Queries a mock Firestore database of typical creator rates to get a baseline value.
- `project_revenue(deal_terms: dict, historical_data: dict) -> float`: Calculates projected revenue, especially for CPA/Hybrid deals, using past conversion rates.
- `suggest_negotiation(weak_clauses: list, market_data: dict) -> list[str]`: Uses Gemini to generate specific email scripts/talking points for negotiation.
- `check_memory_bank(brand_name: str) -> dict`: Retrieves past deal history with this specific brand from Firestore to leverage past performance in negotiations.

## 6. Market Rate Database (Mock)
Stored in Firestore `market_rates` collection:
- **Tech**: 100k subs -> $2500 - $4000 per integration
- **Finance**: 100k subs -> $4000 - $7000 per integration
- **Lifestyle**: 100k subs -> $1500 - $3000 per integration

## 7. Code Skeleton
```python
from google import genai
import os

class RevenueOptimizerAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    def analyze_deal(self, input_data: RevenueInput) -> RevenueInsight:
        # 1. Fetch benchmark from `benchmark_rates`
        # 2. Compare `deal_value` vs benchmark
        # 3. Calculate `below_market_pct`
        # 4. Generate `negotiation_points` using Gemini
        # 5. Return RevenueInsight
        pass
```

## 8. Example Output
For a $5000 tech review sponsorship deal (Audience: 250k, 5% ER):
```json
{
  "deal_assessment": "below_market",
  "market_benchmark": 7500.00,
  "below_market_pct": 33.3,
  "projected_revenue": 5000.00,
  "negotiation_points": [
    "Highlight your 5% engagement rate, which is 2x the industry average for tech.",
    "Counter-offer with $7500 for the current deliverables, or offer to reduce deliverables (remove IG Stories) for the $5000 rate.",
    "Mention the long-tail views your hardware reviews typically get over a 6-month period."
  ]
}
```
