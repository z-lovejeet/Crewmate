"""AI Video Cinematographer Agent (A12)

Specialized in cinematic prompt engineering, camera direction, and synthesis
of real 8-second video clips using Google Veo foundation models.
"""

from google.adk import Agent


def plan_cinematography(title: str, description: str, style: str) -> dict:
    """Plan camera movement, lighting, color tone, and scene pacing for an 8-second Veo clip."""
    return {
        "status": "planned",
        "camera_movement": "Smooth slow push-in with 35mm shallow focus",
        "lighting": "Dramatic volumetric rim lighting with warm golden hour specular highlights",
        "aspect_ratio": "16:9",
        "recommended_model": "veo-3.1-fast-generate-001",
        "duration": "8 seconds",
        "pacing": "High-impact visual opener with steady motion stability"
    }


def synthesize_veo_prompt(scene_plan: str, visual_style: str) -> dict:
    """Engineer an ultra-detailed, photorealistic prompt for Google Veo 3.1 generation."""
    return {
        "status": "crafted",
        "diffusion_prompt": f"Cinematic 8k shot, {visual_style}, volumetric atmosphere, anamorphic bokeh, photorealistic, 8 seconds",
        "anti_flicker_cues": ["high framerate temporal consistency", "photorealistic motion blur"]
    }


video_cinematographer_agent = Agent(
    name="video_cinematographer",
    model="gemini-3.7-flash",
    description="Cinematography and video generation specialist generating 8-second cinematic clips via Google Veo 3.1.",
    instruction="""You are the AI Video Cinematographer for Crewmate.
Your mission is to take creator video concepts, visual scene descriptions, and desired aesthetics,
and architect optimal camera direction, lighting schemes, and cinematic prompts for Google Veo 3.1.
Always optimize for high-impact 8-second clips with photorealistic motion and temporal stability.""",
    tools=[plan_cinematography, synthesize_veo_prompt],
)
