# Obsidian

Central Obsidian Vault for the Personal Cognitive Architecture (PCA).

This vault is the human-readable semantic memory layer for captures, concepts, references, and synthesis artifacts. Canonical architecture and implementation authority remains in the `jjuniper-dev/personal-cognitive-architecture` repository unless a vault note explicitly declares itself canonical.

## Purpose

This repository supports:

- persistent cognitive memory
- structured note maturation from capture to canonical knowledge
- cross-domain synthesis (personal + work)
- agent-assisted but human-governed knowledge evolution

## Governance and Operating Notes

- Vault governance baseline: `_System/Vault Schema.md`
- Backlog alignment and authority model: `_System/PCA Backlog Operating Model Alignment.md`
- Sync SOP (Working Copy + GitHub): `_System/sync-policy.md`
- Frontmatter/folder validation script: `_System/scripts/validate_vault.py`

## Current Taxonomy Baseline (Canonical + Capture-Compatible)

```text
00_Inbox/
01_Daily/
02_Projects/
03_Research/
04_Concepts/
05_Themes/
06_People/
07_Outputs/
08_Media/
20_MOCs/
30_Templates/
40_Reference/
_System/
90_Archive/
```


Capture imports from OneDrive may still arrive under `10_Reflections`/`20_Notes`/`30_Clippings`/`40_Research`/`50_Tasks`/`60_Reference`/`70_Processed`; these are treated as transitional ingestion folders and normalized into the canonical taxonomy during triage.
