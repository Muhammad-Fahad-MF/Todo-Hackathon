# Data Model: Task Entity

## Task Dataclass

The core data entity for the In-Memory Todo Application will be a `Task` dataclass. This choice aligns with Python 3.13+ type hinting requirements and provides a clear, concise way to define data structures.

```python
from dataclasses import dataclass, field
from typing import Literal

@dataclass
class Task:
    id: int = field(init=False)  # Auto-incrementing, unique ID
    title: str
    description: str = ""
    status: Literal["Pending", "Completed"] = "Pending"

    # Internal counter for auto-incrementing IDs
    _next_id: int = field(init=False, default=1, repr=False)

    def __post_init__(self):
        # Assign ID and increment the counter
        if not hasattr(Task, '_next_id_counter'):
            Task._next_id_counter = 1
        self.id = Task._next_id_counter
        Task._next_id_counter += 1

    def __setattr__(self, name, value):
        if name == 'status':
            if value not in ["Pending", "Completed"]:
                raise ValueError("Status must be 'Pending' or 'Completed'")
        super().__setattr__(name, value)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status
        }
```

## Entity Attributes and Validation

### `Task`

-   **`id`**:
    -   **Type**: `int`
    -   **Description**: A unique identifier for the task.
    -   **Validation**: Auto-incrementing, starting at 1. Guaranteed to be unique and never reused. Handled during object instantiation.
-   **`title`**:
    -   **Type**: `str`
    -   **Description**: The main description of the task.
    -   **Validation**: Must not be an empty string. This will be enforced at the point of user input.
-   **`description`**:
    -   **Type**: `str`
    -   **Description**: Optional longer description for the task.
    -   **Validation**: Defaults to an empty string if not provided. No other specific validation.
-   **`status`**:
    -   **Type**: `Literal["Pending", "Completed"]`
    -   **Description**: The current state of the task.
    -   **Validation**: Must be one of the literal values "Pending" or "Completed". Defaults to "Pending". Enforced via `__setattr__`.

## Relationships

-   **None**: The `Task` entity exists independently. There are no relationships with other entities in this phase of the application.

## State Transitions

The `status` attribute of a `Task` can transition as follows:

-   `"Pending"` → `"Completed"`: This transition occurs when the user explicitly marks a task as complete.
-   `"Completed"` → (No transition back to "Pending"): Once a task is "Completed", it remains in that state.
