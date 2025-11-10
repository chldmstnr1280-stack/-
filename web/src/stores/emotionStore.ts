import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EmotionLog } from '../types';

interface EmotionState {
  logs: EmotionLog[];
  addLog: (log: Omit<EmotionLog, 'id' | 'date'>) => void;
  getLogs: () => EmotionLog[];
  getRecentLogs: (count: number) => EmotionLog[];
  clear: () => void;
}

export const useEmotionStore = create<EmotionState>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (logData) => {
        const newLog: EmotionLog = {
          ...logData,
          id: `emotion_${Date.now()}`,
          date: new Date(),
        };
        set((state) => ({
          logs: [...state.logs, newLog],
        }));
      },
      getLogs: () => get().logs,
      getRecentLogs: (count) => {
        const logs = get().logs;
        return logs.slice(-count).reverse();
      },
      clear: () => set({ logs: [] }),
    }),
    {
      name: 'sellery-emotions',
    }
  )
);
