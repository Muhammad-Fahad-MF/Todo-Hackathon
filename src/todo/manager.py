from typing import List, Optional
from todo.models import Task

class TaskManager:
    def __init__(self):
        self.tasks: List[Task] = []

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        if not title:
            raise ValueError("Task title cannot be empty.")

        new_task = Task(title=title, description=description) # Task dataclass handles ID and default status
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
            task.status = new_status # Dataclass __setattr__ handles validation
        return task

    def delete_task(self, task_id: int) -> bool:
        initial_len = len(self.tasks)
        self.tasks = [task for task in self.tasks if task.id != task_id]
        return len(self.tasks) < initial_len
