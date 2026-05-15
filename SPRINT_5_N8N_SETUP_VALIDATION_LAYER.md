# Sprint 5: n8n Setup Guide — Validation Layer Workflow

**Goal:** Build the dual-agent validation workflow that scores YouTube captures across 4 dimensions and routes to Promote/Inbox/Archive.

## Prerequisites

1. n8n running locally or accessible (default: http://localhost:5678)
2. Anthropic Claude API key (for Sonnet + Haiku models)
3. Neo4j running with credentials from `.env`
4. Obsidian vault with `/Captures/YouTube/` folder created
5. FastAPI backend running with n8n webhook URL configured

**Cost estimate:** ~$0.012-0.018 CAD per video (~$44-330 CAD/year depending on volume)

## Step 1: Create/Verify Credentials

### Anthropic Claude Credential
1. **Settings → Credentials → New**
2. **Choose:** Anthropic
3. **API Key:** Your Anthropic API key
4. **Save as:** "Anthropic - Claude"

### Neo4j Credential
1. **Settings → Credentials → New**
2. **Choose:** HTTP Basic Auth
3. **Username:** `neo4j`
4. **Password:** from `.env`
5. **Save as:** "Neo4j - Local"

## Step 2: Create the Workflow

### 1. Webhook Trigger
- Path: `youtube-validation`
- Method: POST
- Response Mode: On Received

### 2. Deduplication Check
Purpose: prevent re-processing the same video.

POST to Neo4j:
```json
{
  "statements": [
    {
      "statement": "MATCH (v:VideoCapture {url: $url}) WHERE v.validated = true RETURN v.id as id, v.routing as routing, v.overall_score as score",
      "parameters": {"url": "{{$input.first().json.url}}"}
    }
  ]
}
```

### 2.5. Summarize Video
```javascript
const payload = $input.first().json;
const transcript = payload.transcript || '';
const summary = transcript.length > 2000
  ? transcript.substring(0, 2000) + "\n[...transcript truncated for length...]"
  : transcript;

return {
  video_title: payload.title,
  video_url: payload.url,
  summary,
  full_transcript: transcript,
  video_id: payload.id,
  captured_at: new Date().toISOString()
};
```

### 3. Screening Agent Assessment
- Node: Anthropic
- Model: `claude-sonnet-4-20250514`
- Temperature: `0.3`
- Max tokens: `500`

Return JSON with:
```json
{
  "credibility_score": 0,
  "quality_score": 0,
  "relevance_score": 0,
  "alignment_score": 0,
  "reasoning": {
    "credibility": "",
    "quality": "",
    "relevance": "",
    "alignment": ""
  }
}
```

### 4. Critical Agent Assessment
- Node: Anthropic
- Model: `claude-3-5-haiku-20241022`
- Temperature: `0.8`
- Max tokens: `500`

Same JSON structure as Screening Agent.

### 5. Compare Assessments
```javascript
const screening = $node["Screening Agent Assessment"].json;
const critical = $node["Critical Agent Assessment"].json;
const RELEVANCE_FLOOR = 60;

const credibility_diff = Math.abs(screening.credibility_score - critical.credibility_score);
const quality_diff = Math.abs(screening.quality_score - critical.quality_score);
const relevance_diff = Math.abs(screening.relevance_score - critical.relevance_score);
const alignment_diff = Math.abs(screening.alignment_score - critical.alignment_score);

const credibility_agree = credibility_diff < 15;
const quality_agree = quality_diff < 15;
const relevance_agree = relevance_diff < 15;
const alignment_agree = alignment_diff < 15;
const agents_agree = credibility_agree && quality_agree && relevance_agree && alignment_agree;
const agreement_count = [credibility_agree, quality_agree, relevance_agree, alignment_agree].filter(x => x).length;

const composite_credibility = (screening.credibility_score + critical.credibility_score) / 2;
const composite_quality = (screening.quality_score + critical.quality_score) / 2;
const composite_relevance = (screening.relevance_score + critical.relevance_score) / 2;
const composite_alignment = (screening.alignment_score + critical.alignment_score) / 2;

const relevance_passes_floor = composite_relevance >= RELEVANCE_FLOOR;
const floor_violation = !relevance_passes_floor;
const overall_score = (composite_credibility + composite_quality + composite_relevance + composite_alignment) / 4;

let confidence_score;
if (agents_agree) confidence_score = 95;
else if (agreement_count === 3) confidence_score = 70;
else if (agreement_count === 2) confidence_score = 40;
else confidence_score = 20;

let routing;
if (overall_score > 80 && relevance_passes_floor) routing = "PROMOTE";
else if (floor_violation) routing = "INBOX";
else if (overall_score >= 60) routing = "INBOX";
else routing = "ARCHIVE";

return {
  agents_agree,
  agreement_count,
  confidence_score,
  overall_score: Math.round(overall_score * 10) / 10,
  routing,
  floor_violation
};
```

### 6. Create Obsidian Validation Note
Create a validation report in `Captures/YouTube/{date}-{video_id}-validation.md` with scores, reasoning, routing, and metadata.

### 7. Write to Obsidian
Write the markdown note to your vault path.

### 8. Update Neo4j
Update the `VideoCapture` node with agent-specific scores, composite scores, routing, confidence, floor violation, and Obsidian file pointer.

### 9. Respond to Webhook
Return status, validation results, Obsidian file, and whether manual review is required.

## Node Order

1. Webhook → Deduplication Check
2. Deduplication Check → Summarize Video if no match
3. Summarize Video → Screening Agent
4. Screening Agent → Critical Agent
5. Critical Agent → Compare Assessments
6. Compare Assessments → Create Validation Note
7. Create Validation Note → Write to Obsidian
8. Create Validation Note → Update Neo4j
9. Update Neo4j → Respond to Webhook

## Troubleshooting

- Invalid JSON: tighten the system prompt to require JSON only.
- Agents always agree: increase Critical Agent temperature or decrease Screening temperature.
- File write fails: verify vault path and permissions.
- Neo4j fails: verify credentials and service availability.
- Dedup returns empty: normal on first ingestion.

## Manual Review Process

When `agents_agree = false`:
1. Open the Obsidian note.
2. Read both agent assessments.
3. Decide PROMOTE, INBOX, or ARCHIVE.
4. Move note accordingly.
5. Use the decision as feedback for Phase 2.
