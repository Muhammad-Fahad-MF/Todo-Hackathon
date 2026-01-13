---
id: 0038
title: Fix Ghost Token Bug with Jwks Table
stage: misc
date: 2026-01-12
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: user
command: /sp.implement
labels: [bug-fix, database, auth, jwks, jwt]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/models/models.py
  - backend/alembic/versions/84518683b9ac_add_jwks_table.py
  - specs/001-fullstack-todo-app/tasks.md
tests:
  - alembic upgrade head
---

## Prompt

/sp.implement Solve this issue but think step by step before doing anything and keep the project context in mind @specs/001-fullstack-todo-app/spec.md and @specs/001-fullstack-todo-app/plan.md

## Response snapshot

Identified and resolved the "Ghost Token" bug by adding the missing `jwks` table required by Better-Auth v1's JWT plugin.
1.  **Diagnosis**: The missing table caused database transactions to rollback during signup/session creation, while the frontend still received a JWT, leading to a state mismatch.
2.  **Implementation**:
    *   Added `Jwks` model to `backend/app/models/models.py`.
    *   Generated and applied a new Alembic migration (`84518683b9ac`).
    *   Updated `tasks.md` with task `T035` to document the fix.
The authentication flow is now fully synchronized between the client and server.

## Outcome

- ✅ Impact: Resolved critical authentication failure where users were partially logged in but rejected by the backend.
- 🧪 Tests: Applied database migration successfully.
- 📁 Files: Modified 3 files.
- 🔁 Next prompts: None.
- 🧠 Reflection: Authentication plugins often have implicit database requirements that must be explicitly mapped in the backend models when using a separate API server.