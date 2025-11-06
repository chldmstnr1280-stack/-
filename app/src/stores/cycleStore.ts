/**
 * Cycle Tracking State Management (Zustand)
 *
 * Manages menstrual cycle logging and emotion correlation insights
 */

import { create } from 'zustand';
import { cycleApi } from '../api/cycle';
import type { CyclePhase, CycleLog, CycleInsights } from '../types/phase2';

interface CycleState {
  currentPhase: CyclePhase | null;
  insights: CycleInsights | null;
  history: CycleLog[];
  isLoading: boolean;
  error: string | null;

  // Actions
  logCycle: (phase: CyclePhase | null, date?: Date) => Promise<boolean>;
  fetchCurrentPhase: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchHistory: (from?: Date, to?: Date) => Promise<void>;
  refreshCycle: () => Promise<void>;
  reset: () => void;
}

export const useCycleStore = create<CycleState>((set, get) => ({
  currentPhase: null,
  insights: null,
  history: [],
  isLoading: false,
  error: null,

  logCycle: async (phase: CyclePhase | null, date?: Date) => {
    set({ isLoading: true, error: null });
    try {
      await cycleApi.logCycle(phase, date);

      // Refresh data after logging
      await Promise.all([
        get().fetchCurrentPhase(),
        get().fetchInsights(),
      ]);

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to log cycle',
        isLoading: false,
      });
      return false;
    }
  },

  fetchCurrentPhase: async () => {
    try {
      const phase = await cycleApi.getCurrentPhase();
      set({ currentPhase: phase });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch current phase',
      });
    }
  },

  fetchInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      const insights = await cycleApi.getInsights();
      set({ insights, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch insights',
        isLoading: false,
      });
    }
  },

  fetchHistory: async (from?: Date, to?: Date) => {
    set({ isLoading: true, error: null });
    try {
      const history = await cycleApi.getHistory(from, to);
      set({ history, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch history',
        isLoading: false,
      });
    }
  },

  refreshCycle: async () => {
    await Promise.all([
      get().fetchCurrentPhase(),
      get().fetchInsights(),
    ]);
  },

  reset: () =>
    set({
      currentPhase: null,
      insights: null,
      history: [],
      isLoading: false,
      error: null,
    }),
}));
