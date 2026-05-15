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

### 2. Content Quality (0-100)
Assessment of intellectual rigor and presentation:
- **90-100:** Deeply researched, novel insights, excellent presentation
- **70-89:** Well-structured, accurate, clear presentation, good depth
- **50-69:** Adequate content, some gaps, decent organization
- **30-49:** Superficial treatment, some errors, unclear sections
- **0-29:** Poor quality, significant errors, incoherent presentation

### 3. Relevance to Your Goals (0-100)
Assessment of fit with your learning/knowledge objectives:
- **90-100:** Directly addresses core goals, immediately applicable
- **70-89:** Relevant to goals, useful but not critical
- **50-69:** Tangentially related, some useful context
- **30-49:** Loosely related, minimal relevance
- **0-29:** Off-topic, not relevant to stated goals

### 4. Value Alignment (0-100)
Assessment of ethical/methodological alignment:
- **90-100:** Aligned with empirical rigor, ethics, transparency, human agency
- **70-89:** Generally aligned, minor concerns
- **50-69:** Mixed signals, some misalignment
- **30-49:** Notable misalignment on key values
- **0-29:** Fundamentally misaligned, contradicts core values

## n8n Workflow Structure

### Node 1: Webhook Trigger
- Listen on `/webhook/youtube-capture`
- Receive: `{url, title, transcript, id}`

### Node 2: Summarize Video
```javascript
const transcript = $input.first().json.transcript;
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
**Temperature:** 0.3
**Purpose:** Consistent baseline assessment across dimensions.

### Node 4: Critical Agent Assessment
**Type:** Claude Haiku (Anthropic API)
**Temperature:** 0.8
**Purpose:** Independent assessment to catch blind spots.

### Node 5: Compare Assessments & Calculate Agreement
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

const composite_credibility = (screening.credibility_score + critical.credibility_score) / 2;
const composite_quality = (screening.quality_score + critical.quality_score) / 2;
const composite_relevance = (screening.relevance_score + critical.relevance_score) / 2;
const composite_alignment = (screening.alignment_score + critical.alignment_score) / 2;

const relevance_passes_floor = composite_relevance >= RELEVANCE_FLOOR;
const floor_violation = !relevance_passes_floor;
const agreement_count = [credibility_agree, quality_agree, relevance_agree, alignment_agree].filter(x => x).length;
const confidence_score = agents_agree ? 95 : (agreement_count === 3 ? 70 : 40);
const overall_score = (composite_credibility + composite_quality + composite_relevance + composite_alignment) / 4;

let routing;
if (overall_score > 80 && relevance_passes_floor) routing = "PROMOTE";
else if (floor_violation) routing = "INBOX";
else if (overall_score >= 60) routing = "INBOX";
else routing = "ARCHIVE";

return {
  agents_agree,
  agreement_count,
  confidence_score,
  overall_score,
  routing,
  floor_violation,
  scores: {
    credibility: {screening: screening.credibility_score, critical: critical.credibility_score, composite: composite_credibility, agree: credibility_agree},
    quality: {screening: screening.quality_score, critical: critical.quality_score, composite: composite_quality, agree: quality_agree},
    relevance: {screening: screening.relevance_score, critical: critical.relevance_score, composite: composite_relevance, agree: relevance_agree, floor: RELEVANCE_FLOOR, passes: relevance_passes_floor},
    alignment: {screening: screening.alignment_score, critical: critical.alignment_score, composite: composite_alignment, agree: alignment_agree}
  },
  reasoning: {screening: screening.reasoning, critical: critical.reasoning}
};
```

## Deduplication Strategy

Before agents fire:
- Query Neo4j: `MATCH (v:VideoCapture {url: $url}) WHERE v.validated = true RETURN v`
- If exists: skip agents and return existing validation result.
- If not: proceed to Screening Agent.

## INBOX Backlog Policy

- Max age: items older than 7 days auto-archive.
- Max size: if INBOX exceeds 50 items, notify the user.
- Daily summary: generate digest of INBOX items.

## Cost Analysis (CAD)

- Screening Agent: ~$0.01-0.015 CAD per video
- Critical Agent: ~$0.002-0.003 CAD per video
- Total per video: ~$0.012-0.018 CAD

## Neo4j Schema Update

VideoCapture node includes agent-specific scores, composite scores, routing, confidence, floor violation, and Obsidian file pointer.

## Next Steps

- Sprint 6: Voice Memo Processor
- Sprint 7: Chat/Social Processor
- Sprint 8: Cognitive Reconciliation Engine
