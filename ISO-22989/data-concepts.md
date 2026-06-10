---
title: "ISO/IEC 22989 — Data Concepts"
type: reference
source: ISO_IEC_22989
standard: "ISO/IEC 22989:2022"
tags: [iso, ai-standards, terminology, iso-22989]
created_at: "2026-05-30T01:21:04.997Z"
---

# ISO/IEC 22989 — Data Concepts

*Source: ISO/IEC 22989:2022 — Information technology — Artificial intelligence — Concepts and terminology*

## Dataset

A structured collection of data—observations, measurements, or records—assembled and used for training, validating, or testing an AI model, or for analysis.

**Related:** Training data, Validation data, Test data, Ground truth

---

## Training Data

The subset of a dataset used to adjust the parameters of an AI model during the training process. The model learns patterns and relationships from training data.

**Related:** Validation data, Test data, Dataset, Overfitting

---

## Validation Data

Data held out from training and used during model development to tune hyperparameters, select model architectures, and estimate model performance before final evaluation.

**Related:** Training data, Test data, Overfitting

---

## Test Data

An independent dataset used exclusively for final, unbiased evaluation of a trained model's performance. Must not influence training or hyperparameter selection.

**Related:** Training data, Validation data, Model evaluation

---

## Ground Truth

The reference or target labels/values used as the authoritative answer against which model predictions are compared during training or evaluation.

**Related:** Labeling, Training data, Model evaluation

---

## Labeling (Annotation)

The process of assigning meaningful tags, categories, or structured metadata to raw data to create labeled datasets used for supervised machine learning.

**Related:** Ground truth, Training data, Supervised learning

---

## Data Augmentation

Techniques that artificially expand training data by applying transformations—such as rotation, cropping, noise injection, or paraphrasing—to existing examples without altering their labels.

**Related:** Training data, Overfitting, Dataset

---

## Synthetic Data

Artificially generated data that replicates the statistical characteristics of real data, used to supplement training sets, protect privacy, or test AI systems without exposing sensitive information.

**Related:** Data augmentation, Privacy, Generative AI

---

## Bias (Data)

Systematic errors or skewed distributions in training data that reflect historical inequalities, sampling limitations, or measurement errors, potentially causing an AI model to produce unfair or inaccurate outputs.

**Related:** Fairness, Labeling, Training data


---
*ISO/IEC 22989:2022 establishes a common vocabulary for AI to enable consistent communication across stakeholders.*
