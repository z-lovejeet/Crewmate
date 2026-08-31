import asyncio
import json
import logging
import os
import uuid
from typing import Dict, Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from ..services.gemini import generate_text, generate_video, check_video_operation, save_generated_video

logger = logging.getLogger("crewmate.videos")
router = APIRouter(prefix="/api/videos", tags=["Videos"])

# In-memory job store (sufficient for hackathon demo)
_jobs: Dict[str, dict] = {}

VIDEO_DIR = "/tmp/crewmate_videos"
os.makedirs(VIDEO_DIR, exist_ok=True)

# Available Veo models for user selection
VEO_MODELS = {
    "veo-3.1-fast": {
        "id": "veo-3.1-fast-generate-001",
        "name": "Veo 3.1 Fast",
        "quality": "Good",
        "speed": "~60-90s",
        "description": "Best balance of quality and speed",
    },
    "veo-3.1-lite": {
        "id": "veo-3.1-lite-generate-001",
        "name": "Veo 3.1 Lite",
        "quality": "Standard",
        "speed": "~30-60s",
        "description": "Fastest generation, lighter quality",
    },
    "veo-3.1": {
        "id": "veo-3.1-generate-001",
        "name": "Veo 3.1",
        "quality": "Highest",
        "speed": "~2-3 min",
        "description": "Maximum quality, cinematic output",
    },
    "veo-3.0-fast": {
        "id": "veo-3.0-fast-generate-001",
        "name": "Veo 3.0 Fast",
        "quality": "Good",
        "speed": "~60-90s",
        "description": "Previous generation, reliable",
    },
    "veo-3.0": {
        "id": "veo-3.0-generate-001",
        "name": "Veo 3.0",
        "quality": "High",
        "speed": "~2-3 min",
        "description": "Previous generation, high quality",
    },
    "veo-2.0": {
        "id": "veo-2.0-generate-001",
        "name": "Veo 2.0",
        "quality": "Good",
        "speed": "~1-2 min",
        "description": "Stable, well-tested model",
    },
}


class VideoGenerateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    style: Optional[str] = "cinematic"
    aspect_ratio: Optional[str] = "16:9"
    model_key: Optional[str] = "veo-3.1-fast"


class VideoGenerateResponse(BaseModel):
    job_id: str
    status: str
    model_name: str
    model_id: str
    estimated_time: str


class VideoStatusResponse(BaseModel):
    job_id: str
    status: str  # "processing" | "completed" | "failed"
    video_url: Optional[str] = None
    error: Optional[str] = None
    model_name: str = ""
    prompt_used: str = ""


@router.get("/models")
async def list_models():
    """List available Veo models for video generation."""
    return {"models": VEO_MODELS}


@router.post("/generate", response_model=VideoGenerateResponse)
async def start_video_generation(req: VideoGenerateRequest):
    """Start AI video generation using Veo.
    
    Pipeline:
    1. Gemini 3.7 Flash crafts a cinematic video generation prompt
    2. Selected Veo model generates a real 10-second video clip
    3. Returns job_id for polling status
    """
    logger.info(f"Video generation request: {req.title} (model={req.model_key})")

    # Resolve model
    model_info = VEO_MODELS.get(req.model_key, VEO_MODELS["veo-3.1-fast"])
    model_id = model_info["id"]

    # Step 1: LLM crafts cinematic video prompt
    llm_prompt = f"""You are an elite cinematographer and video director. Craft a detailed video generation prompt for an AI model (Google Veo).

Title: "{req.title}"
Description: "{req.description}"
Visual Style: "{req.style}"
Aspect Ratio: "{req.aspect_ratio}"

Create a single, highly detailed prompt for generating a 10-second video clip. Include:
- Specific camera movement (slow dolly in, aerial pan, tracking shot, steady close-up)
- Lighting description (golden hour, neon, dramatic volumetric, soft ambient)
- Subject positioning and action
- Atmosphere and mood (cinematic, energetic, serene, epic)
- Color palette and visual tone
- Resolution/quality cues (8K, cinematic, photorealistic, film grain)

The prompt should be 2-4 sentences, ultra-specific, and optimized for AI video generation.
Return ONLY the prompt text, nothing else."""

    try:
        crafted_prompt = generate_text(
            prompt=llm_prompt,
            system_instruction="You are a cinematography expert. Return only the video generation prompt, no explanations."
        )
        crafted_prompt = crafted_prompt.strip().strip('"').strip("'")
    except Exception as e:
        logger.warning(f"LLM prompt crafting failed: {e}, using fallback")
        crafted_prompt = f"Cinematic 8K video of {req.description or req.title}, {req.style} style, dramatic lighting, smooth camera movement, photorealistic, 10 seconds"

    logger.info(f"Crafted video prompt: {crafted_prompt[:100]}...")

    # Step 2: Start Veo generation
    try:
        operation = generate_video(
            prompt=crafted_prompt,
            model=model_id,
            aspect_ratio=req.aspect_ratio,
        )
    except Exception as e:
        logger.error(f"Veo generation failed to start: {e}")
        raise HTTPException(status_code=500, detail=f"Video generation failed to start: {str(e)}")

    # Step 3: Store job
    job_id = str(uuid.uuid4())[:8]
    _jobs[job_id] = {
        "operation_name": operation.name,
        "status": "processing",
        "model_id": model_id,
        "model_name": model_info["name"],
        "prompt": crafted_prompt,
        "title": req.title,
        "aspect_ratio": req.aspect_ratio,
        "video_path": None,
        "error": None,
    }

    logger.info(f"Job {job_id} started: operation={operation.name}")

    return VideoGenerateResponse(
        job_id=job_id,
        status="processing",
        model_name=model_info["name"],
        model_id=model_id,
        estimated_time=model_info["speed"],
    )


@router.get("/status/{job_id}", response_model=VideoStatusResponse)
async def check_video_status(job_id: str):
    """Poll video generation job status."""
    if job_id not in _jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = _jobs[job_id]

    if job["status"] == "completed":
        return VideoStatusResponse(
            job_id=job_id,
            status="completed",
            video_url=f"/api/videos/download/{job_id}",
            model_name=job["model_name"],
            prompt_used=job["prompt"],
        )

    if job["status"] == "failed":
        return VideoStatusResponse(
            job_id=job_id,
            status="failed",
            error=job.get("error", "Unknown error"),
            model_name=job["model_name"],
            prompt_used=job["prompt"],
        )

    # Poll Veo operation
    try:
        operation = check_video_operation(job["operation_name"])

        if operation.done:
            if operation.error:
                job["status"] = "failed"
                job["error"] = operation.error.get("message", "Video generation failed")
                logger.warning(f"Job {job_id} failed: {job['error']}")
                return VideoStatusResponse(
                    job_id=job_id,
                    status="failed",
                    error=job["error"],
                    model_name=job["model_name"],
                    prompt_used=job["prompt"],
                )

            # Save the video
            video_path = os.path.join(VIDEO_DIR, f"{job_id}.mp4")
            try:
                save_generated_video(operation, video_path)
                job["status"] = "completed"
                job["video_path"] = video_path
                logger.info(f"Job {job_id} completed: {video_path}")

                return VideoStatusResponse(
                    job_id=job_id,
                    status="completed",
                    video_url=f"/api/videos/download/{job_id}",
                    model_name=job["model_name"],
                    prompt_used=job["prompt"],
                )
            except Exception as e:
                job["status"] = "failed"
                job["error"] = str(e)
                return VideoStatusResponse(
                    job_id=job_id,
                    status="failed",
                    error=str(e),
                    model_name=job["model_name"],
                    prompt_used=job["prompt"],
                )

        return VideoStatusResponse(
            job_id=job_id,
            status="processing",
            model_name=job["model_name"],
            prompt_used=job["prompt"],
        )

    except Exception as e:
        logger.error(f"Status check failed for {job_id}: {e}")
        return VideoStatusResponse(
            job_id=job_id,
            status="processing",
            model_name=job["model_name"],
            prompt_used=job["prompt"],
        )


@router.get("/download/{job_id}")
async def download_video(job_id: str):
    """Download the generated video as MP4."""
    if job_id not in _jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = _jobs[job_id]
    video_path = job.get("video_path")

    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video file not found")

    clean_title = job.get("title", "video").lower()
    clean_title = "".join(c if c.isalnum() or c in "-_ " else "" for c in clean_title).strip().replace(" ", "-")[:40]

    return FileResponse(
        video_path,
        media_type="video/mp4",
        filename=f"{clean_title or 'crewmate-video'}.mp4",
    )
