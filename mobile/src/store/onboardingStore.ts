/**
 * 온보딩 상태 관리 (Zustand)
 */

import { create } from 'zustand';
import { OnboardingState, OnboardingStep } from '../types/onboarding';

interface OnboardingStore extends OnboardingState {
  completeStep: (step: OnboardingStep) => void;
  setCurrentDay: (day: number) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  currentDay: 0,
  isComplete: false,
  completedSteps: [],
  startedAt: new Date(),
};

export const useOnboardingStore = create<OnboardingStore>(set => ({
  ...initialState,

  completeStep: (step: OnboardingStep) =>
    set(state => ({
      completedSteps: [...state.completedSteps, step],
    })),

  setCurrentDay: (day: number) =>
    set({
      currentDay: day,
    }),

  completeOnboarding: () =>
    set({
      isComplete: true,
      completedAt: new Date(),
    }),

  reset: () => set(initialState),
}));
