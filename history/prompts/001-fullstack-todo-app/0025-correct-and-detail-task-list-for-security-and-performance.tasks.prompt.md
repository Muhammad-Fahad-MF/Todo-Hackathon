---
id: 0025
title: Correct and Detail Task List for Security and Performance
stage: tasks
date: 2026-01-08
surface: agent
model: gemini-1.5-pro
feature: 001-fullstack-todo-app
branch: main
user: fahad
command: /sp.tasks
labels: [security, performance, integration]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-fullstack-todo-app/tasks.md
tests:
  - docs/security/iron-rule-test.md
---

## Prompt

so should I rewrite a new tasks.md /sp.tasks and command the agent to write them. And how to make sure the new tasks are very detailed and specific. So give me a good prompt for new tasks.md.

---
*The user then executed the `/sp.tasks` command with the following context, which was generated in the previous turn:*

Generate a new, detailed tasks.md file for the 'Full-Stack Todo Application' based on the original spec.md and plan.md. Your primary goal is to correct the failures of the previous implementation. The new tasks must address the following critical issues: 1. Security Integration Failure: * Create explicit tasks for integrating the frontend's authentication state (e.g., from a Zustand store) with the API client (api.ts). * There must be a specific task detailing that the API client must read the JWT and attach it as an Authorization: Bearer <token> header to all relevant API calls. * Include a task to modify the backend API endpoints to robustly enforce authentication, ensuring they reject any request lacking a valid JWT with a 401 Unauthorized error. 2. Performance Bottleneck: * Create specific tasks for frontend state management that explicitly forbid the use of router.refresh() for routine data synchronization. * Tasks for creating, updating, or deleting items must specify that the UI should be updated by modifying the client-side state (e.g., a Zustand store) directly after the API call succeeds. For every task, you must follow these rules: * Each task must be atomic and focus on a single, specific objective. * Each task must have a clear and verifiable 'Definition of Done' that describes the expected outcome. * Clearly state any dependencies a task has on other tasks. * Group the tasks into the original milestones from plan.md. Here is an example of the required format and level of detail: 1 - [ ] T035 [US2] **Security**: Integrate the API client with the auth store. 2 - **Description**: Modify the `fetchApi` wrapper in `frontend/src/lib/api.ts`. It must import the authentication store, retrieve the user's JWT, and add it to the `Authorization` header for all requests except login and registration. 3 - **Dependencies**: T018 (Zustand store for session). 4 - **Definition of Done**: When inspecting network requests in the browser's developer tools, API calls to `/api/v1/tasks` contain the `Authorization: Bearer <token>` header. If the token is null, the header is not added.

## Response snapshot

```markdown
# Implementation Tasks: Full-Stack Todo Application (Corrected)

**Feature Branch**: `001-fullstack-todo-app`

This document provides a corrected, dependency-aware, and actionable checklist for implementing the Full-Stack Todo Application. It is designed to fix the security and performance issues identified in the initial implementation by adding explicit integration tasks.

---

### Milestone 1 & 2: Foundations (No Changes)

**Goal**: These milestones established the project structure and database schema. The tasks were completed correctly and do not require changes.

- [x] T001 - T011 (Completed as per original tasks.md)

---

### Milestone 3: Secure Backend API (Revised)

**Goal**: Ensure the backend API rigorously enforces authentication and user-scoping on all data-related endpoints.

**Definition of Done**: Anonymous requests to task endpoints are rejected, and all data operations are provably scoped to the authenticated user.

- [x] T012 [US1, US2] Implement a reusable FastAPI dependency in `backend/app/core/auth.py` that verifies the Better Auth session JWT and returns a `CurrentUser` model.
- [ ] T013 [US2] **Security**: **Strictly Enforce User Scoping in Task Endpoints.**
    - **Description**: In `backend/app/api/v1/endpoints/tasks.py`, ensure that every single database query (for GET, PUT, DELETE) is filtered by the `user_id` obtained from the `CurrentUser` object provided by the `Depends` function.
    - **Dependencies**: T012.
    - **Definition of Done**: A code review confirms that no database query in this file can execute without a `.where(Task.user_id == current_user.id)` clause. Any unauthenticated request to these endpoints MUST fail with a 401 status.
- [x] T014 Configure `CORSMiddleware` in `backend/app/main.py`.
- [x] T015 Implement a global exception handler in `backend/app/main.py`.
- [x] T016 [P] Create a `/health` check endpoint in `backend/app/main.py`.

---

### Milestone 4: Secure Frontend & State Management (Revised)

**Goal**: Build a secure and performant frontend by explicitly integrating the authentication state with the API client and using client-side state management for a responsive UX.

**Definition of Done**: The frontend sends authenticated API requests, handles expired sessions gracefully, and updates its state without unnecessary full-page refreshes.

- [x] T017 - T023 (Completed as per original tasks.md - UI and basic auth setup)
- [ ] T024 [US2] **Security**: **Create an Auth-Aware API Client.**
    - **Description**: Refactor the `fetchApi` wrapper in `frontend/src/lib/api.ts`. It must be modified to retrieve the authentication token from the Zustand session store and include it in an `Authorization: Bearer <token>` header for every API request.
    - **Dependencies**: T018 (Zustand store for session).
    - **Definition of Done**: Using browser developer tools, all API requests to `/api/v1/tasks/` are inspected and confirmed to contain the `Authorization` header with a valid JWT.
- [ ] T025 [US1, US2] **Security**: **Implement Centralized 401 Error Handling.**
    - **Description**: In the `fetchApi` wrapper in `frontend/src/lib/api.ts`, add logic to the `catch` block that specifically checks for a 401 status code. If a 401 error is received, the client-side session store (Zustand) must be cleared, and the user must be programmatically redirected to the `/login` page.
    - **Dependencies**: T024.
    - **Definition of Done**: While logged in, manually delete the session token from browser storage and refresh the page or trigger an API call. The application must automatically redirect to the login page.
- [ ] T026 [US2] **Performance**: **Refactor `AddTaskForm` to use Client-Side State.**
    - **Description**: Modify the `handleSubmit` function in `frontend/src/components/forms/AddTaskForm.tsx`. After a successful `createTask` API call, the component **must not** call `router.refresh()`. Instead, it must add the newly returned task object directly to the client-side Zustand task store.
    - **Dependencies**: T018, T024.
    - **Definition of Done**: Adding a new task updates the task list UI instantly without a full-page network refresh being visible in the browser's Network tab.
- [ ] T027 [US2] **Performance**: **Refactor `TaskList` to use Client-Side State.**
    - **Description**: Modify the `handleToggle` and `handleDelete` functions in `frontend/src/components/tasks/TaskList.tsx`. These functions should optimistically update the Zustand task store, make the API call, and only revert the store change if the API call fails. They **must not** call `router.refresh()`.
    - **Dependencies**: T018, T024.
    - **Definition of Done**: Toggling or deleting a task updates the UI instantly, and no page-level data fetching is initiated.

---

### Milestone 5: Integration & Final Verification (Revised)

**Goal**: Verify the end-to-end security and functionality of the integrated system.

**Definition of Done**: The application is fully functional, and the 'Iron Rule' security principle is verifiably enforced.

- [ ] T028 [US2] Connect the fully refactored UI components to the now-authenticated API client.
    - **Description**: Ensure the `DashboardPage` and its children are correctly using the API functions from `frontend/src/lib/api.ts` and are rendering data from the Zustand store.
    - **Dependencies**: T026, T027.
    - **Definition of Done**: The application allows a logged-in user to create, view, update, and delete tasks seamlessly.
- [x] T029 **Security**: Create the 'Iron Rule' security audit procedure as a markdown document in `docs/security/iron-rule-test.md`.
- [ ] T030 **Security**: **Execute and Pass the 'Iron Rule' Test.**
    - **Description**: Follow the procedure in `iron-rule-test.md` to attempt to access another user's data. This test can only be passed if the backend correctly returns a 404 or 401 error and reveals no information.
    - **Dependencies**: T013, T024, T028.
    - **Definition of Done**: The test procedure is executed, and the outcome is documented as "PASS" in the audit document, with logs or screenshots as evidence.
```

## Outcome

- ✅ Impact: A new, corrected `tasks.md` was generated to guide the next phase of development, directly addressing the critical security and performance flaws in the initial implementation.
- 🧪 Tests: The new task list includes a specific, verifiable task to execute the 'Iron Rule' security test.
- 📁 Files: `specs/001-fullstack-todo-app/tasks.md` was overwritten. `history/prompts/001-fullstack-todo-app/0025-correct-and-detail-task-list-for-security-and-performance.tasks.prompt.md` was created and filled.
- 🔁 Next prompts: The user is now positioned to start implementing the new, more detailed tasks.
- 🧠 Reflection: The initial failure was a classic case of "the parts work but the system doesn't." The `tasks.md` was a checklist of features, not a plan for integration. This exercise of regenerating the tasks with a focus on a) security integration and b) performance-driven state management was crucial. The new `tasks.md` is far more robust.

## Evaluation notes (flywheel)

- Failure modes observed: Initial task list was too high-level and missed critical integration steps between auth and API clients.
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Implement T013 (backend enforcement) and T024 (frontend auth-aware API client) to see the immediate effect on security.
