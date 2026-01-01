from typing import List, Optional
from todo.models import Task
from datetime import datetime, timezone

class TaskManager:
    def __init__(self):
        self.tasks: List[Task] = []

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        if not title:
            raise ValueError("Task title cannot be empty.")
        
        new_task = Task(title=title, description=description)
        self.tasks.append(new_task)
        return new_task

    def list_tasks(self) -> List[Task]:
        return self.tasks

    def find_task_by_id(self, task_id: int) -> Optional[Task]:
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def update_task_status(self, task_id: int, new_status: str) -> Optional[Task]:
        task = self.find_task_by_id(task_id)
        if task:
            task.status = new_status
            if new_status == "Completed":
                task.completed_at = datetime.now(timezone.utc)
        return task

    def delete_task(self, task_id: int) -> bool:
        task_to_delete = self.find_task_by_id(task_id)
        if task_to_delete:
            self.tasks.remove(task_to_delete)
            return True
        return False
