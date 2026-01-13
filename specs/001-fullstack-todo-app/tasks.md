# Implementation Tasks: Full-Stack Todo Application (Consolidated & Corrected)

**Feature Branch**: `001-fullstack-todo-app`

This document provides a complete, corrected, dependency-aware, and actionable checklist for the Full-Stack Todo Application. It includes all original tasks for historical reference and adds new, detailed tasks to fix the security and performance issues.

---

### Milestone 1: Project Foundation & Environment Setup

**Goal**: Initialize both backend and frontend projects with all necessary tooling and configuration for a secure, type-safe development environment.

- [x] T001 [P] Initialize the backend Python project in `backend/` using `uv init`.
- [x] T002 Add required backend dependencies to `pyproject.toml`: `fastapi`, `uvicorn`, `pydantic-settings`, `sqlmodel`, `alembic`, and `asyncpg`.
- [x] T003 Implement environment validation in `backend/app/core/config.py` using `pydantic-settings` for `DATABASE_URL`, `CORS_ORIGINS`, and `BETTER_AUTH_SECRET`.
- [x] T004 [P] Initialize the frontend Next.js project in `frontend/` using `npx create-next-app@latest` (with TypeScript, Tailwind CSS, and App Router).
- [x] T005 Create a `frontend/.env.local.example` file with `NEXT_PUBLIC_API_URL='http://127.0.0.1:8000'`.
- [x] T006 [P] Develop the type synchronization script at `scripts/sync-types.sh` to convert Pydantic models to TypeScript interfaces.

---

### Milestone 2: Asynchronous Database & Data Schema

**Goal**: Establish a robust, asynchronous data layer with SQLModel, managed by Alembic migrations.

- [x] T007 [US1, US2] Define `User` and `Task` schemas in `backend/app/models/` using SQLModel, ensuring `Task.user_id` has a foreign key to `User`.
- [x] T008 Initialize Alembic in the `backend/` directory and configure `backend/alembic/env.py` to enable automatic column type change detection (`compare_type=True`).
- [x] T009 Create the initial Alembic migration in `backend/alembic/versions/` to generate the `User` and `Task` tables.
- [x] T010 Implement the database engine and session logic in `backend/app/db/session.py`, ensuring it uses an `AsyncSession` with the `+asyncpg` dialect.
- [x] T011 [P] Create an idempotent seeding script in `backend/scripts/seed.py` to populate the database with test data.

---

### Milestone 3: Secure Backend API (Revised)

**Goal**: Ensure the backend API rigorously enforces authentication and user-scoping on all data-related endpoints.

- [x] T012 [US1, US2] Implement a reusable FastAPI dependency in `backend/app/core/auth.py` that verifies the Better Auth session JWT and returns a `CurrentUser` model.
- [x] T013 [US2] **Security**: **Strictly Enforce User Scoping in Task Endpoints.**
    - **Description**: In `backend/app/api/v1/endpoints/tasks.py`, ensure that every single database query (for GET, PUT, DELETE) is filtered by the `user_id` obtained from the `CurrentUser` object provided by the `Depends` function.
    - **Dependencies**: T012.
    - **Definition of Done**: A code review confirms that no database query in this file can execute without a `.where(Task.user_id == current_user.id)` clause. Any unauthenticated request to these endpoints MUST fail with a 401 status.
- [x] T014 Configure `CORSMiddleware` in `backend/app/main.py` to use a `CORS_ORIGINS` environment variable.
- [x] T015 Implement a global exception handler in `backend/app/main.py` to enforce the standardized JSON error structure.
- [x] T016 [P] Create a `/health` check endpoint in `backend/app/main.py` that verifies database connectivity.

---

### Milestone 4: Frontend UI, State Management & UX (Revised)

**Goal**: Build a secure and performant frontend by explicitly integrating the authentication state with the API client and using client-side state management for a responsive UX.

- [x] T017 [P] Install frontend dependencies: Better Auth client, `zustand`, `immer`, `lucide-react`, `clsx`, `tailwind-merge`, `sonner`, and `zod`.
- [x] T018 [US1] Implement Zustand store in `frontend/src/lib/store.ts` for managing and persisting the user session state.
- [x] T019 [US1] Create Login/Signup pages in `frontend/src/app/(auth)/` that integrate with the Better Auth library for authentication.
- [x] T020 [US1] Implement client-side form validation on the Login and Signup forms using Zod, providing clear error messages for invalid input.
- [x] T021 [US1, US2] Create Edge Middleware in `frontend/src/middleware.ts` to protect all non-auth routes from unauthenticated access.
- [x] T022 [US2] Design and build loading skeleton components for the task list in `frontend/src/components/ui/skeletons.tsx`.
- [x] T023 [US2] Implement Sonner for toast notifications in `frontend/src/components/ui/Toaster.tsx` to provide feedback on API actions.
- [x] T024 [US2] Implement a typed API client module in `frontend/src/lib/api.ts` using the generated types from `sync-types.sh`.

---

### Milestone 5: Full-Stack Integration & Security Verification (NEW & REVISED TASKS)

**Goal**: Connect the frontend and backend to deliver the complete user experience and perform the final 'Iron Rule' security audit.

- [x] T025 [US2] **Security**: **Create an Auth-Aware API Client.**
    - **Description**: Refactor the `fetchApi` wrapper in `frontend/src/lib/api.ts`. It must be modified to retrieve the authentication token from the Zustand session store (T018) and include it in an `Authorization: Bearer <token>` header for every API request.
    - **Dependencies**: T018.
    - **Definition of Done**: Using browser developer tools, all API requests to `/api/v1/tasks/` are inspected and confirmed to contain the `Authorization` header with a valid JWT.
- [x] T026 [US1, US2] **Security**: **Implement Centralized 401 Error Handling.**
    - **Description**: In the `fetchApi` wrapper in `frontend/src/lib/api.ts`, add logic to the `catch` block that specifically checks for a 401 status code. If a 401 error is received, the client-side session store (Zustand) must be cleared, and the user must be programmatically redirected to the `/login` page.
    - **Dependencies**: T025.
    - **Definition of Done**: While logged in, manually deleting the session token from browser storage and then refreshing the page or triggering an API call automatically redirects the user to the login page.
- [x] T027 [US2] **Performance**: **Refactor `AddTaskForm` to use Client-Side State.**
    - **Description**: Modify the `handleSubmit` function in `frontend/src/components/forms/AddTaskForm.tsx`. After a successful `createTask` API call, the component **must not** call `router.refresh()`. Instead, it must add the newly returned task object directly to the client-side Zustand task store.
    - **Dependencies**: T018, T025.
    - **Definition of Done**: Adding a new task updates the task list UI instantly without a full-page network refresh being visible in the browser's Network tab.
- [x] T028 [US2] **Performance**: **Refactor `TaskList` to use Client-Side State.**
    - **Description**: Modify the `handleToggle` and `handleDelete` functions in `frontend/src/components/tasks/TaskList.tsx`. These functions should optimistically update the Zustand task store, make the API call, and only revert the store change if the API call fails. They **must not** call `router.refresh()`.
    - **Dependencies**: T018, T025.
    - **Definition of Done**: Toggling or deleting a task updates the UI instantly, and no page-level data fetching is initiated.
- [x] T029 **Security**: Create the 'Iron Rule' security audit procedure as a markdown document in `docs/security/iron-rule-test.md`.
- [x] T030 **Security**: **Execute and Pass the 'Iron Rule' Test.**
    - **Description**: Follow the procedure in `iron-rule-test.md` to attempt to access another user's data. This test can only be passed if the backend correctly returns a 404 or 401 error and reveals no information.
    - **Dependencies**: T013, T025, T028.
    - **Definition of Done**: The test procedure is executed, and the outcome is documented as "PASS" in the audit document, with logs or screenshots as evidence.

---

### Milestone 6: Bug Fixes & Architecture Alignment (CURRENT)

**Goal**: Fix the "broken" login/signup by correctly routing authentication requests to the Next.js server (Better-Auth) instead of the Python Backend, while ensuring the Python Backend understands the architecture.

- [x] T031 [Fix] **Refactor Auth Client Configuration**:
    - **Description**: Update `frontend/src/lib/auth.ts`. The `authClient` is currently inheriting `NEXT_PUBLIC_API_URL` (which points to the Python Backend at port 8000) as its `baseURL`. This causes login requests to fail because Better-Auth routes exist on the Next.js server (port 3000). Remove the `baseURL` property or set it to `process.env.NEXT_PUBLIC_APP_URL` (defaulting to origin).
    - **Rationale**: Better-Auth is hosted on Next.js. The client must talk to Next.js, not Python, for auth.
- [x] T032 [Fix] **Verify & Update CORS in Backend**:
    - **Description**: Ensure `backend/app/main.py` has `CORSMiddleware` configured to explicitly allow requests from the Frontend origin (e.g., `http://localhost:3000`).
- [x] T033 [Backend] **Document Auth Architecture**:
    - **Description**: Add a prominent docstring/comment in `backend/app/main.py` (and potentially a dummy route `/api/auth/info`) explaining that Authentication is handled by the Next.js frontend (Better-Auth) and that the Backend only verifies tokens. This addresses the confusion of "missing" auth routes.
- [x] T034 [Fix] **Verify Middleware Cookie Name**:
    - **Description**: Check `frontend/src/middleware.ts`. It uses a hardcoded `SESSION_COOKIE_NAME = 'session'`. Better-Auth default is often `better-auth.session_token`. Update logic to check the correct cookie or use Better-Auth's middleware helper if available.
- [x] T035 [Refactor] **Implement Database-Backed Session Authentication**:
    - **Description**: Switch from JWT strategy to database-backed sessions. Remove JWT plugin from frontend configuration. Update backend `get_current_user` to verify opaque session tokens against the `Session` table instead of decoding JWTs.
    - **Rationale**: Simplifies architecture, avoids algorithm mismatches (EdDSA vs HS256), and enables instant session revocation.