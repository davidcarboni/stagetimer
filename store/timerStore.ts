import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TimerState {
  targetTime: number | null;
  isRunning: boolean;
  setTargetTime: (targetTime: number | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      targetTime: null,
      isRunning: false,
      setTargetTime: (targetTime) => set({ targetTime }),
      setIsRunning: (isRunning) => set({ isRunning }),
      reset: () => set({ targetTime: null, isRunning: false }),
    }),
    {
      name: 'timer-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);