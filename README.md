# Obsidian Vault

Central Obsidian Vault — human-readable semantic memory layer for the Personal Cognitive Architecture (PCA).

## Purpose

This vault serves as the canonical location for:
- Human-curated knowledge and concepts
- Daily notes and chronicles
- Active project tracking
- Research workups and findings
- Person records and contacts
- External outputs and publications
- System governance and agent definitions

See `_System/Vault Schema.md` for authoritative governance and folder taxonomy.

## Structure

The vault is organized into numbered folders for clarity and semantic organization:

### Capture & Chronicle (00–09)

- **`00_Inbox/`** — Quick capture landing zone for new clips and unprocessed items
- **`01_Daily/`** — Daily logs, dated entries (YYYY-MM-DD format), monthly and yearly summaries

### Knowledge Base (02–09)

- **`02_Projects/`** — Active and completed project notes, roadmaps, retrospectives
- **`03_Research/`** — Research workups, investigations, deep-dives, experimental findings
- **`04_Concepts/`** — Canonical, reviewed, reusable knowledge atoms (stable reference)
- **`05_Themes/`** — Topic/theme synthesis and cross-cutting narratives
- **`06_People/`** — Person records with roles, relationships, and context
- **`07_Outputs/`** — Externally consumable outputs: blog posts, presentations, publications
- **`08_Media/`** — Images, attachments, diagrams, and binary assets

### System & Reference (20–40)

- **`20_MOCs/`** — Maps of Content; structural indices and navigation
- **`30_Templates/`** — Reusable note templates for consistency
- **`40_Reference/`** — Mirrored/reference materials from external sources (not authoritative here)

### System & Administration

- **`_System/`** — Vault governance, schemas, workflows
  - `agents/` — Agent definitions and write permissions
  - `logs/` — Operation and integration logs
  - `routing/` — Intent routing and dispatch rules
  - `memory/` — Entity registry, alias mappings, relationship graphs

### Archive

- **`90_Archive/`** — Retired material, organized by year and category

## Authority Model

| Repository | Role | Authority |
|---|---|---|
| **`jjuniper-dev/personal-cognitive-architecture`** | System architecture, implementation, workflows, agents, backlog | Canonical architecture & implementation |
| **`jjuniper-dev/Obsidian`** | Central vault, human-readable memory, captured knowledge | Canonical human-readable memory |

Vault notes are authoritative for reviewed concepts, captures, and human-curated knowledge. The PCA repo remains authoritative for system architecture and workflows.

## Getting Started

### For Humans

1. **Daily notes:** Add dated entries to `01_Daily/`
2. **Capture ideas:** Drop unprocessed notes in `00_Inbox/`
3. **Create concepts:** Write reviewed knowledge atoms to `04_Concepts/`
4. **Project tracking:** Manage active projects in `02_Projects/`

### For Agents

1. Check `_System/Vault Schema.md` for write rules and allowed folders
2. Review `agents/` definitions for your role and permissions
3. Use templates from `30_Templates/` for consistency
4. Default behavior: write new captures to `00_Inbox/` for human review
5. Validate against entity registry before creating duplicates

### For Integrations

- n8n workflows write to `00_Inbox/` by default (see routing rules in `_System/routing/`)
- PCA repo can mirror architecture docs to `40_Reference/PCA/`
- External sources sync to `40_Reference/` with proper metadata

## Key Files

- **`_System/Vault Schema.md`** — Authoritative structure definition and governance
- **`_System/CONSOLIDATION_PLAN.md`** — Recent consolidation execution details
- **`_System/agents/`** — Agent role definitions and write permissions
- **`_System/memory/Entities.md`** — Canonical entity registry
- **`_System/memory/Aliases.md`** — Wikilink disambiguation

## Vault Governance

See `_System/Vault Schema.md` for:
- Complete folder taxonomy with purposes and retention policies
- Frontmatter standards by note type
- Agent write rules and validation
- Source-of-truth metadata requirements
- Review and promotion workflows

## Usage Patterns

### Writing a New Concept
1. Use template from `30_Templates/Concept.md`
2. Write to `04_Concepts/ConceptName.md`
3. Include frontmatter: `source_of_truth: true`, `semantic_status: draft`
4. Link to related concepts and projects
5. Request human review before marking `canonical`

### Capturing External Knowledge
1. Drop raw note in `00_Inbox/`
2. Include source attribution
3. Human reviews and moves to appropriate folder
4. Example destinations: `03_Research/`, `40_Reference/`, `07_Outputs/`

### Tracking an Active Project
1. Create folder in `02_Projects/ProjectName/`
2. Write project charter to `02_Projects/ProjectName/README.md`
3. Add phase notes, decisions, retrospectives
4. Move to `90_Archive/Projects/` after completion

### Daily Logging
1. Create or open `01_Daily/YYYY-MM-DD.md`
2. Use template from `30_Templates/Daily.md`
3. Log events, reflections, and next steps
4. Archive yearly summaries to `90_Archive/YYYY/`

## Integration with PCA

This vault integrates with the broader PCA system:

- **n8n Workflows** → Write captures to `00_Inbox/`
- **Qdrant** → Indexes vault concepts for semantic search
- **Neo4j** → Graphs relationships between entities
- **Vault** → Provides HashiCorp Vault integration for secrets
- **Ollama** → Local LLM can reason over vault concepts

Workflow definitions are mirrored in `40_Reference/` or stored in PCA repo as canonical source.

## Quick Links

- [Personal Cognitive Architecture](https://github.com/jjuniper-dev/personal-cognitive-architecture) — Main PCA system repo
- [Vault Schema](/_System/Vault Schema.md) — Governance authority
- [Consolidation Plan](/_System/CONSOLIDATION_PLAN.md) — Recent migration details
- [Agent Definitions](/_System/agents/) — What agents can write where

## Status

**Vault Maturity:** Early / Actively Consolidating  
**Last Update:** 2026-05-28  
**Consolidation Status:** Schema and structure in place; content migration in progress

See `_System/Vault Schema.md` for detailed governance status and MVP backlog.
