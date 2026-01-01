from typing import List, Optional, Literal
from .models import Task
from datetime import datetime, timezone

class TaskManager:
    """Manages a collection of tasks."""
    def __init__(self) -> None:
        """Initializes the TaskManager with an empty list of tasks."""
        self.tasks: List[Task] = []

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """Adds a new task to the list.

        Args:
            title: The title of the task.
            description: An optional description of the task.

        Returns:
            The newly created task.
        
        Raises:
            ValueError: If the title is empty.
        """
        if not title:
            raise ValueError("Task title cannot be empty.")
        
        new_task = Task(title=title, description=description)
        self.tasks.append(new_task)
        return new_task

    def list_tasks(self) -> List[Task]:
        """Returns the list of all tasks.

        Returns:
            A list of all tasks.
        """
        return self.tasks

    def find_task_by_id(self, task_id: int) -> Optional[Task]:
        """Finds a task by its ID.

        Args:
            task_id: The ID of the task to find.

        Returns:
            The task with the specified ID, or None if not found.
        """
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def update_task_status(self, task_id: int, new_status: Literal["Pending", "Completed"]) -> Optional[Task]:
        """Updates the status of a task.

        Args:
            task_id: The ID of the task to update.
            new_status: The new status for the task.

        Returns:
            The updated task, or None if the task was not found.
        """
        task = self.find_task_by_id(task_id)
        if task:
            task.status = new_status
            if new_status == "Completed":
                task.completed_at = datetime.now(timezone.utc)
        return task

    def delete_task(self, task_id: int) -> bool:
        """Deletes a task.

        Args:
            task_id: The ID of the task to delete.

        Returns:
            True if the task was deleted, False otherwise.
        """
        task_to_delete = self.find_task_by_id(task_id)
        if task_to_delete:
            self.tasks.remove(task_to_delete)
            return True
        return False
