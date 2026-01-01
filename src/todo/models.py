from dataclasses import dataclass, field
from typing import Literal, Optional, get_args
from datetime import datetime, timezone

@dataclass
class Task:
    title: str
    description: Optional[str] = None
    status: Literal["Pending", "Completed"] = "Pending"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    id: int = field(init=False)

    _id_counter: int = field(default=0, init=False, repr=False)

    def __post_init__(self):
        type(self)._id_counter += 1
        self.id = type(self)._id_counter

    def __setattr__(self, name, value):
        if name == 'status' and value not in get_args(self.__class__.__annotations__['status']):
            raise ValueError(f"Status must be one of {get_args(self.__class__.__annotations__['status'])}")
        super().__setattr__(name, value)
