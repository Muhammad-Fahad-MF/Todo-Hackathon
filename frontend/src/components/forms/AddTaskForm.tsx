// @/components/forms/AddTaskForm.tsx
"use client";

import { useState } from "react";
import { createTask } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskCreate } from "@/types/schemas";
import { useTaskStore } from "@/lib/store";

export function AddTaskForm() {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newTaskData: TaskCreate = { title, description: "" }; // Assuming description is optional
      const newTask = await createTask(newTaskData);
      addTask(newTask);
      toast.success("Task added successfully!");
      setTitle("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to add task: ${error.message}`);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Learn about Next.js server components"
        disabled={isSubmitting}
        className="flex-grow"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}