---
id: 0059
title: Debug Middleware Redirect Loop
stage: green
date: 2026-01-13
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: user
command: /sp.implement
labels: ["debug", "middleware", "cookies", "redirect-loop"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/middleware.ts
tests:
  - null
---

## Prompt

the issue is not resolved and also I cant see any request log on backend logs. ... on dashboard it is giving 307 code and frontend is not even calling backend. Also log included middleware, maybe middleware can be culprit

## Response snapshot

Confirmed the user's suspicion that the Middleware is the culprit (307 redirect, no backend call). The likely cause is the middleware checking for a specific cookie name (`better-auth.session_token`) while production environments might prefix it (e.g., `__Secure-`).

Modified `frontend/src/middleware.ts` to:
1.  Check for `__Secure-better-auth.session_token` in addition to the standard name.
2.  Log all available cookie names to the Vercel function logs for debugging.

## Outcome

- ✅ Impact: Debugging and potential fix for middleware cookie detection.
- 🧪 Tests: N/A
- 📁 Files: frontend/src/middleware.ts
- 🔁 Next prompts: Redeploy frontend and check logs.
- 🧠 Reflection: Middleware redirects are "silent" to the backend but loud in the browser network tab (307). Always check middleware first for auth redirects.

## Evaluation notes (flywheel)

- Failure modes observed: Cookie naming inconsistency in prod vs dev.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A