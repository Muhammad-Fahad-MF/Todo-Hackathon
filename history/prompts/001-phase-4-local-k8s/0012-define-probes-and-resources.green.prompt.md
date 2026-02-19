---
id: 0012
title: Define Probes and Resources
stage: green
date: 2026-02-08
surface: agent
model: gemini-2.0-flash-thinking-exp-01-21
feature: 001-phase-4-local-k8s
branch: main
user: fahad
command: /sp.implement
labels: [kubernetes, probes, resources, reliability]
links:
  spec: specs/001-phase-4-local-k8s/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - kubernetes/helm/todo-app/templates/deployment-backend.yaml
 - kubernetes/helm/todo-app/templates/deployment-frontend.yaml
 - kubernetes/helm/todo-app/values.yaml
 - specs/001-phase-4-local-k8s/tasks.md
tests:
 - manual: helm template verification
---

## Prompt

/sp.implement T015 -> Context: Neon DB cold starts can take up to 20-30 seconds. We are standardizing probes and resource budgets across the stack to ensure high availability and efficient local resource utilization.
... (Full prompt logic for identity, objective, tasks, constraints, and verification)

## Response snapshot

Implemented "Slow-Start, Fast-Fail" probe strategy and refined resource budgets:
1.  **Harden Probes**: Added `startupProbe` to `deployment-backend.yaml` and parameterized frontend probes from `values.yaml`. Probes use named port `http` and provide a 300s threshold (30 * 10s) to accommodate Neon DB cold starts.
2.  **Resource Budgets**: Standardized requests (100m CPU / 128Mi RAM) and limits (500m CPU / 512Mi RAM) for both Backend and Frontend in `values.yaml`.
3.  **Validation**: Verified manifest integrity with `helm template`.

## Outcome

- ✅ Impact: Significantly improved application reliability by preventing premature probe failures during database cold starts and established resource boundaries for stability.
- 🧪 Tests: Confirmed correct manifest generation via `helm template`.
- 📁 Files: Updated deployment templates, values file, and task list.
- 🔁 Next prompts: Final Phase: Deployment & Verification (T016).
- 🧠 Reflection: Using named ports and parameterizing probes in `values.yaml` ensures a clean, maintainable Helm chart.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
