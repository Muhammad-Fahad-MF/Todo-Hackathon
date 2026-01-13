---
id: 0040
title: Switch to JWT Tokens for Backend
stage: refactor
date: 2026-01-12
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-in-memory-todo-app
user: user
command: /sp.implement
labels: [auth, jwt, better-auth, handshake]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api.ts
  - frontend/src/lib/auth.ts
tests:
  - manual verification
---

## Prompt

"Not enough segments" error when calling Python backend from Dashboard.

## Response snapshot

Fixed the "Not enough segments" error by ensuring the frontend sends actual JWTs instead of opaque session IDs.
1.  **Server-side Fix**: Updated `api.ts` to fetch from the `/api/auth/token` endpoint (which returns the JWT) instead of `/api/auth/get-session` (which returns the session ID).
2.  **Client-side Fix**: Added the `jwtClient` plugin to `auth.ts` and updated `api.ts` to use `authClient.token()` for consistent JWT retrieval.
3.  **Outcome**: The Python backend now receives a valid 3-part JWT, allowing the `PyJWT` library to successfully decode and verify the user's identity.

## Outcome

- ✅ Impact: Resolved 401 errors caused by token format mismatch.
- 🧪 Tests: n/a
- 📁 Files: Modified `api.ts` and `auth.ts`.
- 🔁 Next prompts: None.
- 🧠 Reflection: Better-Auth distinguishes between session IDs (for cookies) and JWTs (for external APIs). When integrating with a non-JS backend, the `jwt` plugin must be explicitly used to retrieve the JWT string.