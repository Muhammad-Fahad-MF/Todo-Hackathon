// @/components/tasks/TaskList.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useTaskStore } from "@/lib/store";
import { Task } from "@/types/schemas";
import {
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskListProps {
  initialTasks: Task[];
}

type SortOrder = 'newest' | 'oldest';

export function TaskList({ initialTasks }: TaskListProps) {
  const { tasks, setTasks, updateTask, deleteTask } = useTaskStore();
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks, setTasks]);

  // Sort tasks based on selected order
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Use ID as proxy for creation time if created_at is missing, 
      // otherwise parse dates. Assuming ID is auto-incrementing.
      const idA = a.id || 0;
      const idB = b.id || 0;
      
      if (sortOrder === 'newest') {
        return idB - idA;
      } else {
        return idA - idB;
      }
    });
  }, [tasks, sortOrder]);

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
    <div className="space-y-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
              {sortOrder === 'newest' ? <ArrowDownAZ className="mr-2 h-3.5 w-3.5" /> : <ArrowUpAZ className="mr-2 h-3.5 w-3.5" />}
              Sort by: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOrder('newest')}>
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
              Oldest first
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ul className="space-y-3">
        {sortedTasks.map((task) => (
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
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded border">
                  #{task.id}
                </span>
                <span className="font-bold">{task.title}</span>
              </div>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
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
    </div>
  );
}