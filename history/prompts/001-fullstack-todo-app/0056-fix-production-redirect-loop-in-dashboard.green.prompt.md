---
id: 0056
title: Fix Production Redirect Loop in Dashboard
stage: green
date: 2026-01-13
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: user
command: /sp.implement
labels: ["bugfix", "production", "auth", "api", "nextjs"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api.ts
tests:
  - null
---

## Prompt

after deployment when I am navigating to /dashboard it is redirecting me to /login but I have session cookies/tokens because home(/) is redirecting me /dashboard but that dashboard is redirecting me /login. what can be the issue

## Response snapshot

Identified that the server-side API client (`fetchApi` in `api.ts`) was attempting to fetch the session via an HTTP request to its own app URL (`${APP_URL}/api/auth/get-session`). In production environments (like Vercel), this self-referential call often fails due to network routing or DNS issues, resulting in a missing token, a 401 from the backend, and a redirect to login.

Fixed by replacing the HTTP fetch with a direct call to `auth.api.getSession` using a dynamic import of `@/lib/auth-server`. This ensures the session is retrieved reliably on the server side without network overhead, while avoiding client-side bundle issues with server dependencies.

## Outcome

- ✅ Impact: Fixed infinite redirect loop on Dashboard in production.
- 🧪 Tests: N/A (Production-only issue).
- 📁 Files: frontend/src/lib/api.ts
- 🔁 Next prompts: None.
- 🧠 Reflection: Self-referential HTTP requests in Serverless/Edge environments are a common pitfall. Direct library calls are always preferred.

## Evaluation notes (flywheel)

- Failure modes observed: Production-specific network routing.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A