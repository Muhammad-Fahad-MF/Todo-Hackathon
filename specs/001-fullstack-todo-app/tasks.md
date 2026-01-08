# Implementation Tasks: Full-Stack Todo Application (Consolidated)

This document provides a final, consolidated, and actionable checklist for implementing the Full-Stack Todo Application. Tasks are organized by milestone, are atomic, and include a 'Definition of Done' for verification.

---

### Milestone 1: Project Foundation & Environment Setup

**Goal**: Initialize both backend and frontend projects with all necessary tooling and configuration for a secure, type-safe development environment.

**Definition of Done**: Backend and frontend projects are fully initialized, dependencies are installed, and environment variable handling is configured.

- [x] T001 [P] Initialize the backend Python project in `backend/` using `uv init`.
- [x] T002 Add required backend dependencies to `pyproject.toml`: `fastapi`, `uvicorn`, `pydantic-settings`, `sqlmodel`, `alembic`, and `asyncpg`.
- [x] T003 Implement environment validation in `backend/app/core/config.py` using `pydantic-settings` for `DATABASE_URL`, `CORS_ORIGINS`, and `BETTER_AUTH_SECRET`.
- [x] T004 [P] Initialize the frontend Next.js project in `frontend/` using `npx create-next-app@latest` (with TypeScript, Tailwind CSS, and App Router).
- [x] T005 Create a `frontend/.env.local.example` file with `NEXT_PUBLIC_API_URL='http://127.0.0.1:8000'`.
- [x] T006 [P] Develop the type synchronization script at `scripts/sync-types.sh` to convert Pydantic models to TypeScript interfaces.

---

### Milestone 2: Asynchronous Database & Data Schema

**Goal**: Establish a robust, asynchronous data layer with SQLModel, managed by Alembic migrations.

**Definition of Done**: The database schema is defined and managed via code, and the application can interact with the database asynchronously.

- [x] T007 [US1, US2] Define `User` and `Task` schemas in `backend/app/models/` using SQLModel, ensuring `Task.user_id` has a foreign key to `User`.
- [x] T008 Initialize Alembic in the `backend/` directory and configure `backend/alembic/env.py` to enable automatic column type change detection (`compare_type=True`).
- [x] T009 Create the initial Alembic migration in `backend/alembic/versions/` to generate the `User` and `Task` tables.
- [x] T010 Implement the database engine and session logic in `backend/app/db/session.py`, ensuring it uses an `AsyncSession` with the `+asyncpg` dialect.
- [x] T011 [P] Create an idempotent seeding script in `backend/scripts/seed.py` to populate the database with test data.

---

### Milestone 3: Secure API & Core Business Logic

**Goal**: Develop the core API, focusing on secure session verification and consistent error handling.

**Definition of Done**: API endpoints are protected, correctly handle business logic, and conform to the project's error and CORS contracts.

- [x] T012 [US1, US2] Implement a reusable FastAPI dependency in `backend/app/core/auth.py` that verifies the Better Auth session JWT and returns a `CurrentUser` model.
- [x] T013 [US2] Implement `POST`, `GET`, `PUT`, `DELETE` endpoints for tasks in `backend/app/api/v1/endpoints/tasks.py`, ensuring all queries are filtered by `user_id`.
- [x] T014 Configure `CORSMiddleware` in `backend/app/main.py` to use a `CORS_ORIGINS` environment variable.
- [x] T015 Implement a global exception handler in `backend/app/main.py` to enforce the standardized JSON error structure.
- [x] T016 [P] Create a `/health` check endpoint in `backend/app/main.py` that verifies database connectivity.

---

### Milestone 4: Frontend UI, State Management & UX

**Goal**: Build a responsive and resilient user interface with robust state management and clear user feedback.

**Definition of Done**: The frontend provides a complete UI for authentication and task management, with persistent state and good UX patterns (loading/error states).

- [x] T017 [P] Install frontend dependencies: Better Auth client, `zustand` (for state), `immer` (for zustand), `lucide-react`, `clsx`, `tailwind-merge`, `sonner` (for toasts), and `zod` (for validation).
- [x] T018 [US1] Implement Zustand store in `frontend/src/lib/store.ts` for managing and persisting the user session state.
- [x] T019 [US1] Create Login/Signup pages in `frontend/src/app/(auth)/` that integrate with the Better Auth library for authentication.
- [x] T020 [US1] Implement client-side form validation on the Login and Signup forms using Zod, providing clear error messages for invalid input.
- [x] T021 [US1, US2] Create Edge Middleware in `frontend/src/middleware.ts` to protect all non-auth routes from unauthenticated access.
- [x] T022 [US2] Design and build loading skeleton components for the task list in `frontend/src/components/ui/skeletons.tsx`.
- [x] T023 [US2] Implement Sonner for toast notifications in `frontend/src/components/ui/Toaster.tsx` to provide feedback on API actions.

---

### Milestone 5: Full-Stack Integration & Security Verification

**Goal**: Connect the frontend and backend to deliver the complete user experience and perform the final 'Iron Rule' security audit.

**Definition of Done**: The application is fully functional end-to-end, and the core security principle of data isolation is formally verified.

- [x] T024 [US2] Implement a typed API client module in `frontend/src/lib/api.ts` using the generated types from `sync-types.sh`.
- [x] T025 [US2] Build the main dashboard UI in `frontend/src/app/dashboard/page.tsx`, fetching and displaying user-specific tasks.
- [x] T026 [US2] Implement the full UI lifecycle for tasks (add, list, toggle, delete), using loading skeletons and toasts for feedback.
- [x] T027 **Security**: Create the 'Iron Rule' security audit procedure as a markdown document in `docs/security/iron-rule-test.md`.
- [x] T028 **Security**: Execute the 'Iron Rule' test procedure against the live API and document the pass/fail outcome in the audit document.