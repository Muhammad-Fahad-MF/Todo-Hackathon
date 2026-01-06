---
id: 0001
title: Generate Full-Stack App Spec
stage: spec
date: 2026-01-06
surface: agent
model: gemini-pro
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: {{USER}}
command: /sp.specify
labels: [spec, full-stack, todo-app]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-fullstack-todo-app/spec.md
  - specs/001-fullstack-todo-app/checklists/requirements.md
tests:
  - none
---

## Prompt

Based on our ratified @spec-kit/constitution.md, run /sp.specify to generate the baseline technical specifications for our Phase 2 Full-Stack Web Application. You must generate a comprehensive set of specifications in @spec-kit/specs/ covering the following modules: 1. Database Schema Specification (@specs/database.md) Define a SQLModel-based schema for a multi-user Todo application. Mandatory tables: User and Task. The Task table must include a user_id field (indexed) to enforce strict user isolation. Include fields for: title, description, is_completed, created_at, and updated_at. 2. API Contract Specification (@specs/api.md) Design a RESTful API using FastAPI. Include endpoints for: POST /api/v1/tasks (Create) GET /api/v1/tasks (List all for the authenticated user) PATCH /api/v1/tasks/{task_id} (Update status/title) DELETE /api/v1/tasks/{task_id} (Delete) Security: Every endpoint must require a valid JWT token in the Authorization header. Define standard error responses (401 Unauthorized, 404 Not Found, 422 Validation Error). 3. Frontend & UI Specification (@specs/ui.md) Specify a Next.js 16+ App Router structure. Layout: A clean, responsive dashboard using Tailwind CSS. Features: Auth Pages: Login and Signup forms. Dashboard: A task list with checkboxes for completion and a 'Delete' button. Form: An 'Add Task' input field. Data Fetching: Use Server Components for initial data load and Zod for client-side form validation. 4. Authentication Specification (@specs/auth.md) Detail the integration of Better Auth on the Next.js frontend. Explain the handshake: Frontend authenticates via Better Auth → obtains JWT → attaches JWT to FastAPI requests. Define the Middleware logic for protecting frontend routes. 5. Environment & Infrastructure (@specs/infrastructure.md) List all required environment variables for both /backend and /frontend. Define the connection strategy for Neon PostgreSQL. Specify the monorepo directory structure: /backend (Python/FastAPI) and /frontend (Next.js/TS).

## Response snapshot

Successfully generated a technology-agnostic feature specification for the full-stack Todo application. The process involved:
1.  Creating a new feature branch `001-fullstack-todo-app`.
2.  Drafting an initial spec from the user's technical description.
3.  Validating the spec against a quality checklist and identifying violations (presence of implementation details).
4.  Rewriting the spec to be technology-agnostic, adding sections for Edge Cases, Assumptions, and Out of Scope.
5.  Re-validating the spec successfully and updating the quality checklist.
The specification is now ready for the planning phase.

## Outcome

- ✅ Impact: High. Generated the foundational specification for a new application.
- 🧪 Tests: n/a
- 📁 Files: 
  - `specs/001-fullstack-todo-app/spec.md`
  - `specs/001-fullstack-todo-app/checklists/requirements.md`
  - `history/prompts/001-fullstack-todo-app/0001-generate-full-stack-app-spec.spec.prompt.md`
- 🔁 Next prompts: `/sp.plan`
- 🧠 Reflection: The process of intentionally creating a non-compliant spec and then fixing it based on a checklist is a good way to ensure all constraints are met.

## Evaluation notes (flywheel)

- Failure modes observed: Initial spec contained implementation details, violating the 'technology-agnostic' rule.
- Graders run and results (PASS/FAIL): Initial: FAIL. Revised: PASS.
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a