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
  const [description, setDescription] = useState("");
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
      const newTaskData: TaskCreate = { title, description };
      const newTask = await createTask(newTaskData);
      addTask(newTask);
      toast.success("Task added successfully!");
      setTitle("");
      setDescription("");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Learn about Next.js server components"
        disabled={isSubmitting}
        className="flex-grow"
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        disabled={isSubmitting}
        className="flex-grow"
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}