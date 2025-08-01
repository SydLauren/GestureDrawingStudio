import { SessionDefinition } from '@/components/SessionSetupPanel';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SessionState = {
  config: SessionDefinition | null;
  setConfig: (config: SessionDefinition) => void;
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
