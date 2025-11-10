/**
 * 사용자 상태 관리 (Zustand)
 */

import { create } from 'zustand';
import { User, HSPLevel, UserStats } from '../types/user';

interface UserStore {
  user: User | null;
  stats: UserStats | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  updateProfile: (data: Partial<User>) => void;
  setHSPLevel: (level: HSPLevel) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  incrementStreak: () => void;
  logout: () => void;
}

const initialStats: UserStats = {
  totalEmotionLogs: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalRoutinesCompleted: 0,
  points: 0,
  badges: [],
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  stats: initialStats,
  isAuthenticated: false,

  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),

  updateProfile: (data: Partial<User>) =>
    set(state => ({
      user: state.user ? { ...state.user, ...data, updatedAt: new Date() } : null,
    })),

  setHSPLevel: (level: HSPLevel) =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            hspLevel: level,
            updatedAt: new Date(),
          }
        : null,
    })),

  updateStats: (stats: Partial<UserStats>) =>
    set(state => ({
      stats: state.stats ? { ...state.stats, ...stats } : null,
    })),

  incrementStreak: () =>
    set(state => {
      if (!state.stats) return {};

      const newStreak = state.stats.currentStreak + 1;
      return {
        stats: {
          ...state.stats,
          currentStreak: newStreak,
          longestStreak: Math.max(state.stats.longestStreak, newStreak),
        },
      };
    }),

  logout: () =>
    set({
      user: null,
      stats: initialStats,
      isAuthenticated: false,
    }),
}));
