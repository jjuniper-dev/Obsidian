---
tags: [system, pca, github, audit, tooling]
type: system-note
owner: PCA
---

# Repo Activity Check

A read-only inspection tool that reports branch and PR activity across the three PCA GitHub repositories.

**Script**: `personal-cognitive-architecture/scripts/repo-activity-check.js`  
**Runbook**: `pca/runbooks/repo-activity-check.md`  
**Worker spec**: `personal-cognitive-architecture/agents/repo-activity-worker.md`

## What it reports

- All branches per repo, grouped by type (`claude/`, `codex/`, `feat/fix/chore`, default)
- Age of each branch in days, with last-commit date
- Whether a branch has an open PR
- Stale branch flags: no open PR and older than threshold (default 14 days)
- Recent commits to the default branch
- Open PR list with draft status and last-update age

## When to use

- After a Claude Code or Codex session to see what branches were created
- Weekly or monthly branch hygiene review
- Before deciding which stale `claude/` branches can be deleted

## Quick run

```bash
# From personal-cognitive-architecture/
GITHUB_TOKEN=<token> npm run repo-activity-check
```

## Linked docs

- [[PCA Architecture]]
- [[PCA Dev Workflow]]
