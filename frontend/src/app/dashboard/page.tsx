import { Suspense } from 'react';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { getTasks } from '@/lib/api';
import { TaskList } from '@/components/tasks/TaskList';
import { DashboardSkeleton } from '@/components/ui/skeletons';

export const metadata = {
  title: 'Dashboard - Full-Stack Todo App',
};

async function Tasks() {
  const tasks = await getTasks();
  return <TaskList initialTasks={tasks} />;
}

export default function DashboardPage() {
  return (
    <Dashboard>
      <Suspense fallback={<DashboardSkeleton />}>
        <Tasks />
      </Suspense>
    </Dashboard>
  );
}
