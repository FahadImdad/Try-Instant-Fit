---
smart_default: false
---
# Workspace Map — Try Instant Fit

> **Purpose**: Project architecture and code-repo layout for AI context
>
> **Updated**: 2026-05-05 — registered live GitHub repos

---

## Product Overview

**Try Instant Fit** — AI-powered virtual try-on for fashion retail. CEO: Muhammad Fahad Imdad.

Core flow: customer scans QR code on garment tag → uploads selfie → sees themselves wearing the garment → buys / shares.

---

## Repository Architecture

The product lives across **three** GitHub repositories under `github.com/FahadImdad`:

### 1. Try-Instant-Fit-Nexus (this directory)
- **URL**: https://github.com/FahadImdad/Try-Instant-Fit-Nexus
- **Role**: Operating system / orchestration layer.
- **Contains**: Nexus skills, memory, builds, AND development mirrors of `/website/` and `/backend/`.
- **Local origin**: `origin` is set to this repo.

### 2. Try-Instant-Fit-Website (live marketing site)
- **URL**: https://github.com/FahadImdad/Try-Instant-Fit-Website
- **Role**: Production source-of-truth for the public marketing site at tryinstantfit.com.
- **Local mirror**: `04-workspace/../website/` (i.e. [website/](../website/) at Nexus root).
- **Pages**: index, products, how-it-works, pricing, register, demo, install, dashboard.
- **For any SEO / copy / design change intended to ship live**: the change must land in this repo.

### 3. Try-Instant-Fit-Backend (live backend)
- **URL**: https://github.com/FahadImdad/Try-Instant-Fit-Backend
- **Role**: Production backend — try-on API, dashboard data, billing, analytics.
- **Local mirror**: [backend/](../backend/) at Nexus root.

---

## Sync Mechanism

The relationship between the local mirrors inside this Nexus repo and the standalone live repos is **not yet documented** here. Before pushing production-bound changes, confirm with the user:

- Are `/website/` and `/backend/` here git submodules / subtrees of the live repos?
- Or are they manual copies that need a separate `git push` to a different remote?
- Or are they snapshots that get re-uploaded to the live repos by hand?

This affects every change-to-deploy workflow.

---

## Folder Structure (this Nexus repo)

```
Try-Instant-Fit-Nexus/
├── 00-system/          # Nexus orchestrator, skills, mental models
├── 01-memory/          # Personal memory: goals, learnings, config
├── 04-workspace/       # This file + workspace artifacts
├── website/            # Marketing site (mirror of Try-Instant-Fit-Website)
├── backend/            # Backend services (mirror of Try-Instant-Fit-Backend)
└── CLAUDE.md           # Nexus boot instructions
```

---

**Last Updated**: 2026-05-05
