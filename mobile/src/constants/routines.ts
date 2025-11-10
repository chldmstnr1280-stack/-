/**
 * 루틴 상수 데이터
 */

import { Routine, RoutineType, RoutineCategory, BreathingPattern } from '../types/routine';

// 명상 루틴
export const MEDITATION_ROUTINES: Routine[] = [
  {
    id: 'meditation_3min',
    name: '3분 평온 명상',
    description: '짧지만 깊은 마음의 휴식',
    type: RoutineType.MEDITATION,
    category: RoutineCategory.RELAXATION,
    duration: 180, // 3분
    icon: '🧘',
    benefits: ['스트레스 감소', '마음 안정', '집중력 향상'],
    instructions: [
      '편안한 자세로 앉으세요',
      '눈을 감고 호흡에 집중하세요',
      '생각이 떠오르면 부드럽게 놓아주세요',
    ],
    isPremium: false,
  },
  {
    id: 'meditation_5min',
    name: '5분 집중 명상',
    description: '깊이 있는 마음 챙김 시간',
    type: RoutineType.MEDITATION,
    category: RoutineCategory.FOCUS,
    duration: 300, // 5분
    icon: '🧘‍♀️',
    benefits: ['깊은 이완', '감정 조절', '내면 평화'],
    instructions: [
      '편안한 자세로 앉으세요',
      '호흡을 천천히 깊게 하세요',
      '현재 순간에 머무르세요',
    ],
    isPremium: false,
  },
  {
    id: 'meditation_sleep',
    name: '수면 명상',
    description: '편안한 잠을 위한 명상',
    type: RoutineType.MEDITATION,
    category: RoutineCategory.SLEEP,
    duration: 600, // 10분
    icon: '😴',
    benefits: ['숙면 유도', '불안 해소', '몸의 이완'],
    isPremium: true,
  },
];

// 호흡법
export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'breathing_478',
    name: '4-7-8 호흡법',
    description: '불안을 줄이고 마음을 진정시키는 호흡법',
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8,
    },
    cycles: 4,
    benefits: ['불안 감소', '수면 유도', '스트레스 완화'],
  },
  {
    id: 'breathing_box',
    name: '박스 호흡법',
    description: '균형잡힌 호흡으로 집중력 향상',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfter: 4,
    },
    cycles: 5,
    benefits: ['집중력 향상', '감정 조절', '마음 안정'],
  },
  {
    id: 'breathing_deep',
    name: '복식 호흡',
    description: '배로 깊게 호흡하여 몸을 이완',
    pattern: {
      inhale: 5,
      exhale: 5,
    },
    cycles: 6,
    benefits: ['긴장 완화', '혈액 순환', '에너지 증진'],
  },
];

// 활동 루틴
export const ACTIVITY_ROUTINES: Routine[] = [
  {
    id: 'activity_garden_walk',
    name: '정원 산책',
    description: '셀리와 함께하는 마음의 산책',
    type: RoutineType.ACTIVITY,
    category: RoutineCategory.RELAXATION,
    duration: 300, // 5분
    icon: '🚶',
    benefits: ['기분 전환', '가벼운 운동', '자연 연결'],
    instructions: [
      '편안한 속도로 걸으세요',
      '주변을 천천히 관찰하세요',
      '셀리와 대화해보세요',
    ],
    isPremium: false,
  },
  {
    id: 'activity_stretching',
    name: '스트레칭',
    description: '몸과 마음을 풀어주는 스트레칭',
    type: RoutineType.ACTIVITY,
    category: RoutineCategory.ENERGY,
    duration: 180, // 3분
    icon: '🤸',
    benefits: ['근육 이완', '혈액 순환', '피로 회복'],
    isPremium: false,
  },
];

// 모든 루틴 통합
export const ALL_ROUTINES: Routine[] = [
  ...MEDITATION_ROUTINES,
  ...ACTIVITY_ROUTINES,
  // 호흡법은 별도로 관리 (BreathingPattern 타입)
];

// 루틴 ID로 찾기
export const getRoutineById = (id: string): Routine | undefined => {
  return ALL_ROUTINES.find(routine => routine.id === id);
};

// 타입별 루틴 가져오기
export const getRoutinesByType = (type: RoutineType): Routine[] => {
  return ALL_ROUTINES.filter(routine => routine.type === type);
};

// 카테고리별 루틴 가져오기
export const getRoutinesByCategory = (category: RoutineCategory): Routine[] => {
  return ALL_ROUTINES.filter(routine => routine.category === category);
};

// 무료 루틴만 가져오기
export const getFreeRoutines = (): Routine[] => {
  return ALL_ROUTINES.filter(routine => !routine.isPremium);
};
