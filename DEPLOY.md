# Deployment Guide

This project is configured for a hybrid deployment:
- **Frontend:** Next.js (Deploy on **Vercel**)
- **Backend:** FastAPI (Deploy on **Render**, **Railway**, or **Vercel**)
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
| `NEXT_PUBLIC_API_URL` | URL of your deployed Backend | `https://my-backend.vercel.app` (or Render) |
| `BETTER_AUTH_SECRET` | Random string (must match backend) | `super_secure_random_string` |
| `BETTER_AUTH_URL` | URL of your deployed Frontend | `https://my-app.vercel.app` |

### Backend (Render/Railway/Vercel)
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

### Backend (Render/Railway)
1.  Push code to GitHub.
2.  Connect repo to Render/Railway.
3.  Set Build Command: `pip install -r requirements.txt` (or `uv sync` if using uv)
4.  Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Backend (Vercel)
1.  Connect your repository to Vercel.
2.  **Crucial:** Set the **Root Directory** to `backend`.
3.  Vercel will auto-detect the `vercel.json` and Python runtime.
4.  Add the Environment Variables (see Section 2).
    - Note: `CORS_ORIGINS` must be a JSON array string: `["https://your-frontend.vercel.app"]`.
5.  Deploy.

### Frontend
1.  Connect repo to Vercel.
2.  Set Root Directory to `frontend`.
3.  Vercel should auto-detect Next.js.
5.  Deploy.

### Backend (Hugging Face Spaces)

Hugging Face Spaces offers a simple way to host Dockerized applications.

1.  **Create a New Space:**
    - Go to [huggingface.co/spaces](https://huggingface.co/spaces).
    - Create a new Space.
    - Select **Docker** as the SDK.
    - Choose **Blank** template.

2.  **Configure Environment Variables:**
    - Go to the **Settings** tab of your Space.
    - Scroll to **Variables and secrets**.
    - Add the following **Secrets** (for security) or **Variables**:
        - `DATABASE_URL`: Your Async Postgres URL (`postgresql+asyncpg://...`)
        - `BETTER_AUTH_SECRET`: Your shared auth secret.
        - `CORS_ORIGINS`: JSON list of allowed origins (e.g., `["https://your-frontend-url.com"]`).

3.  **Push Code:**
    - Hugging Face Spaces are git repositories. You can push your `backend/` folder contents to the Space.
    - **Method A (Git Push):**
        - Clone your Space locally: `git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME`
        - Copy the contents of your `backend/` directory (including `Dockerfile` and `requirements.txt`) into the root of the cloned Space.
        - `git add .`, `git commit -m "Deploy backend"`, `git push`.
    - **Method B (Dockerfile Path):**
        - If you sync your entire repo, you might need to configure the Space to look for the Dockerfile in `backend/`. However, HF Spaces usually expect the Dockerfile at the root.
        - **Recommendation:** Use Method A or set up a GitHub Action to push the `backend/` folder to the HF Space remote.

4.  **Verify:**
    - The Space will build the Docker image.
    - Once "Running", your API will be available at `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME` (or the direct URL provided in the UI, usually `https://your-username-space-name.hf.space`).
    - Use this URL as the `NEXT_PUBLIC_API_URL` in your Frontend.
