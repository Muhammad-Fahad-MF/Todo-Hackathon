# Research: Phase 4 Local Kubernetes

**Feature**: Phase 4 Local Kubernetes Deployment
**Status**: Completed

## Unknowns & Clarifications

### 1. `uv` in Docker Multi-stage
**Decision**: Use `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` as builder.
**Rationale**: Pre-packaged with `uv`, optimized for caching.
**Pattern**:
1. Mount `uv.lock` and `pyproject.toml`.
2. Run `uv sync --frozen --no-install-project`.
3. Copy `.venv` to runtime image.
4. Set `PATH="/app/.venv/bin:$PATH"`.

### 2. Next.js Standalone Asset Handling
**Decision**: Explicitly copy `public` and `.next/static` folders.
**Rationale**: `output: 'standalone'` does *not* bundle static assets by default. They must be copied manually to the runner image.
**Pattern**:
```dockerfile
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
```

### 3. NGINX Ingress Rewrite
**Decision**: Use annotation `nginx.ingress.kubernetes.io/rewrite-target: /$2`.
**Rationale**: The frontend calls `/api/v1/tasks`, but the backend expects `/api/v1/tasks`. Wait, the backend runs at root `/`.
**Correction**: Actually, if backend has `api/v1` prefix in code, we might NOT need rewrite if we route `/api` to backend.
**Final Decision**: Check backend `main.py`. It uses `/api/v1`.
So `http://todo.local/api/v1/tasks` -> Ingress matches `/api` -> Forwards `/api/v1/tasks` to backend?
No, usually Ingress strips the path.
**Standard**: Path `/api(/|$)(.*)` with rewrite `/$2` means:
Request: `/api/v1/tasks` -> Matches `(.*)` = `v1/tasks` -> Rewritten to `/v1/tasks`.
**Backend Check**: Backend has `app.include_router(api_router, prefix="/api/v1")`.
So backend expects `/api/v1/...`.
**Conclusion**: We should route `/api` to Backend and *NOT* strip it, OR route `/api` and strip it but ensure backend listens on `/v1`.
**Simplest Approach**: Route `/api` to Backend and use rewrite `/$2` effectively stripping `/api`, but ensuring backend mounts at `/v1`.
*Alternative*: Don't rewrite. Pass `/api` through. Backend listens on `/api/v1`.
**Selected**: Pass-through (No Rewrite) is safer if backend matches the URL structure. We will configure Ingress to route path `/api` to backend service.

## Technology Decisions

| Technology | Choice | Rationale |
|------------|--------|-----------|
| Base OS | Debian Bookworm Slim | Smaller than Ubuntu, more compatible than Alpine for Python (wheels). |
| Frontend Base | Alpine Linux | Node.js runs well on Alpine, significantly smaller image. |
| Ingress | NGINX Community | Standard Minikube addon, widely documented. |
| CI/CD Local | Shell Scripts | Simple, no need for complex scaffold like Skaffold for this phase. |
