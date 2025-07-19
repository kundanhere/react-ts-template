import { create } from "zustand";

interface AppState {
  user: { name: string } | null;
  setUser: (user: { name: string } | null) => void;
  // Add more global state and actions here
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
