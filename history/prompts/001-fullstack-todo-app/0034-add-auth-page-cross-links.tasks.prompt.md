---
id: 0034
title: Add auth page cross-links
stage: tasks
date: 2026-01-12
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: user
command: /sp.implement Add already signed up link to login page in signup page. And create an account link in login page.
labels: ["ui", "auth", "ux"]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/app/(auth)/login/page.tsx
 - frontend/src/app/(auth)/signup/page.tsx
tests:
 - npm run lint
---

## Prompt

/sp.implement Add already signed up link to login page in signup page. And create an account link in login page. Act as a senior frontend developer for this task. And do this task carefully without messing up other UI elements.

## Response snapshot

Added "Don't have an account? Sign up" link to Login page and "Already signed up? Login" link to Signup page using Next.js Link component. Verified with lint.

## Outcome

- ✅ Impact: User can navigation between auth pages easily.
- 🧪 Tests: Lint passed.
- 📁 Files: Modified login and signup pages.
- 🔁 Next prompts: None
- 🧠 Reflection: Standard UI update.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null