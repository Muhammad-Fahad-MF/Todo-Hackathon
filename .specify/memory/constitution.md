<!--
---
Sync Impact Report
---
Version Change: 0.0.0 -> 1.0.0
Modified Principles:
- PRINCIPLE_1_NAME -> Spec-Driven & Contract-First Protocol
- PRINCIPLE_2_NAME -> Strict Environment & Config Management
- PRINCIPLE_3_NAME -> Backend Architecture (FastAPI + SQLModel)
- PRINCIPLE_4_NAME -> Frontend Architecture (Next.js 16+)
- PRINCIPLE_5_NAME -> Security & Multi-Tenancy (The 'Iron' Rule)
- PRINCIPLE_6_NAME -> Operational Excellence
Added Sections: None
Removed Sections:
- [SECTION_2_NAME]
- [SECTION_3_NAME]
Templates Requiring Updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# Todo Full-Stack Web Application Constitution

## Core Principles

### 1. Spec-Driven & Contract-First Protocol
Contract-First: Before implementing code, ensure the API contract (endpoints, request/response models) is finalized in @spec-kit/specs/api.md.
Atomic Implementation: Do not implement multiple features in one pass. Every implementation must be a single, verifiable task from the task list.
Zero-Manual-Code: No code exists outside the specifications. If the code deviates from the spec, the spec is the master; update the spec first.

### 2. Strict Environment & Config Management
Zero Hardcoding: No URLs, secrets, or ports in the codebase.
Validation: Use pydantic-settings in the Backend and a validation script in the Frontend to ensure the app crashes on startup with a clear error if any required .env variable is missing.
Local vs. Production: Support .env.example files in both /backend and /frontend. Use DATABASE_URL, BETTER_AUTH_SECRET, and API_BASE_URL as mandatory keys.

### 3. Backend Architecture (FastAPI + SQLModel)
Async by Default: All database operations and route handlers must use async/await.
Dependency Injection: Use FastAPI’s Depends for database sessions and authentication guards to ensure testability.
Structured Logging: Use the logging module to output JSON-formatted logs. Avoid print() statements.
Pydantic V2: Strictly use Pydantic V2 for all schemas, utilizing field_validator for data integrity.

### 4. Frontend Architecture (Next.js 16+)
Type Safety: strict: true in tsconfig.json. No any types allowed. Use Zod for client-side form validation.
Server Components: Default to React Server Components (RSC) for data fetching to minimize client-side JavaScript.
Auth Integration: Implement Better Auth using the middleware pattern to protect routes at the edge.

### 5. Security & Multi-Tenancy (The 'Iron' Rule)
User Isolation: Every database query must include a .where(Task.user_id == authenticated_user_id) clause. There must be no global 'get_all_tasks' endpoint that lacks a user filter.
JWT Integrity: The backend must verify the JWT signature using the BETTER_AUTH_SECRET before processing any request. Return 401 Unauthorized for invalid tokens.

### 6. Operational Excellence
Health Checks: Provide a /health endpoint in the backend to monitor database connectivity.
Error Handling: Implement a global exception handler in FastAPI to return consistent JSON error responses (e.g., { "error": "Message", "code": 404 })

## Governance
All pull requests and code reviews must verify compliance with this constitution. Any deviation from these principles must be justified, documented, and approved.

**Version**: 1.0.0 | **Ratified**: 2026-01-06 | **Last Amended**: 2026-01-06