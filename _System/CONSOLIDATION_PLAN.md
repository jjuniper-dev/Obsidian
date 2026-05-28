# Obsidian Vault Consolidation Plan

**Status:** In Progress  
**Last Updated:** 2026-05-28  
**Goal:** Consolidate distributed vault trees into unified main vault with governed taxonomy

## Executive Summary

This document defines the strategy for collapsing all distributed trees, branches, and sub-vaults into a single consolidated Obsidian vault organized by the taxonomy defined in `_System/Vault Schema.md`.

**Key Principles:**
1. **Consolidate content into semantic folders** — not structure into folders
2. **Maintain full provenance** — track where content originated and when
3. **Deduplication first** — resolve conflicts before migration
4. **Incremental execution** — low-risk trees first, validate before scaling
5. **Enforce at governance level** — prevent re-fragmentation through agent rules

---

## Phase 1: Governance Codification (P0) — IN PROGRESS

**Target Completion:** 2026-06-15

### 1.1 Vault Schema Population

**Status:** In Progress  
**Owner:** jjuniper-dev  

**Deliverables:**
- [x] `_System/Vault Schema.md` — baseline folder taxonomy
- [ ] Wikilink validation rules — formalized in schema
- [ ] Frontmatter standards — by note type (canonical, mirror, capture, concept, etc.)
- [ ] Deduplication heuristics — conflict detection and resolution
- [ ] Agent write rules — consolidated, specific, enforceable

**Acceptance Criteria:**
- [ ] Schema defines all 14 folders and their semantic purpose
- [ ] Frontmatter templates exist for ≥6 note types
- [ ] Deduplication rules are actionable (not vague)
- [ ] Agent rules prevent new root-level trees
- [ ] Default routing sends all agent writes to `00_Inbox`

### 1.2 Consolidation Metadata Standard

**Status:** Draft  

**Add to frontmatter:**
```yaml
consolidation:
  source_tree: "null"  # if migrated from distributed location
  source_path: "null"  # original path before migration
  migration_date: "null"  # YYYY-MM-DD
  migration_pr: "null"  # GitHub PR that performed migration
  human_reviewed: false  # true only after human review
  merged_from: []  # if consolidated from duplicates
  canonical_entity: "null"  # if merged/aliased to existing concept
```

**Rationale:**
- Enables audit trail of all migrations
- Supports reverse mapping (where did this note come from?)
- Tracks human review status
- Links duplicates that were merged

### 1.3 Conflict Resolution Policy

**Status:** Draft  

**For duplicate concepts:**
1. **Canonical vs. Mirror** → Canonical wins; mirror is moved to `40_Reference`
2. **Two canonical sources** → Compare recency and review status; winner is kept, loser is archived with redirect alias
3. **Similar but distinct** → Keep both; create `05_Themes` MOC linking them
4. **Orphaned references** → Create redirect or null entity in `_System/memory/Aliases.md`

---

## Phase 2: Inventory & Deduplication (P0–P1)

**Target Completion:** 2026-06-30

### 2.1 Current Tree Audit

**Status:** Not Started

**Actions:**
1. List all top-level directories and sub-trees in current vault (excluding taxonomy folders)
2. For each tree, document:
   - Tree name and purpose
   - File count, word count, date range
   - Primary topics and entity types
   - Interconnections with other trees
   - Overlaps with governed folders

3. Classify each tree:
   - **Type A (Safe):** Reference material, mirrors, non-overlapping content
   - **Type B (Medium):** Some duplicates, needs review, limited interconnections
   - **Type C (Complex):** Heavy duplicates, dense interconnections, needs human judgment

**Output:** `_System/TREE_INVENTORY.md` (to be created)

### 2.2 Deduplication Analysis

**Status:** Not Started

**For each Type B & C tree:**
1. Semantic similarity scan (embeddings-based) against existing vault content
2. Identify duplicate concepts, projects, people records
3. Flag high-priority merges (duplicates in `04_Concepts` or `02_Projects`)
4. Document merge decisions (which version is canonical, disposal method for duplicates)

**Output:** `_System/DEDUPLICATION_MATRIX.md` (to be created)

### 2.3 Wikilink & Reference Validation

**Status:** Not Started

**Actions:**
1. Extract all wikilinks from all trees
2. Identify broken links (point to non-existent notes)
3. Check for tree-specific reference paths that will break on consolidation
4. Create mapping of old paths → new consolidated paths

**Output:** `_System/WIKILINK_MAP.md` (to be created)

---

## Phase 3: Staged Migration (P1)

**Target Completion:** 2026-07-31 (rolling)

### Migration Sequencing

**Order of Migration (low-risk → high-risk):**

#### Wave 1: Reference Material (Low Risk)
**Target:** 2026-06-15  
- `40_Reference/` existing mirrors
- External documentation and archived references
- No internal dependencies, minimal wikilinks
- **Action:** Audit paths, ensure no broken references, move to consolidated `40_Reference/`

#### Wave 2: Research & Themes (Low-Medium Risk)
**Target:** 2026-06-30  
- Research findings and investigations
- Topic synthesis and theme notes
- **Action:** Deduplicate similar research, consolidate into `03_Research/` and `05_Themes/`
- **Validation:** Check all internal links, update MOCs

#### Wave 3: Concepts (Medium Risk)
**Target:** 2026-07-15  
- Canonical concept definitions
- Reusable knowledge atoms
- **Action:** High-priority deduplication, merge conflicting definitions, consolidate into `04_Concepts/`
- **Validation:** Run wikilink validator, ensure all aliases are registered in `_System/memory/Aliases.md`

#### Wave 4: Projects & People (Medium-High Risk)
**Target:** 2026-07-30  
- Active and completed projects
- Person records and contacts
- **Action:** Deduplicate people and projects, consolidate into `02_Projects/` and `06_People/`
- **Validation:** Check all project backreferences, ensure person records have unique identifiers

#### Wave 5: Daily & Inbox (Low Risk, Rolling)
**Target:** Ongoing  
- Daily notes that are date-immutable
- Transient inbox items
- **Action:** Move dated entries to `01_Daily/YYYY/MM/` structure, delete transient captures

### Per-Tree Migration Workflow

**For each tree being consolidated:**

1. **Pre-Migration Validation**
   - [ ] Run wikilink check on tree
   - [ ] Identify deduplication targets (from `DEDUPLICATION_MATRIX.md`)
   - [ ] Create migration checklist

2. **Content Preparation**
   - [ ] Apply consolidation metadata to all notes in tree
   - [ ] Resolve wikilinks using `WIKILINK_MAP.md`
   - [ ] Merge duplicates with canonical versions
   - [ ] Update all internal links to post-consolidation paths

3. **Migration Execution**
   - [ ] Create feature branch: `feat/consolidate-{tree-name}`
   - [ ] Move/copy files to target folders in governed taxonomy
   - [ ] Add redirects/aliases in `_System/memory/Aliases.md` for old tree paths
   - [ ] Update MOCs and navigation
   - [ ] Run full wikilink validator

4. **Archive Old Tree**
   - [ ] Move original tree to `90_Archive/{tree-name}/{date}/`
   - [ ] Add `CONSOLIDATED.md` marker noting consolidation date and PR
   - [ ] Keep for historical reference only

5. **Pull Request & Review**
   - [ ] Create PR with description referencing `CONSOLIDATION_PLAN.md`
   - [ ] Link any issues/backlog items
   - [ ] Tag for human review (requires approval)
   - [ ] Merge to `feat/vault-consolidation-schema`

6. **Post-Migration Validation**
   - [ ] Run full wikilink validator (no broken links)
   - [ ] Verify no orphaned notes
   - [ ] Check redirect aliases are functional
   - [ ] Confirm no new root-level trees created

---

## Phase 4: Governance Enforcement (P1–P2)

**Target Completion:** 2026-08-31

### 4.1 Update Agent Write Rules

**Status:** Not Started

**In `_System/Vault Schema.md`, update "Agent Write Rules" to enforce:**

1. **No new root-level trees** — agents cannot create folders outside taxonomy
2. **Default inbox routing** — all new agent-written content → `00_Inbox/`
3. **Template requirement** — new content must use a template from `30_Templates/`
4. **Frontmatter validation** — required metadata per note type
5. **Entity deduplication** — before creating a new entity, check `_System/memory/Entities.md`
6. **Wikilink validation** — all links must point to valid consolidated paths

### 4.2 GitHub Actions Validation Workflow

**Status:** To be created  
**File:** `.github/workflows/vault-validation.yml`

**Triggers:**
- On push to `main` (after consolidation complete)
- On pull requests affecting vault content

**Checks:**
- [ ] All frontmatter is valid YAML and contains required fields per note type
- [ ] No wikilinks point to non-existent files
- [ ] No notes exist outside governed folders (except `_System/`)
- [ ] No duplicate entity names in `04_Concepts/` or `06_People/`
- [ ] All notes in `00_Inbox/` have `semantic_status: capture` or `inbox`
- [ ] No new root-level directories created

**Action on Failure:** Block merge, require fix

### 4.3 Consolidation Registry

**Status:** To be created  
**File:** `_System/CONSOLIDATION_REGISTRY.md`

**Content:**
- List of all trees consolidated, with dates and PRs
- Redirect mappings (old paths → new consolidated paths)
- Merged duplicates and their resolution
- Lessons learned and future preventive measures

---

## Backlog Items (Proposed)

### P0 (MVP-Blocking)

```
PCA-BL-016: Vault Content Inventory & Deduplication
- Status: Ready for Work
- Effort: L (Large, 5–8 days)
- Deliverable: _System/TREE_INVENTORY.md, _System/DEDUPLICATION_MATRIX.md
- Acceptance: All trees inventoried, all duplicates identified and categorized

PCA-BL-017: Tree-to-Folder Migration Plan Detail
- Status: Ready for Work
- Effort: M (Medium, 3–5 days)
- Deliverable: Updated CONSOLIDATION_PLAN.md with specific migration targets
- Acceptance: Each tree has assigned destination folder(s), migration sequence locked
```

### P1 (MVP-Enabling)

```
PCA-BL-018: Staged Consolidation Execution (Wave 1–2)
- Status: Blocked by PCA-BL-016
- Effort: XL (Multiple weeks, rolling)
- Deliverable: PRs consolidating Waves 1–2 (Reference, Research, Themes)
- Acceptance: Zero broken wikilinks, all content in governed folders

PCA-BL-019: Vault Consolidation Validation & Tooling
- Status: Design needed
- Effort: M (Medium, 3–5 days)
- Deliverable: GitHub Actions workflow, validation rules
- Acceptance: Vault validation passes on all PRs post-consolidation

PCA-BL-020: Consolidation Registry & Final Cleanup
- Status: Blocked by PCA-BL-018
- Effort: S (Small, 1–2 days)
- Deliverable: CONSOLIDATION_REGISTRY.md, archive cleanup
- Acceptance: Full audit trail of all migrations, all old trees archived
```

---

## Success Criteria

✅ **Consolidation is successful when:**

1. All content is organized by the taxonomy in `_System/Vault Schema.md`
2. No root-level trees exist outside the 14 governed folders + `_System/` + `90_Archive/`
3. Zero broken wikilinks (validated by GitHub Actions)
4. No duplicate entity records in `04_Concepts/` or `06_People/` (deduplicated)
5. All notes have valid consolidation metadata (source_tree, migration_date, etc.)
6. Agent write rules prevent re-fragmentation (all new content routes through `00_Inbox/`)
7. GitHub Actions workflow enforces governance on every PR
8. `_System/CONSOLIDATION_REGISTRY.md` documents full migration history
9. All old trees archived to `90_Archive/` with redirect aliases
10. No new distributed trees created for at least 30 days post-consolidation

---

## Timeline

| Phase | Start | End | Status |
|---|---|---|---|
| **Phase 1: Governance** | 2026-05-28 | 2026-06-15 | IN PROGRESS |
| **Phase 2: Inventory & Dedup** | 2026-06-01 | 2026-06-30 | BLOCKED (waiting P1 completion) |
| **Phase 3: Migration (Waves 1–5)** | 2026-06-15 | 2026-07-31 | BLOCKED |
| **Phase 4: Enforcement & Cleanup** | 2026-07-15 | 2026-08-31 | BLOCKED |
| **Post-Consolidation (30-day window)** | 2026-09-01 | 2026-09-30 | VALIDATION |

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| **Broken wikilinks on large scale** | High | Comprehensive wikilink audit (Phase 2), GitHub Actions validator (Phase 4) |
| **Deduplication conflicts** | Medium | Establish clear conflict resolution policy (Phase 1), human review before merge |
| **Agent re-fragmentation** | Medium | Update agent write rules, enforce taxonomy in GitHub Actions |
| **Lost historical context** | Low | Archive old trees + consolidation metadata + registry |
| **Incomplete migration** | High | Phased approach (Waves 1–5), validation before each wave |

---

## Next Steps

**Immediate (Next 5 Days):**
1. Finalize frontmatter standards and add to `_System/Vault Schema.md`
2. Add consolidation metadata structure to schema
3. Formalize conflict resolution policy
4. Create `_System/TREE_INVENTORY.md` template

**Week 2 (Days 6–15):**
1. Execute Phase 2 inventory and deduplication analysis
2. Create `_System/DEDUPLICATION_MATRIX.md` and `_System/WIKILINK_MAP.md`
3. Detail specific migration targets in this plan
4. Create GitHub Actions workflow skeleton

**Week 3+ (Ongoing):**
1. Begin Wave 1 migrations (Reference material)
2. Validate each migration thoroughly
3. Collect lessons learned and adjust plan as needed
4. Keep this document updated with actual progress

---

## References

- `_System/Vault Schema.md` — Authoritative taxonomy and governance
- `_System/PCA Backlog Operating Model Alignment.md` — Integration with PCA backlog
- `README.md` — Vault structure overview
- `personal-cognitive-architecture` repo — Canonical PCA architecture

