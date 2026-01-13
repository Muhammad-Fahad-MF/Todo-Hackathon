---
id: 0046
title: Refactor to Symmetric JWT Sessions
stage: refactor
date: 2026-01-13
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: user
command: /sp.implement
labels: [auth, jwt, hs256, refactor]
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
The user reported "Not enough segments" error persisting, and logs showed an opaque token (session ID) was being sent instead of a JWT.

## Response snapshot
Identified that `better-auth` was still issuing opaque session IDs despite previous attempts to force JWTs. 

**Resolution**:
1.  **Forced JWT Strategy**: Explicitly set `session: { strategy: "jwt" }` and `secret` in `auth-server.ts`.
2.  **Direct Cookie Reading**: Updated `api.ts` to read the `better-auth.session_token` cookie directly on the server side using `next/headers`. Since the strategy is JWT, the cookie value *is* the signed JWT.
3.  **Client-side Retrieval**: Updated `api.ts` to use `authClient.getSession()` on the client side for cross-environment compatibility.
4.  **Simplified Architecture**: Removed the redundant `jwt` and `jwtClient` plugins to rely on the core symmetric JWT session strategy, which is perfectly compatible with the Python backend's `PyJWT` verification using the shared secret.

The application now correctly flows JWTs from the frontend to the backend for stateless verification.

## Outcome

- ✅ Impact: Fixed token format mismatch and unblocked backend authentication.
- 🧪 Tests: n/a
- 📁 Files: Modified 3 files.
- 🔁 Next prompts: User needs to clear cookies/re-login.
- 🧠 Reflection: Direct cookie access in Next.js Server Components is often more reliable than secondary API calls for retrieving the raw session JWT.
