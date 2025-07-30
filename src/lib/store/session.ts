import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionConfig = {
  timePerImage: number; // in seconds
  numberOfImages: number;
};

type SessionState = {
  config: SessionConfig | null;
  setConfig: (config: SessionConfig) => void;
  clearConfig: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (config) => set({ config }),
      clearConfig: () => set({ config: null }),
    }),
    {
      name: 'gesture-drawing-session', // localStorage key
    },
  ),
);
