/**
 * 루틴 관련 타입 정의
 */

export enum RoutineType {
  MEDITATION = 'meditation',
  BREATHING = 'breathing',
  ACTIVITY = 'activity',
}

export enum RoutineCategory {
  RELAXATION = 'relaxation',
  FOCUS = 'focus',
  SLEEP = 'sleep',
  ENERGY = 'energy',
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  type: RoutineType;
  category: RoutineCategory;
  duration: number; // seconds
  icon: string;
  benefits: string[];
  instructions?: string[];
  audioUrl?: string; // for meditation
  isPremium: boolean;
}

export interface RoutineProgress {
  id: string;
  routineId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  duration: number; // actual duration in seconds
  rating?: number; // 1-5
  notes?: string;
}

export interface RoutineHistory {
  userId: string;
  routines: RoutineProgress[];
  totalCompleted: number;
  totalDuration: number; // total seconds
  favoriteRoutine?: string;
  streak: number; // consecutive days
}

// 호흡법 타입
export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number; // seconds
    hold?: number; // seconds (optional)
    exhale: number; // seconds
    holdAfter?: number; // seconds (optional)
  };
  cycles: number;
  benefits: string[];
}
