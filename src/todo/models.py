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
