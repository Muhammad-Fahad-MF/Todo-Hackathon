---
id: 0001
title: Constitute Project
stage: constitution
date: 2026-01-06
surface: agent
model: gemini-pro
feature: none
branch: master
user: fahad
command: /sp.constitution We are executing Phase 2: Todo Full-Stack Web Application. Act as a Lead System Architect. You must enforce these production-level standards across the monorepo.
labels: [constitution]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
tests:
  null
---

## Prompt

/sp.constitution We are executing Phase 2: Todo Full-Stack Web Application. Act as a Lead System Architect. You must enforce these production-level standards across the monorepo.
1. Spec-Driven & Contract-First Protocol

    Contract-First: Before implementing code, ensure the API contract (endpoints, request/response models) is finalized in @spec-kit/specs/api.md.

    Atomic Implementation: Do not implement multiple features in one pass. Every implementation must be a single, verifiable task from the task list.

    Zero-Manual-Code: No code exists outside the specifications. If the code deviates from the spec, the spec is the master; update the spec first.

2. Strict Environment & Config Management

    Zero Hardcoding: No URLs, secrets, or ports in the codebase.

    Validation: Use pydantic-settings in the Backend and a validation script in the Frontend to ensure the app crashes on startup with a clear error if any required .env variable is missing.

    Local vs. Production: Support .env.example files in both /backend and /frontend. Use DATABASE_URL, BETTER_AUTH_SECRET, and API_BASE_URL as mandatory keys.

3. Backend Architecture (FastAPI + SQLModel)

    Async by Default: All database operations and route handlers must use async/await.

    Dependency Injection: Use FastAPI’s Depends for database sessions and authentication guards to ensure testability.

    Structured Logging: Use the logging module to output JSON-formatted logs. Avoid print() statements.

    Pydantic V2: Strictly use Pydantic V2 for all schemas, utilizing field_validator for data integrity.

4. Frontend Architecture (Next.js 16+)

    Type Safety: strict: true in tsconfig.json. No any types allowed. Use Zod for client-side form validation.

    Server Components: Default to React Server Components (RSC) for data fetching to minimize client-side JavaScript.

    Auth Integration: Implement Better Auth using the middleware pattern to protect routes at the edge.

5. Security & Multi-Tenancy (The 'Iron' Rule)

    User Isolation: Every database query must include a .where(Task.user_id == authenticated_user_id) clause. There must be no global 'get_all_tasks' endpoint that lacks a user filter.

    JWT Integrity: The backend must verify the JWT signature using the BETTER_AUTH_SECRET before processing any request. Return 401 Unauthorized for invalid tokens.

6. Operational Excellence

    Health Checks: Provide a /health endpoint in the backend to monitor database connectivity.

    Error Handling: Implement a global exception handler in FastAPI to return consistent JSON error responses (e.g., { "error": "Message", "code": 404 })

## Response snapshot

I have updated the project constitution to version 1.0.0, incorporating the six principles you provided. The constitution is located at `.specify/memory/constitution.md`.

I also updated the `plan-template.md` to align with the new constitution.

## Outcome

- ✅ Impact: High
- 🧪 Tests: None
- 📁 Files: 
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
- 🔁 Next prompts: null
- 🧠 Reflection: The constitution provides a solid foundation for the project. The principles are clear and actionable.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null