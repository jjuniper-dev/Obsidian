---
source_of_truth: false
canonical_source:
  repo: jjuniper-dev/personal-cognitive-architecture
  path: docs/ARCHITECTURE.md
  branch: main
mirror_status: reference_copy
last_synced: 2026-05-30
---

# PCA Architecture — Reference Copy

**Canonical source:** `jjuniper-dev/personal-cognitive-architecture/docs/ARCHITECTURE.md`

This local Obsidian copy exists for vault reference under `40_Reference/PCA/`. It is **not** the source of truth. See the canonical document for the complete architecture.

---

## Layer Models (Summary)

PCA uses two complementary layer models:

### Design Layer Model (5 layers — use for code placement decisions)

| Layer | Name | Typical Components |
|---|---|---|
| L1 | Knowledge & Control | Obsidian, Neo4j, schemas, governance |
| L2 | Agent Runtime | Ayla, workers, model adapters |
| L3 | Workflow & Integration | n8n workflows, webhooks |
| L4 | Infrastructure | Docker, Tailscale, host services |
| L5 | AI Models | Ollama, Anthropic, OpenRouter |

### Functional Decomposition Model (9 layers — use for data flow tracing)

| # | Layer |
|---|---|
| 1 | Input Sources |
| 2 | Capture Layer |
| 3 | Validation Layer |
| 4 | Cognitive Reconciliation Engine |
| 5 | Knowledge Integration Layer |
| 6 | Reasoning & Agents Layer |
| 7 | Execution & Automation Layer |
| 8 | Output Generation Layer |
| 9 | Infrastructure, Governance & Ethics |

### Layer Model Cross-Reference

| Functional Layers (9) | Design Layer (5) | Current Implementation |
|---|---|---|
| 1–2 Input & Capture | L3 + L1 | WF10, WF11, WF16 (live); WF15 (pending) |
| 3 Validation | L3 + L1 | WF10 validation gate (E1.2.3 done 2026-05-30) |
| 4 Reconciliation | L2 + L3 | Pending (E1.3.x) |
| 5 Knowledge Integration | L1 | Obsidian, Qdrant, Neo4j |
| 6 Reasoning & Agents | L2 + L5 | WF12 (live); WF-Ayla (pending) |
| 7 Execution | L3 | n8n, 14+ workflows |
| 8 Output | L2 + L3 | WF10 notes, WF13 alerts, WF14 cost |
| 9 Infrastructure | L4 + L1 | Docker, HashiCorp Vault, Tailscale |

See canonical document in `jjuniper-dev/personal-cognitive-architecture/docs/ARCHITECTURE.md` for:
- Complete layer-by-layer breakdown
- pca operational tier label → design layer mapping
- Data flow examples with current workflow references
- Implementation status table
- Design trade-offs
