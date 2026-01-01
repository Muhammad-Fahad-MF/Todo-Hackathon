# Phase 1 In-Memory Todo Console Application (Python) Constitution

<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → Simplicity
  - [PRINCIPLE_2_NAME] → Type Safety
  - [PRINCIPLE_3_NAME] → User Experience
  - [PRINCIPLE_4_NAME] → Modularity
- Added sections: Key Standards, Constraints, Success Criteria
- Removed sections: Principles 5 and 6
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->

## Core Principles

### I. Simplicity
Code should be strictly minimal and functional (YAGNI - You Aren't Gonna Need It).

### II. Type Safety
Rigorous use of Python 3.13+ type hinting for all functions and classes.

### III. User Experience
The CLI should use the 'rich' library for visual hierarchy (tables, colors) rather than plain print statements.

### IV. Modularity
Separation of concerns between the data model (logic) and the user interface (view).

## Key Standards
- **Language Version**: Python 3.13+
- **Code Style**: PEP 8 compliance; use snake_case for functions/variables, PascalCase for classes.
- **Documentation**: Google-style docstrings required for all modules, classes, and functions.
- **Error Handling**: No raw crashes. Use try/except blocks to catch user input errors (e.g., non-integer IDs) and display friendly error messages.
- **Data Structure**: Use a global List of Dictionaries or a Task Class for in-memory storage.

## Constraints
- **Storage**: STRICTLY In-Memory only. Do not use SQLite, JSON files, or any external database persistence for this phase.
- **Directory Structure**: All source code must reside in a `src/` folder.
- **Dependencies**: Use 'uv' for dependency management (rich, typer/click).
- **Testing**: Code must be testable (logic separated from input/output).

## Success Criteria
- Application starts and stops without errors.
- Code passes static type checking.
- The 5 core features (Add, Delete, Update, List, Complete) share a consistent UI style.
- Repository structure includes src/, specs/, README.md, and GEMINI.md.

## Governance
This Constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All pull requests and reviews must verify compliance with this constitution. Complexity must be justified. Use `GEMINI.md` for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01