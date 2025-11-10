import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Selly, SellyStage, SellyStyle } from '../types';

interface SellyState extends Selly {
  addExperience: (amount: number) => void;
  setStyle: (style: SellyStyle) => void;
  getEvolutionProgress: () => number;
  reset: () => void;
}

const EVOLUTION_THRESHOLDS = {
  seed: 0,
  sprout: 100,
  flower: 300,
  baby: 500,
};

const getStageFromExperience = (experience: number): SellyStage => {
  if (experience >= EVOLUTION_THRESHOLDS.baby) return 'baby';
  if (experience >= EVOLUTION_THRESHOLDS.flower) return 'flower';
  if (experience >= EVOLUTION_THRESHOLDS.sprout) return 'sprout';
  return 'seed';
};

export const useSellyStore = create<SellyState>()(
  persist(
    (set, get) => ({
      stage: 'seed',
      style: 'green',
      experience: 0,
      addExperience: (amount) => {
        const currentExp = get().experience;
        const newExp = currentExp + amount;
        const newStage = getStageFromExperience(newExp);
        set({ experience: newExp, stage: newStage });
      },
      setStyle: (style) => set({ style }),
      getEvolutionProgress: () => {
        const { experience, stage } = get();
        const currentThreshold = EVOLUTION_THRESHOLDS[stage];
        const nextStages: SellyStage[] = ['seed', 'sprout', 'flower', 'baby'];
        const currentIndex = nextStages.indexOf(stage);

        if (currentIndex === nextStages.length - 1) {
          return 100; // Max level
        }

        const nextStage = nextStages[currentIndex + 1];
        const nextThreshold = EVOLUTION_THRESHOLDS[nextStage];
        const progress = ((experience - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

        return Math.min(Math.max(progress, 0), 100);
      },
      reset: () => set({ stage: 'seed', style: 'green', experience: 0 }),
    }),
    {
      name: 'sellery-selly',
    }
  )
);
