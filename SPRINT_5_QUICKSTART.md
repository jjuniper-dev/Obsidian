# Sprint 5: Validation Layer — Quick Start

**What changed:** Rebuilt from task extraction to **dual-agent validation** with agreement-driven confidence scoring.

**What it does:** 
- Two independent AI agents score each YouTube video across 4 dimensions
- If agents **agree** → high confidence → automatic routing (PROMOTE/INBOX/ARCHIVE)
- If agents **disagree** → flag for manual review
- Your decisions train future assessments

## Architecture at a Glance

```
YouTube Video Captured
    ↓
Screening Agent                Critical Agent
  (temp 0.5)     →→→    Assessment    ←←←   (temp 0.7)
Scores on:
• Source Credibility (0-100)
• Content Quality (0-100)  
• Relevance to Goals (0-100)
• Value Alignment (0-100)
    ↓
Compare Scores → Agreement?
    ├─ YES (all 4 dimensions align) → Confidence 95% → AUTO-ROUTE
    └─ NO (disagreement) → Confidence 20-70% → FLAG FOR REVIEW
    ↓
Route based on Overall Score
    ├─ >80 → PROMOTE (integrate into knowledge)
    ├─ 60-80 → INBOX (needs your review)
    └─ <60 → ARCHIVE (low relevance)
    ↓
Create Obsidian validation report + Update Neo4j
```

## 3-Step Setup

### Step 1: Read the Architecture
**File:** `SPRINT_5_VALIDATION_LAYER.md`
- 4 scoring dimensions explained
- n8n workflow node-by-node breakdown
- Sample test cases
- Neo4j schema changes

**Time:** 15 min

### Step 2: Build in n8n
**File:** `SPRINT_5_N8N_SETUP_VALIDATION_LAYER.md`
- Create OpenAI + Neo4j credentials
- Add 9 nodes to n8n workflow (copy/paste code)
- Connect nodes in order
- Update FastAPI `.env` with webhook URL

**Time:** 30-45 min

### Step 3: Test
```bash
# Send test YouTube video to FastAPI
curl -X POST http://localhost:8000/api/capture/youtube \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "Test Video Title",
    "transcript": "Your video transcript or summary here...",
    "id": "test-001"
  }'

# Verify:
# 1. Check n8n Executions → should be green
# 2. Check /Captures/YouTube/ → markdown file created
# 3. Query Neo4j → MATCH (v:VideoCapture {id: "test-001"}) RETURN v
```

**Time:** 10 min

## Key Differences from Original Sprint 5

| Old | New |
|-----|-----|
| Extract action items | Score for relevance & quality |
| Single GPT call | Dual-agent assessment |
| Task list output | Validation report + routing |
| No confidence signal | Confidence based on agent agreement |
| Auto-integrate all | Smart routing to PROMOTE/INBOX/ARCHIVE |

## What You Get

### Obsidian Notes
```markdown
# Video Title

## 📊 Validation Summary
Overall Score: 87.5/100
Routing: 🟢 PROMOTE
Confidence: 95%
Agent Agreement: ✅ YES

## 🎯 Dimension Scores
1. Source Credibility: 92/100 ✅
2. Content Quality: 89/100 ✅
3. Relevance to Goals: 85/100 ✅
4. Value Alignment: 84/100 ✅

## 📋 Assessment Summary
✅ Agents Agree — Highly reliable assessment

Routing: 🟢 PROMOTE
→ Integrate into knowledge graph
```

### Neo4j Schema
VideoCapture node now includes:
```
validated: true
validated_at: 2026-05-11T14:30:00Z
credibility_score: 92
quality_score: 89
relevance_score: 85
alignment_score: 84
overall_score: 87.5
confidence: 95
routing: "PROMOTE"
agents_agree: true
obsidian_file: "Captures/YouTube/2026-05-11-abc123-validation.md"
```

## Scoring Rubric Reference

### Credibility (0-100)
- **90-100:** Industry expert, peer-reviewed, established authority
- **70-89:** Credible with track record, multiple sources confirm
- **50-69:** Generally trustworthy, limited verification
- **30-49:** Mixed reputation, some unreliable claims
- **0-29:** Unreliable, misinformation

### Quality (0-100)
- **90-100:** Deeply researched, novel, excellent presentation
- **70-89:** Well-structured, accurate, good depth
- **50-69:** Adequate, some gaps, decent organization
- **30-49:** Superficial, some errors, unclear sections
- **0-29:** Poor quality, significant errors, incoherent

### Relevance to Goals (0-100)
You're building: Personal Cognitive Architecture, agentic systems, knowledge management
- **90-100:** Directly addresses core goals
- **70-89:** Relevant, useful but not critical
- **50-69:** Tangentially related, useful context
- **30-49:** Loosely related, minimal relevance
- **0-29:** Off-topic, not relevant

### Value Alignment (0-100)
Your values: Empirical rigor, transparency, human agency, ethics
- **90-100:** Exemplary alignment
- **70-89:** Generally aligned, minor concerns
- **50-69:** Mixed signals, some misalignment
- **30-49:** Notable misalignment
- **0-29:** Fundamentally misaligned

## Routing Logic

### PROMOTE (>80 overall)
✅ **Action:** Integrate into knowledge system
- Add to semantic graph
- Include in vector index for search
- Link to related existing knowledge
- Example: "This is high-quality research on agentic design patterns"

### INBOX (60-80 overall)
🟡 **Action:** Manual review
- Agents disagreed or score is borderline
- You read the validation report
- You decide: Keep for integration or discard?
- Your decision trains future assessments
- Example: "Content is relevant but agents disagree on quality"

### ARCHIVE (<60 overall)
🔴 **Action:** Store but deprioritize
- Low relevance or quality score
- Keep in vault for future context
- Don't integrate into main knowledge graph
- Example: "Tangential content, may be useful someday"

## What's Next

Once this is working:
- **Sprint 6:** Voice Memo Processor (same validation layer, add transcription)
- **Sprint 7:** Chat/Social Processor (same validation layer, simplified scoring)
- **Sprint 8:** Cognitive Reconciliation Engine (Phase 2 - graph comparison + agent learning)

## FAQ

**Q: Why two agents instead of one?**
A: Disagreement signals uncertainty better than confidence scores. When agents disagree, you know to review. When they agree, you can trust the assessment.

**Q: Can I tune the scoring?**
A: Yes. After testing, you can adjust the system prompts to weight dimensions differently (e.g., "Relevance is more important than alignment for this user").

**Q: What if agents always disagree?**
A: Increase Critical Agent temperature from 0.7 back toward Screening Agent (0.5), OR update system prompts to be clearer about scoring criteria.

**Q: How do I handle the INBOX items?**
A: Read the validation report in Obsidian. If you disagree with routing, manually update the `routing` field in the note. This feedback trains Phase 2 (Cognitive Reconciliation Engine).

---

**Ready?** Start with `SPRINT_5_VALIDATION_LAYER.md` to understand the architecture, then follow `SPRINT_5_N8N_SETUP_VALIDATION_LAYER.md` to build in n8n.
