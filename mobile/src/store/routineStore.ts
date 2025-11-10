/**
 * 루틴 상태 관리 (Zustand)
 */

import { create } from 'zustand';
import { RoutineProgress, RoutineHistory } from '../types/routine';

interface RoutineStore {
  history: RoutineProgress[];
  currentRoutine: RoutineProgress | null;
  totalCompleted: number;
  streak: number;

  // Actions
  startRoutine: (routineId: string, userId: string) => void;
  completeRoutine: (rating?: number, notes?: string) => void;
  cancelRoutine: () => void;
  getCompletedToday: () => RoutineProgress[];
  getRoutineHistory: (routineId: string) => RoutineProgress[];
  getTotalDuration: () => number;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  history: [],
  currentRoutine: null,
  totalCompleted: 0,
  streak: 0,

  startRoutine: (routineId: string, userId: string) => {
    const newRoutine: RoutineProgress = {
      id: `routine_${Date.now()}`,
      routineId,
      userId,
      startedAt: new Date(),
      duration: 0,
    };

    set({
      currentRoutine: newRoutine,
    });
  },

  completeRoutine: (rating?: number, notes?: string) => {
    const { currentRoutine, history, totalCompleted } = get();

    if (!currentRoutine) return;

    const completedRoutine: RoutineProgress = {
      ...currentRoutine,
      completedAt: new Date(),
      duration: Math.floor(
        (new Date().getTime() - currentRoutine.startedAt.getTime()) / 1000
      ),
      rating,
      notes,
    };

    set({
      history: [completedRoutine, ...history],
      currentRoutine: null,
      totalCompleted: totalCompleted + 1,
    });

    // TODO: Calculate streak
  },

  cancelRoutine: () => {
    set({
      currentRoutine: null,
    });
  },

  getCompletedToday: () => {
    const { history } = get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return history.filter(routine => {
      if (!routine.completedAt) return false;
      const completedDate = new Date(routine.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });
  },

  getRoutineHistory: (routineId: string) => {
    const { history } = get();
    return history.filter(routine => routine.routineId === routineId);
  },

  getTotalDuration: () => {
    const { history } = get();
    return history.reduce((total, routine) => total + routine.duration, 0);
  },
}));
