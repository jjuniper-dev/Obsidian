# n8n YouTube Processor Setup Guide

## Prerequisites

1. **n8n running** on your home PC (default: http://localhost:5678)
2. **OpenAI API key** for GPT and Whisper models
3. **Neo4j** accessible from n8n machine (on same network or Docker bridge)
4. **Obsidian vault** path accessible from n8n machine
5. **FastAPI backend** running on your network

## Step 1: Create Webhook Credentials in n8n

1. Go to **Settings → Credentials**
2. Click **New**
3. Select **Webhook** (if it's a credential type) or skip if using built-in webhook node

## Step 2: Create OpenAI Credentials

1. **Settings → Credentials → New**
2. Choose **OpenAI**
3. Enter your OpenAI API key
4. Save as "OpenAI - Default"

## Step 3: Create Neo4j Connection

1. **Settings → Credentials → New**
2. Choose **HTTP Basic Auth** (for Neo4j Cypher endpoint)
3. Configure:
   - **Username:** `neo4j`
   - **Password:** (from your `.env`)
   - Save as "Neo4j - Local"

## Step 4: Build the Workflow in n8n UI

### Node 1: Webhook Trigger

1. **Add Node → Trigger → Webhook**
2. Configure:
   - **Path:** `youtube-capture`
   - **Method:** POST
   - **Response Mode:** On Received
   - **Auto-respond:** YES
3. Note the webhook URL (e.g., `http://localhost:5678/webhook/youtube-capture`)
4. Update FastAPI `.env`:
   ```
   N8N_WEBHOOK_URL=http://host.docker.internal:5678/webhook/youtube-capture
   ```

### Node 2: Extract Payload

1. **Add Node → Helpers → Code**
2. **Language:** JavaScript
3. **Code:**
   ```javascript
   // Extract and validate YouTube data
   const payload = $input.first().json;
   
   const videoIdMatch = payload.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
   const videoId = videoIdMatch ? videoIdMatch[1] : null;
   
   if (!videoId) {
     throw new Error('Invalid YouTube URL');
   }
   
   return {
     videoId,
     url: payload.url,
     title: payload.title,
     transcript: payload.transcript || null,
     id: payload.id,
     captureDate: new Date().toISOString()
   };
   ```

### Node 3: Fetch YouTube Metadata

1. **Add Node → Request → HTTP Request**
2. **Method:** GET
3. **URL:**
   ```
   https://www.youtube.com/oembed?url={{$node["Extract Payload"].json.url}}&format=json
   ```
4. **Options:**
   - **Send Query:** as URL Params
   - **Response Format:** JSON

### Node 4: Check Transcript Exists (Conditional)

1. **Add Node → Flow → IF**
2. **Condition:**
   - **Property:** `{{$node["Extract Payload"].json.transcript}}`
   - **Operation:** Is Not Empty
3. **True Path:** Skip to Summarize
4. **False Path:** Call Whisper (optional advanced step)

### Node 5: Summarize with GPT

1. **Add Node → AI/LLMs → OpenAI Chat**
2. **Model:** gpt-4
3. **Messages:**
   ```
   Role: User
   Content: "Summarize this YouTube video in 2-3 sentences.

   Title: {{$node["Extract Payload"].json.title}}

   Transcript:
   {{$node["Extract Payload"].json.transcript}}"
   ```
4. **Temperature:** 0.5

### Node 6: Extract Tasks

1. **Add Node → AI/LLMs → OpenAI Chat**
2. **Model:** gpt-4
3. **Messages:**
   ```
   Role: User
   Content: "Extract 3-5 action items from this content. Format as bullet points only.

   Title: {{$node["Extract Payload"].json.title}}

   Summary: {{$node["Summarize with GPT"].json.choices[0].message.content}}"
   ```
4. **Temperature:** 0.3

### Node 7: Prepare Obsidian Note

1. **Add Node → Helpers → Code**
2. **Language:** JavaScript
3. **Code:**
   ```javascript
   const payload = $node["Extract Payload"].json;
   const metadata = $node["Fetch YouTube Metadata"].json;
   const summary = $node["Summarize with GPT"].json.choices[0].message.content;
   const tasks = $node["Extract Tasks"].json.choices[0].message.content;
   
   const date = new Date();
   const dateStr = date.toISOString().split('T')[0];
   const filename = `${dateStr}-${payload.videoId}.md`;
   
   const markdownContent = `# ${payload.title}
   
   **Source:** [Watch on YouTube](${payload.url})
   **Author:** ${metadata.author_name || 'Unknown'}
   **Date:** ${new Date(payload.captureDate).toLocaleDateString()}
   
   ## Summary
   ${summary}
   
   ## Transcript
   ${payload.transcript || '(No transcript available)'}
   
   ## Action Items
   ${tasks}
   
   ## Metadata
   - Video ID: ${payload.videoId}
   - Captured: ${payload.captureDate}
   - Tags: #youtube #video #captured
   `;
   
   return {
     filename,
     filepath: `Captures/YouTube/${filename}`,
     content: markdownContent,
     videoId: payload.videoId,
     title: payload.title,
     summary,
     tasks,
     id: payload.id,
     captureDate: payload.captureDate
   };
   ```

### Node 8: Write to Obsidian Vault

1. **Add Node → Files → Write Binary File**
2. **File Path:**
   ```
   /path/to/vault/Captures/YouTube/{{$node["Prepare Obsidian Note"].json.filename}}
   ```
   Replace `/path/to/vault` with your actual vault path (e.g., `/Users/username/Obsidian`)
3. **File Content:**
   ```
   {{$node["Prepare Obsidian Note"].json.content}}
   ```
4. **Data Binary Property:** `data`

### Node 9: Update Neo4j

1. **Add Node → Request → HTTP Request**
2. **Method:** POST
3. **URL:** 
   ```
   http://localhost:7474/db/neo4j/tx/commit
   ```
4. **Authentication:** Basic Auth (Neo4j credentials)
5. **Headers:**
   ```
   Content-Type: application/json
   ```
6. **Body (JSON):**
   ```json
   {
     "statements": [
       {
         "statement": "MATCH (v:VideoCapture {id: $id}) SET v.summary = $summary, v.transcript = $transcript, v.tasks = $tasks, v.processed = true, v.obsidian_file = $obsidian_file, v.processed_at = datetime() RETURN v",
         "parameters": {
           "id": "{{$node['Prepare Obsidian Note'].json.id}}",
           "summary": "{{$node['Prepare Obsidian Note'].json.summary}}",
           "transcript": "{{$node['Extract Payload'].json.transcript}}",
           "tasks": "{{$node['Prepare Obsidian Note'].json.tasks}}",
           "obsidian_file": "{{$node['Prepare Obsidian Note'].json.filepath}}"
         }
       }
     ]
   }
   ```

### Node 10: Response

1. **Add Node → Request → Respond to Webhook**
2. **Response Code:** 200
3. **Response Data:**
   ```json
   {
     "status": "success",
     "message": "YouTube video processed",
     "obsidian_file": "{{$node['Prepare Obsidian Note'].json.filename}}",
     "processed_at": "{{$node['Prepare Obsidian Note'].json.captureDate}}"
   }
   ```

## Step 5: Set Environment Variables in n8n

1. **Settings → Environment Variables**
2. Add:
   ```
   NEO4J_URI=localhost:7687
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=PCAPassword123!
   OBSIDIAN_VAULT_PATH=/path/to/vault
   ```

## Step 6: Test the Workflow

### Create necessary Obsidian folders:
```bash
mkdir -p /path/to/vault/Captures/YouTube
```

### Test with curl:
```bash
curl -X POST http://localhost:8000/api/capture/youtube \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "Test Video",
    "transcript": "This is a test transcript for the workflow. It contains information about the video content.",
    "id": "test-001"
  }'
```

### Check results:
1. **n8n Execution History:** Should show all nodes completed
2. **Obsidian Vault:** Check `/Captures/YouTube/` for new markdown file
3. **Neo4j Browser:** Query `MATCH (v:VideoCapture {id: "test-001"}) RETURN v` to see updated node

## Troubleshooting

### "Invalid credential" error in OpenAI node
- Go to **Settings → Credentials**
- Verify OpenAI API key is correct
- Test with simple prompt first

### "File write failed" in Write Binary File node
- Verify Obsidian vault path exists and n8n process has write permissions
- Check path format (use absolute path, not relative)

### Neo4j update fails
- Verify Neo4j is running: `curl http://localhost:7474/browser/`
- Check credentials match `.env`
- Verify VideoCapture node exists in database

### Webhook not triggering
- Copy full webhook URL from Webhook node
- Ensure FastAPI's `N8N_WEBHOOK_URL` matches exactly
- Check n8n logs: `docker logs n8n` (if containerized)

## Next Steps

After testing Sprint 5 successfully:
- **Sprint 6:** Voice Memo Processor (similar architecture, uses audio transcription)
- **Sprint 7:** Chat/Social Processor (simpler, no transcription)
- **Sprint 8:** Conflict Detection & Resolution engine in n8n
- **Sprint 9:** Microsoft Teams integration for notifications
