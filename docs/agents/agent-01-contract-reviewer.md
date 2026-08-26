# Agent 01: Contract Reviewer 📋

## 1. Role
Analyzes brand deal contracts for risks, extracts key clauses, assigns risk scores, and suggests counter-terms to protect the creator.

## 2. System Prompt
```text
You are a highly skilled media lawyer specializing in digital creator brand deals. 
Your job is to review sponsorship contracts. You must extract key clauses (exclusivity, payment terms, usage rights, termination), identify risks, and assign severity scores.
Always provide actionable counter-proposals that protect the creator's intellectual property and financial interests.
```

## 3. Input Schema
```python
from pydantic import BaseModel
from typing import Dict, Any

class ContractInput(BaseModel):
    file_url: str
    brand_name: str
    creator_preferences: Dict[str, Any]
```

## 4. Output Schema
```python
from pydantic import BaseModel
from typing import List, Optional

class ClauseRisk(BaseModel):
    clause_id: str
    title: str
    category: str
    severity: str
    original_text: str
    risk_explanation: str
    suggested_alternative: str

class ContractAnalysis(BaseModel):
    contract_id: str
    total_clauses: int
    risks: List[ClauseRisk]
    overall_risk_score: int
    negotiation_suggestions: List[str]
    revenue_context: Optional[str]
```

## 5. Tools
- `extract_clauses(pdf_url)`: Parse PDF and extract clause sections using Gemini Vision.
- `score_risk(clause_text, category)`: Score individual clause risk based on the rubric.
- `draft_counter_proposal(clause, severity)`: Generate counter-proposal text.
- `check_memory_bank(brand_name)`: Get past interaction history with this brand from Firestore.

## 6. Risk Scoring Logic
- **Exclusivity**: > 6 months = HIGH, 3-6 months = MEDIUM, < 3 months = LOW.
- **Payment Terms**: Net-90 = HIGH, Net-60 = MEDIUM, Net-30 = LOW, Upon Publication = NONE.
- **Usage Rights**: Perpetuity = CRITICAL, > 1 year = HIGH, Organic Only = LOW.

## 7. Memory Integration
- Queries `brand_interactions` collection in Firestore to see if this brand previously negotiated terms or had late payments, using this to adjust risk scores.

## 8. Code Skeleton
```python
class ContractReviewerAgent:
    def __init__(self, gemini_client, firestore_client):
        self.llm = gemini_client
        self.db = firestore_client

    def analyze_contract(self, input_data: ContractInput) -> ContractAnalysis:
        pass

    def extract_clauses(self, pdf_url: str) -> list:
        pass

    def score_risk(self, clause_text: str, category: str) -> str:
        pass

    def draft_counter_proposal(self, clause: str, severity: str) -> str:
        pass

    def check_memory_bank(self, brand_name: str) -> dict:
        pass
```

## 9. Example Input/Output
**Input:**
`file_url: "gs://contracts/deal1.pdf", brand_name: "TechCorp", creator_preferences: {"max_exclusivity_months": 3}`

**Output:**
```json
{
  "contract_id": "c_123",
  "total_clauses": 15,
  "overall_risk_score": 75,
  "risks": [
    {
      "clause_id": "cl_01",
      "title": "Exclusivity Period",
      "category": "exclusivity",
      "severity": "HIGH",
      "original_text": "Creator shall not promote competing products for 12 months.",
      "risk_explanation": "12 months exceeds your preference of 3 months.",
      "suggested_alternative": "Creator shall not promote competing products for 3 months following publication."
    }
  ],
  "negotiation_suggestions": ["Push back on exclusivity.", "Request Net-30 payment."]
}
```
