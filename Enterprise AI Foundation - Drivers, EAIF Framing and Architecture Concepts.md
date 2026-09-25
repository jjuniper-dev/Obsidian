---
title: Enterprise AI Foundation — Drivers, EAIF Framing and Architecture Concepts
date: 2026-08-23
status: working-interpretation
type: working-intelligence
tags:
  - PCA
  - EAIF
  - enterprise-ai
  - PATH
  - HAIL
  - data
  - devsecops
  - cyber
  - ATO
  - CANChat
  - capability-model
  - investment
  - roadmap
  - playbook
---

# Enterprise AI Foundation — Drivers, EAIF Framing and Architecture Concepts

## Purpose

Capture the emerging rationale, architecture concepts, planning components, and presentation ideas for the HC/PHAC enterprise AI and data foundation.

This note is a **working interpretation**, not an approved architecture, policy position, or management decision.

---

## 1. Core framing

The Enterprise AI Integration Framework (EAIF) should **not** be presented as the complete enterprise AI plan or an all-in-one deliverable.

It is one component within a broader **constellation of deliverables** required to establish and operate an enterprise AI and data foundation.

Related deliverables may include:

- AI strategy and strategic direction
- AI governance and accountability
- enterprise data architecture and data platform roadmap
- PATH/HAIL convergence and platform architecture
- DevSecOps and developer enablement
- cybersecurity and ATO acceleration
- IM/RM readiness
- platform and service management
- resourcing and operating model
- investment and costing plan
- implementation roadmap
- AI-Ops, DataOps and FinOps
- reference implementations
- AI playbook
- capability model and taxonomy

Different groups will own different parts of this work.

**Working message:** EAIF helps connect these components; it does not replace them.

---

## 2. Why now — enterprise drivers

### HAIL reaching an enterprise decision point

HAIL is approaching a level of maturity where it may become an operational AI platform.

That creates an enterprise architecture and governance decision point.

HC/PHAC should not allow HAIL, PATH, data controls, governance and operational models to evolve independently without determining how they should align.

This should be framed as a positive maturity signal that now requires an enterprise-class decision.

### Time-sensitive investment window

Organizational changes may have created an unusual near-term opportunity to fund foundational work.

The objective should not be to spend because funding is available.

The objective should be to rapidly produce decision-quality material so executives can determine whether the enterprise foundation is worth investing in.

### Prevent HC/PHAC divergence

A major risk is allowing HC and PHAC to develop separate AI platforms, operating models, governance mechanisms and data approaches.

If that happens, later integration between:

- data
- AI agents
- platforms
- identity
- security
- governance
- analytics

will become significantly harder and more expensive.

**Working principle:** waiting is itself an architecture decision and may increase future integration debt.

### In-flight projects need a landing zone

AI demand already exists.

Priority projects should not have to individually create:

- model access
- data pipelines
- identity
- security controls
- governance processes
- RAG infrastructure
- logging
- monitoring
- AI-Ops
- support models

The enterprise foundation should provide reusable capabilities that projects can plug into.

### Shadow AI

If the approved enterprise route is unclear or unusable, people will find another route.

Shadow AI should therefore be treated partly as an **enterprise enablement problem**, not simply a compliance problem.

The sanctioned path should be easier than the unsanctioned path.

### Enterprise identity

Departmental development and AI work should use approved HC/PHAC identities and tenants rather than personal accounts.

Enterprise identity supports:

- access control
- auditability
- ownership
- recoverability
- logging
- offboarding
- security investigation
- governance enforcement

### CANChat is useful but purpose-bounded

CANChat can provide a sanctioned productivity capability for appropriate workloads.

It should not be treated as a replacement for the broader enterprise AI foundation.

The foundation must support capabilities beyond general conversational AI, including mission and program workloads.

### Mission-critical AI capabilities

The enterprise foundation must support AI capabilities that are becoming increasingly important to HC/PHAC priorities.

Examples include:

- regulatory workflows
- pre-market and post-market analysis
- grants and contributions
- surveillance
- scientific evidence assessment
- document intelligence
- OCR
- information extraction
- knowledge retrieval
- decision support
- translation
- external portal intake
- workflow automation
- agentic processes
- enterprise search and knowledge intelligence

### External Portal

The departmental External Portal creates a strong demand for reusable AI capabilities.

Potential AI-enabled portal capabilities include:

- intelligent intake
- OCR and document extraction
- document classification
- completeness checks
- dynamic routing
- triage support
- knowledge assistance
- identity-aware assistance
- back-office workflow acceleration

AI should initially support trusted back-office processing rather than assuming a public-facing chatbot is the primary use case.

### External partner compatibility

HC/PHAC must remain technically and operationally compatible with major health partners.

AI readiness increasingly depends on:

- interoperable data
- modern APIs
- common standards
- machine-readable metadata
- governed AI services
- modern analytics infrastructure

External progress increases the importance of internal AI and data readiness.

---

## 3. AI and data should be funded together

AI and data should not be treated as two unrelated transformation programs.

AI depends on governed, usable, discoverable data.

At the same time, AI creates a practical forcing function for prioritizing and improving enterprise data.

AI can also assist the data modernization process through:

- data inventory
- metadata enrichment
- classification suggestions
- entity extraction
- schema mapping
- lineage discovery
- duplicate detection
- document processing
- semantic grouping
- data-quality analysis
- knowledge graph construction

Human accountability remains required.

**Working proposition:** create a combined AI and data foundation investment rather than sequential independent programs.

---

## 4. IM / Records Management

Information and records management should be a named component of AI readiness.

AI will increasingly retrieve, classify, transform and summarize departmental information.

Potential AI-assisted IM/RM capabilities include:

- metadata suggestions
- classification support
- sensitivity flagging
- duplicate identification
- record association
- retention-tag recommendations
- search and retrieval
- document understanding

AI should assist IM/RM processes, not replace policy authority or records accountability.

---

## 5. DevSecOps and developer enablement

The enterprise response to developers cannot simply be:

> AI is not enabled.

Developers should have a sanctioned enterprise pathway for using AI.

The desired direction is a managed AI-enabled development environment that includes:

- enterprise identity
- approved development tools
- approved model endpoints
- safe development/test data
- source control
- secrets management
- logging
- monitoring
- security scanning
- model and prompt evaluation
- promotion gates
- deployment controls

PATH should be considered as a potential enterprise enablement/control environment rather than merely a restriction mechanism.

**Working message:** “Yes — through the managed enterprise path.”

---

## 6. Cybersecurity / ATO

Cybersecurity capacity is itself a design constraint.

The enterprise cannot depend on every AI project undergoing a completely bespoke authorization process.

A reusable enterprise foundation can reduce cyber workload through:

- inherited controls
- pre-assessed platform components
- reusable security patterns
- standard threat models
- evidence automation
- risk-tiered assessment
- delta reviews
- centralized telemetry
- standard logging
- reusable ATO evidence

The paradox should be made explicit:

**Cyber must help authorize the AI foundation so it does not have to repeatedly authorize the same foundational controls for every AI project.**

Potential deliverable:

**AI Security and ATO Acceleration Package**

---

## 7. Service management / ServiceNow

Enterprise AI capabilities require an operational service model.

AI services should not bypass normal service management.

ServiceNow can provide the enterprise service-management wrapper for:

- service requests
- incident management
- ownership
- service catalogue
- escalation
- change management
- support routing
- knowledge management

AI can also assist ITSM through:

- ticket summarization
- ticket classification
- routing suggestions
- knowledge article generation
- issue clustering
- trend detection

A production AI service should have clear operational ownership and support before go-live.

---

## 8. Technology debt

Without an enterprise AI foundation, every project is likely to create its own:

- integrations
- prompts
- retrieval systems
- controls
- model configurations
- data pipelines
- monitoring
- identity patterns
- security patterns

This creates a new category of **enterprise AI technical debt**.

A shared foundation can reduce this debt through reusable components and inherited controls.

AI can also help address existing technology debt through:

- legacy code analysis
- dependency discovery
- documentation generation
- code modernization assistance
- data mapping
- interface discovery
- migration analysis
- architecture discovery

AI should be positioned as an accelerator for debt reduction, not a promise to eliminate technical debt.

---

## 9. PCA as a reference pattern

PCA should not necessarily be recreated literally at enterprise scale.

Instead, identify the reusable architectural pattern it demonstrates.

Possible pattern:

**Capture → Validate → Govern → Route → Store → Retrieve → Reuse**

Enterprise implementations could realize those functions through approved platforms and enterprise controls.

Potential components include:

- ServiceNow for intake/workflow
- PATH for AI control and developer enablement
- HAIL / enterprise runtime for AI workloads
- Fabric / Databricks for data and analytics workloads
- Purview for metadata, catalogue, lineage and governance
- enterprise identity
- reusable retrieval/graph/agent patterns
- centralized observability and lifecycle controls

The goal is to operationalize the **pattern**, not preserve PCA's prototype technology choices.

---

## 10. Governance technology and evidence

Governance should not exist only as committees and documents.

The enterprise platform should help operationalize governance by creating evidence during normal execution.

Relevant capabilities include:

- workload registration
- model registration
- data classification
- policy enforcement
- identity controls
- model routing
- logging
- approval records
- lineage
- evaluation evidence
- lifecycle status
- exception records
- review dates
- operational telemetry

This creates an auditable chain of evidence demonstrating how controls were applied.

---

## 11. EAIF and playbook relationship

EAIF should define the enterprise model.

A companion **AI Playbook** should explain how teams actually use that model.

### Framework

Defines:

- architecture
- lifecycle
- roles
- control model
- principles
- decision mechanisms

### Playbook

Explains:

- where to start
- who to contact
- what assessments to run
- what artefacts to create
- which governance gates apply
- which reusable patterns to use
- what evidence is required
- how to move into production

A deck version could use a matrix with:

**phases across the top**

and:

**activities / stakeholders / artefacts / gates down the side**

A written version can then provide the detailed field guidance.

---

## 12. EAIF timing concept

Proposed planning horizon: approximately 18 months.

### Months 0–3 — Define and enable the investment decision

Produce enough clarity for leadership to determine whether to:

- invest
- adjust
- sequence
- defer
- stop

Key outputs may include:

- EAIF v0.x
- conceptual architecture
- platform convergence view
- capability model
- governance model
- assessment rubric
- initial investment case
- resourcing model
- implementation roadmap

**Month 3 should be a formal decision gate.**

### Months 3–18 — Mobilize, validate and scale

Potential activities:

- secure funding
- mobilize resources
- validate against real workloads
- implement shared platform capabilities
- mature PATH/HAIL integration
- mature data platform
- establish reusable controls
- introduce AI-Ops/DataOps/FinOps
- operationalize governance
- publish reusable patterns
- scale adoption

Funding and staffing may not become available immediately after the Month-3 decision.

The roadmap should therefore separate **decision readiness** from **resource mobilization**.

---

## 13. AI capability decomposition model

Working HC/PHAC architecture convention:

### L0 — Mission Outcome / Value
Why the capability exists.

### L1 — Business Capability / Service
What the organization provides or performs.

### L2 — AI Capability
What AI must be able to do.

### L3 — AI Solution / Execution Pattern
How AI capabilities are assembled to solve the problem.

### L4 — AI Technique / Model Class
The technical AI method.

### L5 — Platform / Runtime Capability
Where and how the workload executes.

### L6 — Model / Provider / Configuration
The specific implementation.

Important:

The **L0–L6 numbering is a local working convention**, not an industry-standard numbering model.

The value is in maintaining the separation between levels.

### Example — GCTranslate

**L0 — Mission Outcome**
Effective bilingual/multilingual government communication.

**L1 — Business Capability / Service**
Translation and language services.

**L2 — AI Capabilities**
- machine translation
- language detection
- terminology handling
- document extraction
- quality evaluation

**L3 — Execution Patterns**
- document translation workflow
- API translation
- batch translation
- human validation
- terminology-aware processing

**L4 — Technique / Model Class**
- transformer models
- multilingual language models
- sequence-to-sequence models
- OCR where required
- embeddings where required

**L5 — Platform / Runtime**
Approved GC or departmental runtime and supporting services.

**L6 — Model / Provider / Configuration**
Specific model, version, provider, configuration, weights, adapters or fine-tuning.

### Architectural lesson

“Generative AI” and “LLM” are too coarse to serve as the enterprise capability model.

A business service may require multiple AI capabilities, patterns, techniques and enabling services.

---

## 14. Visuals to develop

1. **Why Now / Drivers map**
2. **EAIF within the constellation of enterprise deliverables**
3. **20-section EAIF visual family**
4. **18-month roadmap with Month-3 investment decision gate**
5. **HAIL / PATH / Purview target relationship**
6. **CANChat capability-fit view**
7. **Mission-critical AI capabilities**
8. **AI + Data joint-investment model**
9. **External Portal AI capability model**
10. **DevSecOps / AI developer pathway**
11. **Cyber / ATO control inheritance model**
12. **Enterprise PCA reference architecture**
13. **Governance technology / evidence chain**
14. **AI Playbook lifecycle matrix**
15. **L0–L6 capability decomposition using GCTranslate**
16. **Technology-debt prevention and modernization view**

---

## 15. Items requiring validation

- precise HAIL operational status
- PATH/HAIL target operating relationship
- approved ownership/accountability model
- exact CANChat capability boundaries
- funding window and investment timing
- 18-month leadership expectation
- applicable SSC AI governance/playbook guidance
- platform-specific product roles
- cyber/ATO inheritance feasibility
- ServiceNow AI-service onboarding model
- authoritative HC/PHAC AI capability taxonomy
- GCTranslate technical implementation details

---

## Key working message

> HC/PHAC does not need another isolated AI project. It needs an enterprise foundation that allows priority programs to use AI safely, consistently and quickly while sharing data, controls, platforms and operational capabilities.

> EAIF is one component of that larger enterprise effort. It provides the integration logic, while a constellation of related architecture, governance, platform, data, resourcing and operational deliverables turns that model into an enterprise capability.