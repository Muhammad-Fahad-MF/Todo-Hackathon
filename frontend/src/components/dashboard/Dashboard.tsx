"use client";

import { useSession, authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { ChatWidget } from "@/components/chat/ChatWidget";
import { MessageSquare, X, ChevronRight, ChevronLeft } from "lucide-react";

export function Dashboard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="container mx-auto max-w-7xl py-6 px-4 md:px-6 min-h-screen flex flex-col">
      <header className="flex justify-between items-center mb-6">
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

      <div className="flex flex-1 flex-col md:flex-row gap-6 relative items-start">
        {/* Main Content Area */}
        <main className="flex-1 w-full space-y-6 min-w-0">
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
        </main>

        {/* Desktop Sidebar (Sticky) */}
        <aside 
          className={`hidden md:flex flex-col sticky top-4 h-[calc(100vh-2rem)] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-80 lg:w-96" : "w-12"
          }`}
        >
          <div className="relative h-full flex flex-col">
             {/* Toggle Button */}
             <Button
                variant="secondary"
                size="icon"
                className="absolute -left-3 top-2 z-10 h-6 w-6 rounded-full shadow-md border"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             >
                {isSidebarOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
             </Button>

             {isSidebarOpen ? (
               <ChatWidget />
             ) : (
               <div className="h-full bg-muted/30 rounded-lg border border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setIsSidebarOpen(true)}>
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
               </div>
             )}
          </div>
        </aside>
      </div>

      {/* Mobile Floating Action Button */}
      <Button
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-40"
        onClick={() => setIsMobileChatOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Mobile Chat Overlay */}
      {isMobileChatOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-4 bg-background border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b bg-muted/50">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Assistant
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileChatOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
               <ChatWidget />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}