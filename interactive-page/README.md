# Data Engineering Zoomcamp — Interactive Course Reader

A fast, single-page interactive course reader for the **Data Engineering Zoomcamp**.

## Features

- **Unified Course Outline**: Browse all 7 modules, the `dlt` ingestion workshop, setup guides, homework assignments, solutions, and the capstone project in an always-visible sidebar.
- **Instant Lesson & Video Reader**: Click any unit to watch its embedded YouTube lecture video and read the rendered Markdown lesson, complete with 1-click copyable code blocks and inline course diagrams.
- **One-Page Module Mode (`Read All`)**: Stack every lesson and video of a module onto a single continuous scrollable page, with bottom navigation jumping directly to the next course module.
- **Visual Progress Bars**: Track your overall course completion, per-module completion, and inline homework self-check quiz progress (persisted automatically in `localStorage`).
- **Command Palette (`⌘K` / `Ctrl+K`)**: Quickly search and jump to any module or lesson.

## Quick Start

```bash
cd interactive-page
npm install
npm run dev
```

To re-sync the markdown bundle after editing course `.md` files in the repository root:

```bash
npm run sync
```
