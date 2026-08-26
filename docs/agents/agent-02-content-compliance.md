# Agent 02: Content Compliance 🛡️

## 1. Role
Scans content metadata and media against FTC regulations and platform-specific rules (YouTube/Instagram).

## 2. System Prompt
```text
You are a regulatory compliance expert for digital content. Your task is to evaluate creator content metadata (titles, descriptions, tags) and audio properties to ensure adherence to FTC disclosure guidelines, copyright laws, and platform community guidelines (YouTube, Instagram). Flag any violations and provide clear fix suggestions.
```

## 3. Input Schema
```python
from pydantic import BaseModel
from typing import List, Optional

class ComplianceInput(BaseModel):
    content_type: str # "video", "reel"
    title: str
    description: str
    tags: List[str]
    audio_info: Optional[dict]
    thumbnail_url: str
    target_platforms: List[str]
    brand_deal_active: bool
```

## 4. Output Schema
```python
from pydantic import BaseModel
from typing import List, Dict, Optional

class ComplianceCheck(BaseModel):
    rule: str
    status: str # "pass", "fail", "warning"
    detail: str
    fix_suggestion: str

class PlatformCompliance(BaseModel):
    platform: str
    overall_status: str
    checks: List[ComplianceCheck]

class ComplianceResult(BaseModel):
    scan_id: str
    platforms: Dict[str, PlatformCompliance]
    compliance_score: int
    music_alternatives: Optional[List[str]]
    content_category: str
```

## 5. Tools
- `check_ftc_disclosure(description, tags)`: Verify presence of clear FTC disclosures (e.g., #ad, #sponsored) if `brand_deal_active` is True.
- `scan_copyright(audio_info)`: Mock check for copyrighted music.
- `check_platform_rules(platform, content_metadata)`: Engine to check platform rules.
- `classify_content(title, description)`: Uses Gemma to classify content type.
- `suggest_music_alternatives(copyrighted_track)`: Uses Lyria API to generate royalty-free alternatives if copyright fails.

## 6. FTC Rules Engine
- **Check**: Must contain "#ad" or "#sponsored" in the first 3 lines of description.
- **Check**: Cannot bury disclosure in a sea of tags.

## 7. Platform Rules
- **YouTube**: Checks against restricted content keywords, spammy tags.
- **Instagram**: Checks for "Paid partnership" requirement alignment based on description text.

## 8. Gemma Integration
- Uses Gemma model (local or via API) for lightweight, fast text classification: `classify_content` categorizes the input as review, tutorial, vlog, etc.

## 9. Lyria Integration
- If `scan_copyright` returns a failure (e.g., "Detected Universal Music Group Track"), `suggest_music_alternatives` invokes Lyria to generate 3 alternative background tracks matching the original tempo/mood.

## 10. Code Skeleton
```python
class ContentComplianceAgent:
    def __init__(self, gemini_client, gemma_client, lyria_client):
        self.llm = gemini_client
        self.classifier = gemma_client
        self.audio_gen = lyria_client

    def scan_content(self, input_data: ComplianceInput) -> ComplianceResult:
        pass

    def check_ftc_disclosure(self, description: str, tags: list) -> list:
        pass

    def scan_copyright(self, audio_info: dict) -> dict:
        pass

    def check_platform_rules(self, platform: str, metadata: dict) -> list:
        pass

    def classify_content(self, title: str, description: str) -> str:
        pass

    def suggest_music_alternatives(self, track_info: str) -> list:
        pass
```

## 11. Example Scan
**Input**: YouTube tech review with active brand deal, but description only says "Thanks to brand for sending this".

**Output**:
```json
{
  "scan_id": "scan_456",
  "compliance_score": 40,
  "content_category": "tech_review",
  "platforms": {
    "youtube": {
      "platform": "youtube",
      "overall_status": "fail",
      "checks": [
        {
          "rule": "FTC Disclosure",
          "status": "fail",
          "detail": "Missing clear #ad or #sponsored tag.",
          "fix_suggestion": "Add #ad to the first line of your description."
        }
      ]
    }
  }
}
```
