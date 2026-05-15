import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from datetime import datetime
import uuid

from app.models.schemas import (
    YouTubeShareRequest, VoiceMemoRequest, ChatRequest, SocialRequest, CaptureResponse
)
from app.services.neo4j import get_neo4j_client, close_neo4j_client

# Initialize FastAPI app
app = FastAPI(
    title="PCA Capture API",
    description="Personal Cognitive Architecture - Capture Layer",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook")
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")


# Startup / Shutdown
@app.on_event("startup")
async def startup_event():
    """Initialize Neo4j connection on startup"""
    neo4j = get_neo4j_client(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
    if not neo4j.health_check():
        print("WARNING: Neo4j connection failed. Some features may not work.")


@app.on_event("shutdown")
async def shutdown_event():
    """Close Neo4j connection on shutdown"""
    close_neo4j_client()


# Health check
@app.get("/api/healthz")
async def health_check():
    """Health check endpoint"""
    neo4j = get_neo4j_client()
    db_healthy = neo4j.health_check()
    return {
        "status": "ok",
        "service": "pca-capture-api",
        "neo4j": "healthy" if db_healthy else "unhealthy",
        "timestamp": datetime.utcnow().isoformat()
    }


# YouTube Share Capture
@app.post("/api/capture/youtube")
async def capture_youtube(request: YouTubeShareRequest):
    """
    Receive YouTube video share from iOS Shortcut.
    Store in Neo4j, trigger n8n workflow.
    """
    try:
        capture_id = f"youtube-{uuid.uuid4().hex[:12]}"

        neo4j = get_neo4j_client()

        # Create VideoCapture node in Neo4j
        video_data = {
            "id": capture_id,
            "youtube_url": request.url,
            "video_id": request.url.split("v=")[-1] if "v=" in request.url else "",
            "title": request.title or "Untitled",
            "channel": None,
            "transcript": request.transcript,
            "summary": None,  # Will be filled by n8n
            "extracted_tasks": [],  # Will be filled by n8n
            "captured_at": datetime.utcnow().isoformat(),
            "source": "youtube",
            "exported_to_obsidian": False
        }

        neo4j.create_video_capture_node(video_data)

        # Trigger n8n workflow
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{N8N_WEBHOOK_URL}/youtube-processor",
                json={
                    "capture_id": capture_id,
                    "youtube_url": request.url,
                    "title": request.title,
                    "transcript": request.transcript,
                    "thumbnail_url": request.thumbnail_url
                },
                timeout=10.0
            )

        return CaptureResponse(
            id=capture_id,
            source_type="youtube",
            obsidian_file=f"/PCA Inbox/youtube-{capture_id}.md",
            tasks=[],  # Will be populated by n8n
            status="processing"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"YouTube capture failed: {str(e)}")


# Voice Memo Capture
@app.post("/api/capture/voice-memo")
async def capture_voice_memo(request: VoiceMemoRequest):
    """
    Receive voice memo from iOS Shortcut.
    Store in Neo4j, trigger n8n (Whisper transcription).
    """
    try:
        capture_id = f"voicememo-{uuid.uuid4().hex[:12]}"

        neo4j = get_neo4j_client()

        # Create VoiceMemoCapture node in Neo4j
        memo_data = {
            "id": capture_id,
            "transcript": "",  # Will be filled by Whisper via n8n
            "extracted_tasks": [],
            "extracted_tags": [],
            "extracted_contexts": [],
            "captured_at": datetime.utcnow().isoformat(),
            "source": "ios-voice-memo",
            "duration_seconds": request.duration,
            "exported_to_obsidian": False
        }

        neo4j.create_voice_memo_node(memo_data)

        # Trigger n8n workflow (Whisper transcription)
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{N8N_WEBHOOK_URL}/voice-memo-processor",
                json={
                    "capture_id": capture_id,
                    "audio_base64": request.audio_base64,
                    "duration": request.duration,
                    "filename": request.filename
                },
                timeout=10.0
            )

        return CaptureResponse(
            id=capture_id,
            source_type="voice_memo",
            obsidian_file=f"/PCA Inbox/voice-memo-{capture_id}.md",
            tasks=[],  # Will be populated by n8n
            status="processing"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice memo capture failed: {str(e)}")


# Chat Capture
@app.post("/api/capture/chat")
async def capture_chat(request: ChatRequest):
    """
    Receive chat/message from iOS Shortcut.
    Store in Neo4j, trigger n8n workflow.
    """
    try:
        capture_id = f"chat-{uuid.uuid4().hex[:12]}"

        neo4j = get_neo4j_client()

        # Create Task node in Neo4j
        task_data = {
            "id": capture_id,
            "text": request.text,
            "project": None,
            "tags": [],
            "contexts": [],
            "confidence": 0.0,
            "source": f"chat-{request.platform}",
            "created_at": datetime.utcnow().isoformat(),
            "ai_parsed": False
        }

        neo4j.create_task_node(task_data)

        # Trigger n8n workflow
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{N8N_WEBHOOK_URL}/chat-processor",
                json={
                    "capture_id": capture_id,
                    "text": request.text,
                    "platform": request.platform,
                    "author": request.author,
                    "timestamp": request.timestamp
                },
                timeout=10.0
            )

        return CaptureResponse(
            id=capture_id,
            source_type="chat",
            obsidian_file=f"/PCA Inbox/chat-{capture_id}.md",
            tasks=[],
            status="processing"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat capture failed: {str(e)}")


# Social Media Capture
@app.post("/api/capture/social")
async def capture_social(request: SocialRequest):
    """
    Receive social media share from iOS Shortcut.
    Store in Neo4j, trigger n8n workflow.
    """
    try:
        capture_id = f"social-{uuid.uuid4().hex[:12]}"

        neo4j = get_neo4j_client()

        # Create Task node in Neo4j
        task_data = {
            "id": capture_id,
            "text": request.text,
            "project": None,
            "tags": [],
            "contexts": [],
            "confidence": 0.0,
            "source": f"social-{request.source}",
            "created_at": datetime.utcnow().isoformat(),
            "ai_parsed": False
        }

        neo4j.create_task_node(task_data)

        # Trigger n8n workflow
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{N8N_WEBHOOK_URL}/social-processor",
                json={
                    "capture_id": capture_id,
                    "text": request.text,
                    "source": request.source,
                    "url": request.url,
                    "author": request.author,
                    "engagement": request.engagement
                },
                timeout=10.0
            )

        return CaptureResponse(
            id=capture_id,
            source_type="social",
            obsidian_file=f"/PCA Inbox/social-{request.source}-{capture_id}.md",
            tasks=[],
            status="processing"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Social capture failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
