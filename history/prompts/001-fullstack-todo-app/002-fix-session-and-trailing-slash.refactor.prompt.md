---
id: 002
title: Fix session handling and trailing slash bugs
stage: refactor
date: 2026-01-24
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: main
user: fahad
command: /sp.solve
labels: ["auth", "bug-fix", "api", "cookies"]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api.ts
  - frontend/src/components/tasks/TaskList.tsx
  - frontend/src/types/schemas.ts
  - backend/app/core/auth.py
  - frontend/scripts/smoke-test.ts
tests:
  - frontend/scripts/smoke-test.ts
---

## Prompt

solve these bugs in code as a senior experience full stack developer.

## Response snapshot

Implemented critical fixes for the "Add Task" bug and session handling:
1. Added trailing slashes to API endpoints in `api.ts` to prevent 307 redirects.
2. Fixed server-side cookie forwarding logic to handle both regular and secure Better-Auth cookies.
3. Enabled unchecking tasks in `TaskList.tsx`.
4. Improved error reporting to prevent `[object Object]` toast messages.
5. Synchronized TypeScript schemas with the backend database models.
6. Created a TypeScript smoke test script to verify full-stack connectivity.

## Outcome

- ✅ Impact: Resolved 401 Unauthorized loops and fixed task addition/toggling functionality.
- 🧪 Tests: Connectivity verified via `frontend/scripts/smoke-test.ts` (List, Create, Delete pass).
- 📁 Files: Modified API core, Task UI components, and Backend Auth logic.
- 🔁 Next prompts: Verify login flow in browser and finalize UI polishing.
- 🧠 Reflection: The 307 redirect from FastAPI was the silent killer, causing cookies to be dropped when the browser hit port 8000 directly.

## Evaluation notes (flywheel)

- Failure modes observed: Aggressive signOut() on 401 masked the root cause (redirects).
- Graders run and results (PASS/FAIL): PASS (Connectivity test)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Update DATABASE_URL to verify-full to resolve PG warnings.
