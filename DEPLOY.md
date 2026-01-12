# Deployment Guide

This project is configured for a hybrid deployment:
- **Frontend:** Next.js (Deploy on **Vercel**)
- **Backend:** FastAPI (Deploy on **Render**, **Railway**, or **Heroku**)
- **Database:** PostgreSQL (Recommend **Neon**, **Supabase**, or **Render Postgres**)

## 1. Database Setup (Neon PostgreSQL)

1.  Create a project on [Neon](https://neon.tech).
2.  Get your **Connection String**.
    - **Pooled Connection (Better for Serverless/Vercel):** `postgres://user:pass@ep-xyz.region.aws.neon.tech/neondb?sslmode=require`
    - **Direct Connection (For Migrations/Backend):** `postgres://user:pass@ep-xyz.region.aws.neon.tech/neondb` (No pooling, or port 5432)

## 2. Environment Variables

### Frontend (Vercel)
Add these to your Vercel project settings:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Pooled** Connection String for Auth | `postgres://user:pass@ep-xyz...` |
| `NEXT_PUBLIC_API_URL` | URL of your deployed Backend | `https://my-backend.onrender.com` |
| `BETTER_AUTH_SECRET` | Random string (must match backend) | `super_secure_random_string` |
| `BETTER_AUTH_URL` | URL of your deployed Frontend | `https://my-app.vercel.app` |

### Backend (Render/Railway)
Add these to your backend service settings:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Async** Connection String (Direct) | `postgresql+asyncpg://user:pass@host/db` |
| `ALEMBIC_DATABASE_URL`| **Sync** Connection String (Direct) | `postgresql://user:pass@host/db` |
| `BETTER_AUTH_SECRET` | Must match Frontend's secret | `super_secure_random_string` |
| `CORS_ORIGINS` | Allowed Frontend Origins (JSON) | `["https://my-app.vercel.app"]` |

> **Note on Backend DB URL:** Python's `asyncpg` driver requires `postgresql+asyncpg://` scheme. The `ALEMBIC_DATABASE_URL` uses the standard `postgresql://` scheme.

## 3. Database Migrations

Since we have two sources of schema (better-auth and our own models):

1.  **Run Better-Auth Migrations:**
    Currently, better-auth in this project is configured to auto-manage its schema on the frontend side or you can use its CLI.
    The easiest way for the first deploy:
    - Connect your local `frontend/.env` to the **Remote Neon DB**.
    - Run the frontend locally (`npm run dev`). Better-auth should create the user tables.

2.  **Run Backend Migrations:**
    - Connect your local `backend/.env` to the **Remote Neon DB**.
    - Run `alembic upgrade head`.

## 4. Deployment Steps

### Backend
1.  Push code to GitHub.
2.  Connect repo to Render/Railway.
3.  Set Build Command: `pip install -r requirements.txt` (or `uv sync` if using uv)
    - *Note: Since you use `uv`, you might need to export requirements.txt or use a buildpack that supports uv.*
    - **Recommended:** Generate `requirements.txt`:
      ```bash
      cd backend
      uv pip compile pyproject.toml -o requirements.txt
      ```
4.  Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend
1.  Connect repo to Vercel.
2.  Set Root Directory to `frontend`.
3.  Vercel should auto-detect Next.js.
4.  Add the Environment Variables.
5.  Deploy.