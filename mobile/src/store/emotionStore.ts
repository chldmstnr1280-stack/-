/**
 * 감정 기록 상태 관리 (Zustand)
 */

import { create } from 'zustand';
import { EmotionLog } from '../types/emotion';

interface EmotionStore {
  emotions: EmotionLog[];
  currentLog: Partial<EmotionLog> | null;

  // Actions
  addEmotion: (emotion: EmotionLog) => void;
  updateCurrentLog: (data: Partial<EmotionLog>) => void;
  clearCurrentLog: () => void;
  getEmotionsByDateRange: (startDate: Date, endDate: Date) => EmotionLog[];
  getTodayEmotion: () => EmotionLog | undefined;
}

export const useEmotionStore = create<EmotionStore>((set, get) => ({
  emotions: [],
  currentLog: null,

  addEmotion: (emotion: EmotionLog) =>
    set(state => ({
      emotions: [...state.emotions, emotion],
      currentLog: null,
    })),

  updateCurrentLog: (data: Partial<EmotionLog>) =>
    set(state => ({
      currentLog: {
        ...state.currentLog,
        ...data,
      },
    })),

  clearCurrentLog: () =>
    set({
      currentLog: null,
    }),

  getEmotionsByDateRange: (startDate: Date, endDate: Date) => {
    const { emotions } = get();
    return emotions.filter(
      emotion =>
        emotion.date >= startDate && emotion.date <= endDate
    );
  },

  getTodayEmotion: () => {
    const { emotions } = get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return emotions.find(emotion => {
      const emotionDate = new Date(emotion.date);
      emotionDate.setHours(0, 0, 0, 0);
      return emotionDate.getTime() === today.getTime();
    });
  },
}));
