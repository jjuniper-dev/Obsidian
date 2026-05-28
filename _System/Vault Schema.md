# Vault Schema

## Purpose

This document defines governance for the Obsidian vault as a human-readable semantic memory layer.

## Repository Authority Model

The PCA uses at least two GitHub repositories with distinct authority boundaries.

| Repository | Role | Authority |
|---|---|---|
| `jjuniper-dev/personal-cognitive-architecture` | System architecture, implementation, workflows, agents, roadmap, backlog execution | Canonical architecture and implementation authority |
| `jjuniper-dev/Obsidian` | Central Obsidian vault, human-readable memory, reference notes, captured knowledge | Canonical human-readable memory surface once schema-governed |

Architecture reference documents may be mirrored into the Obsidian vault under `40_Reference/PCA/`, but unless explicitly marked otherwise, the PCA repository remains the source of truth for architecture and implementation.

## Role of Obsidian

Obsidian is a human-readable semantic memory layer.

Obsidian is authoritative for reviewed notes, captures, concepts, references, and human-curated knowledge. It is not automatically authoritative for PCA architecture, implementation, schemas, workflows, or backlog items—those remain the authority of the PCA repo.

## Vault Maturity Status

Current Obsidian repo maturity: early / scaffolded → **consolidating to governed schema**.

Known current state:
- README identifies the repo as the central Obsidian vault.
- PCA architecture reference notes exist under `40_Reference/PCA/`.
- These reference notes point back to the PCA repo as canonical source.
- `_System/Vault Schema.md` now defines governance baseline.
- **Vault consolidation in progress**: collapsing distributed trees into canonical structure.
- Folder taxonomy, templates, canonical entity registry, alias registry, and wikilink validation are in active refinement.

Backlog implication:
Vault governance is an MVP-enabling workstream.

## Folder Taxonomy (Canonical)

Folders are prefixed with numbers for ordering and function clarity. This is the **authoritative structure**—all existing folders not listed below should be migrated or archived.

### Capture & Chronicle (00–09)

- **`00_Inbox`** — capture-first landing zone
  - New clips, quick captures, unprocessed items
  - Agents write here; humans promote to appropriate folders
  - No subcategories; flat until review
  - Retention: transient (promote or archive within 2–4 weeks)

- **`01_Daily`** — daily logs and chronicle notes
  - Daily notes, dated entries (YYYY-MM-DD.md format)
  - Monthly summaries (YYYY-MM.md)
  - Yearly reviews (YYYY.md)
  - Retention: indefinite; archive yearly summaries to `90_Archive/YYYY/`

### Knowledge Base (02–09)

- **`02_Projects`** — active and completed project notes
  - Project index, roadmap, phase notes, retrospectives
  - One folder per project or team
  - Subfolders: `active/`, `completed/`, `planning/`
  - Retention: move completed projects to `90_Archive/Projects/` after 12 months of inactivity

- **`03_Research`** — research workups, investigations, deep-dives
  - Research reports, experimental findings, literature reviews
  - Organized by topic or research question
  - Link to source materials in `40_Reference/`
  - Retention: archive concluded research to `90_Archive/Research/`

- **`04_Concepts`** — canonical concept notes
  - Stable, reviewed, reusable knowledge atoms
  - Person-independent; not tied to daily context
  - Required frontmatter: `source_of_truth: true`, `semantic_status: canonical`
  - Minimum viable concept definition: definition, use cases, related concepts, example

- **`05_Themes`** — topic/theme synthesis and cross-cutting narratives
  - Topic indices, theme collections, narrative threads
  - MOC-adjacent but thematic rather than structural
  - Example: "AI Governance", "Health Optimization", "Systems Design"
  - Link to concept notes and project notes

- **`06_People`** — person records, contact info, context
  - One file per person
  - Frontmatter: roles, relationships, last contact, status
  - Link to projects and concepts they're associated with
  - Privacy-aware; sensitive data not stored here

- **`07_Outputs`** — externally consumable outputs
  - Blog posts, publications, presentations, deliverables
  - One folder per output type or medium
  - Subfolders: `blog/`, `presentations/`, `papers/`, `artifacts/`
  - Retention: published artifacts; drafts live in `00_Inbox` until ready

- **`08_Media`** — images, attachments, binary assets
  - Organized by category: `images/`, `attachments/`, `diagrams/`, `screenshots/`
  - Use symbolic references in note text; don't embed large files
  - Retention: deduplicate and clean quarterly

### System & Reference (20–40)

- **`20_MOCs`** — maps of content
  - Master index (`Index.md`)
  - Folder-level indices (`Projects MOC.md`, `Concepts MOC.md`, `People MOC.md`)
  - Thematic indices linked from `05_Themes`
  - No original content; purely structural/linking

- **`30_Templates`** — reusable note templates
  - Template by note type: `Capture.md`, `Concept.md`, `Decision.md`, `Project.md`, `Research.md`, `Daily.md`, `MOC.md`
  - Each template includes required frontmatter and structural guidance
  - Agents use these when creating notes

- **`40_Reference`** — mirrored/reference materials
  - External documentation, architecture specs, standards
  - Organized by source: `40_Reference/PCA/`, `40_Reference/Standards/`, `40_Reference/External/`
  - Required frontmatter: `source_of_truth: false`, `canonical_source: { repo, path, branch }`, `last_synced`, `sync_method`
  - Not editable; sync from canonical source

### System & Administration (_System, agents, logs, routing, memory)

- **`_System`** — governance, schemas, workflows, agent definitions
  - `Vault Schema.md` — this file; authoritative structure definition
  - `Frontmatter Standards.md` — required metadata per note type
  - `Agent Permissions.md` — what agents can write where
  - `Review Workflow.md` — promotion and review process
  - Subfolders: `workflows/`, `schemas/`, `agent-definitions/`

- **`agents/`** — agent definitions and configurations
  - One file per agent role: `Capture Agent.md`, `Researcher.md`, `Analyst.md`
  - Agents' allowed write zones, templates, validation rules
  - Integration with PCA repo agent definitions

- **`logs/`** — operation and integration logs
  - Agent operation logs (writes, errors, validations)
  - Sync logs (vault ↔ PCA, vault ↔ n8n)
  - Audit trail for sensitive note modifications
  - Retention: keep 90 days; archive older logs to `90_Archive/logs/YYYY-MM/`

- **`routing/`** — intent routing and dispatch definitions
  - Capture routing rules (inbox → target folder logic)
  - Integration routing (n8n → vault write targets)
  - Topic routing (concept → related folders)

- **`memory/`** — semantic memory structures
  - Entity registry (`Entities.md`) — canonical list of people, projects, concepts
  - Alias registry (`Aliases.md`) — canonical aliases and wikilink mappings
  - Relationship graph snapshots
  - Used for backlink validation and disambiguation

### Archive (90)

- **`90_Archive`** — retired material
  - `90_Archive/YYYY/` — archived by year
  - `90_Archive/Projects/` — completed projects
  - `90_Archive/Research/` — concluded research
  - `90_Archive/logs/` — historical logs
  - Retention: keep indefinitely; yearly compress

---

## Source-of-Truth Metadata

### Required for mirror/reference notes

```yaml
source_of_truth: false
canonical_source:
  repo: jjuniper-dev/personal-cognitive-architecture
  path: docs/ARCHITECTURE.md
  branch: main
mirror_status: reference_copy
last_synced: 2026-05-28T18:00:00Z
sync_method: manual | automated | webhook
sync_frequency: weekly | monthly | on-demand
```

**Allowed Folders:** `40_Reference/`, `_System/workflows/` (mirrors of pca workflows)  
**Agent Writes:** No direct writes; sync from canonical source only.  
**Review:** Not required; mirrors are informational.

### Required for vault-native canonical notes

```yaml
source_of_truth: true
canonical_layer: obsidian
semantic_status: canonical | draft | review | transient
created_at: 2026-05-28T18:00:00Z
last_reviewed: 2026-05-28T18:00:00Z
confidence: high | medium | low
tags: []
```

**Allowed Folders:** `01_Daily/`, `02_Projects/`, `03_Research/`, `04_Concepts/`, `05_Themes/`, `06_People/`, `07_Outputs/`, `00_Inbox/`  
**Agent Writes:** Agents write to `00_Inbox/` or to agent-designated folders per `agents/*/write_zones`.  
**Review:** `04_Concepts/` notes require human review before marking `canonical`.  
**Promotion Path:** `00_Inbox/ → agent-designated folder → (optional) human review → semantic_status: canonical`

### Optional frontmatter (all notes)

```yaml
aliases: []                    # wikilink aliases
related_concepts: []           # links to 04_Concepts/
related_projects: []           # links to 02_Projects/
related_people: []             # links to 06_People/
agent_provenance: Capture Agent | Researcher | (human-authored)
review_status: pending | approved | rejected
```

---

## Note Types & Templates

Each note type has a template in `30_Templates/`. Agents and humans use these to ensure consistent metadata.

| Note Type | Folder | Frontmatter | Purpose | Review Required |
|---|---|---|---|---|
| Capture | `00_Inbox/` | `semantic_status: transient` | Quick note; unprocessed | No |
| Daily | `01_Daily/` | `source_of_truth: true`, `semantic_status: canonical` | Chronicle, dated entry | No (unless sensitive) |
| Project | `02_Projects/` | `source_of_truth: true`, `semantic_status: draft/canonical` | Active project tracking | Yes (for canonical) |
| Research | `03_Research/` | `source_of_truth: true`, `semantic_status: draft/canonical` | Investigation; workup | Yes (for canonical) |
| Concept | `04_Concepts/` | `source_of_truth: true`, `semantic_status: canonical` | Reusable knowledge atom | **Yes** (mandatory) |
| Theme | `05_Themes/` | `source_of_truth: true`, `semantic_status: canonical` | Topic synthesis | Yes (for canonical) |
| Person | `06_People/` | `source_of_truth: true`, `semantic_status: canonical` | Person record | Yes (for sensitive data) |
| Output | `07_Outputs/` | `source_of_truth: true`, `semantic_status: canonical` | Published deliverable | Yes (before publication) |
| MOC | `20_MOCs/` | `source_of_truth: true`, `semantic_status: canonical` | Map of content | No (structural) |
| Reference | `40_Reference/` | `source_of_truth: false`, `canonical_source: {...}` | Mirror of external source | No (informational) |

---

## Agent Write Rules

Agents must not treat every Markdown file in the Obsidian repo as canonical knowledge.

Before writing or updating a vault note, agents must determine:

1. **Vault-native or mirror?** Is this a vault-native note or a mirror of another source?
2. **Source-of-truth metadata present?** Does the note have appropriate frontmatter?
3. **Note type & folder match?** Is this a capture, concept, reference, decision, project, or transient inbox item? Does it belong in the target folder?
4. **Validation required?** Does this note require alias or wikilink validation against entity registry?
5. **Duplicate check?** Does this write create or merge a duplicate concept (check `_System/memory/Entities.md`)?
6. **Canonical modification?** Does this write modify a human-reviewed/canonical note? (If yes, escalate or write to `00_Inbox/` instead.)
7. **Promotion path?** Should this change go to `00_Inbox/` for human review before direct promotion to target folder?

### Allowed Agent Write Zones

| Agent | Allowed Folders | Notes |
|---|---|---|
| Capture Agent | `00_Inbox/`, (+ `01_Daily/` if templated) | New clips, unprocessed items |
| Researcher | `03_Research/`, `00_Inbox/` | Research workups; inbox for human review |
| Analyst | `04_Concepts/`, `05_Themes/`, `00_Inbox/` | Concept synthesis; inbox if unsure |
| n8n Workflow | `00_Inbox/`, (designated zones per workflow config) | External integrations capture to inbox first |
| Human | All (with review/governance per type) | Can write anywhere with appropriate frontmatter |

### Write Validation Checklist

Before any agent write:

- [ ] Is the target folder in the agent's allowed write zones?
- [ ] Does the note include required frontmatter for its type?
- [ ] Is `source_of_truth` correctly set?
- [ ] For canonical notes: is human review required per note type?
- [ ] For mirrored notes: does `canonical_source` reference the true source?
- [ ] Does the entity/concept already exist in `_System/memory/Entities.md`?
- [ ] Are wikilinks validated against entity registry?
- [ ] Does the note have a meaningful title (not a timestamp)?

---

## Vault Governance Workstream

### Theme I — Vault Governance and Memory Operations

**Objective:** Turn the Obsidian repo from a central vault into a governed semantic memory surface.

**Status:** Consolidation in progress.

**Candidate Backlog Items:**

- Populate and maintain this schema. ✅ (in progress)
- Define official vault folder taxonomy and enforcement checks. ✅ (done)
- Define frontmatter standards by note type. (pending)
- Define canonical entity registry location. (pending)
- Define alias registry location. (pending)
- Define wikilink validation rules. (pending)
- Define reference-copy vs canonical-source rules. ✅ (done)
- Define vault write permissions for agents. ✅ (done)
- Define GitHub-backed vault connector read/write policy. (pending)
- Define vault sync and conflict-resolution policy. (pending)
- **Consolidation task:** Migrate existing folders to canonical structure and archive obsolete trees. (in progress)

---

## Migration & Consolidation (In Progress)

### Current → Canonical Folder Mapping

| Current Path | Target Path | Action |
|---|---|---|
| Root `.md` files (day notes) | `01_Daily/YYYY/MM/` | Migrate date-stamped files ✅ (in progress) |
| `_System/` | Keep + expand subdirectories | Already canonical |
| `20_MOCs/`, `30_Templates/`, `40_Reference/`, etc. | Keep as-is | Already following canonical structure |

### Execution Steps (Priority Order)

1. ✅ **Create `01_Daily/` directory structure** with README
2. ✅ **Migrate root-level daily notes** to `01_Daily/YYYY/MM/`
3. **Create `_System/` subdirectories** (`agents/`, `logs/`, `routing/`, `memory/`)
4. **Populate templates** in `30_Templates/` with required metadata
5. **Create entity registry** in `_System/memory/Entities.md`
6. **Create alias registry** in `_System/memory/Aliases.md`
7. **Archive obsolete folders** (if any) to `90_Archive/deprecated/`
8. **Validate wikilinks** across vault
9. **Run vault validation** in Obsidian desktop app
10. **Create PR and request review**

---

## Review & Approval

**Schema Version:** 2026-05-28 (Consolidation Edition)  
**Last Updated:** 2026-05-28  
**Maintained By:** jjuniper-dev (human), with agent write governance  
**Next Review:** 2026-06-28 (after consolidation completion)

---

## Appendix: Glossary

- **Canonical Note:** Vault-native, human-reviewed, source-of-truth knowledge.
- **Mirror/Reference:** Copy of external source; not authoritative here.
- **Semantic Status:** One of `canonical`, `draft`, `review`, `transient`.
- **Entity Registry:** Master list of people, projects, concepts in vault.
- **Wikilink:** Obsidian markdown link (`[[Note Name]]`).
- **Frontmatter:** YAML metadata at top of note.
- **MOC:** Map of Content; index or navigational aid.
- **Agent Provenance:** Which system/human authored the note.
