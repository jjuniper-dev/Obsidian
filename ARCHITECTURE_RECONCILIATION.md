# Architecture Reconciliation: Sprint 5 ↔ Outcome-Focused Vision

**Alignment between current Sprint 5 Validation Layer and the comprehensive Cognitive Architecture diagrams**

---

## The Shift: From Knowledge System → Adaptive Cognitive Engine

### Current (Sprint 5)
```
Capture → Validate → Store → (Phase 2: Reconcile) → (Phase 3+: Reason)
```

### Target Vision (From Diagrams)
```
Inputs → Validation → Cognitive Reconciliation → Knowledge Graph → 
Reasoning & Question Engine → Intervention & Action → Observed Outcomes → 
Feedback & Learning Update → Outcome Evolution
```

**The key insight:** We're not just building a knowledge system. We're building an **adaptive cognitive engine that evolves human outcomes** (Health, Knowledge, Skills, Reflection).

---

## Mapping: 9-Layer Architecture ↔ Outcome-Focused Vision

### Layer 1-2: Inputs + Capture → INPUTS (Capture Layer)
✅ **Aligned**
- Voice, Web, YouTube, Chat, Documents, Ideas, Manual Input
- Our Capture Layer handles all input normalization

### Layer 3: Validation → VALIDATION
✅ **Aligned** 
- Sprint 5 dual-agent screening (credibility, quality, relevance, alignment)
- Filters content before integration

### Layer 4: Cognitive Reconciliation Engine → COGNITIVE RECONCILIATION ENGINE
✅ **Aligned (Phase 2)**
- Our Phase 2: Graph comparison, relationship detection, confidence updates, model evolution
- Their diagram: Reinforce, Challenge, Expand, Detect Contradictions, Update Confidence, Trigger Learning
- **Same concept, different naming**

### Layer 5: Knowledge Graph → KNOWLEDGE GRAPH (Belief State)
✅ **Aligned**
- Obsidian + Neo4j + Chroma
- Their diagram adds: confidence scores, temporal context, provenance
- **Need to enhance:** Track when beliefs were updated, what evidence changed them

### Layer 6: Reasoning & Agents → REASONING & QUESTION ENGINE
🔄 **Needs Enhancement**
- Current: LLMs + RAG + MCP tools
- Their diagram: Pattern detection, multi-step reasoning, what-if simulation
- **Missing:** Structured question types (Diagnostic, Developmental, Counterfactual, Constraint, Values, Reflection)

### Layer 7: Execution → INTERVENTION & ACTION
🔄 **Needs Enhancement**
- Current: n8n workflows, task management, API integrations
- Their diagram: Recommendation, Automations, Agent Workflows, Task Generation
- **Missing:** Action confidence-based automation (only auto-execute high-confidence actions)

### Layer 8: Output → OBSERVED OUTCOMES
🔄 **Needs Enhancement**
- Current: Documents, dashboards, presentations, audio
- Their diagram: Signals, Results, Behaviors, Feedback
- **Missing:** Measurement framework (how do we measure health/knowledge/skills impact?)

### Layer 9: Feedback Loop → FEEDBACK + LEARNING UPDATE
🔄 **Needs Enhancement**
- Current: Obsidian → Neo4j sync
- Their diagram: Update beliefs, improve accuracy, adapt
- **Missing:** RLHF-Lite training from observed outcomes

---

## New Concept: Outcome Evolution Layer

**Not in current architecture. Critical addition from diagrams.**

Maps outcomes from abstract beliefs to measurable human development:

```
CURRENT STATE
├── Context (where are you now?)
├── Constraints (what limits you?)
├── Strengths (what works?)
└── History (what's your trajectory?)
    ↓
DESIRED OUTCOME
├── Goals (where do you want to go?)
├── Metrics (how will you measure it?)
├── Meaning (why does this matter?)
└── Priorities (what matters most?)
    ↓
PATHWAY DESIGN
├── Options (possible routes?)
├── Tradeoffs (costs/benefits?)
├── Simulations (what-if scenarios?)
└── Risks (what could go wrong?)
    ↓
GUIDED ACTIONS
├── Tasks (what to do?)
├── Practice (how to improve?)
├── Resources (what's needed?)
└── Prompts (when to act?)
    ↓
MEASURED RESULTS
├── Progress (are you advancing?)
├── Patterns (what's working?)
├── Wins (celebrate successes)
└── Challenges (blockers?)
    ↓
ADAPTATION
├── Refine (improve the approach)
├── Pivot (change direction if needed)
├── Double Down (double invest if working)
└── Iterate (repeat cycle)
```

**This is the human development loop** that makes the system outcome-focused vs. just knowledge-focused.

---

## Hot + Cold Architecture Integration

**Diagrams introduce:** Distinguish between always-on lightweight vs. on-demand heavy compute

### Current (Our Design)
- Single architecture: FastAPI → n8n → Neo4j

### Enhanced (Aligned with Diagrams)

#### 🔥 HOT LAYER (Always On, Lightweight)
```
1. CAPTURE (iPhone)
   Notes, Voice, Shortcuts, Photos, Files
   ↓
2. CHAT EXPERIENCE (Always Available)
   Retrieval-augmented chat with lightweight LLM
   Qwen2.5-7B-Instruct (local, low resources)
   ↓
3. API GATEWAY (Lightweight)
   FastAPI + Nginx
   Auth, rate limiting, sync trigger
```

**Always-On LLM:** Qwen2.5-7B-Instruct
- Fast, low memory
- Good for chat, RAG, summaries
- Runs on CPU/GPU always available

#### ❄️ COLD LAYER (On-Demand, Heavy)
```
SYNC TRIGGER (manual or scheduled)
   ↓
SPIN UP
   GPU/CPU instance starts
   (Local or cloud burst)
   ↓
PROCESS PIPELINE
   • Chunk & normalize (LLM)
   • Entity extraction (LLM)
   • Graph updates (batch)
   • Embeddings & indexing (batch)
   ↓
RESULTS PUBLISHED
   Sanctioned & indexed in graph
   ↓
SPIN DOWN
   Instance shuts down (cost efficient)
```

**On-Demand LLM:** Mistral Small 3.1 24B (or better)
- Heavy, deep reasoning
- Complex synthesis, multi-step reasoning
- Only runs when needed (batch processing)

#### 💾 PERSISTENT STORES (Always On, Lightweight)
```
Graph Database (Neo4j / Memgraph)
  Entities, relationships, confidence scores, provenance

Vector Database (Chroma / Qdrant)
  Embeddings, semantic search, retrieval chunks

Document Store (S3 / MinIO / Local FS)
  Original files, chunks, metadata, versions

State & Queues (Redis / SQLite)
  Sync status, job queues, locks, cache
```

---

## Data Flow Reconciliation

### Current Sprint 5
```
Capture → FastAPI creates Neo4j node → 
n8n webhook → Validation (dual agents) → 
Create Obsidian note → Update Neo4j → Response
```

### Enhanced (Aligned with Diagrams)
```
HOT LAYER:
  Capture (iPhone) → API upload → Inbox (unsanctioned) → Chat available with context

COLD LAYER (User Decides When):
  Sync trigger → Spin up GPU → Full validation pipeline → 
  Cognitive reconciliation → Graph updates → Embedding & indexing → 
  Publish to sanctioned graph → Spin down

FEEDBACK LOOP:
  User actions on published items → Outcome measurement → 
  Confidence updates → Training signal → Adaptive refinement
```

**Key difference:** Capture is instant (hot). Validation/processing is batched (cold). User decides sync timing.

---

## Model Placement Strategy

### Lightweight Model (Qwen2.5-7B, Always On)
- **Used for:**
  - Chat interactions (quick responses)
  - Retrieval-augmented context (inject recent notes into chat)
  - Quick RAG summaries
  - Real-time API responses
- **Characteristics:** Low latency, low cost, always available
- **Running:** Ollama locally

### Heavy Model (Mistral 3.1 24B or better, On-Demand)
- **Used for:**
  - Deep synthesis (reconcile knowledge)
  - Complex reasoning (what-if scenarios)
  - Entity extraction & relation inference
  - Pathway design (current → desired → steps)
- **Characteristics:** High quality, expensive, only when needed
- **Running:** Cold-start on-demand (local GPU burst or Lambda)

---

## Outcome Domains (New)

System evolves toward 4 outcome domains:

### 🏥 HEALTH
- Habits (what you do regularly)
- Sleep (rest quality)
- Energy (vitality and focus)
- Well-being (mental, physical, emotional)

**System tracks:** Exercise habits captured → Pattern analysis → Recommendations → Health metrics measured

### 📚 KNOWLEDGE
- Languages (ability to understand & communicate)
- Research (synthesis of disparate sources)
- Concepts (mental models, frameworks)
- Expertise (demonstrated competency)

**System tracks:** Articles captured → Reconciled into knowledge graph → Synthesis reports → New concepts discovered

### 💪 SKILLS
- Prompting (ability to get AI to help)
- Writing (clarity of expression)
- Systems Thinking (seeing connections)
- Communication (getting ideas across)

**System tracks:** Chat interactions → Feedback on quality → Recommendations for practice → Skill level trending

### 🪞 REFLECTION
- Judgment (quality of decisions)
- Values (alignment with what matters)
- Growth (personal development trajectory)
- Direction (where you're heading)

**System tracks:** Periodic reflection captures → Values detection → Alignment scoring → Trajectory analysis

---

## Feedback & Learning Loop (RLHF-Lite)

### Current State
- Validation is one-directional (score → route)
- No learning from user decisions

### Enhanced (From Diagrams)
```
User sees Obsidian note (from Cold processing)
   ↓
User approves (PROMOTE) or rejects (ARCHIVE) or modifies
   ↓
Signal captured: "User agreed with credibility=92" or "User disagreed"
   ↓
Aggregated: "When agents score credibility >90, 95% match with user approval"
   ↓
Update agent prompts: "Focus on [X] dimension where you were off"
   ↓
Next batch: Agents score better → Fewer rejections → Faster approval
```

**Cost:** Almost free (just logging user decisions)
**Benefit:** Agents get better over time, customized to user's values

---

## Governance + Foundation Layer (Integrated)

### Current State
- Listed as separate layer

### Enhanced (From Diagrams - Always On)
```
ETHICS & ALIGNMENT
  Built-in guardails (what the system won't do)
  Values alignment checks (does this match your stated values?)

PRIVACY & SECURITY
  Your data, your control
  End-to-end encryption, no cloud upload

HUMAN OVERSIGHT
  You make the calls (system augments, never decides)
  Confidence-based automation (only auto-execute high-confidence actions)

AUDITABILITY
  Transparent & traceable (every decision logged)
  Provenance tracking (where did this idea come from?)

ACTION CONTROLS
  Confidence-based automation (high conf = auto, low conf = ask user)
  Approve gates on sensitive actions

COMPLIANCE
  GC / PHAC alignment (if applicable)
  Regulatory readiness
```

---

## Implementation Roadmap (Revised)

| Phase | What | When | Impact |
|-------|------|------|--------|
| **1** | Capture + Basic Validation | ✅ Sprint 1-5 | Can ingest from anywhere |
| **2** | Cognitive Reconciliation | Sprint 8-10 | Knows what you know, detects contradictions |
| **3** | Hot + Cold Architecture | Sprint 11-12 | Efficient compute, fast chat, deep processing |
| **4** | Reasoning & Question Engine | Sprint 13-15 | Can answer complex questions about your knowledge |
| **5** | Intervention & Action | Sprint 16-18 | Recommends tasks, automates high-confidence actions |
| **6** | Outcome Measurement | Sprint 19-21 | Tracks health/knowledge/skills/reflection impact |
| **7** | Feedback & Learning Loop | Sprint 22+ | System gets smarter from your decisions |
| **8** | Outcome Evolution Engine | Ongoing | Helps you evolve toward desired outcomes |

---

## Key Insights from Reconciliation

### 1. **Sprint 5 is Foundational, Not Complete**
- Validation layer is correct approach
- But it's just the starting point
- Real value emerges in Phases 2-8

### 2. **Hot + Cold Architecture is Essential**
- Don't build one monolithic system
- Lightweight for interactive, Heavy for batch
- User controls when heavy processing runs (cost efficient)

### 3. **Outcome Focus Changes Everything**
- Not "what do we know" but "how does it help you?"
- Every layer feeds into outcome evolution
- Measurement framework critical

### 4. **Feedback Loop is the Engine**
- User decisions are training data (RLHF-Lite)
- System improves from outcomes
- Closes the loop: better system → better decisions → better outcomes

### 5. **Always-On Governance > Reactive**
- Don't add ethics later
- Build guardrails into foundational layer
- Privacy, transparency, human oversight from day one

---

## Reconciliation Summary

**Current Sprint 5 Design:** ✅ **CORRECT FOUNDATION**
- Validation layer with dual-agent screening
- Feeds into Neo4j knowledge graph
- Prepares for Phase 2 reconciliation

**What Diagrams Add:** 🔄 **MISSING LAYERS**
- Outcome Evolution (human development loop)
- Hot + Cold compute architecture
- Outcome domains (Health/Knowledge/Skills/Reflection)
- Feedback & learning loop
- Measurement framework
- Confidence-based automation

**Action:** Keep Sprint 5 on track, but view it as **Layer 1 of 8-layer outcome-focused system**.

---

## Next Step

**Before diving into n8n implementation (Sprint 5):**
1. ✅ Review this reconciliation
2. Confirm Sprint 5 validation layer aligns with your intent
3. Plan Phase 2 (reconciliation) with outcome evolution in mind
4. Design hot + cold architecture for compute efficiency

**Question for Opus 4.7 review:**
- Does this reconciliation capture the intent of the outcome-focused diagrams?
- Are there gaps between current architecture and the vision?
- What's the priority order for Phases 2-8?

---

**Files to Update Based on This:**
- `README.md` — Add outcome domains, hot+cold architecture
- `ARCHITECTURE.md` — Add outcome evolution layer, hot+cold details
- Roadmap — Extend to 8 phases showing outcome focus

---

**Ready to reconcile the documentation?** Or should we get Opus 4.7 feedback first?
