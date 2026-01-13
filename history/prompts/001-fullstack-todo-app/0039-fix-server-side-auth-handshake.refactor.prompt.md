---
id: 0039
title: Fix Server-Side Auth Handshake
stage: refactor
date: 2026-01-12
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: user
command: /sp.implement
labels: [auth, nextjs, server-components, jwt, handshake]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api.ts
  - frontend/.env
tests:
  - manual verification
---

## Prompt

check these 3 scenarios one by one. (Scenario A: Token missing, Scenario B: Secret Mismatch, Scenario C: Database Lookup)

## Response snapshot

Resolved the 401 "Not authenticated" error by fixing the server-side authentication handshake.
1.  **Scenario A (Token missing)**: Identified that `fetchApi` failed to retrieve the JWT when called from Next.js Server Components because browser cookies were inaccessible. Refactored `api.ts` to use `next/headers` to forward cookies to the internal Better-Auth session endpoint on the server.
2.  **Scenario B (Secret Mismatch)**: Verified that `BETTER_AUTH_SECRET` was correctly synchronized between frontend and backend.
3.  **Scenario C (Database Lookup)**: Confirmed user ID and model compatibility.
4.  **Environment Correction**: Fixed `NEXT_PUBLIC_API_URL` in `frontend/.env` which was incorrectly pointing to the frontend port (3000) instead of the backend (8000).

The frontend can now successfully authenticate requests to the Python backend from both Client and Server components.

## Outcome

- ✅ Impact: Enabled data fetching in the Dashboard by ensuring the Authorization header is correctly populated on the server.
- 🧪 Tests: n/a
- 📁 Files: Modified `api.ts` and `.env`.
- 🔁 Next prompts: None.
- 🧠 Reflection: In Next.js App Router, libraries designed for the browser (like auth clients) often need manual cookie handling when used in Server Components.