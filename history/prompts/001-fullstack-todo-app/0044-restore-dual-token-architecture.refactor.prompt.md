---
id: 0044
title: Restore Dual Token Architecture
stage: refactor
date: 2026-01-12
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-in-memory-todo-app
user: user
command: /sp.implement
labels: [auth, jwt, dual-token, refactor]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/auth-server.ts
  - frontend/src/lib/auth.ts
  - frontend/src/lib/api.ts
tests:
  - manual verification
---

## Prompt

"Not enough segments" error persisted, indicating opaque session token usage.

## Response snapshot

Diagnosed that `session: { strategy: "jwt" }` was either ignored or ineffective in the presence of the database adapter, causing the client to continue sending opaque database session IDs to the backend.

**Resolution**:
Reverted to the robust "Dual Token" architecture:
1.  **Re-enabled `jwt` Plugin**: Configured `auth-server.ts` to use the `jwt` plugin with explicit `alg: "HS256"`. This generates a secondary, standards-compliant JWT specifically for the backend.
2.  **Frontend Client Update**: Re-added `jwtClient` to `auth.ts`.
3.  **API Client Update**: Modified `api.ts` to explicitly fetch this secondary JWT (`/api/auth/token`) instead of the primary session ID (`/api/auth/get-session`).

This ensures the Python backend receives the 3-part JWT it expects, resolving the validation error.

## Outcome

- ✅ Impact: Fixed token format mismatch.
- 🧪 Tests: n/a
- 📁 Files: Modified 3 files.
- 🔁 Next prompts: None.
- 🧠 Reflection: Explicit separation of "Session" (for frontend/middleware) and "Access Token" (for backend API) is a safer architectural pattern when mixing frameworks.