# Sprint 5: Validation Layer — Dual-Agent Screening & Scoring

**Objective:** Implement the Validation Layer that assesses captured content across 4 dimensions (credibility, quality, relevance, alignment) using dual-agent agreement-driven confidence scoring.

## Architecture Overview

```
INPUT (YouTube Video)
    ↓
CAPTURE LAYER (FastAPI)
    • Create VideoCapture node in Neo4j
    • Summarize content
    ↓
VALIDATION LAYER (n8n) ← SPRINT 5
    • Screening Agent Assessment
      - Source Credibility (0-100)
      - Content Quality (0-100)
      - Relevance to Goals (0-100)
      - Value Alignment (0-100)
    • Critical Agent Assessment (independent)
      - Same 4 dimensions
    • Agreement/Disagreement Gate
      - If agents agree → High confidence → Route
      - If agents disagree → Flag for human review
    ↓
ROUTING DECISION
    • Score >80 → PROMOTE (integrate into knowledge system)
    • Score 60-80 → INBOX (manual review required)
    • Score <60 → ARCHIVE (low relevance, store for later)
    ↓
OUTPUT
    • Obsidian note with validation report
    • Neo4j updated with scores + routing decision
    • Confidence signal for reconciliation engine
```

## Validation Dimensions

### 1. Source Credibility (0-100)
Assessment of creator/source trustworthiness:
- **90-100:** Industry expert, peer-reviewed, established authority
- **70-89:** Credible creator with track record, multiple sources confirm
- **50-69:** Generally trustworthy but limited verification
- **30-49:** Mixed reputation, some unreliable claims detected
- **0-29:** Unreliable, misinformation, low credibility

**Screening Agent Prompt:**
```
Assess source credibility for this YouTube creator.
Consider: expertise, track record, citations, peer recognition, past accuracy.
Rate 0-100 where 100 = world-leading authority in their domain.
```

### 2. Content Quality (0-100)
Assessment of intellectual rigor and presentation:
- **90-100:** Deeply researched, novel insights, excellent presentation
- **70-89:** Well-structured, accurate, clear presentation, good depth
- **50-69:** Adequate content, some gaps, decent organization
- **30-49:** Superficial treatment, some errors, unclear sections
- **0-29:** Poor quality, significant errors, incoherent presentation

**Screening Agent Prompt:**
```
Assess the intellectual quality of this content.
Consider: research depth, novelty, accuracy, logical flow, presentation clarity.
Rate 0-100 where 100 = publishable academic/industry standard.
```

### 3. Relevance to Your Goals (0-100)
Assessment of fit with your learning/knowledge objectives:
- **90-100:** Directly addresses core goals, immediately applicable
- **70-89:** Relevant to goals, useful but not critical
- **50-69:** Tangentially related, some useful context
- **30-49:** Loosely related, minimal relevance
- **0-29:** Off-topic, not relevant to stated goals

**Screening Agent Prompt:**
```
You are evaluating content fit for someone building:
- A Personal Cognitive Architecture
- A knowledge evolution system
- Real-time decision assurance systems
- Agentic systems with human oversight

Assess how relevant this video is to these goals.
Rate 0-100 where 100 = directly addresses core architectural needs.
```

### 4. Value Alignment (0-100)
Assessment of ethical/methodological alignment:
- **90-100:** Aligned with empirical rigor, ethics, transparency, human agency
- **70-89:** Generally aligned, minor concerns
- **50-69:** Mixed signals, some misalignment
- **30-49:** Notable misalignment on key values
- **0-29:** Fundamentally misaligned, contradicts core values

**Screening Agent Prompt:**
```
Assess alignment with these values:
- Empirical rigor and evidence-based reasoning
- Transparency and explainability
- Human agency and control (agents augment, not replace)
- Privacy and data ethics
- Bias awareness and mitigation

Rate 0-100 where 100 = exemplary alignment.
```

## n8n Workflow Structure

### Node 1: Webhook Trigger
- Listen on `/webhook/youtube-capture`
- Receive: `{url, title, transcript, id}`

### Node 2: Summarize Video
```javascript
// Prepare summary for agent assessment
const transcript = $input.first().json.transcript;

// If transcript is short, use as summary
// If long, use first 2000 chars + "..." for assessment
const summary = transcript.length > 2000 
  ? transcript.substring(0, 2000) + "...[truncated]"
  : transcript;

return {
  video_title: $input.first().json.title,
  video_url: $input.first().json.url,
  summary,
  full_transcript: transcript,
  video_id: $input.first().json.id
};
```

### Node 3: Screening Agent Assessment
**Type:** Claude Sonnet (Anthropic API)
**Temperature:** 0.3 (conservative, deterministic scoring)
**Purpose:** Consistent baseline assessment across dimensions

**System Prompt:**
```
You are a rigorous content evaluator using Claude Sonnet. You assess content across 4 dimensions with conservative scoring.

Temperature 0.3 means: Be consistent and principled. Avoid random variation. Score based on clear criteria.

Dimensions:
1. Source Credibility (0-100): Is the creator trustworthy and authoritative?
2. Content Quality (0-100): Is it well-researched, clear, substantive?
3. Relevance to Goals (0-100): Fit with Personal Cognitive Architecture, agentic systems, knowledge management?
4. Value Alignment (0-100): Empirical rigor, transparency, human agency, ethics?

Respond ONLY with valid JSON, no other text:
{
  "credibility_score": <number 0-100>,
  "quality_score": <number 0-100>,
  "relevance_score": <number 0-100>,
  "alignment_score": <number 0-100>,
  "reasoning": {
    "credibility": "1-2 sentence explanation",
    "quality": "1-2 sentence explanation",
    "relevance": "1-2 sentence explanation",
    "alignment": "1-2 sentence explanation"
  }
}
```

**User Message:**
```
Assess this YouTube video with rigorous, conservative scoring:

**Title:** {{$node["Summarize Video"].json.video_title}}

**Summary:**
{{$node["Summarize Video"].json.summary}}

Provide your assessment across all 4 dimensions.
```

### Node 4: Critical Agent Assessment
**Type:** Claude Haiku (Anthropic API)
**Temperature:** 0.8 (exploratory, probes for gaps and edge cases)
**Purpose:** Independent assessment to catch blind spots

**System Prompt:**
```
You are a critical content evaluator using Claude Haiku. You assess content across 4 dimensions and look for edge cases, gaps, and potential issues.

Temperature 0.8 means: Be more exploratory. Challenge assumptions. Probe for what might be missing. Still be principled, but consider alternative interpretations.

Same 4 dimensions as the Screening Agent:
1. Source Credibility (0-100)
2. Content Quality (0-100)
3. Relevance to Goals (0-100)
4. Value Alignment (0-100)

Respond ONLY with valid JSON, no other text:
{
  "credibility_score": <number 0-100>,
  "quality_score": <number 0-100>,
  "relevance_score": <number 0-100>,
  "alignment_score": <number 0-100>,
  "reasoning": {
    "credibility": "1-2 sentence explanation",
    "quality": "1-2 sentence explanation",
    "relevance": "1-2 sentence explanation",
    "alignment": "1-2 sentence explanation"
  }
}
```

**User Message:**
```
Independently assess this content. Look for gaps, blind spots, and edge cases:

**Title:** {{$node["Summarize Video"].json.video_title}}

**Content:**
{{$node["Summarize Video"].json.summary}}

Provide your critical assessment. This should be independent from any prior scoring.
```

### Node 5: Compare Assessments & Calculate Agreement
```javascript
const screening = $node["Screening Agent Assessment"].json;
const critical = $node["Critical Agent Assessment"].json;

// PER-DIMENSION THRESHOLDS
const RELEVANCE_FLOOR = 60; // Hard floor: relevance must be >= 60

// Calculate difference across dimensions
const credibility_diff = Math.abs(screening.credibility_score - critical.credibility_score);
const quality_diff = Math.abs(screening.quality_score - critical.quality_score);
const relevance_diff = Math.abs(screening.relevance_score - critical.relevance_score);
const alignment_diff = Math.abs(screening.alignment_score - critical.alignment_score);

// Agreement threshold: difference < 15 points = agreement
const credibility_agree = credibility_diff < 15;
const quality_agree = quality_diff < 15;
const relevance_agree = relevance_diff < 15;
const alignment_agree = alignment_diff < 15;

// Overall agreement: all dimensions must agree
const agents_agree = credibility_agree && quality_agree && relevance_agree && alignment_agree;

// Calculate composite scores (average of both agents)
const composite_credibility = (screening.credibility_score + critical.credibility_score) / 2;
const composite_quality = (screening.quality_score + critical.quality_score) / 2;
const composite_relevance = (screening.relevance_score + critical.relevance_score) / 2;
const composite_alignment = (screening.alignment_score + critical.alignment_score) / 2;

// Per-dimension floor check
const relevance_passes_floor = composite_relevance >= RELEVANCE_FLOOR;
const floor_violation = !relevance_passes_floor;

// Overall confidence: based on agreement level
const agreement_count = [credibility_agree, quality_agree, relevance_agree, alignment_agree].filter(x => x).length;
const confidence_score = agents_agree ? 95 : (agreement_count === 3 ? 70 : 40);

// Determine routing based on composite score + per-dimension floors
const overall_score = (composite_credibility + composite_quality + composite_relevance + composite_alignment) / 4;

let routing;
if (overall_score > 80 && relevance_passes_floor) {
  routing = "PROMOTE";
} else if (floor_violation) {
  routing = "INBOX"; // Floor violation → manual review regardless of overall score
} else if (overall_score >= 60) {
  routing = "INBOX";
} else {
  routing = "ARCHIVE";
}

return {
  agents_agree,
  agreement_count,
  confidence_score,
  overall_score,
  routing,
  floor_violation,
  scores: {
    credibility: {
      screening: screening.credibility_score,
      critical: critical.credibility_score,
      composite: composite_credibility,
      agree: credibility_agree
    },
    quality: {
      screening: screening.quality_score,
      critical: critical.quality_score,
      composite: composite_quality,
      agree: quality_agree
    },
    relevance: {
      screening: screening.relevance_score,
      critical: critical.relevance_score,
      composite: composite_relevance,
      agree: relevance_agree,
      floor: RELEVANCE_FLOOR,
      passes: relevance_passes_floor
    },
    alignment: {
      screening: screening.alignment_score,
      critical: critical.alignment_score,
      composite: composite_alignment,
      agree: alignment_agree
    }
  },
  reasoning: {
    screening: screening.reasoning,
    critical: critical.reasoning
  }
};
```

### Node 6: Create Obsidian Validation Note
```javascript
const comparison = $node["Compare Assessments"].json;
const video = $node["Summarize Video"].json;
const now = new Date();
const dateStr = now.toISOString().split('T')[0];

const validationReport = `# ${video.video_title}

**URL:** [Watch](${video.video_url})
**Assessment Date:** ${now.toISOString()}
**Status:** ${comparison.routing}

## Validation Results

### Overall Score: ${comparison.overall_score.toFixed(1)}/100
**Routing:** ${comparison.routing}
**Confidence:** ${comparison.confidence_score}%
**Agent Agreement:** ${comparison.agents_agree ? '✓ YES' : '⚠️ DISAGREEMENT'}

---

## Dimension Scores

### 1. Source Credibility: ${comparison.scores.credibility.composite.toFixed(0)}/100
- Screening Agent: ${comparison.scores.credibility.screening}/100
- Critical Agent: ${comparison.scores.credibility.critical}/100
- Agreement: ${comparison.scores.credibility.agree ? '✓' : '✗'}

**Reasoning:**
- Screening: ${comparison.reasoning.screening.credibility}
- Critical: ${comparison.reasoning.critical.credibility}

### 2. Content Quality: ${comparison.scores.quality.composite.toFixed(0)}/100
- Screening Agent: ${comparison.scores.quality.screening}/100
- Critical Agent: ${comparison.scores.quality.critical}/100
- Agreement: ${comparison.scores.quality.agree ? '✓' : '✗'}

**Reasoning:**
- Screening: ${comparison.reasoning.screening.quality}
- Critical: ${comparison.reasoning.critical.quality}

### 3. Relevance to Goals: ${comparison.scores.relevance.composite.toFixed(0)}/100
- Screening Agent: ${comparison.scores.relevance.screening}/100
- Critical Agent: ${comparison.scores.relevance.critical}/100
- Agreement: ${comparison.scores.relevance.agree ? '✓' : '✗'}

**Reasoning:**
- Screening: ${comparison.reasoning.screening.relevance}
- Critical: ${comparison.reasoning.critical.relevance}

### 4. Value Alignment: ${comparison.scores.alignment.composite.toFixed(0)}/100
- Screening Agent: ${comparison.scores.alignment.screening}/100
- Critical Agent: ${comparison.scores.alignment.critical}/100
- Agreement: ${comparison.scores.alignment.agree ? '✓' : '✗'}

**Reasoning:**
- Screening: ${comparison.reasoning.screening.alignment}
- Critical: ${comparison.reasoning.critical.alignment}

---

## Summary

${comparison.agents_agree 
  ? `✓ **Agents Agree** — High confidence in assessment (${comparison.confidence_score}%)`
  : `⚠️ **Agents Disagree** on ${4 - comparison.agreement_count} dimension(s) — Flagged for manual review`
}

**Recommendation:** ${comparison.routing === 'PROMOTE' ? 'Integrate into knowledge system' : comparison.routing === 'INBOX' ? 'Requires manual review before integration' : 'Archive for later reference'}

---

## Routing Decision

\`\`\`
${comparison.routing}
${comparison.routing === 'PROMOTE' ? '→ Integrate into knowledge graph and semantic index' : ''}
${comparison.routing === 'INBOX' ? '→ Review manually to validate agent assessment' : ''}
${comparison.routing === 'ARCHIVE' ? '→ Store but do not prioritize in knowledge synthesis' : ''}
\`\`\`

---

**Assessment ID:** ${video.video_id}
**Video ID:** ${video.video_id}
**Tags:** #validation #assessment #screeningresult`;

const filename = `${dateStr}-${video.video_id}-validation.md`;

return {
  filename,
  filepath: `Captures/YouTube/${filename}`,
  content: validationReport,
  video_id: video.video_id,
  routing: comparison.routing,
  scores: comparison.scores,
  confidence: comparison.confidence_score,
  agents_agree: comparison.agents_agree
};
```

### Node 7: Write Validation Note to Obsidian
**Type:** Write Binary File
- **Path:** `/path/to/vault/{{$node["Create Obsidian Note"].json.filepath}}`
- **Content:** `{{$node["Create Obsidian Note"].json.content}}`

### Node 8: Update Neo4j with Validation Results
```javascript
// Cypher query to update VideoCapture node with validation scores (agent-specific + composite)
const scores = $node["Compare Assessments"].json.scores;
const routing = $node["Compare Assessments"].json.routing;
const confidence = $node["Compare Assessments"].json.confidence_score;
const comparison = $node["Compare Assessments"].json;

return {
  statement: `
    MATCH (v:VideoCapture {id: $id})
    SET 
      v.validated = true,
      v.validated_at = datetime(),
      
      # Agent-specific scores
      v.screening_credibility = $screening_cred,
      v.screening_quality = $screening_qual,
      v.screening_relevance = $screening_rel,
      v.screening_alignment = $screening_align,
      v.critical_credibility = $critical_cred,
      v.critical_quality = $critical_qual,
      v.critical_relevance = $critical_rel,
      v.critical_alignment = $critical_align,
      
      # Composite scores
      v.credibility_score = $credibility,
      v.quality_score = $quality,
      v.relevance_score = $relevance,
      v.alignment_score = $alignment,
      v.overall_score = $overall,
      v.confidence = $confidence,
      v.routing = $routing,
      v.agents_agree = $agree,
      v.floor_violation = $floor_violation,
      v.obsidian_file = $obsidian_file
    RETURN v
  `,
  parameters: {
    id: $input.first().json.video_id,
    screening_cred: scores.credibility.screening,
    screening_qual: scores.quality.screening,
    screening_rel: scores.relevance.screening,
    screening_align: scores.alignment.screening,
    critical_cred: scores.credibility.critical,
    critical_qual: scores.quality.critical,
    critical_rel: scores.relevance.critical,
    critical_align: scores.alignment.critical,
    credibility: scores.credibility.composite,
    quality: scores.quality.composite,
    relevance: scores.relevance.composite,
    alignment: scores.alignment.composite,
    overall: comparison.overall_score,
    confidence,
    routing,
    agree: comparison.agents_agree,
    floor_violation: comparison.floor_violation,
    obsidian_file: $node["Create Obsidian Note"].json.filepath
  }
};
```

### Node 9: Response
**Type:** Respond to Webhook
```json
{
  "status": "success",
  "validation": {
    "overall_score": "{{$node['Compare Assessments'].json.overall_score}}",
    "routing": "{{$node['Compare Assessments'].json.routing}}",
    "confidence": "{{$node['Compare Assessments'].json.confidence_score}}%",
    "agents_agree": "{{$node['Compare Assessments'].json.agents_agree}}"
  },
  "obsidian_file": "{{$node['Create Obsidian Note'].json.filename}}",
  "manual_review_required": "{{!$node['Compare Assessments'].json.agents_agree}}"
}
```

---

## Deduplication Strategy

**Before agents fire (Insert before Node 3):**
- Query Neo4j: `MATCH (v:VideoCapture {url: $url}) WHERE v.validated = true RETURN v`
- If exists: Skip agents, return existing validation result (idempotent)
- If not exists: Proceed to Node 3 (Screening Agent)

**Rationale:** Prevents duplicate processing of same video. Cost-efficient and idempotent.

---

## INBOX Backlog Policy

**Goal:** Prevent INBOX queue from growing unbounded

**Policy:**
- **Max Age:** Items in INBOX older than 7 days auto-archive with note: "Auto-archived after 7-day review window"
- **Max Size:** If INBOX exceeds 50 items, user gets notification: "INBOX threshold exceeded. Review and archive old items."
- **Daily Summary:** Each morning, generate digest: "5 items in INBOX | 2 require immediate review | 3 are low-priority"

**Implementation:**
- Node 6 (Obsidian): Tag all INBOX items with `#inbox-submitted-<date>`
- Daily cron job: Query `#inbox-submitted-<7daysago>` and move to ARCHIVE
- Weekly report: Count INBOX items and trigger alert if >50

---

## Idempotency Guarantee

**Problem:** Network failures could cause duplicate Neo4j writes

**Solution:** Use `video_id` + `validated_at` as upsert key

**Cypher:**
```cypher
MERGE (v:VideoCapture {id: $id})
  ON CREATE SET v.created_at = datetime()
  ON MATCH SET v.validated_at = datetime()
SET 
  v.validated = true,
  v.screening_credibility = $screening_cred,
  ...all other fields...
RETURN v
```

This ensures: Same video + same validation window = single node, no duplicates

---

## Cost Analysis (CAD)

### Per-Video Cost
- **Screening Agent (Claude Sonnet):** ~$0.01-0.015 CAD per video
- **Critical Agent (Claude Haiku):** ~$0.002-0.003 CAD per video
- **Total per video:** ~$0.012-0.018 CAD

### Annual Cost Estimates
- **10 videos/day:** ~$44-66 CAD/year
- **25 videos/day:** ~$110-165 CAD/year
- **50 videos/day:** ~$220-330 CAD/year
- **100 videos/day:** ~$440-660 CAD/year

**For comparison (GPT-4):** Same workload would cost $1,500-2,500 CAD/year

**Breakdown by model:**
- Sonnet (80% of cost): ~$0.009 CAD per video
- Haiku (20% of cost): ~$0.003 CAD per video

---

## Testing & Validation

### Test Case 1: High-Quality, Credible Content (Should PROMOTE)
```bash
curl -X POST http://localhost:8000/api/capture/youtube \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=example1",
    "title": "Building Agentic Systems with Neo4j GraphRAG",
    "transcript": "In this presentation, Neo4j Chief Technologist Michael Hunger walks through how to build agentic systems using graph intelligence...",
    "id": "test-promote-001"
  }'
```
Expected: Overall score >80, agents agree, routing=PROMOTE

### Test Case 2: Mediocre Content (Should INBOX)
```bash
curl -X POST http://localhost:8000/api/capture/youtube \
  -d '{
    "url": "https://www.youtube.com/watch?v=example2",
    "title": "AI Tips and Tricks",
    "transcript": "Here are some random tips about AI that might be useful. Everyone uses AI differently so this might or might not help you...",
    "id": "test-inbox-001"
  }'
```
Expected: Overall score 60-80, possible disagreement, routing=INBOX

### Test Case 3: Low-Quality Content (Should ARCHIVE)
```bash
curl -X POST http://localhost:8000/api/capture/youtube \
  -d '{
    "url": "https://www.youtube.com/watch?v=example3",
    "title": "Make Money Fast with AI",
    "transcript": "Buy my course on AI. It will make you rich. AI is magic. No technical details provided...",
    "id": "test-archive-001"
  }'
```
Expected: Overall score <60, agents agree, routing=ARCHIVE

## Obsidian Output Example

The validation note will look like:

```markdown
# Building Agentic Systems with Neo4j GraphRAG

**URL:** [Watch](https://youtube.com/...)
**Assessment Date:** 2026-05-11T14:30:00Z
**Status:** PROMOTE

## Validation Results

### Overall Score: 87.5/100
**Routing:** PROMOTE
**Confidence:** 95%
**Agent Agreement:** ✓ YES

---

## Dimension Scores

### 1. Source Credibility: 92/100
- Screening Agent: 90/100
- Critical Agent: 94/100
- Agreement: ✓

### 2. Content Quality: 89/100
- Screening Agent: 88/100
- Critical Agent: 90/100
- Agreement: ✓

### 3. Relevance to Goals: 85/100
- Screening Agent: 83/100
- Critical Agent: 87/100
- Agreement: ✓

### 4. Value Alignment: 84/100
- Screening Agent: 84/100
- Critical Agent: 84/100
- Agreement: ✓

---

## Summary

✓ **Agents Agree** — High confidence in assessment (95%)

**Recommendation:** Integrate into knowledge system
```

## Neo4j Schema Update

VideoCapture node now includes:
```cypher
{
  id: string,
  url: string,
  title: string,
  source: "youtube",
  created_at: datetime,
  
  # Agent-specific scores (for Phase 2 learning)
  screening_credibility: float,
  screening_quality: float,
  screening_relevance: float,
  screening_alignment: float,
  critical_credibility: float,
  critical_quality: float,
  critical_relevance: float,
  critical_alignment: float,
  
  # Composite scores (for routing decisions)
  validated: boolean,
  validated_at: datetime,
  credibility_score: float,
  quality_score: float,
  relevance_score: float,
  alignment_score: float,
  overall_score: float,
  confidence: integer,
  routing: enum("PROMOTE", "INBOX", "ARCHIVE"),
  agents_agree: boolean,
  floor_violation: boolean,
  obsidian_file: string
}
```

## Next Steps

Once Sprint 5 is working:
- **Sprint 6:** Voice Memo Processor with same validation layer
- **Sprint 7:** Chat/Social Processor with same validation layer
- **Sprint 8:** Cognitive Reconciliation Engine (Phase 2) - graph comparison and relationship detection
