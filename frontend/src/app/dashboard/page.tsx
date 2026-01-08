// @/app/dashboard/page.tsx
import { Suspense } from "react";
import { getTasks } from "@/lib/api";
import { DashboardSkeleton } from "@/components/ui/skeletons";
import { AddTaskForm } from "@/components/forms/AddTaskForm";
import { TaskList } from "@/components/tasks/TaskList";

export const metadata = {
  title: "Dashboard - Full-Stack Todo App",
};

export default async function DashboardPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add a New Task</h2>
        <AddTaskForm />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Task List</h2>
        <Suspense fallback={<DashboardSkeleton />}>
          <Tasks />
        </Suspense>
      </div>
    </div>
  );
}

async function Tasks() {
  const tasks = await getTasks();
  return <TaskList initialTasks={tasks} />;
}