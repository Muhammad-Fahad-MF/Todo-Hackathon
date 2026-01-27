"use client";

import { useSession, authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddTaskForm } from "@/components/forms/AddTaskForm";

export function Dashboard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button onClick={handleSignOut} variant="outline" className="border-accent2 text-accent2 hover:bg-accent2/10 hover:text-accent2">
            Logout
          </Button>
        </div>
      </header>

      <div className="grid gap-8 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Add a New Task</CardTitle>
            <CardDescription>
              What do you need to get done today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddTaskForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              Here are the tasks you have planned.
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}