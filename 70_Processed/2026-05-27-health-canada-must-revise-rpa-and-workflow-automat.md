---
pca_score: 88
priority: high
relevance_score: 92
insight_density: 85
action_potential: 88
pca_summary: "Health Canada must revise RPA and workflow automation governance in response to new GC agentic AI guidance, requiring immediate review of in-flight initiatives."
pca_tags: ["AI governance", "policy", "RPA automation", "strategic planning", "government technology", "compliance", "workflow automation"]
scored_at: 2026-05-27T13:55:32.618Z
title: "Health Canada must revise RPA and workflow automation governance in response to new GC agentic AI guidance, requiring immediate review of in-flight initiatives."
capture_type: UNCLASSIFIED / NON CLASSIFIÉ
GC Agentic AI Guidance
Implications for RPA and Workflow Automation
Health Canada — Enterprise Architecture / Technology Portfolio Office
Audience: HC Program and IT Colleagues
EA/TPO Working Note May 2026 BOTTOM LINE
The Government of Canada has published formal guidance on agentic AI
systems. This changes how Health Canada must treat RPA and workflow
automation — particularly any flow that includes AI-assisted logic. Rule-based
automation and AI-informed automation now carry different governance
requirements. In-flight initiatives should be reviewed now.
WHAT THE GC GUIDANCE MEANS
The GC guidance addresses AI systems that can pursue goals, plan tasks, invoke
tools, and execute actions with limited human intervention. This is materially different
from chatbots or generative AI that produces text for a human to review.
The governance requirements the guidance introduces are: bounded autonomy
(enforced limits on what a system can access and do), recoverability (the ability to
stop, trace, and reverse automated actions), auditability, and mandatory human
oversight wherever regulatory authority, rights, or operational consequences are
involved.
These are architectural requirements, not advisory best practices.
THREE CONVERGING SIGNALS
GC POLICY SIGNAL
GC guidance formally elevates
bounded autonomy, recoverability, and
HC PLATFORM ASSESSMENT
The March 2026 Power Platform
assessment found workload-level
runtime governance from maturity
targets to requirements for agentic AI
systems.
monitoring, telemetry, and AI
governance for agentic and workflow-
automation workloads are currently
immature.
PLATFORM DIRECTION
PATH (AI control plane) and HAIL (AI
runtime) are the enterprise response
— but neither is yet fully operational
for governed agentic execution. The
gap is real and near-term.
WHY RPA AND WORKFLOW AUTOMATION ARE DIRECTLY AFFECTED
Traditional RPA executes rules a human pre-defined. The moment a Power
Automate flow, Copilot Studio agent, or RPA script incorporates AI-assisted decision
logic, it crosses into agentic territory under the GC framework.
That transition is already happening: Power Automate flows can invoke AI models;
Copilot Studio agents can trigger automated actions; RPA scripts are increasingly
enhanced with AI-informed routing or classification. Governance designed for rule-
based execution does not cover AI-informed execution.
HOW TO TREAT IN-FLIGHT RPA INITIATIVES
Two questions determine what governance controls apply before an initiative
proceeds or scales:
QUESTION IF YES — REQUIRED ACTIONS TIER
Does the initiative involve any AI
model, Copilot Studio agent, or AI-
inference step in the workflow?
Responsible AI assessment;
human oversight model;
output auditability; model and
connector allow-listing;
rollback plan
Tier 4
Does the workflow take operational
action — sending communications,
modifying records, routing
submissions, or triggering
downstream systems?
Immutable logging; ability to
stop execution; defined
human override path;
recoverability controls
Tier 3+
Initiatives that cannot satisfy the applicable controls should not proceed to production
— including pilots, which frequently become production systems without a formal
uplift review.
RECOMMENDED FRAMING FOR LEADERSHIP
Rule-based automation automates tasks. Agentic automation exercises
judgment. Health Canada's governance model must distinguish between the two.
In-flight initiatives should be reviewed against that distinction now, before it
becomes a compliance finding.
GC SOURCE REFERENCE
Guide on the use of agentic artificial intelligence
canada.ca — Treasury Board Secretariat / Digital Government
EA/TPO working note. Represents EA team interpretation. Not citeable GC policy.
Unclassified / Non classifié
domain: general
source: iPhone 
sensitivity: private
tags: [null]
status: active
lifecycle_state: Active
created_at: 2026-05-27T09:55:20.478-04:00
processed_at: 2026-05-27T14:00:18.028Z
---

# Health Canada must revise RPA and workflow automation governance in response to new GC agentic AI guidance, requiring immediate review of in-flight initiatives.
 UNCLASSIFIED / NON CLASSIFIÉ
GC Agentic AI Guidance
Implications for RPA and Workflow Automation
Health Canada — Enterprise Architecture / Technology Portfolio Office
Audience: HC Program and IT Colleagues
EA/TPO Working Note May 2026 BOTTOM LINE
The Government of Canada has published formal guidance on agentic AI
systems. This changes how Health Canada must treat RPA and workflow
automation — particularly any flow that includes AI-assisted logic. Rule-based
automation and AI-informed automation now carry different governance
requirements. In-flight initiatives should be reviewed now.
WHAT THE GC GUIDANCE MEANS
The GC guidance addresses AI systems that can pursue goals, plan tasks, invoke
tools, and execute actions with limited human intervention. This is materially different
from chatbots or generative AI that produces text for a human to review.
The governance requirements the guidance introduces are: bounded autonomy
(enforced limits on what a system can access and do), recoverability (the ability to
stop, trace, and reverse automated actions), auditability, and mandatory human
oversight wherever regulatory authority, rights, or operational consequences are
involved.
These are architectural requirements, not advisory best practices.
THREE CONVERGING SIGNALS
GC POLICY SIGNAL
GC guidance formally elevates
bounded autonomy, recoverability, and
HC PLATFORM ASSESSMENT
The March 2026 Power Platform
assessment found workload-level
runtime governance from maturity
targets to requirements for agentic AI
systems.
monitoring, telemetry, and AI
governance for agentic and workflow-
automation workloads are currently
immature.
PLATFORM DIRECTION
PATH (AI control plane) and HAIL (AI
runtime) are the enterprise response
— but neither is yet fully operational
for governed agentic execution. The
gap is real and near-term.
WHY RPA AND WORKFLOW AUTOMATION ARE DIRECTLY AFFECTED
Traditional RPA executes rules a human pre-defined. The moment a Power
Automate flow, Copilot Studio agent, or RPA script incorporates AI-assisted decision
logic, it crosses into agentic territory under the GC framework.
That transition is already happening: Power Automate flows can invoke AI models;
Copilot Studio agents can trigger automated actions; RPA scripts are increasingly
enhanced with AI-informed routing or classification. Governance designed for rule-
based execution does not cover AI-informed execution.
HOW TO TREAT IN-FLIGHT RPA INITIATIVES
Two questions determine what governance controls apply before an initiative
proceeds or scales:
QUESTION IF YES — REQUIRED ACTIONS TIER
Does the initiative involve any AI
model, Copilot Studio agent, or AI-
inference step in the workflow?
Responsible AI assessment;
human oversight model;
output auditability; model and
connector allow-listing;
rollback plan
Tier 4
Does the workflow take operational
action — sending communications,
modifying records, routing
submissions, or triggering
downstream systems?
Immutable logging; ability to
stop execution; defined
human override path;
recoverability controls
Tier 3+
Initiatives that cannot satisfy the applicable controls should not proceed to production
— including pilots, which frequently become production systems without a formal
uplift review.
RECOMMENDED FRAMING FOR LEADERSHIP
Rule-based automation automates tasks. Agentic automation exercises
judgment. Health Canada's governance model must distinguish between the two.
In-flight initiatives should be reviewed against that distinction now, before it
becomes a compliance finding.
GC SOURCE REFERENCE
Guide on the use of agentic artificial intelligence
canada.ca — Treasury Board Secretariat / Digital Government
EA/TPO working note. Represents EA team interpretation. Not citeable GC policy.
Unclassified / Non classifié

## PCA Routing

- Lifecycle state: Inbox
- Capture type: UNCLASSIFIED / NON CLASSIFIÉ
GC Agentic AI Guidance
Implications for RPA and Workflow Automation
Health Canada — Enterprise Architecture / Technology Portfolio Office
Audience: HC Program and IT Colleagues
EA/TPO Working Note May 2026 BOTTOM LINE
The Government of Canada has published formal guidance on agentic AI
systems. This changes how Health Canada must treat RPA and workflow
automation — particularly any flow that includes AI-assisted logic. Rule-based
automation and AI-informed automation now carry different governance
requirements. In-flight initiatives should be reviewed now.
WHAT THE GC GUIDANCE MEANS
The GC guidance addresses AI systems that can pursue goals, plan tasks, invoke
tools, and execute actions with limited human intervention. This is materially different
from chatbots or generative AI that produces text for a human to review.
The governance requirements the guidance introduces are: bounded autonomy
(enforced limits on what a system can access and do), recoverability (the ability to
stop, trace, and reverse automated actions), auditability, and mandatory human
oversight wherever regulatory authority, rights, or operational consequences are
involved.
These are architectural requirements, not advisory best practices.
THREE CONVERGING SIGNALS
GC POLICY SIGNAL
GC guidance formally elevates
bounded autonomy, recoverability, and
HC PLATFORM ASSESSMENT
The March 2026 Power Platform
assessment found workload-level
runtime governance from maturity
targets to requirements for agentic AI
systems.
monitoring, telemetry, and AI
governance for agentic and workflow-
automation workloads are currently
immature.
PLATFORM DIRECTION
PATH (AI control plane) and HAIL (AI
runtime) are the enterprise response
— but neither is yet fully operational
for governed agentic execution. The
gap is real and near-term.
WHY RPA AND WORKFLOW AUTOMATION ARE DIRECTLY AFFECTED
Traditional RPA executes rules a human pre-defined. The moment a Power
Automate flow, Copilot Studio agent, or RPA script incorporates AI-assisted decision
logic, it crosses into agentic territory under the GC framework.
That transition is already happening: Power Automate flows can invoke AI models;
Copilot Studio agents can trigger automated actions; RPA scripts are increasingly
enhanced with AI-informed routing or classification. Governance designed for rule-
based execution does not cover AI-informed execution.
HOW TO TREAT IN-FLIGHT RPA INITIATIVES
Two questions determine what governance controls apply before an initiative
proceeds or scales:
QUESTION IF YES — REQUIRED ACTIONS TIER
Does the initiative involve any AI
model, Copilot Studio agent, or AI-
inference step in the workflow?
Responsible AI assessment;
human oversight model;
output auditability; model and
connector allow-listing;
rollback plan
Tier 4
Does the workflow take operational
action — sending communications,
modifying records, routing
submissions, or triggering
downstream systems?
Immutable logging; ability to
stop execution; defined
human override path;
recoverability controls
Tier 3+
Initiatives that cannot satisfy the applicable controls should not proceed to production
— including pilots, which frequently become production systems without a formal
uplift review.
RECOMMENDED FRAMING FOR LEADERSHIP
Rule-based automation automates tasks. Agentic automation exercises
judgment. Health Canada's governance model must distinguish between the two.
In-flight initiatives should be reviewed against that distinction now, before it
becomes a compliance finding.
GC SOURCE REFERENCE
Guide on the use of agentic artificial intelligence
canada.ca — Treasury Board Secretariat / Digital Government
EA/TPO working note. Represents EA team interpretation. Not citeable GC policy.
Unclassified / Non classifié
- Domain: general
- Source: iPhone 
- Review required: Yes
