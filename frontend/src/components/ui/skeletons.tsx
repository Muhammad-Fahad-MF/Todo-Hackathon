import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <TaskSkeleton />
      <TaskSkeleton />
      <TaskSkeleton />
      <TaskSkeleton />
    </div>
  );
}
