import { SessionDefinition } from '@/components/SessionSetupPanel';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  config: SessionDefinition;
  setConfig: (config: SessionDefinition) => void;
  clearConfig: () => void;
}

const defaultSessionConfig: SessionDefinition = {
  timePerImage: 60, // default to 1 minute per image
  numberOfImages: 20, // default to 20 images
  imageFilters: undefined,
  imageId: undefined,
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      config: defaultSessionConfig,
      setConfig: (config) => set({ config }),
      clearConfig: () => set({ config: defaultSessionConfig }),
    }),
    {
      name: 'gesture-drawing-session', // localStorage key
    },
  ),
);
