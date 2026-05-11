# Sprint 5: Integration Guide

## End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPTURE FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. iOS Shortcut / Postman / curl                             │
│     ↓                                                           │
│  2. FastAPI POST /api/capture/youtube                          │
│     - Receives: url, title, transcript (optional), id          │
│     - Creates VideoCapture node in Neo4j                       │
│     - Responds immediately with capture ID                     │
│     ↓                                                           │
│  3. FastAPI sends async webhook to n8n                         │
│     POST http://localhost:5678/webhook/youtube-capture         │
│     Payload: { url, title, transcript, id }                   │
│     ↓                                                           │
│  4. n8n Webhook Trigger receives POST                          │
│     ↓                                                           │
│  5. n8n Workflow executes (see N8N_SETUP_GUIDE.md)            │
│     a) Extract payload & validate YouTube URL                  │
│     b) Fetch YouTube metadata (author, thumbnail)              │
│     c) Check if transcript provided                            │
│     d) Summarize transcript with GPT-4                         │
│     e) Extract 3-5 action items with GPT-4                     │
│     f) Create Obsidian markdown note                           │
│     g) Write note to /Captures/YouTube/YYYY-MM-DD-videoId.md   │
│     h) Update Neo4j VideoCapture node with processed data      │
│     ↓                                                           │
│  6. n8n responds with success + filepath to FastAPI            │
│     ↓                                                           │
│  7. End state:                                                 │
│     ✓ Obsidian vault updated with processed YouTube notes      │
│     ✓ Neo4j graph updated with summaries and tasks             │
│     ✓ FastAPI recorded successful webhook delivery             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## File Locations

```
Project Root (/home/user/Obsidian/)
├── backend/                          # FastAPI application
│   ├── app/main.py                  # Webhook endpoints
│   ├── app/models/schemas.py        # Request/response models
│   ├── app/services/neo4j.py        # Neo4j client
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
│
├── n8n/                              # n8n workflows
│   └── youtube-processor-workflow.json
│
├── Captures/                         # Obsidian capture folders
│   ├── YouTube/                     # YouTube videos
│   ├── VoiceMemos/                  # Voice transcriptions
│   ├── Chat/                        # Chat messages
│   └── Social/                      # Social media posts
│
├── SPRINT_5_N8N_YOUTUBE_PROCESSOR.md    # Architecture & spec
├── N8N_SETUP_GUIDE.md                   # Step-by-step n8n setup
└── SPRINT_5_INTEGRATION_GUIDE.md        # This file
```

## API Integration Points

### FastAPI → n8n Webhook

**FastAPI sends POST request after creating Neo4j node:**

```python
# In backend/app/main.py @app.post("/api/capture/youtube")
async def capture_youtube(request: YouTubeShareRequest):
    # 1. Create VideoCapture node in Neo4j
    video_node = await neo4j_service.create_video_capture_node(...)
    
    # 2. Immediately return to client
    response = {
        "id": video_node["id"],
        "status": "processing",
        "message": "Video capture recorded, processing in background"
    }
    
    # 3. Trigger n8n async webhook (fire and forget)
    asyncio.create_task(
        httpx.post(
            os.getenv("N8N_WEBHOOK_URL"),
            json={
                "url": request.url,
                "title": request.title,
                "transcript": request.transcript,
                "id": video_node["id"]
            }
        )
    )
    
    return response
```

**Environment variable configuration:**

```bash
# In backend/.env
N8N_WEBHOOK_URL=http://host.docker.internal:5678/webhook/youtube-capture
# or for external n8n:
N8N_WEBHOOK_URL=http://192.168.1.100:5678/webhook/youtube-capture
```

## Neo4j Integration

### Node Structure

VideoCapture node created by FastAPI:
```cypher
CREATE (v:VideoCapture {
  id: "capture-123",
  url: "https://youtube.com/watch?v=...",
  title: "Video Title",
  source: "youtube",
  transcript: null,  // provided by iOS or will be transcribed
  created_at: datetime(),
  processed: false
})
```

Updated by n8n workflow:
```cypher
MATCH (v:VideoCapture {id: "capture-123"})
SET 
  v.processed = true,
  v.processed_at = datetime(),
  v.summary = "2-3 sentence summary",
  v.transcript = "Full transcript text",
  v.tasks = ["Task 1", "Task 2", "Task 3"],
  v.obsidian_file = "Captures/YouTube/2026-05-11-abc123.md"
RETURN v
```

### Querying Recent Captures

```cypher
# Get last 10 YouTube videos processed
MATCH (v:VideoCapture {source: "youtube", processed: true})
RETURN v
ORDER BY v.processed_at DESC
LIMIT 10

# Get videos with extracted tasks
MATCH (v:VideoCapture {processed: true})
WHERE v.tasks IS NOT NULL
RETURN v.title, v.tasks, v.processed_at
```

## Obsidian Note Structure

Created by n8n in `/Captures/YouTube/YYYY-MM-DD-{videoId}.md`:

```markdown
# Video Title

**Source:** [Watch on YouTube](https://youtube.com/watch?v=...)
**Author:** Creator Name
**Date:** 2026-05-11

## Summary
2-3 sentence summary of the video content...

## Transcript
Full video transcript or auto-transcribed audio...

## Action Items
- Action item 1
- Action item 2
- Action item 3
- Action item 4
- Action item 5

## Metadata
- Video ID: abc123
- Captured: 2026-05-11T12:00:00Z
- Tags: #youtube #video #captured
```

## Testing Checklist

- [ ] FastAPI backend running: `docker-compose up -d` in `backend/`
- [ ] n8n running on home PC: `http://localhost:5678`
- [ ] Neo4j running in Docker with correct password
- [ ] OpenAI API key configured in n8n credentials
- [ ] Obsidian vault path exists and is writable
- [ ] n8n YouTube workflow imported and active
- [ ] Webhook URL matches between FastAPI `.env` and n8n webhook node

### Test with curl:

```bash
# Test 1: Send YouTube capture to FastAPI
curl -X POST http://localhost:8000/api/capture/youtube \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "Never Gonna Give You Up",
    "transcript": "We are no strangers to love. You know the rules...",
    "id": "test-001"
  }'

# Expected response:
# {
#   "id": "test-001",
#   "status": "processing",
#   "message": "Video capture recorded, processing in background"
# }

# Test 2: Check n8n execution
# - Go to http://localhost:5678
# - View Executions tab
# - Verify YouTube Processor workflow completed all nodes

# Test 3: Check Obsidian vault
# - Open /Captures/YouTube/ folder
# - Should see new markdown file created

# Test 4: Check Neo4j update
# - Open http://localhost:7474/
# - Run query: MATCH (v:VideoCapture {id: "test-001"}) RETURN v
# - Verify 'processed' = true, 'summary' and 'tasks' populated
```

## Troubleshooting Scenarios

### Scenario 1: n8n webhook not triggered
**Symptom:** FastAPI responds successfully, but n8n shows no execution

**Diagnosis:**
1. Check FastAPI webhook URL matches n8n webhook path
2. Verify network connectivity: `curl http://localhost:5678/webhook/youtube-capture`
3. Check n8n service logs

**Solution:**
```bash
# Test webhook connectivity from FastAPI container
docker exec pca-capture-api curl http://host.docker.internal:5678/webhook/youtube-capture

# Or if external n8n on home PC:
docker exec pca-capture-api curl http://192.168.1.X:5678/webhook/youtube-capture
```

### Scenario 2: OpenAI API errors in n8n
**Symptom:** Summarize/Extract nodes fail with "401 Unauthorized"

**Diagnosis:**
1. OpenAI credential not configured
2. API key invalid or expired

**Solution:**
1. Go to n8n **Settings → Credentials**
2. Verify "OpenAI - Default" credential has valid key
3. Test with: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

### Scenario 3: Obsidian file not created
**Symptom:** Neo4j shows processed but no markdown file in vault

**Diagnosis:**
1. Obsidian vault path incorrect
2. Directory permissions issue
3. Write Binary File node misconfigured

**Solution:**
```bash
# Check vault path exists and is writable
ls -la /home/user/Obsidian/Captures/YouTube/

# Add write permissions if needed
chmod -R 755 /home/user/Obsidian/Captures/

# Manually test file creation
echo "# Test" > /home/user/Obsidian/Captures/YouTube/test.md
```

### Scenario 4: Neo4j update fails
**Symptom:** Workflow executes but Neo4j node not updated

**Diagnosis:**
1. VideoCapture node doesn't exist
2. Neo4j credentials wrong
3. Cypher query syntax error

**Solution:**
```bash
# Verify node exists
curl -X POST http://localhost:7474/db/neo4j/tx/commit \
  -H "Authorization: Basic $(echo -n 'neo4j:PCAPassword123!' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "statements": [{
      "statement": "MATCH (v:VideoCapture {id: \"test-001\"}) RETURN v"
    }]
  }'
```

## Performance Considerations

- **Transcript summarization:** ~2-3 seconds for 10min video (GPT-4)
- **Task extraction:** ~1-2 seconds (GPT-4)
- **Obsidian file write:** <1 second (local file system)
- **Neo4j update:** <500ms (local database)
- **Total workflow time:** ~5-10 seconds per video

### Cost per capture:
- GPT-4 summarization: ~$0.03
- Task extraction: ~$0.02
- **Total:** ~$0.05 per YouTube video processed

## Next Sprint (Sprint 6)

Voice Memo Processor will be similar but with key differences:
1. **Audio transcription** via OpenAI Whisper (~$0.006/minute)
2. **Summary extraction** from transcribed text
3. **Task parsing** from audio content
4. **Obsidian sync** to `/Captures/VoiceMemos/`
5. **Neo4j VoiceMemoCapture** node type

Architecture will be identical; only the input processing changes.
