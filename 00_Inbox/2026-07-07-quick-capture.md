---
title: "Quick Capture "
capture_type: url
url: 
domain: general
source: iPhone 
sensitivity: internal
tags: [null]
status: inbox
_route: obsidian_inbox
created_at: 2026-07-07T00:37:11.803Z
---

# Quick Capture 

# PATH Concept of Operations (ConOps)

**Version:** v0.1
**Date:** 2026-07-06
**Status:** Working EA position for socialization. Not an ARB-confirmed architecture decision.
**Classification:** Unclassified / Non classifié
**Audience:** Chief Information Officer (CIO), Enterprise Architecture (EA) Director, Digital Transformation Branch (DTB) leadership
**Prepared by:** EA / Technology Portfolio Office (TPO)

---

## 1. Purpose

This document explains what the Protected AI Technology Hub (PATH) is intended to do, why it is needed, and how it relates to the Health AI Lab (HAIL). It is written to correct a specific misunderstanding that has taken hold across parts of Health Canada (HC) and the Public Health Agency of Canada (PHAC): the perception of PATH as a sandbox for the Office of the Chief Data Officer (OCDO). PATH is not an environment where experiments happen. It is the mechanism through which governance is enforced at the point where artificial intelligence (AI) actually runs.

This is an EA working position, developed to support upcoming Architecture Review Board (ARB) and executive discussions. It has not yet been formally confirmed by ARB.

---

## 2. The problem PATH exists to solve

HC and PHAC have real AI demand today. Copilot, CANChat, and program-level pilots are already producing genuine adoption. What none of these provide is an enterprise mechanism for making that adoption accountable: a known inventory of what is running, confirmation that data classification and privacy requirements have been met, an audit trail from input to output, and a defined path for authorizing a workload to move from pilot to production.

A recent status review of PATH's own pattern delivery makes the underlying issue concrete. Pattern 1, a virtual-machine-based exploration pattern, is complete through testing. Pattern 2, a containerized workload pattern, has passed every platform, dependency, and workload test but is blocked at user validation because no standard internal ingress path exists. Azure AI Foundry, the model execution service both patterns depend on, is provisioned centrally by the cloud team and sits outside the patterns entirely, meaning the AI runtime itself is not yet governed by the architecture meant to govern it.

None of this reflects a build failure. It reflects the absence of a control plane. Delivery teams are assembling capable components without a shared mechanism to enforce policy, standardize access, or make the result auditable. That gap is what PATH is designed to close.

---

## 3. What PATH is, and what it is not

PATH is the enterprise control plane for AI execution: the layer where policy enforcement, workload onboarding, model routing, and audit logging happen at the moment AI actually runs, not afterward in a review meeting.

PATH is **not**:

- a sandbox for the OCDO or any single team to run experiments in;
- a place where models are hosted for their own sake;
- a governance document or framework that exists separately from operational workloads.

The distinction matters because a sandbox can be ignored once a program is ready to scale. A control plane cannot, by definition, be bypassed without the workload becoming ungoverned. Framing PATH as the former lets it be treated as optional. Framing it as the latter makes clear why every AI workload with material risk needs to pass through it.

---

## 4. Relationship to HAIL and to data governance

PATH and HAIL are co-equal, currently incomplete components of a single enterprise AI platform that does not yet exist as a unified, ARB-endorsed entity.

| | HAIL | PATH |
|---|---|---|
| Primary role | Runtime: executes AI workloads | Control plane: governs how execution happens |
| Current maturity | Operational, supporting real PHAC workloads | Pre-prototype patterns, not approved to proceed |
| Core value demonstrated | Proves HC/PHAC can run AI workloads at all | Intended to prove HC/PHAC can run AI workloads safely and defensibly |
| Primary risk if left alone | Becomes an isolated runtime with no enterprise governance | Becomes a governance abstraction with no operational grounding |

A short way to state the relationship: HAIL runs, PATH governs, and Microsoft Purview classifies and traces the data underneath both. PATH is not meant to recreate data governance. It consumes Purview's classifications and enforces access and handling rules built on top of them.

---

## 5. Operational roles and accountability

Accountability for an AI workload's business outcome and human oversight stays with the program that owns it. PATH does not absorb that accountability; it makes the accountability operationally possible by providing the inventory, intake, audit trail, and lifecycle controls a program needs to demonstrate it.

The OCDO's role in this model is a parallel, coordinating function, not a final approval gate at the end of a sequence. OCDO helps define governance expectations, data stewardship requirements, and Responsible AI criteria concurrently with delivery, rather than reviewing a finished workload after the fact. Placing OCDO as a terminal step would mean governance is checked only once delivery is already complete, which is the opposite of enforcement at runtime.

Cloud operations and DevOps teams currently provide dependencies that each PATH pattern needs to function, including model deployment, permissions, repository management, and secrets handling. Under the target model, these dependencies become standardized services PATH patterns consume directly, rather than manual support each pattern separately requests.

---

## 6. Governance enforced through PATH

Assessments such as the Algorithmic Impact Assessment (AIA), Privacy Impact Assessment (PIA), and Security Assessment and Authorization (SA&A) are evidence artifacts produced inside PATH's governance gates. They are not themselves the gates. PATH is the mechanism that determines when those artifacts are required, checks that they exist before a workload proceeds, and preserves them as part of the audit record.

At minimum, a workload moving through PATH should have: a documented intake decision, a data classification, AIA and PIA status where applicable, an SA&A or Authority to Operate (ATO) status appropriate to the data involved, an audit log, a defined human-oversight model, and a named operational owner. None of this exists today as an enforced, systematic requirement. It exists as a set of separate expectations that different teams are individually responsible for remembering.

---

## 7. Current constraints

PATH cannot proceed to production use today. It has not received approval to proceed as an enterprise service, and Protected B production workloads on either PATH or HAIL are blocked pending ATO. Pattern 2 cannot complete user validation until a standard internal ingress path is defined. Azure AI Foundry ownership has not been assigned at the OCDO/CDO level, which is the primary dependency blocking PATH from bringing the AI runtime inside its own governance boundary.

---

## 8. What this document asks of leadership

This ConOps is intended to change how PATH is discussed, not to request funding or approval on its own. The specific decision this framing supports is the PATH/HAIL convergence decision that EA and TPO intend to bring to ARB: an explicit architecture position on how HAIL's runtime and PATH's control plane converge, rather than continuing to develop in parallel with no shared model. Until that decision is made, PATH should not be described, in any internal or executive material, as a sandbox, and HAIL should not be described as production-ready for Protected B workloads.

---

*This document represents an EA/TPO working position developed for socialization purposes. It is not a citeable GC policy instrument and has not been confirmed by ARB.*


## PCA Routing

- Route: obsidian_inbox
- Gate version: 1.1
- Capture type: url
