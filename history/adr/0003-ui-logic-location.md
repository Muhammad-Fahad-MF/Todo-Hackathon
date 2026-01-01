# ADR-0003: UI Logic Location

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-01
- **Feature:** 001-in-memory-todo-app
- **Context:** To ensure the application is modular and maintainable, a clear separation of concerns is needed between business logic (data management) and presentation logic (user interface). The `plan.md` explicitly calls for a 'Modular REPL' architecture.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

All UI-related logic, specifically the formatting of output using the `rich` library, will be located in a dedicated presentation layer (e.g., a `cli` or `view` module). The data management layer (`services`) will be responsible only for business logic and will return primitive data types or data models, not formatted strings.

<!-- For technology stacks, list all components:
     - Framework: Next.js 14 (App Router)
     - Styling: Tailwind CSS v3
     - Deployment: Vercel
     - State Management: React Context (start simple)
-->

## Consequences

### Positive

- **Separation of Concerns**: Enforces a clean architecture, making the codebase easier to understand, test, and maintain.
- **Testability**: The business logic can be tested independently of the UI, and vice-versa.
- **Flexibility**: The presentation layer can be modified or even replaced (e.g., with a web UI) with minimal impact on the core business logic.

### Negative

- Requires passing data between layers, which can introduce a small amount of overhead compared to a monolithic design.

## Alternatives Considered

- **Logic in Data Manager**: Placing `rich` formatting calls directly within the data management functions was considered. This was rejected because it would tightly couple the business logic to a specific presentation library, making it difficult to test the logic in isolation and harder to adapt or reuse the business logic for different interfaces in the future. This violates the 'Modularity' principle.

## References

- Feature Spec: ../../specs/001-in-memory-todo-app/spec.md
- Implementation Plan: ../../specs/001-in-memory-todo-app/plan.md
- Related ADRs: None
- Evaluator Evidence: None