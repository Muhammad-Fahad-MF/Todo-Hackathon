import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserSession {
  userId: string;
  email: string;
  // Add any other user properties you need
}

interface SessionState {
  session: UserSession | null;
  setSession: (session: UserSession | null) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: 'user-session-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
