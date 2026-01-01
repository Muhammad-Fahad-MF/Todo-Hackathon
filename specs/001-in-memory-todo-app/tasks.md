---
description: "Task list for In-Memory Todo App implementation"
---

# Tasks: In-Memory Todo App

**Input**: Design documents from `/specs/001-in-memory-todo-app/`
**Prerequisites**: plan.md, spec.md

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Foundation

**Purpose**: Project initialization and core data model.

- [x] T001 Configure `pyproject.toml` with `typer` and `rich` dependencies in the `[project.dependencies]` section.**Crucial**: Add a `[project.scripts]` section with `start = "todo.main:app"` to enable `uv run start`.
Success Condition: `uv pip install` successfully installs the dependencies.
- [x] T002 Create the source directory `src/todo/`. Success Condition: The directory `src/todo/` exists.
- [x] T003 Create an empty `src/todo/__init__.py` file. Success Condition: The file exists.
- [x] T004 [US1] Define the `Task` data model in `src/todo/models.py` using `typing.TypedDict` or `dataclasses.dataclass` as specified in `spec.md`. 
Success Condition: The file contains the `Task` type with `id`, `title`, `description`, and `status` fields.

**Checkpoint**: Human Review. The basic project structure and data model are in place.

---

## Phase 2: Core Logic (Task Manager)

**Purpose**: Implement the business logic for managing tasks in memory.

- [x] T005 Create the `TaskManager` class in `src/todo/manager.py` with an in-memory list to store tasks. Success Condition: The file and class exist.
- [x] T006 [US1] Implement the `add_task` method in `src/todo/manager.py`. It should handle ID generation (no reuse) and validation for empty titles. Success Condition: Calling the method adds a task to the in-memory list and returns the new task.
- [x] T007 [US2] Implement the `list_tasks` method in `src/todo/manager.py`. Success Condition: The method returns the current list of all tasks.
- [x] T008 [US3] Implement the `update_task_status` method in `src/todo/manager.py`. It should find a task by ID and update its status. Success Condition: Calling the method changes a task's status in the list.
- [x] T009 [US4] Implement the `delete_task` method in `src/todo/manager.py`. It should remove a task by ID. Success Condition: Calling the method removes the specified task from the list.

**Checkpoint**: Human Review. The `TaskManager` is complete and its methods can be unit tested.

---

## Phase 3: CLI & REPL Implementation

**Purpose**: Create the user-facing command-line interface and main application loop.

- [x] T010 [US5] Set up main CLI entry point in `src/todo/main.py` using `typer` and the REPL loop. Success Condition: Running `uv run start` starts the REPL.
- [x] T011 [US5] Implement command parsing ("add", "list", "complete", "delete", "exit") in `src/todo/main.py`. Success Condition: The REPL correctly identifies and routes these commands.
- [x] T012 [US1] Integrate `TaskManager.add_task` with the "add" command in `src/todo/main.py`, including prompts for user input. Success Condition: The "add" command successfully creates a new task.
- [x] T013 [US2] Integrate `TaskManager.list_tasks` with the "list" command in `src/todo/main.py`. Success Condition: The "list" command retrieves tasks from the manager.
- [x] T014 [US3] Integrate `TaskManager.update_task_status` with the "complete" command in `src/todo/main.py`, including prompts for the task ID. Success Condition: The "complete" command updates a task's status.
- [x] T015 [US4] Integrate `TaskManager.delete_task` with the "delete" command in `src/todo/main.py`, including prompts for the task ID. Success Condition: The "delete" command removes a task.

**Checkpoint**: Human Review. The CLI is functional, though with basic text output.

---

## Phase 4: Rich UI Integration

**Purpose**: Enhance the CLI output using the `rich` library for a better user experience.

- [x] T016 [US5] Create and display a welcome banner using `rich.panel.Panel` when the application starts in `src/todo/main.py`. Success Condition: A panel is shown on startup.
- [x] T017 [US2] Use `rich.table.Table` to display the output of the "list" command in `src/todo/main.py`, with color-coding for status. Success Condition: The "list" command shows a formatted table.
- [x] T018 [US1] [US3] [US4] Use `rich.print` with color (e.g., `"[red]Error..."`) for all error messages in `src/todo/main.py`. Success Condition: Invalid ID errors are shown in red.
- [x] T019 Use `rich.panel.Panel` or `rich.table.Table` to display the main menu of available commands within the REPL in `src/todo/main.py`. Success Condition: A formatted menu is shown in the main loop.

**Checkpoint**: Human Review. The UI is now polished and uses `rich` components as specified.

---
## Phase 5: Polish & Finalization

**Purpose**: Add final touches and ensure all requirements are met.

- [ ] T020 Add comprehensive docstrings and type hints to all functions and classes in `src/todo/` and `main.py`. Success Condition: Code is fully documented and passes static type checking.
- [ ] T021 Create/update the `README.md` file with clear instructions on how to set up, run, and use the application. Success Condition: The `README.md` is complete and accurate.

---
## Dependencies & Execution Order

- **Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 -> Phase 5**
- Tasks within a phase can be done in order. User Story tags indicate which feature is being built.
