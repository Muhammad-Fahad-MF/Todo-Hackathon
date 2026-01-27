---
id: "0071"
title: "fix-next-headers-and-turbopack-config"
stage: "refactor"
date: "2026-01-23"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "fullstack-todo-app"
branch: "main"
user: "fahad"
command: "npm run dev"
labels:
  - "fix"
  - "nextjs"
  - "turbopack"
  - "refactor"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "frontend/src/lib/api.ts"
  - "frontend/tailwind.config.ts"
tests:
  - "npm run build"
---

# Prompt

What is this error suggesting on running app with `npm run dev` and going /dashboard in browser after signing up in @frontend/**. Error: GET /api/auth/get-session 200 in 1155ms (compile: 523ms, render: 632ms)
○ Compiling /dashboard ...
⨯ ./src/lib/api.ts:16:1
Ecmascript file had an error
14 | }
15 |
> 16 | import { headers } from "next/headers";
| ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
17 |
18 | // ... (imports remain the same)
19 |

You're importing a component that needs "next/headers". That only works in a Server Component which is not supported in the pages/ directory.

# Response

Fixed the `Ecmascript file had an error` crash by refactoring `frontend/src/lib/api.ts`.
1.  Removed the top-level import of `next/headers`, which is server-only and causes crashes when the file is imported by Client Components (like `TaskList.tsx`).
2.  Implemented a dynamic `import("next/headers")` inside the server-side check (`typeof window === "undefined"`).
3.  Updated the usage to `await cookies()` (instead of `headers()`) to correctly retrieve the session token and fix a TypeScript error (`Property 'value' does not exist on type 'string'`).
4.  Updated `frontend/tailwind.config.ts` to use `import` instead of `require` for `tailwindcss-animate` to improve compatibility with Turbopack.

Verified the fix by running `npm run build` in `frontend`, which passed successfully.

## Evaluation

The critical crash in `api.ts` is resolved. The application should now compile and run without the reported error. The build process confirmed that the code is syntactically correct and types are valid.
