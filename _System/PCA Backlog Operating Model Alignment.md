# PCA Backlog Operating Model — Obsidian Alignment Update

## Bottom Line

The PCA Backlog Operating Model still fits. The Obsidian repo sharpens authority boundaries:

1. PCA repo = canonical architecture and implementation authority.
2. Obsidian repo = central vault and human-readable memory surface.
3. Obsidian reference copies are not automatically source-of-truth.
4. `_System/Vault Schema.md` is the vault governance anchor.
5. Agent writes to Obsidian require stricter controls than ordinary file writes.
6. Vault governance is a P0/P1 MVP workstream.

## Repository Authority Model

| Repository | Role | Authority |
|---|---|---|
| `jjuniper-dev/personal-cognitive-architecture` | System architecture, implementation, workflows, agents, roadmap, backlog execution | Canonical architecture and implementation authority |
| `jjuniper-dev/Obsidian` | Central Obsidian vault, human-readable memory, reference notes, captured knowledge | Canonical human-readable memory surface once schema-governed |

Architecture reference documents may be mirrored into the Obsidian vault under `40_Reference/PCA/`, but unless explicitly marked otherwise, the PCA repository remains the source of truth for architecture and implementation.

## Vault Maturity Status

Current Obsidian repo maturity: early / scaffolded.

Known current state:
- README identifies the repo as the central Obsidian vault.
- PCA architecture reference notes exist under `40_Reference/PCA/`.
- These reference notes point back to the PCA repo as canonical source.
- `_System/Vault Schema.md` now defines governance baseline.
- Governed taxonomy, templates, alias registry, and wikilink validation still need enforcement.

Backlog implication:
Vault governance should be treated as MVP-enabling work.

## New Theme I — Vault Governance and Memory Operations

Objective: turn the Obsidian repo from a central vault into a governed semantic memory surface.

Candidate backlog items:
- Populate `_System/Vault Schema.md`
- Define official vault folder taxonomy
- Create canonical note template
- Create capture note template
- Create reference note template
- Create concept note template
- Create decision note template
- Create source note template
- Define frontmatter standards
- Define canonical entity registry location
- Define alias registry location
- Define wikilink validation rules
- Define MOC conventions
- Define reference-copy vs canonical-source rules
- Define vault write permissions for agents
- Define GitHub-backed vault connector read/write policy
- Define vault sync and conflict-resolution policy

## Proposed Backlog Items

- **PCA-BL-011** — Populate Vault Schema (P0)
- **PCA-BL-012** — Define Obsidian Source-of-Truth Rules (P0)
- **PCA-BL-013** — Create Vault Note Templates (P1)
- **PCA-BL-014** — Define Vault Folder Taxonomy (P1)
- **PCA-BL-015** — Align GitHub Vault Connector with Vault Governance (P1)


## Detailed Backlog Drafts

### PCA-BL-011 — Populate Vault Schema

**Status:** Needs Design  
**Priority:** P0  
**Type:** Semantic Governance  
**PCA Layer:** Knowledge Integration  
**Repository/Area:** `jjuniper-dev/Obsidian/_System/Vault Schema.md`

**Problem**  
The vault schema location exists, but governance must be codified with explicit policy and constraints.

**Desired Outcome**  
A populated, enforceable schema covering taxonomy, metadata, canonical status, and write controls.

**Acceptance Criteria**
- [ ] Defines official vault folder taxonomy.
- [ ] Defines note types and required metadata.
- [ ] Distinguishes canonical vault-native notes from reference mirrors.
- [ ] Defines wikilink and alias rules.
- [ ] Defines agent write rules.
- [ ] Defines review status model.

### PCA-BL-012 — Define Obsidian Source-of-Truth Rules

**Status:** Needs Design  
**Priority:** P0  
**Type:** Semantic Governance  
**PCA Layer:** Knowledge Integration  
**Repository/Area:** `jjuniper-dev/Obsidian`

**Problem**  
Reference copies and vault-native notes need durable provenance boundaries.

**Desired Outcome**  
A source-of-truth metadata model for mirrored and canonical notes.

**Acceptance Criteria**
- [ ] Defines `source_of_truth` frontmatter.
- [ ] Defines `canonical_source` frontmatter object.
- [ ] Defines `mirror_status`.
- [ ] Defines `last_synced`.
- [ ] Defines stale mirror detection method.
- [ ] Defines whether agents may update mirrored notes directly.

### PCA-BL-013 — Create Vault Note Templates

**Status:** Needs Design  
**Priority:** P1  
**Type:** Documentation / Semantic Governance  
**PCA Layer:** Knowledge Integration  
**Repository/Area:** `jjuniper-dev/Obsidian/30_Templates`

**Required Templates**
- Capture note
- Concept note
- Reference note
- Decision note
- Project note
- Source note
- MOC note
- Review queue item

**Acceptance Criteria**
- [ ] Templates include required frontmatter.
- [ ] Templates support source attribution.
- [ ] Templates support confidence and review status.
- [ ] Templates support canonical entity linkage.
- [ ] Templates support agent provenance.

### PCA-BL-014 — Define Vault Folder Taxonomy

**Status:** Needs Design  
**Priority:** P1  
**Type:** Semantic Governance  
**PCA Layer:** Knowledge Integration  
**Repository/Area:** `jjuniper-dev/Obsidian`

**Candidate Structure**
- `00_Inbox`
- `01_Daily`
- `02_Projects`
- `03_Research`
- `04_Concepts`
- `05_Themes`
- `06_People`
- `07_Outputs`
- `08_Media`
- `20_MOCs`
- `30_Templates`
- `40_Reference`
- `_System`
- `90_Archive`

**Acceptance Criteria**
- [ ] Folder roles are defined.
- [ ] Allowed note types per folder are defined.
- [ ] Agent write permissions by folder are defined.
- [ ] Review/promotion path is defined.
- [ ] Archive path is defined.

### PCA-BL-015 — Align GitHub Vault Connector with Vault Governance

**Status:** Needs Review  
**Priority:** P1  
**Type:** Integration / Security / Semantic Governance  
**PCA Layer:** Knowledge Integration  
**Repository/Area:** PR #23 / `src/ui-dashboard/server`

**Acceptance Criteria**
- [ ] Confirms `vaultRouter` is imported into app/server root router.
- [ ] Confirms dashboard runtime supports tRPC transport.
- [ ] Reviews whether `publicProcedure` is acceptable for vault content.
- [ ] Adds source-of-truth awareness.
- [ ] Adds folder/type awareness.
- [ ] Avoids exposing sensitive/private vault content by default.
