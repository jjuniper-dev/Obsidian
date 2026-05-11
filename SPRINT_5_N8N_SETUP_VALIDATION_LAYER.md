# Sprint 5: n8n Setup Guide — Validation Layer Workflow

**Goal:** Build the dual-agent validation workflow that scores YouTube captures across 4 dimensions and routes to Promote/Inbox/Archive.

## Prerequisites

1. n8n running locally or accessible (default: http://localhost:5678)
2. OpenAI API key with GPT-4 access
3. Neo4j running with credentials from `.env`
4. Obsidian vault with `/Captures/YouTube/` folder created
5. FastAPI backend running with n8n webhook URL configured

## Step 1: Create/Verify Credentials

### OpenAI Credential
1. **Settings → Credentials → New**
2. **Choose:** OpenAI
3. **API Key:** Your OpenAI API key
4. **Save as:** "OpenAI - GPT4"

### Neo4j Credential (HTTP Basic Auth)
1. **Settings → Credentials → New**
2. **Choose:** HTTP Basic Auth
3. **Username:** `neo4j`
4. **Password:** (from `.env`)
5. **Save as:** "Neo4j - Local"

## Step 2: Create the Workflow

### 1️⃣ Webhook Trigger Node
1. **Add Node → Trigger → Webhook**
2. **Configuration:**
   - **Path:** `youtube-validation`
   - **Method:** POST
   - **Response Mode:** On Received
   - **Auto-respond:** YES
3. **Copy the webhook URL** (you'll update FastAPI `.env` with this)

### 2️⃣ Summarize Video Node
1. **Add Node → Helpers → Code**
2. **Language:** JavaScript
3. **Code:**
```javascript
// Prepare video data for validation assessment
const payload = $input.first().json;

// For very long transcripts, truncate to first 2000 chars
// to keep agent assessment focused
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

### 3️⃣ Screening Agent Assessment Node
1. **Add Node → AI/LLMs → OpenAI Chat**
2. **Credential:** "OpenAI - GPT4"
3. **Model:** gpt-4
4. **Temperature:** 0.5 (consistent assessment)
5. **System Message:**
```
You are a rigorous content validator assessing YouTube content across 4 dimensions.

Your task:
1. Evaluate Source Credibility (0-100): Is the creator trustworthy and authoritative?
2. Evaluate Content Quality (0-100): Is it well-researched, clear, and substantive?
3. Evaluate Relevance to Goals (0-100): How relevant is this to building Personal Cognitive Architecture, agentic systems, knowledge management?
4. Evaluate Value Alignment (0-100): Does it align with empirical rigor, transparency, human agency, ethics?

IMPORTANT: Return ONLY valid JSON. No other text.

Use this exact JSON structure:
{
  "credibility_score": <number 0-100>,
  "quality_score": <number 0-100>,
  "relevance_score": <number 0-100>,
  "alignment_score": <number 0-100>,
  "reasoning": {
    "credibility": "<1-2 sentence explanation>",
    "quality": "<1-2 sentence explanation>",
    "relevance": "<1-2 sentence explanation>",
    "alignment": "<1-2 sentence explanation>"
  }
}
```
6. **User Message:**
```
Assess this YouTube video:

**Title:** {{$node["Summarize Video"].json.video_title}}

**Content Summary:**
{{$node["Summarize Video"].json.summary}}

Evaluate and score across the 4 dimensions. Be rigorous but fair.
```

### 4️⃣ Critical Agent Assessment Node
1. **Add Node → AI/LLMs → OpenAI Chat**
2. **Same credential and model as Screening Agent**
3. **Temperature:** 0.7 (more variation to ensure independence)
4. **System Message:** (same as Screening Agent)
5. **User Message:** (slightly different phrasing to avoid anchoring)
```
Provide an INDEPENDENT assessment of this content.

**Video:** {{$node["Summarize Video"].json.video_title}}

**Summary:**
{{$node["Summarize Video"].json.summary}}

Evaluate across all 4 dimensions. This assessment should be independent and thorough.
```

### 5️⃣ Compare Assessments & Calculate Scores
1. **Add Node → Helpers → Code**
2. **Language:** JavaScript
3. **Code:**
```javascript
const screening = $node["Screening Agent Assessment"].json;
const critical = $node["Critical Agent Assessment"].json;

// Calculate dimension-by-dimension differences
const credibility_diff = Math.abs(screening.credibility_score - critical.credibility_score);
const quality_diff = Math.abs(screening.quality_score - critical.quality_score);
const relevance_diff = Math.abs(screening.relevance_score - critical.relevance_score);
const alignment_diff = Math.abs(screening.alignment_score - critical.alignment_score);

// Agreement threshold: <15 point difference
const credibility_agree = credibility_diff < 15;
const quality_agree = quality_diff < 15;
const relevance_agree = relevance_diff < 15;
const alignment_agree = alignment_diff < 15;

// All dimensions must agree for overall agreement
const agents_agree = credibility_agree && quality_agree && relevance_agree && alignment_agree;

// Count agreeing dimensions
const agreement_count = [credibility_agree, quality_agree, relevance_agree, alignment_agree]
  .filter(x => x).length;

// Composite scores (average of both agents)
const composite_credibility = (screening.credibility_score + critical.credibility_score) / 2;
const composite_quality = (screening.quality_score + critical.quality_score) / 2;
const composite_relevance = (screening.relevance_score + critical.relevance_score) / 2;
const composite_alignment = (screening.alignment_score + critical.alignment_score) / 2;

// Overall score: average of all 4 dimensions
const overall_score = (composite_credibility + composite_quality + composite_relevance + composite_alignment) / 4;

// Confidence: based on agent agreement
let confidence_score;
if (agents_agree) {
  confidence_score = 95; // All dimensions agree
} else if (agreement_count === 3) {
  confidence_score = 70; // 3 of 4 dimensions agree
} else if (agreement_count === 2) {
  confidence_score = 40; // Only half agree
} else {
  confidence_score = 20; // Most dimensions disagree
}

// Routing decision based on overall score
let routing;
if (overall_score > 80) {
  routing = "PROMOTE";
} else if (overall_score >= 60) {
  routing = "INBOX";
} else {
  routing = "ARCHIVE";
}

return {
  agents_agree,
  agreement_count,
  confidence_score,
  overall_score: Math.round(overall_score * 10) / 10,
  routing,
  scores: {
    credibility: {
      screening: screening.credibility_score,
      critical: critical.credibility_score,
      composite: Math.round(composite_credibility * 10) / 10,
      agree: credibility_agree,
      diff: credibility_diff
    },
    quality: {
      screening: screening.quality_score,
      critical: critical.quality_score,
      composite: Math.round(composite_quality * 10) / 10,
      agree: quality_agree,
      diff: quality_diff
    },
    relevance: {
      screening: screening.relevance_score,
      critical: critical.relevance_score,
      composite: Math.round(composite_relevance * 10) / 10,
      agree: relevance_agree,
      diff: relevance_diff
    },
    alignment: {
      screening: screening.alignment_score,
      critical: critical.alignment_score,
      composite: Math.round(composite_alignment * 10) / 10,
      agree: alignment_agree,
      diff: alignment_diff
    }
  },
  reasoning: {
    screening: screening.reasoning,
    critical: critical.reasoning
  }
};
```

### 6️⃣ Create Obsidian Validation Note
1. **Add Node → Helpers → Code**
2. **Language:** JavaScript
3. **Code:**
```javascript
const comparison = $node["Compare Assessments"].json;
const video = $node["Summarize Video"].json;
const now = new Date();
const dateStr = now.toISOString().split('T')[0];

const routingColor = {
  'PROMOTE': '🟢',
  'INBOX': '🟡',
  'ARCHIVE': '🔴'
};

const validationReport = `# ${video.video_title}

**Source:** [Watch on YouTube](${video.video_url})  
**Assessment Date:** ${now.toLocaleString()}  
**Video ID:** ${video.video_id}

---

## 📊 Validation Summary

| Metric | Score |
|--------|-------|
| **Overall Score** | ${comparison.overall_score}/100 |
| **Routing Decision** | ${routingColor[comparison.routing]} ${comparison.routing} |
| **Confidence** | ${comparison.confidence_score}% |
| **Agent Agreement** | ${comparison.agents_agree ? '✅ YES' : '⚠️ DISAGREEMENT'} |

---

## 🎯 Dimension Scores

### 1️⃣ Source Credibility: ${comparison.scores.credibility.composite}/100
\`\`\`
Screening Agent: ${comparison.scores.credibility.screening}/100
Critical Agent:  ${comparison.scores.credibility.critical}/100
Difference:      ${comparison.scores.credibility.diff} points
Agreement:       ${comparison.scores.credibility.agree ? '✅' : '❌'}
\`\`\`

**Evaluation:**
- Screening: ${comparison.reasoning.screening.credibility}
- Critical: ${comparison.reasoning.critical.credibility}

### 2️⃣ Content Quality: ${comparison.scores.quality.composite}/100
\`\`\`
Screening Agent: ${comparison.scores.quality.screening}/100
Critical Agent:  ${comparison.scores.quality.critical}/100
Difference:      ${comparison.scores.quality.diff} points
Agreement:       ${comparison.scores.quality.agree ? '✅' : '❌'}
\`\`\`

**Evaluation:**
- Screening: ${comparison.reasoning.screening.quality}
- Critical: ${comparison.reasoning.critical.quality}

### 3️⃣ Relevance to Goals: ${comparison.scores.relevance.composite}/100
\`\`\`
Screening Agent: ${comparison.scores.relevance.screening}/100
Critical Agent:  ${comparison.scores.relevance.critical}/100
Difference:      ${comparison.scores.relevance.diff} points
Agreement:       ${comparison.scores.relevance.agree ? '✅' : '❌'}
\`\`\`

**Evaluation:**
- Screening: ${comparison.reasoning.screening.relevance}
- Critical: ${comparison.reasoning.critical.relevance}

### 4️⃣ Value Alignment: ${comparison.scores.alignment.composite}/100
\`\`\`
Screening Agent: ${comparison.scores.alignment.screening}/100
Critical Agent:  ${comparison.scores.alignment.critical}/100
Difference:      ${comparison.scores.alignment.diff} points
Agreement:       ${comparison.scores.alignment.agree ? '✅' : '❌'}
\`\`\`

**Evaluation:**
- Screening: ${comparison.reasoning.screening.alignment}
- Critical: ${comparison.reasoning.critical.alignment}

---

## 📋 Assessment Summary

${comparison.agents_agree ? 
  `✅ **Agents Agree** — Assessment is highly reliable (${comparison.confidence_score}%)` :
  `⚠️ **Agent Disagreement** — Flagged for manual review (${comparison.confidence_score}% confidence, ${4-comparison.agreement_count} dimension(s) misaligned)`
}

### Routing Decision

${comparison.routing === 'PROMOTE' ?
  `**🟢 PROMOTE:** Integrate into knowledge graph and semantic index. High quality content aligned with goals.` :
comparison.routing === 'INBOX' ?
  `**🟡 INBOX:** Requires manual review before integration. Review reasoning above and decide:
  - Keep for integration → Move to \`PROMOTE\` folder
  - Discard → Move to \`ARCHIVE\` folder` :
  `**🔴 ARCHIVE:** Store for later reference. Low relevance or quality score, but may be useful in different context.`
}

---

## 🏷️ Tags & Metadata

- Status: #validation #${comparison.routing.toLowerCase()}
- Confidence: #confidence-${comparison.confidence_score}
- Video ID: \`${video.video_id}\`
- Assessed: ${now.toISOString()}
`;

const filename = `${dateStr}-${video.video_id}-validation.md`;

return {
  filename,
  filepath: `Captures/YouTube/${filename}`,
  content: validationReport,
  video_id: video.video_id,
  routing: comparison.routing,
  confidence: comparison.confidence_score,
  overall_score: comparison.overall_score,
  agents_agree: comparison.agents_agree
};
```

### 7️⃣ Write to Obsidian
1. **Add Node → Files → Write Binary File**
2. **File Path:** 
   ```
   /path/to/vault/{{$node["Create Validation Note"].json.filepath}}
   ```
   Replace `/path/to/vault` with your actual Obsidian vault path
3. **File Content:**
   ```
   {{$node["Create Validation Note"].json.content}}
   ```

### 8️⃣ Update Neo4j
1. **Add Node → Request → HTTP Request**
2. **Method:** POST
3. **URL:** `http://localhost:7474/db/neo4j/tx/commit`
4. **Authentication:** Basic Auth with Neo4j credentials
5. **Headers:**
   ```
   Content-Type: application/json
   ```
6. **Body (JSON):**
```json
{
  "statements": [
    {
      "statement": "MATCH (v:VideoCapture {id: $id}) SET v.validated = true, v.validated_at = datetime(), v.credibility_score = $cred, v.quality_score = $qual, v.relevance_score = $rel, v.alignment_score = $align, v.overall_score = $overall, v.confidence = $conf, v.routing = $route, v.agents_agree = $agree, v.obsidian_file = $file RETURN v",
      "parameters": {
        "id": "{{$node['Create Validation Note'].json.video_id}}",
        "cred": {{$node['Compare Assessments'].json.scores.credibility.composite}},
        "qual": {{$node['Compare Assessments'].json.scores.quality.composite}},
        "rel": {{$node['Compare Assessments'].json.scores.relevance.composite}},
        "align": {{$node['Compare Assessments'].json.scores.alignment.composite}},
        "overall": {{$node['Compare Assessments'].json.overall_score}},
        "conf": {{$node['Compare Assessments'].json.confidence_score}},
        "route": "{{$node['Compare Assessments'].json.routing}}",
        "agree": {{$node['Compare Assessments'].json.agents_agree}},
        "file": "{{$node['Create Validation Note'].json.filepath}}"
      }
    }
  ]
}
```

### 9️⃣ Respond to Webhook
1. **Add Node → Request → Respond to Webhook**
2. **Response Code:** 200
3. **Response Data:**
```json
{
  "status": "success",
  "message": "YouTube video validated",
  "validation": {
    "overall_score": "{{$node['Compare Assessments'].json.overall_score}}/100",
    "routing": "{{$node['Compare Assessments'].json.routing}}",
    "confidence": "{{$node['Compare Assessments'].json.confidence_score}}%",
    "agents_agree": {{$node['Compare Assessments'].json.agents_agree}}
  },
  "obsidian_file": "{{$node['Create Validation Note'].json.filename}}",
  "manual_review_required": {{!$node['Compare Assessments'].json.agents_agree}}
}
```

## Connect Nodes in Order

1. Webhook → Summarize Video
2. Summarize Video → Screening Agent
3. Screening Agent → Critical Agent
4. Critical Agent → Compare Assessments
5. Compare Assessments → Create Validation Note
6. Create Validation Note → Write to Obsidian
7. Create Validation Note → Update Neo4j
8. Update Neo4j → Respond to Webhook

## Test the Workflow

### Update FastAPI `.env`
```bash
# In backend/.env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/youtube-validation
```

### Test with curl
```bash
curl -X POST http://localhost:8000/api/capture/youtube \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "Example High-Quality Video",
    "transcript": "This is a detailed, well-researched transcript about building agentic systems...",
    "id": "test-001"
  }'
```

### Verify Results

1. **Check n8n:** 
   - Go to Executions tab
   - Should see green execution (all nodes passed)
   - Review Screening Agent and Critical Agent outputs

2. **Check Obsidian:**
   - Go to `/Captures/YouTube/`
   - Should see new markdown file with validation report
   - Verify scores and routing decision

3. **Check Neo4j:**
   - Query: `MATCH (v:VideoCapture {id: "test-001"}) RETURN v`
   - Verify: `validated=true`, `credibility_score`, `quality_score`, `relevance_score`, `alignment_score`, `routing`

## Troubleshooting

### "Invalid JSON" error in agent nodes
**Solution:** OpenAI model is hallucinating extra text. Add stricter system prompt constraint:
```
You MUST respond ONLY with valid JSON object. Nothing else. No markdown, no explanation.
```

### Agents always agree (no variation)
**Solution:** Increase Critical Agent temperature from 0.7 to 0.9 for more independent thinking

### File write fails
**Solution:** Verify Obsidian vault path is correct and n8n process has write permissions:
```bash
chmod -R 755 /path/to/vault/Captures/YouTube/
```

### Neo4j connection fails
**Solution:** Verify credentials match `.env` and Neo4j is running:
```bash
curl http://localhost:7474/
```

## Next: Manual Review Process

When `agents_agree = false`, you need to:
1. Open the Obsidian note in `/Captures/YouTube/`
2. Read both agent assessments
3. Decide if content should be PROMOTE, INBOX, or ARCHIVE
4. Manually move note to appropriate folder
5. Your decision trains future agent assessments (Phase 2)
