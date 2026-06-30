import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeScheme = 'light' | 'dark';

interface ThemeState {
  scheme: ThemeScheme;
  toggle: () => void;
  setScheme: (scheme: ThemeScheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      scheme: 'dark',
      toggle: () => set({ scheme: get().scheme === 'dark' ? 'light' : 'dark' }),
      setScheme: (scheme) => set({ scheme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
