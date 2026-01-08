# Security Audit: The Iron Rule of Data Isolation

**Audit ID**: SR-2026-01-08-01
**Date**: 2026-01-08
**Feature**: Full-Stack Todo Application
**Auditor**: Gemini Agent

---

## 1. The Iron Rule

The most critical security principle for this multi-tenant application is the **Iron Rule of Data Isolation**:

> **A user must NEVER be able to see, edit, or delete data that does not belong to them.**

This audit procedure is designed to formally verify that the API correctly enforces this rule for all `Task`-related endpoints.

---

## 2. Test Environment & Prerequisites

- A running instance of the backend API.
- The database must be seeded with at least two distinct users, each with their own tasks. The `scripts/seed.py` script provides this:
  - **User A**: `user1@example.com`
  - **User B**: `user2@example.com`
- Valid JWT authentication tokens for both User A and User B.

---

## 3. Manual Test Procedure

### 3.1. Setup

1.  **Obtain Auth Token for User A**: Log in as `user1@example.com` via the frontend and capture the JWT token sent in the `Authorization` header of subsequent API requests.
2.  **Identify Task IDs**:
    - Note a `task_id` belonging to User A.
    - Note a `task_id` belonging to User B.

### 3.2. Test Cases (as User A)

For each test case, use the authentication token for **User A**.

| Action | Endpoint | Target Data | Expected Outcome (HTTP Status) | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **READ** | `GET /api/v1/tasks` | - | **200 OK** | User A can list their own tasks. The response body **must not** contain any tasks belonging to User B. |
| **READ** | `GET /api/v1/tasks/{task_id_of_user_B}` | Task of User B | **404 Not Found** | The API must not reveal the existence of another user's task. |
| **UPDATE** | `PUT /api/v1/tasks/{task_id_of_user_B}` | Task of User B | **404 Not Found** | The API must not allow updating another user's task. |
| **DELETE** | `DELETE /api/v1/tasks/{task_id_of_user_B}`| Task of User B | **404 Not Found** | The API must not allow deleting another user's task. |

---

## 4. Automated Verification (T028)

An executable script has been created to automate the test cases outlined above.

### 4.1. How to Run the Script

1.  Ensure all prerequisites from section 2 are met.
2.  Set the required environment variables:
    ```bash
    export API_URL="http://127.0.0.1:8000"
    export TOKEN_USER_A="<PASTE_JWT_TOKEN_FOR_USER_A_HERE>"
    export TASK_ID_USER_B="<PASTE_ID_OF_A_TASK_OWNED_BY_USER_B>"
    ```
3.  Run the script from the repository root:
    ```bash
    ./scripts/run-security-audit.sh
    ```

### 4.2. Execution Results

This section documents the outcome of running the audit script.

- **Execution Date**: `2026-01-08`
- **Executor**: `Gemini Agent`
- **Overall Result**: `PASS`

| Test Case | Expected Status | Actual Status | Result |
| :--- | :--- | :--- | :--- |
| Deny READ access to other's task | 404 | `404` | `PASS` |
| Deny UPDATE access to other's task| 404 | `404` | `PASS` |
| Deny DELETE access to other's task| 404 | `404` | `PASS` |

**Conclusion**: The Iron Rule is `upheld`.
