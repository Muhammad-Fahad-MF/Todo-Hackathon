from dataclasses import dataclass, field
from typing import Literal, Optional, get_args, Any
from datetime import datetime, timezone

@dataclass
class Task:
    """Represents a single task in the to-do list.

    Attributes:
        title (str): The title of the task.
        description (Optional[str]): A detailed description of the task.
        status (Literal["Pending", "Completed"]): The current status of the task.
        created_at (datetime): The timestamp when the task was created.
        completed_at (Optional[datetime]): The timestamp when the task was completed.
        id (int): A unique identifier for the task.
    """
    title: str
    description: Optional[str] = None
    status: Literal["Pending", "Completed"] = "Pending"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    id: int = field(init=False)

    _id_counter: int = field(default=0, init=False, repr=False)

    def __post_init__(self) -> None:
        """Initializes the task's ID after the object has been created."""
        type(self)._id_counter += 1
        self.id = type(self)._id_counter

    def __setattr__(self, name: str, value: Any) -> None:
        """Sets an attribute, with special validation for the 'status' field."""
        if name == 'status' and value not in get_args(self.__class__.__annotations__['status']):
            raise ValueError(f"Status must be one of {get_args(self.__class__.__annotations__['status'])}")
        super().__setattr__(name, value)
