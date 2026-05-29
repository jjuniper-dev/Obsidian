---
title: Replit Export SpatialSense Archive Pointer
type: reference
status: archived
context: mixed
sensitivity: internal
created: 2026-05-28
updated: 2026-05-28
source: ReplitExport-spatialsense.tar.gz
---

# Replit Export SpatialSense Archive Pointer

The raw Replit export archive was removed from the tracked vault so the Obsidian repository no longer carries a large binary export with nested Replit workspaces and Git histories.

## Archived artifact

- Original filename: `ReplitExport-spatialsense.tar.gz`
- Temporary external location used during this cleanup: `/workspace/Obsidian-external-archive/ReplitExport-spatialsense.tar.gz`
- Contents inspected before removal: `Task-Capture-Bot`, `Task-Capture-Bot-1`, `Couple-Event-Finder`, `Design-Helper`, and `Pptx-Maker`

## Migration decision

- Kept one logical copy of the PCA source by migrating selected `Task-Capture-Bot` patterns into `Apps/pca-event-concierge-poc/`.
- Ignored duplicate `Task-Capture-Bot-1`.
- Migrated selected `Couple-Event-Finder` event concierge UX patterns into the same clean PoC folder.
- Did not migrate Replit-specific configuration such as `.replit`, `.replitignore`, `.replit-artifact`, or `@replit/*` Vite plugins.
