# Sprint 5: Validation Layer — Quick Start

Canonical source: `jjuniper-dev/personal-cognitive-architecture/docs/SPRINT_5_QUICKSTART.md`

This local Obsidian copy exists for vault reference under `40_Reference/PCA/`.

## Sprint 5 Overview

Sprint 5 introduces dual-agent validation with agreement-driven confidence scoring.

### Core Flow

```text
YouTube Video Captured
→ Screening Agent
→ Critical Agent
→ Agreement Analysis
→ PROMOTE / INBOX / ARCHIVE routing
→ Obsidian validation report
→ Neo4j update
```

### Validation Dimensions

- Source Credibility
- Content Quality
- Relevance to Goals
- Value Alignment

### Routing

- PROMOTE → integrate into knowledge graph
- INBOX → human review required
- ARCHIVE → retain but deprioritize

### Key Architectural Shift

Old model:
```text
Extract tasks from content
```

New model:
```text
Evaluate epistemic quality before integration
```

### Related Canonical Docs

See the PCA repo for:
- `SPRINT_5_VALIDATION_LAYER.md`
- `SPRINT_5_N8N_SETUP_VALIDATION_LAYER.md`
- `ARCHITECTURE.md`
- `ARCHITECTURE_RECONCILIATION.md`

The canonical implementation and architecture source of truth lives in:
`jjuniper-dev/personal-cognitive-architecture`
