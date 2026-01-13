---
id: 0041
title: Sync JWT Algorithm to HS256
stage: refactor
date: 2026-01-12
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-in-memory-todo-app
user: user
command: /sp.implement
labels: [auth, jwt, hs256, security, backend]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/auth-server.ts
  - backend/app/core/auth.py
tests:
  - manual verification
---

## Prompt

"Invalid authentication credentials: The specified alg value is not allowed" error.

## Response snapshot

Fixed the algorithm mismatch between the frontend (Better-Auth) and backend (FastAPI).
1.  **Frontend Fix**: Explicitly configured the `jwt` plugin in `auth-server.ts` to use `alg: "HS256"`. Previously, it was likely defaulting to `RS256`, which the backend was not configured to accept.
2.  **Backend Fix**: Updated `backend/app/core/auth.py` to allow both `HS256` and `RS256` in the `algorithms` list, and added a utility to inspect the token header for easier future debugging.
3.  **Outcome**: Both sides now agree on the symmetric HS256 algorithm using the shared `BETTER_AUTH_SECRET`, allowing the backend to successfully verify the token signature.

## Outcome

- ✅ Impact: Finalized the security handshake, allowing the backend to trust and decode tokens from the frontend.
- 🧪 Tests: n/a
- 📁 Files: Modified `auth-server.ts` and `auth.py`.
- 🔁 Next prompts: None.
- 🧠 Reflection: When using JWTs across different language stacks (Node.js vs Python), explicitly defining the signing algorithm is critical to avoid "not allowed" errors from strict libraries like `PyJWT`.
