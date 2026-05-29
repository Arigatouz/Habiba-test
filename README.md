# FlowBoard — Kanban · Draw · AI

[![Deploy to GitHub Pages](https://github.com/Arigatouz/Habiba-test/actions/workflows/deploy.yml/badge.svg)](https://github.com/Arigatouz/Habiba-test/actions/workflows/deploy.yml)

**🔗 Live site:** https://arigatouz.github.io/Habiba-test/

A mobile-friendly productivity app that combines a **Kanban board**, a full-featured
**drawing canvas**, and an **AI assistant** (powered by the Anthropic SDK) that can *see*
your drawing and board to help you design and plan.

## Features

- **Board** — Todo / In Progress / Done columns. Add, edit, delete cards and drag them
  between columns (touch-friendly via SortableJS). Persists to `localStorage`.
- **Draw** — Pen, eraser, line, arrow, rectangle, circle, and text tools. Full-gamut
  color picker + presets, adjustable stroke width, undo/redo, clear, and PNG export.
  Touch drawing works on mobile (the page won't scroll while you draw).
- **Assistant** — Claude with **vision**. It receives an image of your drawing and a
  summary of your board (each toggleable), then critiques sketches, suggests
  improvements, and breaks ideas into tasks. Replies stream in live.
- **Settings** — Save your own Anthropic API key (kept only in your browser), pick the
  Claude model, and verify the key. AI features stay locked until a key is set.

## Tech stack

Vue 3 + Vite + TypeScript · Tailwind CSS · Pinia (+ persisted state) · vue-router ·
vuedraggable · Fabric.js v7 · `@anthropic-ai/sdk` (browser mode) · markdown-it.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

Then open the app, go to **Settings**, and paste your Anthropic API key
(get one at [console.anthropic.com](https://console.anthropic.com/settings/keys)).

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the app and
publishes `dist/` to GitHub Pages. The build uses a relative `base` and hash-based
routing, so it works under the `/Habiba-test/` sub-path with no server config.

## Notes on the API key

The key is stored only in your browser's `localStorage`, and requests go directly from
your browser to `api.anthropic.com` (the SDK runs with `dangerouslyAllowBrowser: true`).
There is no backend — all your data lives locally in the browser.
