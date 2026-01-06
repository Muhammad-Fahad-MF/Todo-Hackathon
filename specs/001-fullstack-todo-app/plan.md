# Implementation Plan: Full-Stack Todo Application

**Feature Branch**: `001-fullstack-todo-app`
**Implementation Plan**: `specs/001-fullstack-todo-app/plan.md`
**Generated Artifacts**:
- `research.md`
- `data-model.md`
- `contracts/`
- `quickstart.md`

---

## Milestone 1: Environment & Foundation (The 'Zero-Trust' Setup)

This milestone focuses on establishing the project structure and foundational tooling, ensuring a secure and automated development environment from day one.

### Tasks

1.  **Initialize Backend (FastAPI)**:
    *   Create a `/backend` directory.
    *   Set up a Python virtual environment.
    *   Install FastAPI, Uvicorn, and `pydantic-settings`.
2.  **Initialize Frontend (Next.js)**:
    *   Create a `/frontend` directory using `npx create-next-app@latest`.
    *   Select options for App Router, TypeScript, and Tailwind CSS.
3.  **Implement Backend .env Validation**:
    *   Create a `backend/app/core/config.py` module.
    *   Define a `Settings` class using `pydantic-settings` to load `DATABASE_URL` and `BETTER_AUTH_SECRET` from a `.env` file.
    *   Ensure the application fails on startup if these variables are missing.
4.  **Create Type Synchronization Script**:
    *   Develop `scripts/sync-types.sh`.
    *   This script will run `pydantic-to-typescript` to convert Pydantic models from the backend into TypeScript interfaces in the frontend.

### Parallelizable Tasks

*   Tasks 1 (Backend Init) and 2 (Frontend Init) can be performed in parallel.

### Verifiable State

*   The `/backend` and `/frontend` directories exist with basic project scaffolds.
*   The backend application can be started (`uvicorn ...`) and will immediately exit with an error if `.env` is not configured.
*   Running `scripts/sync-types.sh` successfully generates a `types.ts` file in the frontend from sample Pydantic models in the backend.

### 'Zero-Manual-Code' Principle

*   Project initialization is templated (`create-next-app`).
*   Type safety between backend and frontend is fully automated via `sync-types.sh`.

---

## Milestone 2: Backend Core & Database Architecture

This milestone establishes the data layer and authentication enforcement, ensuring strict user data isolation at the database level.

### Tasks

1.  **Define SQLModel Schemas**:
    *   Install `sqlmodel`.
    *   In `backend/app/models/`, define `User` and `Task` schemas.
    *   **Crucially**, the `Task` table schema MUST include a `user_id` field with a foreign key relationship to the `User` table. This enforces the 'Iron Rule' at the database level.
2.  **Configure Alembic for Migrations**:
    *   Install and initialize Alembic in the `/backend` directory.
    *   Create an initial migration that generates the `User` and `Task` tables.
3.  **Implement Idempotent Seeding**:
    *   Create a `backend/scripts/seed.py`.
    *   This script should connect to the Neon PostgreSQL database and populate it with initial data (e.g., test users). It must be safe to run multiple times without creating duplicate data.
4.  **Implement FastAPI Auth Dependency**:
    *   Create `backend/app/core/auth.py`.
    *   Implement a FastAPI `Depends` function that inspects the `Authorization` header, decodes the Better Auth JWT, and returns a `CurrentUser` Pydantic model (`user_id`, `email`).
    *   Unauthorized or invalid tokens must result in an HTTP 401 error.

### Parallelizable Tasks

*   Tasks 1 (Schema Def) and 4 (Auth Dependency) can be worked on in parallel after the initial project setup.

### Verifiable State

*   Running `alembic upgrade head` successfully applies the database schema.
*   Running `python scripts/seed.py` populates the database without errors.
*   Protected API endpoints return a 401 error without a valid JWT.
*   With a valid JWT, a protected endpoint can successfully access the `CurrentUser` object.

### 'Zero-Manual-Code' Principle

*   Database schema migrations are managed entirely by Alembic.
*   Test data creation is automated via the `seed.py` script.

---

## Milestone 3: API & Error Contract

This milestone develops the core business logic and ensures all API interactions are consistent, secure, and monitorable.

### Tasks

1.  **Implement Task CRUD Endpoints**:
    *   In `backend/app/api/endpoints/tasks.py`, create endpoints for `POST`, `GET`, `PUT`, `DELETE` on `/api/tasks/`.
    *   **Every database query within these endpoints MUST be filtered by the `user_id` from the `CurrentUser` object provided by the auth dependency.**
2.  **Implement Global Exception Handler**:
    *   In `backend/main.py`, add a global exception handler.
    *   This handler will catch all exceptions (including Pydantic `ValidationError`) and format the response into the specified JSON structure: `{"detail": {"code": "ERROR_CODE", "message": "..."}}`.
3.  **Create Health Check Endpoint**:
    *   Add a `/health` endpoint that performs a simple query (e.g., `SELECT 1`) against the Neon DB.
    *   This provides a simple way to monitor application and database health.

### Verifiable State

*   All CRUD endpoints for tasks are functional and pass integration tests.
*   API requests with invalid data return a 422 error with the standardized JSON error format.
*   The `/health` endpoint returns a 200 OK status when the database is reachable and a 503 Service Unavailable if not.
*   Manual testing confirms that API requests for tasks belonging to another user return an empty list or a 404 Not Found error.

### 'Zero-Manual-Code' Principle

*   A single global exception handler automates the enforcement of the API error contract, avoiding repetitive error-handling code in each endpoint.

---

## Milestone 4: Frontend, Auth & Middleware

This milestone builds the user-facing application and locks down access using modern web security practices.

### Tasks

1.  **Initialize Next.js Project**:
    *   Ensure the Next.js 16+ project from Milestone 1 is set up with App Router and Tailwind CSS.
2.  **Integrate Better Auth**:
    *   Install the Better Auth client library.
    *   Create login and signup pages that use the library to authenticate users against the backend.
3.  **Implement Edge Middleware for Route Protection**:
    *   Create a `middleware.ts` file at the root of the `/frontend` project.
    *   This middleware will inspect the request for a valid Better Auth session cookie and redirect unauthenticated users from dashboard routes to the login page.
4.  **Enforce Type Safety**:
    *   Ensure all frontend components and API calls utilize the TypeScript types generated by the `sync-types.sh` script.

### Parallelizable Tasks

*   This entire milestone can be worked on in parallel with Milestones 2 and 3, as long as the API contract (even a mock version) is defined.

### Verifiable State

*   Users can sign up and log in via the frontend UI.
*   Unauthenticated users attempting to access `/dashboard` are redirected to `/login`.
*   The Next.js application compiles without any TypeScript errors.
*   The browser's developer console shows no type-related warnings or errors during runtime.

### 'Zero-Manual-Code' Principle

*   Route protection is handled declaratively by Next.js middleware, not imperative checks in each page component.
*   Frontend models are never manually written; they are always generated from the backend source of truth.

---

## Milestone 5: Integration & 'Iron Rule' Verification

This final milestone connects the frontend and backend, delivers the complete user experience, and critically, verifies the core security promise.

### Tasks

1.  **Connect UI to API**:
    *   Implement API client functions in the frontend to call the backend's task endpoints.
    *   Connect these functions to the UI components.
2.  **Implement Full Task Lifecycle**:
    *   Build out the UI functionality for adding, listing, toggling the completion status of, and deleting tasks.
    *   Ensure the UI provides feedback during API calls (e.g., loading spinners, success/error notifications).
3.  **'Iron Rule' Verification Task**:
    *   Create a dedicated, documented test procedure.
    *   **Procedure**:
        1.  Log in as User A and create a task. Note its ID.
        2.  Log out.
        3.  Log in as User B.
        4.  Using developer tools, attempt to forge an API request to fetch, update, or delete the task ID belonging to User A.
        5.  **Expected Result**: The API MUST return a 404 Not Found or an empty response. It MUST NOT expose any information about User A's task.
        6.  Document the test outcome with screenshots or logs.

### Verifiable State

*   A user can log in and fully manage their to-do list from start to finish.
*   The application feels responsive and provides clear user feedback.
*   The 'Iron Rule' verification test passes unequivocally, proving that one user cannot access another user's data. This is the final sign-off criteria.

### 'Zero-Manual-Code' Principle

*   The end-to-end functionality is a composition of previously automated and well-defined parts. The final verification step ensures these automated systems function correctly together to enforce the security model without manual intervention in the request lifecycle.
