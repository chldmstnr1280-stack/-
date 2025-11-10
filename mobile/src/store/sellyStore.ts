/**
 * 셀리 캐릭터 상태 관리 (Zustand)
 */

import { create } from 'zustand';
import { SellyState, SellyStage, SellyStyle, SellyMood, SELLY_MILESTONES, EXPERIENCE_REWARDS } from '../types/selly';

interface SellyStore extends SellyState {
  // Actions
  setStyle: (style: SellyStyle) => void;
  addExperience: (amount: number) => void;
  evolve: () => void;
  setMood: (mood: SellyMood) => void;
  updateLastFed: () => void;
}

const initialState: SellyState = {
  userId: '', // Will be set after user creation
  stage: SellyStage.SEED,
  style: SellyStyle.GREEN,
  progress: 0,
  experience: 0,
  accessories: [],
  mood: 'neutral',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useSellyStore = create<SellyStore>((set, get) => ({
  ...initialState,

  setStyle: (style: SellyStyle) =>
    set({
      style,
      updatedAt: new Date(),
    }),

  addExperience: (amount: number) => {
    const state = get();
    const newExperience = state.experience + amount;
    const currentStage = state.stage;

    // 다음 단계 확인
    let newStage = currentStage;
    let shouldEvolve = false;

    if (
      currentStage === SellyStage.SEED &&
      newExperience >= SELLY_MILESTONES[SellyStage.SPROUT].experience
    ) {
      newStage = SellyStage.SPROUT;
      shouldEvolve = true;
    } else if (
      currentStage === SellyStage.SPROUT &&
      newExperience >= SELLY_MILESTONES[SellyStage.FLOWER].experience
    ) {
      newStage = SellyStage.FLOWER;
      shouldEvolve = true;
    } else if (
      currentStage === SellyStage.FLOWER &&
      newExperience >= SELLY_MILESTONES[SellyStage.BABY].experience
    ) {
      newStage = SellyStage.BABY;
      shouldEvolve = true;
    }

    // 진행도 계산 (0-100%)
    const nextStageExp =
      newStage === SellyStage.BABY
        ? SELLY_MILESTONES[SellyStage.BABY].experience
        : Object.values(SellyStage).indexOf(newStage) < Object.values(SellyStage).length - 1
        ? SELLY_MILESTONES[
            Object.values(SellyStage)[Object.values(SellyStage).indexOf(newStage) + 1]
          ].experience
        : newExperience;

    const currentStageExp = SELLY_MILESTONES[newStage].experience;
    const progress =
      newStage === SellyStage.BABY
        ? 100
        : Math.min(
            100,
            Math.floor(
              ((newExperience - currentStageExp) / (nextStageExp - currentStageExp)) * 100
            )
          );

    set({
      experience: newExperience,
      stage: newStage,
      progress,
      mood: shouldEvolve ? 'excited' : state.mood,
      updatedAt: new Date(),
    });

    return shouldEvolve;
  },

  evolve: () => {
    const state = get();
    const stages = Object.values(SellyStage);
    const currentIndex = stages.indexOf(state.stage);

    if (currentIndex < stages.length - 1) {
      set({
        stage: stages[currentIndex + 1],
        progress: 0,
        mood: 'excited',
        updatedAt: new Date(),
      });
    }
  },

  setMood: (mood: SellyMood) =>
    set({
      mood,
      updatedAt: new Date(),
    }),

  updateLastFed: () =>
    set({
      lastFedAt: new Date(),
      mood: 'happy',
      updatedAt: new Date(),
    }),
}));

// 경험치 획득 헬퍼 함수
export const rewardEmotionLog = () => {
  const { addExperience } = useSellyStore.getState();
  return addExperience(EXPERIENCE_REWARDS.EMOTION_LOG);
};

export const rewardRoutineComplete = () => {
  const { addExperience } = useSellyStore.getState();
  return addExperience(EXPERIENCE_REWARDS.ROUTINE_COMPLETE);
};

export const rewardSurveyComplete = () => {
  const { addExperience } = useSellyStore.getState();
  return addExperience(EXPERIENCE_REWARDS.SURVEY_COMPLETE);
};

export const rewardDailyStreak = () => {
  const { addExperience } = useSellyStore.getState();
  return addExperience(EXPERIENCE_REWARDS.DAILY_STREAK);
};
