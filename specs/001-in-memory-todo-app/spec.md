# Feature Specification: In-Memory Todo Console Application

**Feature Branch**: `001-in-memory-todo-app`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "Phase 1: In-Memory Todo Console Application Intent: Develop a single-user, text-based CLI application in Python 3.13+ that runs a Read-Eval-Print Loop (REPL). The application manages a list of tasks strictly in RAM. It must use the 'rich' library for all output formatting to ensure visual hierarchy. Data Model (Strict TypedDict or Dataclass): Define a 'Task' entity with the following strictly typed fields: - id: int (Auto-incrementing, starting at 1. Must be unique.) - title: str (Required. Must not be empty.) - description: str (Optional. Default to empty string.) - status: Literal["Pending", "Completed"] (Default to "Pending") Core Features & Behavior:
1. Application Loop:
- On start, display a welcome banner using `rich.panel`.
- Continuously prompt the user for a command until "exit" is entered. Display available commands and their descriptions using a `rich.panel.Panel` or `rich.table.Table`. 2. Add Task: - Prompt user for Title and Description. - If Title is empty, print an error message in red text (do not crash). - Assign the next available integer ID. 3. List Tasks: - Render a `rich.table.Table` with columns: ID, Title, Status, Description. - Rows with "Completed" status should appear in green; "Pending" in yellow/white. - If list is empty, display a text message "No tasks found." 4. Complete Task: - Accept a Task ID as input. - If ID exists, update status to "Completed". - If ID is invalid (non-integer) or not found, print a specific error message in red. 5. Delete Task: - Accept a Task ID. - Remove the item from the in-memory list. - Confirm deletion with a success message in green. Success Criteria (Measurable & Testable): - [Constitution Alignment] Code is fully annotated with Python 3.13 type hints and passes a static type check. - [Robustness] Entering a non-integer string (e.g., "abc") for ID prompts results in a caught exception and prints "Invalid ID: Please enter a number" in red. - [Visuals] The "List" command generates a Table object, not a plain text dump. - [Lifecycle] Application maintains state as long as the process is running; state resets to empty upon restart. - [Dependencies] Logic is imported from `src/` modules; the main entry point runs via `uv run`. Constraints: - Persistence Strategy: NONE. Use a global variable `tasks: List[Task] = []`. Do not write to disk (JSON/SQLite forbidden). - Error Handling: No raw Python tracebacks allowed in the console output. Use `try/except` blocks for all user inputs. - Directory Structure: Source code must be in `src/`. Entry point is `src/main.py`. Non-Goals: - Persistence of any kind (file or database). - User Authentication. - Web interface or API. - Complex sorting or filtering (Display order by ID is sufficient)."

## Clarifications

### Session 2026-01-01
- Q: What should happen if a user tries to "Mark Complete" a task that is already completed? → A: Show an informational message (e.g., "Task #5 is already complete.").
- Q: If task #2 is deleted, what ID should the next new task receive? → A: 4 (strictly sequential, never reuse IDs).
- Q: For error messages where the format isn't specified, what `rich` component should be used? → A: Simple colored text via `rich.print()`.
- Q: For the main application loop, how should the available commands be presented to the user? → A: A `rich.panel.Panel` or `rich.table.Table` displaying commands and their brief descriptions.
- Q: When displaying tasks in the `rich.table.Table`, how should very long titles or descriptions be handled? → A: Truncate the text and add "..." at the end.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a Task (Priority: P1)
As a user, I want to add a new task to my to-do list so I can keep track of things I need to do.

**Why this priority**: This is a core function of a to-do application.
**Independent Test**: Can be tested by adding a task and verifying it's in the list.

**Acceptance Scenarios**:
1. **Given** the application is running, **When** I enter the "add" command and provide a title and description, **Then** a new task is added to the list with a unique ID and "Pending" status.
2. **Given** the application is running, **When** I enter the "add" command but provide an empty title, **Then** an error message is displayed in red, and no task is added.

---

### User Story 2 - List Tasks (Priority: P1)
As a user, I want to see all my tasks in a formatted table so I can get an overview of my to-do list.

**Why this priority**: This is a core function for viewing the tracked tasks.
**Independent Test**: Can be tested by adding tasks and then listing them.

**Acceptance Scenarios**:
1. **Given** I have tasks in my list, **When** I enter the "list" command, **Then** a `rich` table is displayed with columns for ID, Title, Status, and Description.
2. **Given** the task list is empty, **When** I enter the "list" command, **Then** a message "No tasks found." is displayed.
3. **Given** I have tasks with different statuses, **When** I enter the "list" command, **Then** "Completed" tasks are shown in green, and "Pending" tasks are in yellow/white.

---

### User Story 3 - Complete a Task (Priority: P2)
As a user, I want to mark a task as complete so I can track my progress.

**Why this priority**: This is an essential part of managing tasks.
**Independent Test**: Can be tested by adding a task, completing it, and verifying its status.

**Acceptance Scenarios**:
1. **Given** I have a "Pending" task, **When** I enter the "complete" command with the correct task ID, **Then** the task's status is updated to "Completed".
2. **Given** I enter the "complete" command with a non-integer ID, **Then** an error message "Invalid ID: Please enter a number" is displayed in red.
3. **Given** I enter the "complete" command with an ID that does not exist, **Then** an error message is displayed in red.
4. **Given** I have a "Completed" task, **When** I enter the "complete" command with that task's ID, **Then** an informational message is displayed, and the status remains "Completed".

---

### User Story 4 - Delete a Task (Priority: P2)
As a user, I want to delete a task I no longer need.

**Why this priority**: This allows for cleaning up the task list.
**Independent Test**: Can be tested by adding a task and then deleting it.

**Acceptance Scenarios**:
1. **Given** I have a task in my list, **When** I enter the "delete" command with the correct task ID, **Then** the task is removed from the list, and a success message is shown in green.
2. **Given** I enter the "delete" command with an ID that does not exist, **Then** an error message is displayed in red.

---

### User Story 5 - Application Loop and Exit (Priority: P0)
As a user, I want the application to start up, show a welcome message, and run continuously until I decide to exit.

**Why this priority**: This is the basic application lifecycle.
**Independent Test**: Can be tested by starting the application and entering "exit".

**Acceptance Scenarios**:
1. **Given** I start the application, **When** it launches, **Then** a welcome banner is displayed.
2. **Given** the application is running, **When** I enter "exit", **Then** the application terminates.

### Edge Cases
- Adding a task with an empty title.
- Trying to complete or delete a task with a non-existent or invalid (non-integer) ID.
- Listing tasks when the list is empty.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The system MUST provide a REPL to accept user commands.
- **FR-002**: The system MUST allow users to add tasks with a title and an optional description.
- **FR-003**: The system MUST validate that a task title is not empty.
- **FR-004**: The system MUST automatically assign a unique, incrementing integer ID to each new task.
- FR-005: The system MUST display all tasks in a `rich` table, color-coding them by status. Long titles or descriptions MUST be truncated with "..." to maintain layout.
- **FR-006**: The system MUST allow users to mark a task as "Completed" using its ID.
- **FR-007**: The system MUST allow users to delete a task using its ID.
- **FR-008**: The system MUST handle invalid or non-existent IDs gracefully with user-friendly error messages.
- **FR-009**: The system MUST use in-memory storage; task data is lost on exit.
- **FR-010**: The application MUST be initiated with `uv run`.
- **FR-011**: All source code MUST be in a `src/` directory.

### Key Entities *(include if feature involves data)*
- **Task**: Represents a to-do item with the following attributes:
  - `id`: `int` (unique, auto-incrementing, never reused)
  - `title`: `str` (non-empty)
  - `description`: `str`
  - `status`: `Literal["Pending", "Completed"]`

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: [Constitution Alignment] Code is fully annotated with Python 3.13 type hints and passes a static type check.
- **SC-002**: [Robustness] Entering a non-integer string (e.g., "abc") for ID prompts results in a caught exception and prints "Invalid ID: Please enter a number" in red.
- **SC-003**: [Visuals] The "List" command generates a `rich.table.Table` object, not a plain text dump.
- **SC-004**: [Lifecycle] Application maintains state as long as the process is running; state resets to empty upon restart.
- **SC-005**: [Dependencies] Logic is imported from `src/` modules; the main entry point runs via `uv run`.