---
id: 0001
title: phase-4-local-k8s-spec
stage: spec
date: 2026-02-06
surface: agent
model: gemini-2.0-flash
feature: 001-phase-4-local-k8s
branch: 001-phase-4-local-k8s
user: fahad
command: /sp.specify
labels: ["spec", "phase-4", "k8s", "minikube"]
links:
  spec: specs/001-phase-4-local-k8s/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-phase-4-local-k8s/spec.md
 - specs/001-phase-4-local-k8s/checklists/requirements.md
tests:
 - null
---

## Prompt

Now ask me questions and use this hackathon requirements. And write a good, detailed, and specific prompt for /sp.specify for phase 4.

[User Answered Questions: Neon DB, Minikube Docker Env, Ingress, Gordon Available]
[Prompt Refined to include: Next.js Standalone, FastAPI + uv + Non-root, Dual URL logic, Probes, Resources, AI-Ops]

## Response snapshot

Created feature branch '001-phase-4-local-k8s'.
Generated detailed Spec for Phase 4 including:
1. Containerization (Frontend/Backend/Gordon)
2. Helm Architecture (Dual URLs, Probes, Resources)
3. Networking (Ingress)
4. AI-Ops (kubectl-ai, kagent)
Created Requirements Checklist.

## Outcome

- ✅ Impact: Formalized Phase 4 requirements into a spec.
- 🧪 Tests: N/A
- 📁 Files: spec.md, requirements.md
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: Ensuring the "Dual URL" logic (Internal vs External) was crucial for Next.js in K8s.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A