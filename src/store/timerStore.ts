import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TimerState {
  targetTime: number | null;
  isRunning: boolean;
  pausedTime: number | null;
  duration: number | null;
  setTargetTime: (targetTime: number | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setPausedTime: (pausedTime: number | null) => void;
  setDuration: (duration: number | null) => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      targetTime: null,
      isRunning: false,
      pausedTime: null,
      duration: null,
      setTargetTime: (targetTime) => set({ targetTime }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setPausedTime: (pausedTime) => set({ pausedTime }),
      setDuration: (duration) => set({ duration }),
      reset: () => set({ targetTime: null, isRunning: false, pausedTime: null, duration: null }),
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
