---
id: "003"
title: "Enable trailingSlash in Next.js config"
stage: "fix"
date: "2026-01-25"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-01-21"
feature: "fullstack-todo-app"
branch: "main"
user: "fahad"
command: "Enable trailingSlash: true in next.config.ts"
labels:
  - "config"
  - "nextjs"
  - "routing"
links: null
files:
  - "frontend/next.config.ts"
tests: []
---

## Prompt
still same situation. frontend logs indicate POST 307.

## Response
The previous fix in the proxy handler failed because Next.js itself was likely normalizing the URL (stripping the trailing slash) before the handler code executed, or the browser was following a Next.js-initiated redirect before hitting the proxy logic.

To align the frontend routing with the strict trailing slash requirement of the FastAPI backend, I enabled `trailingSlash: true` in `frontend/next.config.ts`. This forces Next.js to use trailing slashes for all routes, preventing the redirect loop and ensuring requests reach the backend with the slash (and cookies) intact.
