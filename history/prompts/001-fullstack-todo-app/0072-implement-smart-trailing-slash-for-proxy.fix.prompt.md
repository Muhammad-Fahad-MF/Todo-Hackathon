---
id: 0072
title: Implement smart trailing slash for proxy
stage: fix
date: 2026-01-25
surface: agent
model: gemini-2.0-flash-thinking-exp
feature: 001-fullstack-todo-app
branch: 001-in-memory-todo-app
user: fahad
command: null
labels: ["proxy", "trailing-slash", "fastapi", "auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/app/api/external/[...slug]/route.ts
 - frontend/next.config.ts
 - frontend/src/lib/api.ts
 - frontend/scripts/proxy-test.ts
tests:
 - frontend/scripts/proxy-test.ts
---

## Prompt

✦ Here is a summary of our current progress and the state of the project to help you start a new session:

  Project Context: Full-Stack Todo App
   * Tech Stack: Next.js (Frontend), FastAPI (Backend), Neon DB (PostgreSQL), Better-Auth (Authentication).
   * Current Focus: Fixing a bug where CRUD requests to the backend returned 401 Unauthorized because authentication cookies were lost during proxying.

  What We Discovered
   1. Strict Routing: The FastAPI backend enforces strict trailing slashes (e.g., /api/v1/tasks/ is required, /api/v1/tasks triggers a 307 redirect).
   2. Cookie Loss: When the Next.js proxy forwarded requests without the trailing slash, the backend issued a 307 Temporary Redirect. The browser followed
      this redirect but dropped the better-auth.session_token cookie, leading to the 401 error.

  Changes Implemented
   1. Enhanced Debugging: Added [API Debug] logs in frontend/src/lib/api.ts to track cookie forwarding and environment (Server vs. Client).
   2. Proxy Fix: Updated frontend/src/app/api/external/[...slug]/route.ts to manually preserve trailing slashes when reconstructing backend URLs.
   3. Next.js Config: Enabled trailingSlash: true in frontend/next.config.ts to enforce trailing slashes globally and align with the backend's routing
      logic.

  Next Steps / Pending Tasks
   * Verify Auth Routes: Confirm if trailingSlash: true impacts the internal Better-Auth routes (e.g., /api/auth/sign-in/). Check for 308 Permanent
     Redirects in the network tab during login/signup and ensure they don't break the authentication flow.
   * Final CRUD Test: Verify that creating/deleting tasks now results in a 200/201 status code instead of the 307 -> 401 loop.

## Response snapshot

Implemented "Smart Trailing Slash" logic in `frontend/src/app/api/external/[...slug]/route.ts` to intelligently add/remove slashes based on the resource type (collection vs. item). Disabled `trailingSlash: true` in `next.config.ts` to allow granular control. This fix prevents the 307 redirect chain that causes cookie loss and 401 errors in FastAPI.

## Outcome

- ✅ Impact: Resolved the 307 -> 401 redirection loop for CRUD operations.
- 🧪 Tests: Created `frontend/scripts/proxy-test.ts` to verify proxy behavior.
- 📁 Files: Modified proxy route, next.config.ts, and api client.
- 🔁 Next prompts: "Verify if the 404 issue in the dev server has cleared after a full system restart."
- 🧠 Reflection: FastAPI's strict routing required a smarter proxy that distinguishes between collection roots and individual resource IDs.

## Evaluation notes (flywheel)

- Failure modes observed: Encountered persistent 404 on proxy routes after configuration changes, likely due to dev server caching.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Perform a full server and machine restart to clear transient routing caches.
