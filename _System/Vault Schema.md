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

Use this schema to keep personal and work-related notes separated but interoperable.

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

## Recommended Root Folders

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
