from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
import json
from ..config.settings import get_settings
from ..services.gemini import generate_text

router = APIRouter()

class ReportRequest(BaseModel):
    report_type: str = "compliance_and_revenue"
    creator_id: Optional[str] = "creator_demo"
    data: Optional[Dict[str, Any]] = None

class ReportResponse(BaseModel):
    id: str
    title: str
    report_type: str
    generated_at: str
    executive_summary: str
    key_metrics: Dict[str, Any]
    sections: List[Dict[str, str]]

DEMO_REPORT = ReportResponse(
    id="rep-2026-08-brandx",
    title="BrandX Sponsorship Audit & Fleet Performance Report",
    report_type="Sponsorship & Compliance Audit",
    generated_at="August 2026",
    executive_summary="Crewmate evaluated the $8,500 BrandX sponsorship package across legal, copyright, and distribution criteria. By proposing revised Net-30 payment and a 45-day narrowed exclusivity period, an additional $2,700 in value was unlocked while mitigating 100% of copyright infringement liabilities via Lyria audio substitution.",
    key_metrics={
        "Contract Safety Score": "88/100 (High Risk mitigated)",
        "Value Unlocked": "+$2,700",
        "FTC Compliance Status": "100% Shielded",
        "Estimated View Reach": "145,000 - 180,000 Views"
    },
    sections=[
        {
            "heading": "1. Legal & Rights Protection",
            "body": "Replaced perpetual paid ad usage rights with a 60-day licensed window (+30% surcharge applied)."
        },
        {
            "heading": "2. Copyright & Audio Clearance",
            "body": "Substituted flagged audio track with Lyria AI 'Neon Horizon' — fully cleared across global Content ID."
        },
        {
            "heading": "3. Distribution Cadence",
            "body": "Scheduled for Thursday 6:00 PM EST launch with 3 staggered Instagram Reels for optimal audience retention."
        }
    ]
)

@router.post("/generate", response_model=ReportResponse)
async def generate_report(request: ReportRequest):
    prompt = f"""Generate an executive creator performance report for type: {request.report_type}.
Data provided: {request.data or 'Standard creator performance metrics'}

Return ONLY valid JSON matching this schema:
{{
  "id": "rep-custom-01",
  "title": "...",
  "report_type": "{request.report_type}",
  "generated_at": "August 2026",
  "executive_summary": "...",
  "key_metrics": {{"Metric 1": "...", "Metric 2": "..."}},
  "sections": [{{"heading": "...", "body": "..."}}]
}}
"""
    try:
        response_text = generate_text(prompt=prompt)
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        data = json.loads(cleaned.strip())
        return ReportResponse(**data)
    except Exception:
        return DEMO_REPORT

@router.get("/list", response_model=List[ReportResponse])
async def list_reports():
    return [
        DEMO_REPORT,
        ReportResponse(
            id="rep-2026-08-monthly",
            title="August 2026 Fleet Performance & Yield Summary",
            report_type="Monthly Fleet Yield",
            generated_at="August 2026",
            executive_summary="Crewmate autonomous agents processed 14 sponsorship deals, performed 28 compliance scans, and generated 12 viral shorts packages. Creator revenue grew by +34% MoM.",
            key_metrics={"Total Revenue": "$34,200", "Deals Closed": "14", "Safety Rate": "100%"},
            sections=[]
        )
    ]

