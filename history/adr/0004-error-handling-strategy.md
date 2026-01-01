# ADR-0004: Error Handling Strategy

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-01
- **Feature:** 001-in-memory-todo-app
- **Context:** The application requires a robust error handling strategy to provide clear user feedback and prevent crashes, adhering to the "no raw Python tracebacks" constraint. Errors can occur from invalid user input (e.g., non-existent ID) or unexpected system issues.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

A hybrid approach will be implemented:
1.  **Centralized Exception Handling**: A `try...except` block will wrap the main REPL loop to catch any unhandled exceptions, preventing the application from crashing and logging the error for debugging while presenting a generic, friendly error message to the user.
2.  **Localized Error Handling**: Each command handler will be responsible for validating its own inputs and business logic (e.g., finding a task by ID). For predictable errors, it will return a specific error result or message to the presentation layer, which will then format it for the user.

<!-- For technology stacks, list all components:
     - Framework: Next.js 14 (App Router)
     - Styling: Tailwind CSS v3
     - Deployment: Vercel
     - State Management: React Context (start simple)
-->

## Consequences

### Positive

- **Robustness**: A global catch-all prevents the application from terminating unexpectedly.
- **User Experience**: Users receive clear, context-specific error messages for common issues (e.g., "Task not found") instead of generic failure notices.
- **Maintainability**: Error handling logic is located where the error is most understood—at the command level for business errors and at the application entry point for systemic failures.

### Negative

- Requires a consistent way for command handlers to signal errors to the presentation layer (e.g., by returning a tuple `(data, error)` or raising specific custom exceptions).

## Alternatives Considered

- **Centralized-Only Handling**: Relying solely on a single `try/except` block in the REPL loop was considered. This was rejected because it cannot provide context-specific error messages based on user input, leading to a poor user experience. For example, it wouldn't be able to distinguish between a "Task not found" error and an "Invalid input" error without complex inspection of the exception object.
- **Localized-Only Handling**: Relying only on handlers to manage their own errors without a global wrapper was rejected as it increases the risk of an unhandled exception crashing the entire application.

## References

- Feature Spec: ../../specs/001-in-memory-todo-app/spec.md
- Implementation Plan: ../../specs/001-in-memory-todo-app/plan.md
- Related ADRs: None
- Evaluator Evidence: None