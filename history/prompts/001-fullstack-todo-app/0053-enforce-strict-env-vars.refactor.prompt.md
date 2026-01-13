---
id: 0053
title: enforce-strict-env-vars
stage: refactor
date: 2026-01-13
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: user
command: /sp.implement
labels: ["refactor", "env-vars", "security", "bug-fix"]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/lib/auth.ts
 - frontend/src/lib/api.ts
 - specs/001-fullstack-todo-app/tasks.md
tests:
 - null
---

## Prompt

/sp.implement Analyze whole project and make it environment variables strict only as after deploying frontend is calling localhost urls not env urls.

## Response snapshot

Analyzed the frontend codebase and identified hardcoded localhost fallbacks in auth.ts and api.ts. Refactored both files to remove fallbacks and strictly enforce the presence of NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_API_URL, throwing errors if missing. Updated tasks.md with task T036.

## Outcome

- ✅ Impact: Prevents deployed frontend from connecting to localhost by failing fast if env vars are missing.
- 🧪 Tests: Manual verification of code changes.
- 📁 Files: Modified auth.ts and api.ts to remove default values.
- 🔁 Next prompts: Verify deployment build.
- 🧠 Reflection: The user's request was a direct fix on top of the implementation. I treated it as a refactor task and updated the plan accordingly.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null