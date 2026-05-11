# Sprint 5: n8n YouTube Processor Workflow

**Goal:** Build the n8n workflow that processes YouTube captures from the FastAPI webhook, transcribes/summarizes, extracts tasks, and syncs to Obsidian + Neo4j.

## Architecture

```
FastAPI /api/capture/youtube 
  ↓ (async webhook)
n8n Webhook Trigger
  ↓
Extract Payload
  ↓
Fetch YouTube Metadata
  ↓
Transcribe (if needed)
  ↓
Summarize with GPT
  ↓
Extract Tasks
  ↓
Create Obsidian Note
  ↓
Update Neo4j
  ↓
Return Confirmation to FastAPI
```

## Workflow Steps

### 1. Webhook Trigger
- **Node Type:** Webhook
- **Listen Path:** `/webhook/youtube-capture`
- **Method:** POST
- **Auto-respond:** YES

### 2. Extract Payload
- **Node Type:** Code
- Input:
  ```json
  {
    "url": "string",
    "title": "string",
    "transcript": "string|null",
    "id": "string"
  }
  ```
- Extract video ID from URL: `https://youtube.com/watch?v={videoId}`
- Pass to next nodes

### 3. Fetch YouTube Metadata (Optional)
- **Node Type:** HTTP Request
- **URL:** `https://www.youtube.com/oembed?url={url}&format=json`
- Extract: title, author, thumbnail_url, duration
- Fallback to webhook payload if this fails

### 4. Transcribe (Conditional)
- **Node Type:** If (check if transcript exists)
  - **YES:** Skip to step 5
  - **NO:** Call Whisper API to transcribe
    - Use OpenAI Whisper if audio available
    - Or extract transcript from YouTube captions
- Return transcript text

### 5. Summarize with GPT
- **Node Type:** OpenAI ChatCompletion
- **Model:** gpt-4
- **Prompt:** 
  ```
  Summarize this YouTube video transcript in 2-3 sentences.
  
  Transcript: {transcript}
  ```
- Return: summary

### 6. Extract Tasks/Action Items
- **Node Type:** OpenAI ChatCompletion
- **Model:** gpt-4
- **Prompt:**
  ```
  Extract 3-5 key action items or tasks from this content. 
  Format as bullet points.
  
  Title: {title}
  Summary: {summary}
  ```
- Return: task_list array

### 7. Create Obsidian Note
- **Node Type:** File System Write / HTTP Request to Obsidian API
- **Path:** `/Captures/YouTube/{date}-{videoId}.md`
- **Content:**
  ```markdown
  # {title}
  
  **Source:** [{url}]({url})
  **Author:** {author}
  **Date:** {capture_date}
  **Duration:** {duration}
  
  ## Thumbnail
  ![thumbnail]({thumbnail_url})
  
  ## Summary
  {summary}
  
  ## Transcript
  {transcript}
  
  ## Action Items
  {task_list}
  
  ## Tags
  #youtube #video #captured
  ```

### 8. Update Neo4j
- **Node Type:** HTTP Request to Neo4j
- **Query (Cypher):**
  ```cypher
  MATCH (v:VideoCapture {id: $id})
  SET 
    v.summary = $summary,
    v.transcript = $transcript,
    v.tasks = $tasks,
    v.processed = true,
    v.obsidian_file = $obsidian_file,
    v.processed_at = datetime()
  RETURN v
  ```

### 9. Return Confirmation
- **Node Type:** HTTP Response
- Return success status back to FastAPI

## Environment Variables

In n8n, set these credentials/variables:
```
OPENAI_API_KEY = sk-...
NEO4J_URI = bolt://localhost:7687
NEO4J_USERNAME = neo4j
NEO4J_PASSWORD = [from .env]
OBSIDIAN_VAULT_PATH = /path/to/vault
```

## Testing

Once deployed, test with:
```bash
curl -X POST http://localhost:8000/api/capture/youtube \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "Test Video",
    "transcript": null
  }'
```

Then verify:
1. n8n logs show workflow executed
2. Obsidian note created in `/Captures/YouTube/`
3. Neo4j node updated with processed data

## Dependencies

- OpenAI API key (for gpt-4, Whisper)
- Neo4j running and accessible
- Obsidian vault path accessible from n8n machine
- YouTube metadata API access (public)

## Notes

- Transcript can be provided by iOS Shortcut or extracted via YouTube API captions
- If no transcript, Whisper will transcribe audio (slower, ~$0.02 per minute)
- Tasks are extracted from content, not requiring separate ML model
- All timestamps use ISO 8601 format for Neo4j compatibility
