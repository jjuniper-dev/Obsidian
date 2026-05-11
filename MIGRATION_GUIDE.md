# Migration Guide: Obsidian → personal-cognitive-architecture

All architecture and Sprint 5 documentation is now ready to be migrated to the dedicated personal-cognitive-architecture repository.

## Files to Migrate

✅ **Core Documentation** (7 files, all with 10 evaluation fixes applied):
- `README.md` — Project overview with Mermaid diagram
- `ARCHITECTURE.md` — 9-layer architecture breakdown (Claude models, BGE-M3 embeddings, one-way sync, Kokoro TTS)
- `SPRINT_5_VALIDATION_LAYER.md` — Complete validation spec with agent-specific scores, per-dimension thresholds, dedup, INBOX policy
- `SPRINT_5_N8N_SETUP_VALIDATION_LAYER.md` — Step-by-step n8n setup (Claude Sonnet T=0.3, Claude Haiku T=0.8)
- `SPRINT_5_QUICKSTART.md` — 3-step quick start for Sprint 5 build
- `ARCHITECTURAL_REVIEW_REQUEST_OPUS47.md` — Architecture review document for Opus 4.7
- `ARCHITECTURE_RECONCILIATION.md` — Maps Sprint 5 to 8-phase outcome-focused vision

## How to Push

### Option 1: Use GitHub Web UI (Easiest)
1. Go to https://github.com/jjuniper-dev/personal-cognitive-architecture
2. Click **Add file → Upload files**
3. Drag the 7 markdown files from `/home/user/Obsidian/` into the browser
4. Commit with message: "Add PCA architecture and Sprint 5 documentation (all Opus 4.7 fixes applied)"

### Option 2: Use Git Commands (Recommended)
```bash
# Clone the personal-cognitive-architecture repo
git clone https://github.com/jjuniper-dev/personal-cognitive-architecture.git
cd personal-cognitive-architecture

# Copy files from Obsidian vault
cp /home/user/Obsidian/README.md .
cp /home/user/Obsidian/ARCHITECTURE.md .
cp /home/user/Obsidian/SPRINT_5_VALIDATION_LAYER.md .
cp /home/user/Obsidian/SPRINT_5_N8N_SETUP_VALIDATION_LAYER.md .
cp /home/user/Obsidian/SPRINT_5_QUICKSTART.md .
cp /home/user/Obsidian/ARCHITECTURAL_REVIEW_REQUEST_OPUS47.md .
cp /home/user/Obsidian/ARCHITECTURE_RECONCILIATION.md .

# Commit and push
git add .
git commit -m "Add PCA architecture and Sprint 5 documentation

- README: Project overview with 9-layer architecture
- ARCHITECTURE: Complete layer breakdown with 10 Opus 4.7 fixes applied
  * Claude Sonnet + Haiku (not GPT-4)
  * BGE-M3 local embeddings (not OpenAI)
  * One-way sync (not bidirectional)
  * Kokoro TTS (not ElevenLabs)
  * 8-phase roadmap (aligned with outcome-focused vision)
- SPRINT_5_VALIDATION_LAYER: Full validation spec
  * Per-dimension thresholds (Relevance >= 60)
  * Agent-specific scores for Phase 2
  * Deduplication and INBOX policy
  * CAD cost analysis (~$44-330/year)
- SPRINT_5_N8N_SETUP: Step-by-step n8n implementation
  * Dedup node, per-dimension floor logic
  * Updated agent prompts and temperatures
- SPRINT_5_QUICKSTART: 3-step quick start
- ARCHITECTURAL_REVIEW_REQUEST_OPUS47: Design review document
- ARCHITECTURE_RECONCILIATION: 8-phase outcome-focused roadmap"

git push origin main
```

### Option 3: Push from Obsidian Directory (Using Git)
```bash
cd /home/user/Obsidian

# Add new remote
git remote add pca-main https://github.com/jjuniper-dev/personal-cognitive-architecture.git

# Create a branch for these specific files
git checkout -b pca-docs

# Create a commit with just these files
git add README.md ARCHITECTURE.md SPRINT_5_*.md ARCHITECTURAL_REVIEW_REQUEST_OPUS47.md ARCHITECTURE_RECONCILIATION.md
git commit -m "Add PCA core documentation with all Opus 4.7 fixes applied"

# Push to new repo
git push pca-main pca-docs:main
```

## What Changed in Documentation

### ARCHITECTURE.md
- ✅ Layer 3: Claude Sonnet (T=0.3) + Claude Haiku (T=0.8) instead of GPT-4
- ✅ Layer 5c: BGE-M3 local embeddings instead of OpenAI
- ✅ Layer 5 sync: One-way Obsidian → Neo4j instead of bidirectional
- ✅ Layer 8: Kokoro TTS instead of ElevenLabs
- ✅ Roadmap: Extended to 8 phases with clear outcome focus

### SPRINT_5_VALIDATION_LAYER.md
- ✅ Node 3: Screening Agent now uses Claude Sonnet (T=0.3)
- ✅ Node 4: Critical Agent now uses Claude Haiku (T=0.8)
- ✅ Node 5: Includes per-dimension minimum thresholds (Relevance ≥ 60)
- ✅ Node 8: Neo4j schema includes agent-specific scores (for Phase 2 learning)
- ✅ Added: Deduplication, INBOX backlog policy, idempotency, CAD cost analysis

### SPRINT_5_N8N_SETUP_VALIDATION_LAYER.md
- ✅ Prerequisites: Now use Anthropic Claude API (not OpenAI)
- ✅ Node 2.5: New deduplication step before agents fire
- ✅ Nodes 3-4: Updated to use Claude models with new temperatures
- ✅ Node 5: Includes per-dimension floor logic
- ✅ Node 8: Cypher query updated to store agent-specific scores
- ✅ Troubleshooting: Updated for Claude model behavior

### README.md
- ✅ Updated tech stack to show Claude + Anthropic API
- ✅ Added "all 10 evaluation fixes applied" callouts
- ✅ Highlighted Sprint 5 readiness and CAD cost

## Status Check

All 10 Opus 4.7 evaluation fixes are confirmed in the documentation:

| Fix | Status |
|-----|--------|
| 1. Replace GPT-4 with Claude Sonnet + Haiku | ✅ Complete |
| 2. Per-dimension minimum thresholds | ✅ Relevance ≥ 60 hard floor |
| 3. Agent-specific scores in Neo4j | ✅ All 8 agent scores stored |
| 4. Deduplication step | ✅ Node 2.5 added |
| 5. INBOX backlog policy | ✅ 7-day max age, 50-item limit |
| 6. Temperature spread 0.3/0.8 | ✅ Screening=0.3, Critical=0.8 |
| 7. Idempotency | ✅ MERGE with upsert key |
| 8. CAD cost analysis | ✅ ~$0.012-0.018/video, $44-330/year |
| 9. ARCHITECTURE.md fixes | ✅ Claude prose, BGE-M3, one-way sync, Kokoro |
| 10. Phase/Sprint normalization | ✅ 8-phase roadmap aligned |

## Next Steps

1. **Push files to personal-cognitive-architecture** (using one of the 3 options above)
2. **Update your workspace** to reference the new repo as the primary location
3. **Build Sprint 5** using SPRINT_5_N8N_SETUP_VALIDATION_LAYER.md
4. **Plan Phase 2** using ARCHITECTURE_RECONCILIATION.md as the roadmap

## Folder Structure (Personal-Cognitive-Architecture)

After migration, the repo should look like:
```
personal-cognitive-architecture/
├── README.md
├── ARCHITECTURE.md
├── SPRINT_5_VALIDATION_LAYER.md
├── SPRINT_5_N8N_SETUP_VALIDATION_LAYER.md
├── SPRINT_5_QUICKSTART.md
├── ARCHITECTURAL_REVIEW_REQUEST_OPUS47.md
├── ARCHITECTURE_RECONCILIATION.md
├── backend/                  (optional: copy from Obsidian repo)
│   ├── app/
│   ├── docker-compose.yml
│   └── README.md
└── docs/                     (optional: future phase docs)
```

---

**Note:** The Obsidian vault remains the source for captures and knowledge storage. This migration is for architectural documentation and implementation specs.
