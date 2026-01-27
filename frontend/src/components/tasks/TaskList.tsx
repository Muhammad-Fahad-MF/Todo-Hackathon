// @/components/tasks/TaskList.tsx
"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/lib/store";
import { Task } from "@/types/schemas";
import {
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { tasks, setTasks, updateTask, deleteTask } = useTaskStore();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks, setTasks]);

  const handleToggle = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const originalTasks = tasks;
    
    // Optimistic update
    updateTask(id, { is_completed: newStatus });

    try {
      await apiUpdateTask(id, { is_completed: newStatus });
      toast.success(newStatus ? "Task completed!" : "Task reopened.");
    } catch (error) {
      // Rollback on failure
      setTasks(originalTasks);
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (id: number) => {
    const originalTasks = tasks;
    deleteTask(id);

    try {
      await apiDeleteTask(id);
      toast.success("Task deleted.");
    } catch (error) {
      setTasks(originalTasks);
      toast.error("Failed to delete task.");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No tasks yet!</h3>
        <p className="text-muted-foreground">Add a new task to get started.</p>
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
            <span className="font-bold">{task.title}</span>
            {task.description && (
              <p className="text-xs text-muted-foreground">
                {task.description}
              </p>
            )}
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