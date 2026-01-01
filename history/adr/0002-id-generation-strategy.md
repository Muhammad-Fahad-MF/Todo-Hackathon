# ADR-0002: ID Generation Strategy

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-01
- **Feature:** 001-in-memory-todo-app
- **Context:** The application requires a strategy for assigning a unique, non-reusable integer ID to each new task. The system is single-user and in-memory, meaning the ID generation mechanism does not need to handle distributed state or data persistence across sessions.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

A simple, monotonically increasing integer counter will be used. A global variable initialized to 0 will be incremented and assigned to each new task upon creation.

<!-- For technology stacks, list all components:
     - Framework: Next.js 14 (App Router)
     - Styling: Tailwind CSS v3
     - Deployment: Vercel
     - State Management: React Context (start simple)
-->

## Consequences

### Positive

- **Simplicity**: This is the simplest possible implementation that meets the requirements.
- **Performance**: It's extremely fast as it avoids any computation or iteration over existing data.
- **Guaranteed Uniqueness**: Uniqueness is guaranteed for a single session as the counter only moves forward.

### Negative

- IDs are not persistent and will reset every time the application starts. This is acceptable per the in-memory constraint.

## Alternatives Considered

- **Calculate max(id) + 1**: This approach involves iterating through all existing tasks to find the maximum current ID and adding 1. It is less performant (`O(n)`) and more complex than a simple counter. It was rejected as it provides no additional benefit in a single-session, in-memory context and is unnecessarily complex.
- **UUID**: Using UUIDs would guarantee global uniqueness but is overly complex for the requirement of simple, human-readable integer IDs.

## References

- Feature Spec: ../../specs/001-in-memory-todo-app/spec.md
- Implementation Plan: ../../specs/001-in-memory-todo-app/plan.md
- Related ADRs: None
- Evaluator Evidence: None