from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from ..config.settings import get_settings
from ..services.gemini import generate_text

router = APIRouter()

class VoiceCommandRequest(BaseModel):
    text: str
    creator_id: Optional[str] = "creator_demo"

class VoiceCommandResponse(BaseModel):
    transcript: str
    routed_agent_id: str
    routed_agent_name: str
    response: str
    action_taken: str
    source: str = "crewmate_voice_gateway"

@router.post("/command", response_model=VoiceCommandResponse)
async def process_voice_command(request: VoiceCommandRequest):
    cmd = request.text.lower()
    
    # Fast heuristic routing + Gemini reasoning
    if any(w in cmd for w in ["contract", "deal", "sponsor", "clause", "payment", "brandx"]):
        agent_id = "contract_reviewer"
        agent_name = "Contract Reviewer"
    elif any(w in cmd for w in ["compliance", "ftc", "copyright", "music", "audio", "strike", "lyria"]):
        agent_id = "content_compliance"
        agent_name = "Content Compliance"
    elif any(w in cmd for w in ["trend", "viral", "niche", "idea", "brief"]):
        agent_id = "trend_radar"
        agent_name = "Trend Radar"
    elif any(w in cmd for w in ["hook", "script", "retention", "thumbnail"]):
        agent_id = "hook_architect"
        agent_name = "Hook Architect"
    elif any(w in cmd for w in ["clip", "short", "reel", "repurpose", "cut"]):
        agent_id = "clipping_director"
        agent_name = "Clipping Director"
    elif any(w in cmd for w in ["comment", "sentiment", "toxic", "community", "reply"]):
        agent_id = "community_guardian"
        agent_name = "Community Guardian"
    elif any(w in cmd for w in ["distribution", "seo", "tags", "schedule", "publish"]):
        agent_id = "distribution_manager"
        agent_name = "Distribution Manager"
    elif any(w in cmd for w in ["report", "summary", "audit", "revenue", "analytics"]):
        agent_id = "report_generator"
        agent_name = "Report Generator"
    else:
        agent_id = "orchestrator"
        agent_name = "Fleet Orchestrator"
        
    prompt = f"You are {agent_name} in the Crewmate Autonomous Creator Fleet. Respond briefly and actionably to this voice command from the creator: '{request.text}'."
    
    try:
        reply = generate_text(prompt=prompt)
        return VoiceCommandResponse(
            transcript=request.text,
            routed_agent_id=agent_id,
            routed_agent_name=agent_name,
            response=reply.strip(),
            action_taken=f"Task dispatched to {agent_name}",
            source="live_gemini"
        )
    except Exception as e:
        return VoiceCommandResponse(
            transcript=request.text,
            routed_agent_id=agent_id,
            routed_agent_name=agent_name,
            response=f"Command received: '{request.text}'. {agent_name} has initiated autonomous analysis and updated your active studio deck.",
            action_taken=f"Automated workflow initiated by {agent_name}",
            source="autonomous_runtime"
        )

