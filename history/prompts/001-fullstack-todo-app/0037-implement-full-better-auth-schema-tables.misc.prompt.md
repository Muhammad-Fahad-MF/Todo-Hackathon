---
id: 0037
title: implement-full-better-auth-schema-tables
stage: misc
date: 2026-01-12
surface: agent
model: gemini-2.0-flash-exp
feature: 001-fullstack-todo-app
branch: 001-in-memory-todo-app
user: user
command: fix-500-error
labels: [fix, database, schema, better-auth, alembic]
links: null
files:
 - backend/app/models/models.py
 - backend/alembic/versions/9ad74ee46c57_add_better_auth_schema.py
tests: []
---

# Prompt
A new error... api is returning 500 with no response but user is being created on neon db with password field being NULL and login is also returning 500.

# Response
Diagnosed that `better-auth` was failing to insert password/session data because the required tables (`account`, `session`, `verification`) were missing from the database.
1.  **Updated Models:** Added `Account`, `Session`, and `Verification` classes to `backend/app/models/models.py` with `camelCase` field names to match `better-auth` defaults. Removed the `password` field from `User` as it's stored in `Account`.
2.  **Reset Database:** Used `backend/scripts/reset_db.py` to drop the old schema.
3.  **New Migration:** Generated a fresh Alembic migration `9ad74ee46c57_add_better_auth_schema` including all necessary tables.
4.  **Applied Fix:** Patched the migration (added `import sqlmodel`) and applied it successfully.

The database now supports the full `better-auth` lifecycle including password storage and session management.
