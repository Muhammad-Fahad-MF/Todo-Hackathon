---
id: "002"
title: "Fix proxy trailing slash and cookie loss"
stage: "fix"
date: "2026-01-25"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp-01-21"
feature: "fullstack-todo-app"
branch: "main"
user: "fahad"
command: "Fix trailing slash issue in proxy route"
labels:
  - "bugfix"
  - "proxy"
  - "cookies"
  - "nextjs"
links: null
files:
  - "frontend/src/app/api/external/[...slug]/route.ts"
tests: []
---

## Prompt
What the hell is happening frontend in its logs suggesting that the cookies exists and they are going to backend but backend logs are saying that it does not receive any cookies...

## Response
The issue was identified as a redirect loop causing cookie loss.
1. The Next.js proxy route (`[...slug]`) stripped trailing slashes when reconstructing the URL.
2. The FastAPI backend, enforcing strict slashes, returned a `307 Temporary Redirect`.
3. The browser followed the redirect, but in doing so (often due to cross-origin or same-site policies on the redirect target), dropped the authentication cookies.
4. The backend received the redirected request without cookies and returned `401 Unauthorized`.

**Fix:** Updated `frontend/src/app/api/external/[...slug]/route.ts` to check `req.nextUrl.pathname.endsWith('/')` and append the slash to the forwarded URL if present. This prevents the 307 redirect, ensuring the first request succeeds with cookies attached.
