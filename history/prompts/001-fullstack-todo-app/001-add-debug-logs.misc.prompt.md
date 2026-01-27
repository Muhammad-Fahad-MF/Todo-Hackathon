---
id: "001"
title: "Add debug logs for frontend API requests"
stage: "misc"
date: "2026-01-25"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-01-21"
feature: "fullstack-todo-app"
branch: "main"
user: "fahad"
command: "Add debug logs in frontend for CRUD requests to backend with cookies"
labels:
  - "debug"
  - "frontend"
  - "logging"
links: null
files:
  - "frontend/src/lib/api.ts"
tests: []
---

## Prompt
Add debug logs in frontend for CRUD requests to backend with cookies also, I want to see if frontend is sending session tokens to backend

## Response
Added extensive debug logging to `frontend/src/lib/api.ts` in the `fetchApi` function.
The logs now capture:
1.  Request method and URL.
2.  Execution environment (Server vs Client).
3.  Server-side cookie extraction (`better-auth.session_token`, `__Secure-better-auth.session_token`).
4.  Constructed Cookie header for server-side requests.
5.  Final headers sent with the request.
6.  Response status code.

This will allow verification of whether session tokens are being correctly forwarded to the backend.
