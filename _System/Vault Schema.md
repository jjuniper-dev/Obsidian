---
title: Vault Schema
note_type: system
status: active
source_of_truth: true
canonical_layer: obsidian
semantic_status: canonical
updated: 2026-05-26
---

# Vault Schema

## Purpose

This document defines governance for the Obsidian vault as a human-readable semantic memory layer.

## Repository Authority Model

| Repository | Role | Authority |
|---|---|---|
| `jjuniper-dev/personal-cognitive-architecture` | System architecture, implementation, workflows, agents, roadmap, backlog execution | Canonical architecture and implementation authority |
| `jjuniper-dev/Obsidian` | Central Obsidian vault, human-readable memory, reference notes, captured knowledge | Canonical human-readable memory surface |

Architecture reference documents may be mirrored into the Obsidian vault under `40_Reference/PCA/`, but unless explicitly marked otherwise, the PCA repository remains the source of truth for architecture and implementation.

## Taxonomy Model

The vault currently supports two folder schemes:

1. **Governed canonical taxonomy** (target state in GitHub main)
2. **Capture taxonomy** (legacy/ingest structure from OneDrive Remotely Save)

### Canonical Taxonomy (authoritative)

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

### Capture Taxonomy (transitional)

Observed capture folders in OneDrive (`Apps/remotely-save/050926_vault`) include:

- `10_Reflections`
- `20_Notes`
- `30_Clippings`
- `40_Research`
- `50_Tasks`
- `60_Reference`
- `70_Processed`

These are accepted as ingestion folders and should be progressively normalized into canonical taxonomy.

### Folder Normalization Map

- `10_Reflections` -> `04_Concepts` or `05_Themes`
- `20_Notes` -> `00_Inbox` (triage) or `03_Research`
- `30_Clippings` -> `40_Reference`
- `40_Research` -> `03_Research`
- `50_Tasks` -> `02_Projects`
- `60_Reference` -> `40_Reference`
- `70_Processed` -> `07_Outputs` or `90_Archive`

## Core Fields (Cross-cutting)

```yaml
title:
note_type: capture | concept | reference | decision | project | source | moc | daily | system | reflection | task | clipping
status: inbox | draft | active | canonical | archived
context: personal | work | mixed
sensitivity: public | internal | confidential | restricted
tags: []
created:
updated:
related: []
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

Before writing/updating a vault note, agents must determine:
1. Is this vault-native or a mirror of another source?
2. Does note frontmatter contain valid `source_of_truth` metadata?
3. Is this canonical concept/reference/capture/decision/project/transient inbox?
4. Does the write create duplicate concept or broken wikilinks?
5. If in capture taxonomy, should this be promoted/moved into canonical taxonomy?

