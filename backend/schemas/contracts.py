from pydantic import BaseModel
from typing import List

class ContractClause(BaseModel):
    clause_id: str
    category: str
    text: str
    risk_level: str

class CounterProposal(BaseModel):
    clause_id: str
    original_text: str
    proposed_text: str
    justification: str

class ContractAnalysis(BaseModel):
    contract_name: str
    total_clauses: int
    flagged_clauses: int
    overall_risk_score: float
    clauses: List[ContractClause]
    counter_proposals: List[CounterProposal]
    summary: str

class ContractUploadRequest(BaseModel):
    creator_id: str = "demo_creator"
