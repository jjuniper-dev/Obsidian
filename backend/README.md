# PCA Capture — FastAPI Backend

Minimal FastAPI webhook receiver for iOS Shortcuts capture (YouTube, voice memo, chat, social).

## Quick Start

### Prerequisites

- Docker + Docker Compose
- OpenAI API key
- n8n running on home PC (default: http://localhost:5678)

### Setup

1. **Copy `.env.example` to `.env` and fill in values:**
   ```bash
   cp .env.example .env
   ```
   
   Required:
   - `OPENAI_API_KEY` — for n8n workflows
   - `NEO4J_PASSWORD` — any secure password
   - `N8N_WEBHOOK_URL` — where n8n is running (http://localhost:5678 default)

2. **Start services:**
   ```bash
   docker-compose up -d
   ```

   This starts:
   - FastAPI on http://localhost:8000
   - Neo4j on http://localhost:7474 (browser) / bolt://localhost:7687 (driver)

3. **Verify health:**
   ```bash
   curl http://localhost:8000/api/healthz
   ```
   
   Response:
   ```json
   {
     "status": "ok",
     "service": "pca-capture-api",
     "neo4j": "healthy",
     "timestamp": "2026-05-11T12:00:00"
   }
   ```

## API Endpoints

### YouTube Share
```
POST /api/capture/youtube
{
  "url": "https://youtube.com/watch?v=...",
  "title": "Video Title",
  "transcript": "Optional transcript text"
}
```

### Voice Memo
```
POST /api/capture/voice-memo
{
  "audio_base64": "base64-encoded audio",
  "duration": 45
}
```

### Chat
```
POST /api/capture/chat
{
  "text": "Message text",
  "platform": "messages",
  "author": "John Doe"
}
```

### Social
```
POST /api/capture/social
{
  "text": "Tweet text",
  "source": "twitter",
  "url": "https://twitter.com/...",
  "author": "@username"
}
```

## How It Works

1. iOS Shortcut sends data to FastAPI endpoint
2. FastAPI creates node in Neo4j
3. FastAPI sends webhook to n8n
4. n8n processes (transcribe, summarize, extract tasks)
5. n8n writes to Obsidian vault
6. n8n updates Neo4j with results

## Neo4j Browser

Access at http://localhost:7474

Credentials:
- Username: `neo4j`
- Password: (from `.env`)

Query recent captures:
```cypher
MATCH (n) WHERE n.source CONTAINS 'youtube' OR n.source CONTAINS 'voice-memo'
RETURN n
LIMIT 10
```

## Logs

```bash
docker-compose logs -f fastapi
docker-compose logs -f neo4j
```

## Development

Local development (without Docker):

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Next: Sprint 2

Create iOS Shortcuts to send data to these endpoints.
