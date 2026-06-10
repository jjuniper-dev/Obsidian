---
title: "firecrawl/AI-research-SKILLs — AI Research Engineering Library"
capture_type: reference
url: https://github.com/firecrawl/AI-research-SKILLs
domain: ai-research
source: manual
sensitivity: internal
tags: [ai-research, skills, codex, post-training, infrastructure, evaluation, firecrawl, wf09]
status: inbox
lifecycle_state: Inbox
created_at: 2026-05-29T20:07:25-04:00
---

# firecrawl/AI-research-SKILLs — AI Research Engineering Library

> Comprehensive open-source skills library for turning coding agents into AI research agents. 83 skills maintained by Orchestra Research.

**Source:** [github.com/firecrawl/AI-research-SKILLs](https://github.com/firecrawl/AI-research-SKILLs)

## What it is

Packaged skills designed to give coding agents (Claude Code, Codex, Gemini) research-grade depth on AI engineering topics. Each skill is a structured prompt/context file covering a domain end-to-end with real code examples, troubleshooting guides, and production-ready workflows.

## Coverage (83 skills)

- **Post-training** — RLHF, DPO, PPO, reward modelling, preference data curation
- **Infrastructure scaling** — distributed training, FSDP, DeepSpeed, ZeRO, gradient checkpointing
- **Evaluation frameworks** — benchmarking, evals harness, human preference eval, LM-eval
- **Model architecture** — transformers, attention variants, MoE, SSM
- **Fine-tuning** — LoRA, QLoRA, full fine-tune, adapter methods
- **Mechanistic interpretability** — activation patching, probing, circuits
- **Inference** — vLLM, TRT-LLM, speculative decoding, quantisation
- **MLOps / Observability** — experiment tracking, deployment, monitoring
- **Context engineering** — (new 2026) context window management, ordering, freshness
- RAG, multimodal, agents, prompt engineering, data processing, ML paper writing

## PCA integration plan

- **Codex reference**: context_refs in task specs can point to specific skill files for relevant domains
- **WF09 skill injection**: auto-detect prompt domain → fetch matching skill from repo → prepend as context (GitHub issue queued)

## PCA Routing

- Lifecycle state: Inbox
- Capture type: reference
- Domain: ai-research
- Source: manual
- Review required: No — reference library, capture is complete