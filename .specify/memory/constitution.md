<!--
Sync Impact Report:
- Version Change: template -> 1.0.0
- Modified Principles: Instantiated all placeholders with Phase 4 Infrastructure Principles.
- Added Sections: Infrastructure Stack, DevOps Workflow.
- Templates Requiring Updates: ✅ None (plan-template checks align).
-->

# Evolution of Todo Constitution

## Core Principles

### I. Infrastructure as Spec (IaSpec)
**Non-Negotiable:** All infrastructure changes (Dockerfiles, Helm Charts, K8s Manifests) are treated as code. They must be defined in `specs/phase-4/` before implementation.
- No `kubectl edit` or "hot-patching" the cluster.
- Changes flow strictly: Spec → Helm Template → `helm upgrade`.
- The "Source of Truth" is the git repository, not the cluster state.

### II. Containerization Standards
**Security & Efficiency:**
- Images MUST be multi-stage builds optimized for size (target <500MB).
- **Security:** Processes MUST run as non-root users (UID > 1000).
- **Tooling:** Use Docker AI (Gordon) for generation; if unavailable, fallback to Claude Code/Agents.
- Base images must be minimal (e.g., `python-slim`, `node-alpine`) and pinned to specific versions (no `latest`).

### III. Kubernetes Architecture
**Production Parity:**
- **Service Discovery:** Inter-service communication MUST use internal K8s DNS (e.g., `http://backend-service.default.svc.cluster.local`), NEVER `localhost`.
- **Exposure:** External access via Ingress Controller (mimicking Prod) or Minikube Tunnel.
- **Observability:** Cluster MUST have Metrics Server enabled to support `kagent` analysis and HPA.

### IV. AI-Driven Operations
**Assisted DevOps:**
- **Validation:** All Helm templates and complex manifests MUST be audited by `kubectl-ai` for best practices (resource limits, liveness probes).
- **Health:** Deployment success is defined by a `kagent` health check passing with zero critical issues.
- **Logs:** AI Agents must have access to container logs for troubleshooting.

### V. Secret Zero Trust
**Security:**
- ABSOLUTELY NO secrets in `values.yaml`, `Dockerfiles`, or git-committed files.
- Secrets (Neon DB credentials, OpenAI Keys) MUST be injected via Kubernetes Secrets or Environment Variables mapped from a secure local source (e.g., `.env` not committed).

### VI. AI Tool Handoff Protocol
**External Intelligence Mandate:**
- **Gordon (Docker AI):** The Agent **MUST NOT** generate Dockerfiles manually. It MUST:
  1.  **Stop Execution.**
  2.  **Generate a Prompt** for the user to paste into Gordon.
  3.  **Wait** for user confirmation that the file has been created.
  4.  **Verify** the output against quality standards (<500MB, non-root).
- **kubectl-ai / kagent:** These tools SHOULD be executed directly by the Agent if CLI access is available; otherwise, the same Handoff Protocol applies.

## Infrastructure Stack

- **Orchestrator:** Minikube (Docker Driver)
- **Containerization:** Docker Desktop
- **Package Manager:** Helm 3+
- **AI Ops:** `kubectl-ai`, `kagent`, Docker AI (Gordon)
- **Ingress:** NGINX Ingress Controller

## DevOps Workflow

1.  **Spec:** Define the infrastructure change in `specs/phase-4/`.
2.  **Plan:** Generate the Helm chart structure and resource requirements.
3.  **Task:** Break down into atomic tasks (e.g., "Create Backend Dockerfile", "Configure Ingress").
4.  **Implement:** Use AI tools to generate the YAML/Dockerfiles.
5.  **Verify:** Deploy to Minikube, run `kagent` health check, and verify application functionality.

## Governance

Strict adherence to these principles is required for Phase 4 deliverables. Deviations (e.g., hardcoding a secret for "testing") are considered a constitution violation and must be rejected during review.

**Version**: 1.0.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-06