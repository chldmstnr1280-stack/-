import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Emotion } from '../types';

interface EmotionState {
  emotions: Emotion[];

  // Actions
  addEmotion: (emotion: Emotion) => void;
  getEmotionsByDateRange: (startDate: Date, endDate: Date) => Emotion[];
  getTodayEmotions: () => Emotion[];
  getEmotionCount: () => number;
  clearEmotions: () => void;
}

export const useEmotionStore = create<EmotionState>()(
  persist(
    (set, get) => ({
      emotions: [],

      addEmotion: (emotion) =>
        set((state) => ({
          emotions: [...state.emotions, emotion],
        })),

      getEmotionsByDateRange: (startDate, endDate) => {
        const emotions = get().emotions;
        return emotions.filter((emotion) => {
          const emotionDate = new Date(emotion.date);
          return emotionDate >= startDate && emotionDate <= endDate;
        });
      },

      getTodayEmotions: () => {
        const emotions = get().emotions;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return emotions.filter((emotion) => {
          const emotionDate = new Date(emotion.date);
          emotionDate.setHours(0, 0, 0, 0);
          return emotionDate.getTime() === today.getTime();
        });
      },

      getEmotionCount: () => get().emotions.length,

      clearEmotions: () => set({ emotions: [] }),
    }),
    {
      name: 'sellery-emotion-storage',
    }
  )
);
