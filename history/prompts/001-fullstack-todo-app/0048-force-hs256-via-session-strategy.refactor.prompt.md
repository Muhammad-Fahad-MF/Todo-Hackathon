---
id: 0048
title: Force HS256 via Session Strategy
stage: refactor
date: 2026-01-13
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-in-memory-todo-app
user: user
command: /sp.implement
labels: [auth, jwt, hs256, session-strategy, refactor]
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
"Invalid authentication credentials" persisting because frontend is generating EdDSA tokens via JWKS instead of expected HS256.

## Response snapshot
Identified that the `jwt` plugin in Better-Auth v1 prioritizes asymmetric signing (EdDSA/RS256) if a `jwks` table exists, ignoring the `alg: "HS256"` config.

**Resolution**:
1.  **Switch Strategy**: Changed `auth-server.ts` to use `session: { strategy: "jwt" }` and **removed the `jwt` plugin entirely**. This forces Better-Auth to use the shared `BETTER_AUTH_SECRET` to sign the main session token with HS256.
2.  **Update Clients**: Reverted `api.ts` to fetch the session token (which is now the correct JWT) and removed the `jwtClient` plugin from `auth.ts`.
3.  **Outcome**: The frontend now issues symmetric HS256 tokens that the Python backend can verify using the shared secret.

## Outcome

- ✅ Impact: Forced alignment of token signing algorithm (HS256) between frontend and backend.
- 🧪 Tests: n/a
- 📁 Files: Modified 3 files.
- 🔁 Next prompts: User needs to clear cookies/re-login.
- 🧠 Reflection: When a library offers both "JWT Plugin" and "JWT Session Strategy", the distinction is crucial. The plugin is often for OIDC/External interoperability (Asymmetric), while the strategy is for simple stateless sessions (Symmetric).
