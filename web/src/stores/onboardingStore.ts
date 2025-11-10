import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingStep } from '../types';

interface OnboardingState {
  currentDay: number;
  isComplete: boolean;
  steps: OnboardingStep[];
  setCurrentDay: (day: number) => void;
  completeStep: (day: number) => void;
  setIsComplete: (complete: boolean) => void;
  reset: () => void;
}

const initialSteps: OnboardingStep[] = [
  { day: 0, title: 'Welcome', completed: false },
  { day: 1, title: 'Emotion Logging', completed: false },
  { day: 2, title: 'Activity Sync', completed: false },
  { day: 3, title: 'Routine Practice', completed: false },
  { day: 4, title: 'Continue Routine', completed: false },
  { day: 5, title: 'Weekly Check-in', completed: false },
  { day: 7, title: 'Completion', completed: false },
];

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentDay: 0,
      isComplete: false,
      steps: initialSteps,
      setCurrentDay: (day) => set({ currentDay: day }),
      completeStep: (day) =>
        set((state) => ({
          steps: state.steps.map((step) =>
            step.day === day ? { ...step, completed: true } : step
          ),
        })),
      setIsComplete: (complete) => set({ isComplete: complete }),
      reset: () =>
        set({
          currentDay: 0,
          isComplete: false,
          steps: initialSteps,
        }),
    }),
    {
      name: 'sellery-onboarding',
    }
  )
);
