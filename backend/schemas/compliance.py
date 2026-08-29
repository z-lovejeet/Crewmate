from pydantic import BaseModel
from typing import List, Optional

class ComplianceCheck(BaseModel):
    check_name: str
    passed: bool
    severity: str
    details: str

class ComplianceResult(BaseModel):
    platform: str
    overall_score: float
    checks: List[ComplianceCheck]
    recommendations: List[str]

class ComplianceScanRequest(BaseModel):
    title: str
    description: str
    tags: List[str]
    platform: str
    has_sponsorship: bool = False
    audio_description: Optional[str] = None
