import { create } from 'zustand';
import { EmotionEntry, CreateEmotionRequest } from '../types';
import { api } from '../api/client';

interface EmotionState {
  entries: EmotionEntry[];
  isLoading: boolean;
  createEntry: (data: CreateEmotionRequest) => Promise<EmotionEntry>;
  fetchEntries: () => Promise<void>;
}

export const useEmotionStore = create<EmotionState>((set) => ({
  entries: [],
  isLoading: false,

  createEntry: async (data: CreateEmotionRequest) => {
    const entry = await api.createEmotion(data);
    set((state) => ({
      entries: [entry, ...state.entries],
    }));
    return entry;
  },

  fetchEntries: async () => {
    set({ isLoading: true });
    try {
      const entries = await api.getEmotions();
      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      set({ isLoading: false });
    }
  },
}));
