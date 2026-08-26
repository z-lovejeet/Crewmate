# Agent 06: Brand Safety 🎯

## 1. Role
Monitors brand alignment and reputation risks. Verifies content aligns with active brand partnership guidelines, flags controversial or off-brand content, and ensures exclusivity clauses are not violated.

## 2. System Prompt
```text
You are the Brand Safety Agent for Crewmate, a vigilant reputation management specialist. Your duty is to protect the creator's relationships with sponsors. You meticulously scan content drafts against active brand guidelines, searching for controversial topics, profanity, off-brand tone, and accidental competitor mentions. You provide actionable warnings and recommendations to ensure the content remains safe, compliant, and highly monetizable.
```

## 3. Input Schema
```python
from pydantic import BaseModel
from typing import List

class BrandSafetyInput(BaseModel):
    content_draft: str # Transcript or caption text
    active_brand_deals: List[dict] # Details of current sponsors and their guidelines
    content_category: str
```

## 4. Output Schema
```python
class SafetyWarning(BaseModel):
    category: str
    severity: str # 'low', 'medium', 'high'
    description: str
    suggested_fix: str

class BrandSafetyResult(BaseModel):
    safety_score: int # 0-100
    alignment_checks: List[str]
    warnings: List[SafetyWarning]
    recommendations: str
```

## 5. Tools
- `check_brand_alignment(content: str, brand_guidelines: dict) -> dict`: Uses Gemini to assess if the overall tone matches the brand's expected persona.
- `scan_controversial(content_text: str) -> list`: Scans for profanity, sensitive topics (politics, religion, violence), using Google Model Armor for enterprise-grade safety checks.
- `verify_competitor_mentions(content: str, brand_exclusivity: dict) -> list`: Checks for mentions of competitors (e.g., mentioning Adidas while sponsored by Nike).
- `check_guidelines_compliance(content: str, brand_guidelines: dict) -> bool`: Verifies specific rules (e.g., "Must wear safety gear in video").

## 6. Brand Safety Categories
- Profanity / Explicit Content
- Politics / Divisive Topics
- Violence / Harmful Acts
- Competitor Mentions (Exclusivity Violation)
- Off-brand Tone (e.g., overly sarcastic for a family-friendly brand)
- FTC Disclosure Missing (Secondary check)

## 7. Code Skeleton
```python
from google import genai
import os

class BrandSafetyAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    def evaluate_safety(self, input_data: BrandSafetyInput) -> BrandSafetyResult:
        # 1. Run `scan_controversial` (Model Armor integration)
        # 2. Run `verify_competitor_mentions` for each active deal
        # 3. Assess overall alignment with Gemini
        # 4. Calculate `safety_score` based on warnings
        # 5. Return BrandSafetyResult
        pass
```

## 8. Example Output
For a video with an active Nike sponsorship:
```json
{
  "safety_score": 75,
  "alignment_checks": [
    "Tone is energetic and aligns with Nike guidelines."
  ],
  "warnings": [
    {
      "category": "Competitor Mentions",
      "severity": "high",
      "description": "Mentioned 'Adidas Ultraboost' at 04:12.",
      "suggested_fix": "Edit out the competitor mention or blur the logo to comply with the Nike exclusivity clause."
    },
    {
      "category": "Profanity",
      "severity": "low",
      "description": "Mild profanity 'damn' used at 01:05.",
      "suggested_fix": "Consider bleeping if aiming for a general audience, though Nike guidelines permit mild language."
    }
  ],
  "recommendations": "Crucial: Remove the Adidas mention before publishing to avoid breaching the Nike contract."
}
```
