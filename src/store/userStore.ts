import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, OnboardingProgress, OnboardingMission } from '../types';

interface UserState {
  user: User | null;
  onboardingProgress: OnboardingProgress;

  // Actions
  setUser: (user: User) => void;
  updateOnboardingDay: (day: number) => void;
  completeOnboardingMission: (day: number) => void;
  resetUser: () => void;
}

// 초기 온보딩 미션
const initialMissions: OnboardingMission[] = [
  {
    day: 0,
    title: '환영합니다!',
    description: '정원에 입장하고 셀리 스타일을 선택하세요',
    tasks: ['회원가입', '프로필 설정', '셀리 스타일 선택'],
    completed: false,
  },
  {
    day: 1,
    title: '첫 감정 기록',
    description: '오늘의 감정을 기록해보세요',
    tasks: ['감정 기록하기', '활동 연동하기'],
    completed: false,
  },
  {
    day: 2,
    title: '감정 표현하기',
    description: '다양한 방법으로 감정을 표현해보세요',
    tasks: ['이모지로 감정 표현', '색상으로 감정 표현'],
    completed: false,
  },
  {
    day: 3,
    title: '첫 루틴',
    description: '나에게 맞는 루틴을 찾아보세요',
    tasks: ['루틴 선택하기', '루틴 완료하기'],
    completed: false,
  },
  {
    day: 4,
    title: '루틴 습관화',
    description: '루틴을 반복해서 습관을 만들어보세요',
    tasks: ['루틴 2회 완료'],
    completed: false,
  },
  {
    day: 5,
    title: '주간 체크인',
    description: '한 주를 되돌아보고 점검해보세요',
    tasks: ['주간 설문 완료', '감정 리포트 확인'],
    completed: false,
  },
  {
    day: 6,
    title: '성장 확인',
    description: '셀리와 함께 성장한 과정을 확인하세요',
    tasks: ['성장 그래프 보기'],
    completed: false,
  },
  {
    day: 7,
    title: '새로운 시작',
    description: '셀리의 최종 진화를 축하합니다!',
    tasks: ['최종 진화 확인', '앞으로의 여정 계획'],
    completed: false,
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      onboardingProgress: {
        currentDay: 0,
        missions: initialMissions,
        completedDays: [],
      },

      setUser: (user) => set({ user }),

      updateOnboardingDay: (day) =>
        set((state) => ({
          onboardingProgress: {
            ...state.onboardingProgress,
            currentDay: day,
          },
          user: state.user ? { ...state.user, currentOnboardingDay: day } : null,
        })),

      completeOnboardingMission: (day) =>
        set((state) => {
          const missions = state.onboardingProgress.missions.map((mission) =>
            mission.day === day ? { ...mission, completed: true } : mission
          );

          const completedDays = [...state.onboardingProgress.completedDays, day];

          return {
            onboardingProgress: {
              ...state.onboardingProgress,
              missions,
              completedDays,
            },
          };
        }),

      resetUser: () =>
        set({
          user: null,
          onboardingProgress: {
            currentDay: 0,
            missions: initialMissions,
            completedDays: [],
          },
        }),
    }),
    {
      name: 'sellery-user-storage',
    }
  )
);
