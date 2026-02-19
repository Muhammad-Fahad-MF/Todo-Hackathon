---
id: "0019"
title: "Fix Docker build credential error and frontend build args"
stage: "misc"
date_iso: "2026-02-18"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "001-phase-4-local-k8s"
branch: "main"
user: "fahad"
command: "docker build"
labels: ["docker", "minikube", "wsl", "build-args"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "~/.docker/config.json"
tests:
  - "docker images | grep todo-"
---

# Prompt History Record (PHR)

## Prompt
The user was encountering an error when trying to build Docker images after running `eval $(minikube docker-env)`.
The specific error was: `ERROR: failed to build: failed to solve: error getting credentials - err: fork/exec /usr/bin/docker-credential-desktop.exe: exec format error`.
Then, after bypassing that, the frontend build failed due to missing `NEXT_PUBLIC_API_URL`.

## Response
1. Diagnosed the `exec format error` as a WSL interop issue with the Docker Desktop credential helper when using the Minikube daemon.
2. Modified `~/.docker/config.json` to remove the `credsStore` setting, allowing the build to proceed without the failing helper.
3. Identified missing build arguments in the frontend Dockerfile.
4. Successfully built both `todo-backend:latest` and `todo-frontend:latest` using `--build-arg` for the frontend.

## Outcome
- `todo-backend:latest` built successfully.
- `todo-frontend:latest` built successfully with injected environment variables.
- Verified images exist in the Minikube Docker daemon.
