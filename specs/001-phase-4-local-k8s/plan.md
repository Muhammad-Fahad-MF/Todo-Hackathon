# Implementation Plan: Phase 4 Local Kubernetes Deployment

**Branch**: `001-phase-4-local-k8s` | **Date**: 2026-02-06 | **Spec**: [specs/001-phase-4-local-k8s/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-phase-4-local-k8s/spec.md`

## Summary

Migrate the Todo Chatbot application from Docker Compose to a local Kubernetes (Minikube) environment. This phase introduces production-grade orchestration including Ingress routing, Secret management, and AI-assisted operations using `kubectl-ai` and `kagent`.

## Technical Context

**Platform**: Minikube (Docker Driver) with NGINX Ingress & Metrics Server
**Orchestration**: Helm 3 (Chart: `todo-app`)
**Containerization**:
- Backend: `python:3.12-slim-bookworm` (Builder: `ghcr.io/astral-sh/uv:python3.12-bookworm-slim`)
- Frontend: `node:20-alpine` (Standalone Output)
**Networking**:
- Domain: `todo.local` (Mapped via `/etc/hosts`)
- Internal DNS: `http://backend-service.default.svc.cluster.local:8000`
**Secret Management**: Kubernetes Secrets injected via Helm (sourced from local `secrets.yaml` or CLI args)
**AI Tooling**: `kai` (kubectl-ai via Groq), `kagent`, Docker AI (Gordon)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Spec-Driven & Contract-First**: Spec defines architecture and networking contract.
- [x] **Environment & Config**: Secrets managed via K8s Secrets (Zero Trust).
- [x] **Backend Architecture**: Uses Python 3.12 + uv, standard non-root user.
- [x] **Frontend Architecture**: Uses Next.js Standalone build.
- [x] **Security (Iron Rule)**: Non-root execution (UID 1001), no baked-in secrets.
- [x] **Operational Excellence**: Includes Probes (Startup/Liveness/Readiness) and Metrics.

## Project Structure

### Documentation (this feature)

```text
specs/001-phase-4-local-k8s/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── architecture.md      # Phase 1 output (Component Diagrams)
├── k8s-manifests.md     # Phase 1 output (Helm Structure)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── Dockerfile           # New multi-stage Dockerfile
├── .dockerignore

frontend/
├── Dockerfile           # New multi-stage Dockerfile
├── .dockerignore
├── next.config.ts       # Updated for 'standalone' output

kubernetes/
└── helm/
    └── todo-app/
        ├── Chart.yaml
        ├── values.yaml
        ├── .helmignore
        └── templates/
            ├── _helpers.tpl
            ├── deployment-backend.yaml
            ├── deployment-frontend.yaml
            ├── service-backend.yaml
            ├── service-frontend.yaml
            ├── ingress.yaml
            └── secret.yaml

scripts/
└── k8s/
    ├── audit.sh         # Wrapper for kubectl-ai audit
    ├── deploy.sh        # Helm install/upgrade script
    └── optimize.sh      # Wrapper for kagent analysis
```

**Structure Decision**: Monorepo approach where infrastructure code lives in `kubernetes/` but application code (Dockerfiles) lives next to source.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Helm Charts | Standardization | Raw YAML manifests are harder to manage and parameterize for future envs (Cloud). |
| Multi-stage Docker | Security/Size | Simple Dockerfiles create massive >1GB images with compiler bloat. |
| Ingress | Prod Parity | NodePort is simpler but doesn't test routing/CORS logic required for Phase 5. |