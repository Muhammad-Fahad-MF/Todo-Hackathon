# CLI Command Contracts

This document outlines the contracts for the command-line interface (CLI) of the In-Memory Todo Application. Each command defines its input, expected behavior, and output.

## REPL Overview

The application operates as a Read-Eval-Print Loop (REPL). Users will type commands and arguments into the console, and the application will respond accordingly.

### Welcome Banner

-   **Description**: Displayed upon application startup using `rich.panel`.
-   **Output**: A formatted panel containing a welcome message and potentially brief instructions.

### Command Prompt

-   **Description**: Continuously prompts the user for input.
-   **Output**: A clear prompt (e.g., `TodoApp> `).

### Available Commands Display

-   **Description**: Displays a list of available commands and their brief descriptions.
-   **Trigger**: Typically shown on startup and potentially when an invalid command is entered or a 'help' command is invoked (though 'help' is not explicitly defined in the spec, displaying commands is).
-   **Output**: A `rich.panel.Panel` or `rich.table.Table` listing commands.

---

## Commands

### 1. `add`

-   **Description**: Adds a new task to the in-memory list.
-   **Input**:
    -   `title`: `str` (required, non-empty)
    -   `description`: `str` (optional, defaults to empty string)
-   **Example Usage**:
    -   `add "Buy groceries"`
    -   `add "Call mom" "Wish her a happy birthday"`
-   **Behavior**:
    -   Prompts the user for `title` first, then `description`.
    -   If `title` is empty, an error message is displayed, and no task is added.
    -   A unique, auto-incrementing integer `id` is assigned.
    -   `status` defaults to "Pending".
-   **Output**:
    -   Success: Green-colored confirmation message (e.g., `Task '<title>' added with ID <id>.`).
    -   Error (empty title): Red-colored error message (e.g., `Error: Task title cannot be empty.`).

### 2. `list`

-   **Description**: Displays all tasks currently in the in-memory list.
-   **Input**: None
-   **Example Usage**: `list`
-   **Behavior**:
    -   Retrieves all tasks.
    -   Sorts tasks by ID (implicit from storage order and ID generation).
-   **Output**:
    -   If tasks exist: A `rich.table.Table` with columns: `ID`, `Title`, `Status`, `Description`.
        -   "Completed" tasks displayed in green.
        -   "Pending" tasks displayed in yellow/white.
        -   Long `Title` or `Description` fields are truncated with "...".
    -   If no tasks: Message "No tasks found."

### 3. `complete`

-   **Description**: Marks an existing task as "Completed".
-   **Input**:
    -   `id`: `int` (required)
-   **Example Usage**: `complete 1`
-   **Behavior**:
    -   Parses the `id` from the input.
    -   Finds the task by `id`.
    -   Updates the task's `status` to "Completed".
-   **Output**:
    -   Success: Green-colored confirmation message (e.g., `Task <id> marked as Completed.`).
    -   Error (invalid ID format): Red-colored error message (e.g., `Invalid ID: Please enter a number.`).
    -   Error (task not found): Red-colored error message (e.g., `Error: Task with ID <id> not found.`).
    -   Info (already completed): Informational message (e.g., `Task <id> is already Completed.`).

### 4. `delete`

-   **Description**: Removes a task from the in-memory list.
-   **Input**:
    -   `id`: `int` (required)
-   **Example Usage**: `delete 2`
-   **Behavior**:
    -   Parses the `id` from the input.
    -   Removes the task from the in-memory list.
-   **Output**:
    -   Success: Green-colored confirmation message (e.g., `Task <id> deleted.`).
    -   Error (invalid ID format): Red-colored error message (e.g., `Invalid ID: Please enter a number.`).
    -   Error (task not found): Red-colored error message (e.g., `Error: Task with ID <id> not found.`).

### 5. `exit`

-   **Description**: Terminates the application.
-   **Input**: None
-   **Example Usage**: `exit`
-   **Behavior**:
    -   Breaks the REPL loop.
-   **Output**: Application terminates.

---

## Error Taxonomy

-   **Invalid Command**: User enters a command not recognized.
    -   **Output**: Red-colored error message (e.g., `Error: Unknown command. Type 'help' to see available commands.`).
-   **Invalid ID Format**: User provides a non-integer where an ID is expected.
    -   **Output**: Red-colored error message (e.g., `Invalid ID: Please enter a number.`).
-   **Task Not Found**: User provides an ID that does not correspond to an existing task.
    -   **Output**: Red-colored error message (e.g., `Error: Task with ID <id> not found.`).
-   **Empty Title**: User attempts to add a task with an empty title.
    -   **Output**: Red-colored error message (e.g., `Error: Task title cannot be empty.`).
