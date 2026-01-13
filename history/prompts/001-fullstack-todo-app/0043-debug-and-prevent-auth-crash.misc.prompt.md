---
id: 0043
title: Debug and Prevent Auth Crash
stage: misc
date: 2026-01-12
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-in-memory-todo-app
user: user
command: /sp.implement
labels: [auth, debug, error-handling, nextjs, fastapi]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api.ts
  - backend/app/core/auth.py
tests:
  - manual verification
---

## Prompt

"Not enough segments" error persisting. Add better error handling to prevent crash.

## Response snapshot

1.  **Prevented Crash**: Updated `frontend/src/lib/api.ts` to intercept 401 errors on the server-side and immediately `redirect("/login")` using `next/navigation`. This prevents the "unhandled rejection" crash in the Server Component and gracefully sends the user to re-authenticate.
2.  **Debug Instrumentation**: Added `print(f"DEBUG: Received Token: {token}")` to `backend/app/core/auth.py`. This is critical to confirm if the token being received is indeed an opaque session ID (causing the "segments" error) or a malformed JWT.
3.  **Hypothesis**: The browser likely retains a stale, opaque session cookie from the previous `database` strategy configuration. The server is correctly configured for JWTs, but the client is sending legacy data.

## Outcome

- ✅ Impact: Improved user experience by preventing white-screen crashes on auth errors. Added observability to diagnosing the token format.
- 🧪 Tests: n/a
- 📁 Files: Modified `api.ts` and `auth.py`.
- 🔁 Next prompts: User needs to clear cookies and re-test.
- 🧠 Reflection: Persistent auth errors often require "flushing the pipe" (clearing cookies) when changing strategies, as browsers are stateful.