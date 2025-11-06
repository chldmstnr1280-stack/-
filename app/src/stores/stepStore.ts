/**
 * Step Tracking State Management (Zustand)
 *
 * Manages step logging, history, and statistics
 */

import { create } from 'zustand';
import { stepsApi } from '../api/steps';
import type { StepLog, WeeklyStepStats } from '../types/phase2';

interface StepState {
  todaySteps: number;
  weeklyStats: WeeklyStepStats | null;
  history: StepLog[];
  isLoading: boolean;
  error: string | null;

  // Actions
  logSteps: (stepCount: number, date?: Date) => Promise<boolean>;
  fetchTodaySteps: () => Promise<void>;
  fetchWeeklyStats: () => Promise<void>;
  fetchHistory: (from?: Date, to?: Date) => Promise<void>;
  refreshSteps: () => Promise<void>;
  reset: () => void;
}

export const useStepStore = create<StepState>((set, get) => ({
  todaySteps: 0,
  weeklyStats: null,
  history: [],
  isLoading: false,
  error: null,

  logSteps: async (stepCount: number, date?: Date) => {
    set({ isLoading: true, error: null });
    try {
      await stepsApi.logSteps(stepCount, date);

      // Refresh data after logging
      await Promise.all([
        get().fetchTodaySteps(),
        get().fetchWeeklyStats(),
      ]);

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to log steps',
        isLoading: false,
      });
      return false;
    }
  },

  fetchTodaySteps: async () => {
    try {
      const stepCount = await stepsApi.getTodaySteps();
      set({ todaySteps: stepCount });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch today steps',
      });
    }
  },

  fetchWeeklyStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await stepsApi.getWeeklyStats();
      set({ weeklyStats: stats, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch weekly stats',
        isLoading: false,
      });
    }
  },

  fetchHistory: async (from?: Date, to?: Date) => {
    set({ isLoading: true, error: null });
    try {
      const history = await stepsApi.getHistory(from, to);
      set({ history, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch history',
        isLoading: false,
      });
    }
  },

  refreshSteps: async () => {
    await Promise.all([
      get().fetchTodaySteps(),
      get().fetchWeeklyStats(),
    ]);
  },

  reset: () =>
    set({
      todaySteps: 0,
      weeklyStats: null,
      history: [],
      isLoading: false,
      error: null,
    }),
}));
