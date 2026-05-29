---
title: Vault Schema
type: system
status: active
context: mixed
sensitivity: internal
tags:
  - system/schema
  - vault/governance
created: 2026-05-15
updated: 2026-05-15
---

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

Obsidian is authoritative for reviewed notes, captures, concepts, references, and human-curated knowledge. It is not automatically authoritative for PCA architecture, implementation, schemas, workflow definitions, or agent operating rules unless those documents explicitly declare themselves canonical.

## Vault Maturity Status

Current Obsidian repo maturity: early / scaffolded.

Known current state:
- README identifies the repo as the central Obsidian vault.
- PCA architecture reference notes exist under `40_Reference/PCA/`.
- These reference notes point back to the PCA repo as canonical source.
- `_System/Vault Schema.md` now defines governance baseline.
- Folder taxonomy, templates, canonical entity registry, alias registry, and wikilink validation are in active refinement.

Backlog implication:
Vault governance is an MVP-enabling workstream.

## Core Fields

```yaml
title: 
type: note | meeting | decision | project | task | research | reference | daily | template | system
context: personal | work | mixed
sensitivity: public | internal | confidential | restricted
status: inbox | draft | active | waiting | done | archived
area: 
project: 
organization: 
people: []
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
source: 
related: []
```

## Sensitivity Rules

- `public`: safe to publish or share broadly.
- `internal`: normal personal/work operating notes.
- `confidential`: private or work-sensitive; do not place in public repositories.
- `restricted`: credentials, protected information, or sensitive work material; do not store in this vault unless encrypted.

## Context Rules

- `personal`: health, family, finances, habits, personal planning, learning.
- `work`: architecture, governance, meetings, decisions, projects, stakeholders.
- `mixed`: notes that connect personal productivity with work execution.

## Folder Taxonomy (Baseline)

- `00_Inbox` — capture-first landing zone
- `01_Daily` — daily logs and chronicle notes
- `02_Projects` — active project notes
- `03_Research` — research workups and investigation
- `04_Concepts` — canonical concept notes
- `05_Themes` — topic/theme synthesis
- `06_People` — person records
- `07_Outputs` — externally consumable outputs
- `08_Media` — images, attachments, binary assets
- `20_MOCs` — maps of content
- `30_Templates` — reusable note templates
- `40_Reference` — mirrored/reference materials
- `_System` — governance, workflows, schemas, agents
- `90_Archive` — retired material

```text
00 Inbox/
10 Personal/
20 Work/
30 Shared-Knowledge/
40 Projects/
50 Reference/
Templates/
_System/
Attachments/
```

## Recommended Tag Families

```text
#context/personal
#context/work
#context/mixed
#status/inbox
#status/draft
#status/active
#status/waiting
#status/done
#status/archived
#type/note
#type/meeting
#type/decision
#type/project
#type/task
#type/research
#type/reference
#sensitivity/public
#sensitivity/internal
#sensitivity/confidential
#sensitivity/restricted
```

## Source-of-Truth Metadata

### Required for mirror/reference notes

```yaml
source_of_truth: false
canonical_source:
  repo: jjuniper-dev/personal-cognitive-architecture
  path: docs/ARCHITECTURE.md
  branch: main
mirror_status: reference_copy
last_synced:
sync_method:
```

### Required for vault-native canonical notes

```yaml
source_of_truth: true
canonical_layer: obsidian
semantic_status: canonical
```

## Agent Write Rules

Agents must not treat every Markdown file in the Obsidian repo as canonical knowledge.

Before writing or updating a vault note, agents must determine:
1. Is this a vault-native note or a mirror of another source?
2. Does the note have source-of-truth metadata?
3. Is this a canonical concept, reference, capture, decision, project note, or transient inbox item?
4. Does the note require alias or wikilink validation?
5. Does the write create a duplicate concept?
6. Does the write modify a human-reviewed/canonical note?
7. Should the change go to INBOX instead of direct promotion?

## Vault Governance Workstream

### Theme I — Vault Governance and Memory Operations

Objective: turn the Obsidian repo from a central vault into a governed semantic memory surface.

Candidate backlog items:
- Populate and maintain this schema.
- Define official vault folder taxonomy and enforcement checks.
- Define frontmatter standards by note type.
- Define canonical entity registry location.
- Define alias registry location.
- Define wikilink validation rules.
- Define reference-copy vs canonical-source rules.
- Define vault write permissions for agents.
- Define GitHub-backed vault connector read/write policy.
- Define vault sync and conflict-resolution policy.
