import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Routine, RoutineCompletion, RoutineType } from '../types';

interface RoutineState {
  routines: Routine[];
  completions: RoutineCompletion[];

  // Actions
  initializeRoutines: () => void;
  addCompletion: (completion: RoutineCompletion) => void;
  getCompletionsByDateRange: (startDate: Date, endDate: Date) => RoutineCompletion[];
  getTodayCompletions: () => RoutineCompletion[];
}

// 기본 루틴 데이터
const defaultRoutines: Routine[] = [
  // 명상
  {
    id: 'meditation-3min',
    type: RoutineType.MEDITATION,
    title: '3분 명상',
    description: '짧고 간단한 마음챙김 명상',
    duration: 3,
    icon: '🧘‍♀️',
    points: 10,
  },
  {
    id: 'meditation-5min',
    type: RoutineType.MEDITATION,
    title: '5분 명상',
    description: '여유롭게 하는 명상',
    duration: 5,
    icon: '🧘',
    points: 15,
  },
  // 호흡법
  {
    id: 'breathing-belly',
    type: RoutineType.BREATHING,
    title: '복식 호흡',
    description: '깊고 천천히 호흡하기',
    duration: 5,
    icon: '🌬️',
    points: 10,
  },
  {
    id: 'breathing-478',
    type: RoutineType.BREATHING,
    title: '4-7-8 호흡법',
    description: '4초 들이마시고, 7초 멈추고, 8초 내쉬기',
    duration: 5,
    icon: '💨',
    points: 15,
  },
  // 활동
  {
    id: 'activity-walk',
    type: RoutineType.ACTIVITY,
    title: '정원 산책',
    description: '셀리와 함께 정원을 산책하세요',
    duration: 10,
    icon: '🚶‍♀️',
    points: 20,
  },
  {
    id: 'activity-chat',
    type: RoutineType.ACTIVITY,
    title: '셀리와 대화',
    description: '셀리에게 오늘의 이야기를 들려주세요',
    duration: 5,
    icon: '💬',
    points: 10,
  },
];

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      routines: [],
      completions: [],

      initializeRoutines: () => {
        const currentRoutines = get().routines;
        if (currentRoutines.length === 0) {
          set({ routines: defaultRoutines });
        }
      },

      addCompletion: (completion) =>
        set((state) => ({
          completions: [...state.completions, completion],
        })),

      getCompletionsByDateRange: (startDate, endDate) => {
        const completions = get().completions;
        return completions.filter((completion) => {
          const completionDate = new Date(completion.completedAt);
          return completionDate >= startDate && completionDate <= endDate;
        });
      },

      getTodayCompletions: () => {
        const completions = get().completions;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return completions.filter((completion) => {
          const completionDate = new Date(completion.completedAt);
          completionDate.setHours(0, 0, 0, 0);
          return completionDate.getTime() === today.getTime();
        });
      },
    }),
    {
      name: 'sellery-routine-storage',
    }
  )
);
