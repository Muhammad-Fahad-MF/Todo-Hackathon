// @/components/tasks/TaskList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/types/schemas";
import { updateTask, deleteTask } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component
import { Trash2 } from "lucide-react";

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const router = useRouter();

  const handleToggle = async (id: number, is_completed: boolean) => {
    const originalTasks = tasks;
    // Optimistically update UI
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, is_completed: !is_completed } : task
      )
    );

    try {
      await updateTask(id, { is_completed: !is_completed });
      toast.success(`Task ${!is_completed ? "completed" : "marked as pending"}.`);
       router.refresh(); // Re-sync with server state
    } catch (error) {
      // Revert UI on failure
      setTasks(originalTasks);
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (id: number) => {
    const originalTasks = tasks;
    // Optimistically update UI
    setTasks(tasks.filter((task) => task.id !== id));

    try {
      await deleteTask(id);
      toast.success("Task deleted.");
       router.refresh(); // Re-sync with server state
    } catch (error) {
      // Revert UI on failure
      setTasks(originalTasks);
      toast.error("Failed to delete task.");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No tasks yet!</h3>
        <p className="text-muted-foreground">
          Add a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-4 p-3 bg-card rounded-lg shadow-sm"
        >
          <Checkbox
            id={`task-${task.id}`}
            checked={task.is_completed ?? false}
            onCheckedChange={() => {
              if (task.id) {
                handleToggle(task.id, task.is_completed ?? false);
              }
            }}
          />
          <label
            htmlFor={`task-${task.id}`}
            className={`flex-grow text-sm ${
              task.is_completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </label>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (task.id) {
                handleDelete(task.id);
              }
            }}
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}