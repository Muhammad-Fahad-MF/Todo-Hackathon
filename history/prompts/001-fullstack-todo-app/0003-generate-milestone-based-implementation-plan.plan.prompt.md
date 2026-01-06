---
id: 0003
title: Generate Milestone-Based Implementation Plan
stage: plan
date: 2026-01-06
surface: agent
model: gemini-pro
feature: 001-fullstack-todo-app
branch: main
user: "user"
command: "/sp.plan Act as a Lead System Architect. Based on our Project Constitution (referenced via GEMINI.md), the core specification in specs/001-fullstack-todo-app/spec.md, and the requirements in specs/001-fullstack-todo-app/checklists/requirements.md, generate a milestone-based implementation roadmap."
labels: [plan, architecture]
links:
  spec: "specs/001-fullstack-todo-app/spec.md"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "specs/001-fullstack-todo-app/plan.md"
tests:
  - "none"
---

## Prompt

/sp.plan Act as a Lead System Architect. Based on our Project Constitution (referenced via GEMINI.md), the core specification in specs/001-fullstack-todo-app/spec.md, and the requirements in specs/001-fullstack-todo-app/checklists/requirements.md, generate a milestone-based implementation roadmap.

Save the output to: specs/001-fullstack-todo-app/plan.md

You must incorporate the following production-ready standards into the plan:
Milestone 1: Environment & Foundation (The 'Zero-Trust' Setup)

    Initialize /backend (FastAPI) and /frontend (Next.js).

    Implement .env validation logic using pydantic-settings to ensure DATABASE_URL and BETTER_AUTH_SECRET are verified at startup.

    Set up scripts/sync-types.sh to automate Pydantic-to-TypeScript generation.

Milestone 2: Backend Core & Database Architecture

    Define SQLModel schemas with Mandatory User Isolation (all tables must have user_id).

    Configure Alembic for migrations and create an idempotent seed.py for Neon PostgreSQL.

    Implement the FastAPI Auth Dependency to extract CurrentUser from Better Auth JWTs.

Milestone 3: API & Error Contract

    Develop CRUD endpoints for Tasks, strictly filtering every query by authenticated_user_id.

    Implement a global exception handler to return standardized JSON: {"detail": {"code": "STR", "message": "STR"}}.

    Set up the /health endpoint for monitoring Neon DB connectivity.

Milestone 4: Frontend, Auth & Middleware

    Initialize Next.js 16+ with App Router and Tailwind CSS.

    Integrate Better Auth and implement Edge Middleware to protect dashboard routes.

    Ensure the frontend uses the types generated in Milestone 1 for 100% type safety.

Milestone 5: Integration & 'Iron Rule' Verification

    Connect the UI to the API endpoints.

    Implement the full Task lifecycle (Add, List, Toggle, Delete).

    Mandatory Check: Plan a specific verification task to ensure User A cannot access User B's data by manipulating IDs.

Plan Requirements:

    Identify parallelizable tasks.

    Ensure every milestone leads to a 'Verifiable' state.

    Adhere strictly to the 'Zero-Manual-Code' principle.

## Response snapshot

I have generated the implementation plan as requested and saved it to `specs/001-fullstack-todo-app/plan.md`. The plan is structured around the five milestones provided in the prompt, detailing the tasks, parallelizable work, verification steps, and adherence to the 'Zero-Manual-Code' principle for each milestone.

## Outcome

- ✅ Impact: A comprehensive implementation plan has been created, providing a clear roadmap for development.
- 🧪 Tests: No tests were run.
- 📁 Files: `specs/001-fullstack-todo-app/plan.md` was created.
- 🔁 Next prompts: The next logical step would be to start implementing Milestone 1.
- 🧠 Reflection: The prompt was very detailed and clear, which made it straightforward to generate the plan. The milestone structure is logical and covers the full scope of the project.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None.
- Next experiment (smallest change to try): None.