---
id: 0050
title: Refactor to Database Session Auth
stage: refactor
date: 2026-01-13
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-in-memory-todo-app
user: user
command: /sp.implement
labels: [auth, backend, session-auth, refactor]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/auth-server.ts
  - backend/app/core/auth.py
  - backend/app/models/models.py
  - specs/001-fullstack-todo-app/tasks.md
tests:
  - manual verification
---

## Prompt
The user requested to implement a robust "Server-Side Session Authentication" strategy where the backend verifies the opaque session token by checking the database, rather than struggling with JWT signing algorithm mismatches.

## Response snapshot
Implemented the requested refactor:

1.  **Frontend Config (`auth-server.ts`)**: Removed `session: { strategy: "jwt" }`. This reverts Better-Auth to its default behavior of issuing random opaque strings as session tokens.
2.  **Backend Logic (`auth.py`)**: Rewrote `get_current_user` to:
    *   Accept the opaque token string.
    *   Query the `Session` table directly (`SELECT * FROM session WHERE token = :token`).
    *   Validate that the session exists and is not expired (`expiresAt > datetime.utcnow()`).
    *   Fetch the associated `User`.
    *   Return the `CurrentUser`.
3.  **Clean Up**: Removed the unused `Jwks` model and table, and updated `tasks.md`.

This approach eliminates complexity around shared secrets and signing algorithms, leveraging the database as the single source of truth for session validity.

## Outcome

- ✅ Impact: Simplified authentication architecture and guaranteed security by enforcing database-backed session validation.
- 🧪 Tests: n/a
- 📁 Files: Modified 4 files.
- 🔁 Next prompts: User needs to clear cookies and re-login to generate a new opaque token.
- 🧠 Reflection: For hybrid architectures (Next.js + Python), database-backed sessions are often more robust than stateless JWTs because they avoid cross-language cryptographic friction.
