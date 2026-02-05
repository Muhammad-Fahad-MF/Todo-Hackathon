import { create } from 'zustand';
import { sendChatMessage, clearChatHistory, fetchChatHistory, getTasks } from '@/lib/api';
import { ChatResponse, Task } from '@/types/schemas';

// --- Task Store ---

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  fetchTasks: async () => {
    try {
      const tasks = await getTasks();
      set({ tasks });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  },
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));

// --- Chat Store ---

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  conversationId: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  conversationId: null,
  sendMessage: async (content: string) => {
    set({ isLoading: true });
    // Optimistic update
    const userMsg: Message = { role: 'user', content };
    set((state) => ({ messages: [...state.messages, userMsg] }));

    try {
      const { conversationId } = get();
      const data = await sendChatMessage({ 
        message: content, 
        conversation_id: conversationId 
      });
      
      const assistantMsg: Message = { role: 'assistant', content: data.response };
      set((state) => ({ 
        messages: [...state.messages, assistantMsg],
        conversationId: data.conversation_id,
        isLoading: false
      }));

      // --- UI SYNC LOGIC ---
      // Currently refreshes every time (Option A).
      // Future: Wrap this in a check (e.g., if (data.refresh_needed)) for Option B.
      await useTaskStore.getState().fetchTasks();
      
    } catch (error) {
      console.error("Chat error:", error);
      set({ isLoading: false });
    }
  },
  loadHistory: async () => {
    set({ isLoading: true });
    try {
      const history = await fetchChatHistory();
      set({ 
        messages: history.messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        conversationId: history.conversation_id,
        isLoading: false 
      });
    } catch (error) {
      console.error("Load history error:", error);
      set({ isLoading: false });
    }
  },
  clearHistory: async () => {
    set({ isLoading: true });
    try {
      await clearChatHistory();
      set({ messages: [], conversationId: null, isLoading: false });
    } catch (error) {
       console.error("Clear history error:", error);
       set({ isLoading: false });
    }
  },
  reset: () => set({ messages: [], conversationId: null, isLoading: false }),
}));
