"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl mb-6">
          Welcome to your new Todo App
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          The best place to organize your tasks, get more done, and free up your time.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/login">
            <Button size="lg" className="text-lg px-8">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}