import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Selly, SellyStage, SellyStyle } from '../types';

interface SellyState {
  selly: Selly;

  // Actions
  setSelly: (selly: Selly) => void;
  updateStage: (stage: SellyStage) => void;
  updateStyle: (style: Partial<SellyStyle>) => void;
  addExperience: (amount: number) => void;
  levelUp: () => void;
}

const initialSelly: Selly = {
  stage: SellyStage.SEED,
  style: {
    color: 'green',
    accessories: [],
  },
  experience: 0,
  level: 1,
};

// 성장 단계별 필요 경험치
const experienceThresholds = {
  [SellyStage.SEED]: 25,      // 씨앗 -> 새싹: 25 경험치
  [SellyStage.SPROUT]: 50,    // 새싹 -> 꽃: 50 경험치
  [SellyStage.FLOWER]: 100,   // 꽃 -> 캐릭터: 100 경험치
};

export const useSellyStore = create<SellyState>()(
  persist(
    (set, get) => ({
      selly: initialSelly,

      setSelly: (selly) => set({ selly }),

      updateStage: (stage) =>
        set((state) => ({
          selly: {
            ...state.selly,
            stage,
          },
        })),

      updateStyle: (style) =>
        set((state) => ({
          selly: {
            ...state.selly,
            style: {
              ...state.selly.style,
              ...style,
            },
          },
        })),

      addExperience: (amount) =>
        set((state) => {
          const newExperience = state.selly.experience + amount;
          const currentStage = state.selly.stage;

          // 다음 단계로 진화 확인
          let newStage = currentStage;
          let finalExperience = newExperience;

          if (
            currentStage === SellyStage.SEED &&
            newExperience >= experienceThresholds[SellyStage.SEED]
          ) {
            newStage = SellyStage.SPROUT;
            finalExperience = newExperience - experienceThresholds[SellyStage.SEED];
          } else if (
            currentStage === SellyStage.SPROUT &&
            newExperience >= experienceThresholds[SellyStage.SPROUT]
          ) {
            newStage = SellyStage.FLOWER;
            finalExperience = newExperience - experienceThresholds[SellyStage.SPROUT];
          } else if (
            currentStage === SellyStage.FLOWER &&
            newExperience >= experienceThresholds[SellyStage.FLOWER]
          ) {
            newStage = SellyStage.CHARACTER;
            finalExperience = 0; // 최종 단계에서는 경험치 리셋
          }

          return {
            selly: {
              ...state.selly,
              experience: finalExperience,
              stage: newStage,
            },
          };
        }),

      levelUp: () =>
        set((state) => ({
          selly: {
            ...state.selly,
            level: state.selly.level + 1,
          },
        })),
    }),
    {
      name: 'sellery-selly-storage',
    }
  )
);
