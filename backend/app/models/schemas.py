from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Capture Request Schemas
class YouTubeShareRequest(BaseModel):
    url: str
    title: Optional[str] = None
    transcript: Optional[str] = None
    thumbnail_url: Optional[str] = None


class VoiceMemoRequest(BaseModel):
    audio_base64: str
    duration: int  # seconds
    filename: Optional[str] = None


class ChatRequest(BaseModel):
    text: str
    platform: str  # "messages", "whatsapp", "telegram", etc.
    author: Optional[str] = None
    timestamp: Optional[str] = None


class SocialRequest(BaseModel):
    text: str
    source: str  # "twitter", "reddit", "facebook", "instagram", etc.
    url: Optional[str] = None
    author: Optional[str] = None
    engagement: Optional[dict] = None  # likes, retweets, etc.


# Response Schemas
class CaptureResponse(BaseModel):
    id: str
    source_type: str
    obsidian_file: str
    tasks: List[str]
    status: str = "processing"
    n8n_workflow_triggered: bool = True


class WebhookNotification(BaseModel):
    event_type: str  # "capture_received", "conflict_detected", etc.
    capture_id: str
    data: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# Neo4j Node Models (for reference)
class TaskNode(BaseModel):
    id: str
    text: str
    project: Optional[str] = None
    tags: List[str] = []
    contexts: List[str] = []
    confidence: float = 0.0
    source: str
    created_at: str
    ai_parsed: bool = False


class VideoCaptureNode(BaseModel):
    id: str
    youtube_url: str
    video_id: str
    title: str
    channel: Optional[str] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    extracted_tasks: List[str] = []
    captured_at: str
    source: str = "youtube"
    exported_to_obsidian: bool = False


class VoiceMemoCaptureNode(BaseModel):
    id: str
    transcript: str
    extracted_tasks: List[str] = []
    extracted_tags: List[str] = []
    extracted_contexts: List[str] = []
    captured_at: str
    source: str = "ios-voice-memo"
    duration_seconds: int
    exported_to_obsidian: bool = False
