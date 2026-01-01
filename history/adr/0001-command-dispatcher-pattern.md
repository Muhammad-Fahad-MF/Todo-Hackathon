# ADR-0001: Command Dispatcher Pattern

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-01
- **Feature:** 001-in-memory-todo-app
- **Context:** The application's REPL needs a scalable and maintainable mechanism to map user command strings to the corresponding handler functions. As the number of commands grows, a simple conditional block becomes inefficient and hard to manage.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

A dictionary (hash map) will be used to map command strings (e.g., "add", "list", "done") to their respective handler functions. This creates a central command registry that is queried by the main REPL loop.

<!-- For technology stacks, list all components:
     - Framework: Next.js 14 (App Router)
     - Styling: Tailwind CSS v3
     - Deployment: Vercel
     - State Management: React Context (start simple)
-->

## Consequences

### Positive

- **Scalability**: Adding new commands does not require modifying a complex `if/elif/else` structure. A new entry is simply added to the dictionary.
- **Performance**: Command lookups are efficient, typically O(1).
- **Maintainability**: Code is cleaner, more readable, and decouples the command invocation from its implementation.

### Negative

- A slight increase in initial complexity compared to a simple `if` block for a very small number of commands.

## Alternatives Considered

- **If/Elif/Else Block**: A sequential block of `if/elif/else` statements was considered. It is simple for 1-3 commands but scales poorly, leading to reduced readability and increased cyclomatic complexity as more commands are added. It was rejected because it violates the "simplicity" and "modularity" principles for a growing application.

## References

- Feature Spec: ../../specs/001-in-memory-todo-app/spec.md
- Implementation Plan: ../../specs/001-in-memory-todo-app/plan.md
- Related ADRs: None
- Evaluator Evidence: None