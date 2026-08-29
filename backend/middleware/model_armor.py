import re
import hashlib
import logging
from typing import Dict, Any, Tuple, Optional
from datetime import datetime, timezone
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from ..services.firestore_client import save_document

logger = logging.getLogger(__name__)

ARMOR_LOGS_COLLECTION = "armor_logs"

# Comprehensive prompt injection & jailbreak detection patterns
PROMPT_INJECTION_PATTERNS = [
    (r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions", "Instruction Reset Attack"),
    (r"disregard\s+(all\s+)?(previous|prior)\s+rules", "Rule Disregard Attack"),
    (r"you\s+are\s+now\s+(an?\s+)?(unrestricted|jailbroken|dan|evil|god)", "Roleplay Jailbreak"),
    (r"system\s*prompt\s*:\s*", "System Prompt Extraction"),
    (r"reveal\s+your\s+(initial|secret|system)\s+instructions", "System Prompt Leak Attempt"),
    (r"output\s+the\s+exact\s+prompt\s+above", "Prompt Extraction Attack"),
    (r"sudo\s+mode|developer\s+mode\s+enabled", "Privilege Escalation Signature"),
    (r"<script[\s\S]*?>[\s\S]*?<\/script>", "XSS Injection"),
    (r"(DROP|TRUNCATE|DELETE)\s+TABLE", "SQL Injection Signature"),
    (r"DAN\s+Mode|Do\s+Anything\s+Now", "Classic DAN Jailbreak"),
    (r"bypass\s+(safety|content)\s+filters", "Filter Bypass Attempt"),
    (r"base64\s+decode\s+and\s+execute", "Encoded Payload Attack")
]

PII_PATTERNS = [
    (r"\b\d{3}-\d{2}-\d{4}\b", "Social Security Number (SSN)"),
    (r"\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b", "Credit Card Number"),
]


def screen_text_input(text: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Screen input string against prompt injection and critical PII.
    Returns: (is_safe, violation_category, matched_pattern_name)
    """
    if not text or not isinstance(text, str):
        return True, None, None

    # Check for Prompt Injection
    for pattern, name in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return False, "prompt_injection", name

    # Check for PII Leak in raw input
    for pattern, name in PII_PATTERNS:
        if re.search(pattern, text):
            return False, "pii_violation", name

    return True, None, None


def screen_text_output(text: str) -> Tuple[bool, str, Optional[str]]:
    """
    Screen agent generated output to redact accidental PII leaks.
    Returns: (is_safe, sanitized_text, violation_note)
    """
    if not text or not isinstance(text, str):
        return True, text, None

    sanitized = text
    violation = None

    for pattern, name in PII_PATTERNS:
        if re.search(pattern, sanitized):
            sanitized = re.sub(pattern, "[REDACTED_BY_MODEL_ARMOR]", sanitized)
            violation = f"Redacted {name}"

    return True, sanitized, violation


async def log_armor_event(event_type: str, violation: str, detail: str, payload_sample: str, client_ip: str = "internal") -> Dict[str, Any]:
    """Persist Model Armor security events to Firestore audit log."""
    prompt_hash = hashlib.sha256(payload_sample.encode("utf-8")).hexdigest()[:16]
    doc_id = f"armor_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{prompt_hash}"
    
    event_data = {
        "event_type": event_type,
        "violation": violation,
        "detail": detail,
        "prompt_hash": prompt_hash,
        "snippet": payload_sample[:120] if payload_sample else "",
        "client_ip": client_ip,
        "action_taken": "BLOCKED" if event_type == "input_blocked" else "SANITIZED",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    await save_document(ARMOR_LOGS_COLLECTION, doc_id, event_data)
    logger.warning(f"🛡️ Model Armor intercepted: {violation} ({detail}) from {client_ip}")
    return event_data


class ModelArmorMiddleware(BaseHTTPMiddleware):
    """FastAPI Middleware that inspects incoming requests and screens for safety violations."""
    async def dispatch(self, request: Request, call_next):
        # Exclude static/health routes
        if request.url.path in ["/health", "/docs", "/openapi.json", "/"]:
            return await call_next(request)

        # Intercept string query parameters
        for key, value in request.query_params.items():
            is_safe, violation, name = screen_text_input(value)
            if not is_safe:
                await log_armor_event(
                    event_type="input_blocked",
                    violation=violation or "unknown",
                    detail=f"Query Param '{key}' matched {name}",
                    payload_sample=value,
                    client_ip=request.client.host if request.client else "unknown"
                )
                return JSONResponse(
                    status_code=403,
                    content={
                        "error": "Security violation intercepted by Model Armor",
                        "code": "MODEL_ARMOR_BLOCKED",
                        "category": violation,
                        "rule": name,
                        "message": "Input was rejected because it violates enterprise security policies."
                    }
                )

        response = await call_next(request)
        return response
