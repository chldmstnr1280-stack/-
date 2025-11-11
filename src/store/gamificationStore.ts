import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Gamification, Badge } from '../types';

interface GamificationState extends Gamification {
  // Actions
  addPoints: (points: number) => void;
  unlockBadge: (badge: Badge) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  checkAndLevelUp: () => void;
}

// 레벨별 필요 포인트
const pointsPerLevel = 100;

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      points: 0,
      level: 1,
      badges: [],
      streak: 0,

      addPoints: (points) =>
        set((state) => {
          const newPoints = state.points + points;
          return { points: newPoints };
        }),

      unlockBadge: (badge) =>
        set((state) => {
          // 이미 획득한 뱃지인지 확인
          const alreadyUnlocked = state.badges.some((b) => b.id === badge.id);
          if (alreadyUnlocked) return state;

          return {
            badges: [
              ...state.badges,
              {
                ...badge,
                unlockedAt: new Date(),
              },
            ],
          };
        }),

      incrementStreak: () =>
        set((state) => ({
          streak: state.streak + 1,
        })),

      resetStreak: () => set({ streak: 0 }),

      checkAndLevelUp: () =>
        set((state) => {
          const newLevel = Math.floor(state.points / pointsPerLevel) + 1;
          if (newLevel > state.level) {
            return { level: newLevel };
          }
          return state;
        }),
    }),
    {
      name: 'sellery-gamification-storage',
    }
  )
);
