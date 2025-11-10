/**
 * 온보딩 관련 타입 정의
 */

export interface OnboardingState {
  currentDay: number; // 0-7
  isComplete: boolean;
  completedSteps: OnboardingStep[];
  startedAt: Date;
  completedAt?: Date;
}

export enum OnboardingStep {
  // Day 0
  WELCOME = 'welcome',
  PROFILE_SETUP = 'profile_setup',
  GARDEN_INTRO = 'garden_intro',
  SELLY_STYLE_PICKER = 'selly_style_picker',

  // Day 1-2
  FIRST_EMOTION_LOG = 'first_emotion_log',
  ACTIVITY_SYNC = 'activity_sync',
  SELLY_SPROUT = 'selly_sprout',

  // Day 3-4
  ROUTINE_INTRO = 'routine_intro',
  FIRST_ROUTINE = 'first_routine',
  SELLY_FLOWER = 'selly_flower',

  // Day 5
  WEEKLY_CHECKIN = 'weekly_checkin',
  PHQ9_COMPLETE = 'phq9_complete',
  GAD7_COMPLETE = 'gad7_complete',

  // Day 7
  FINAL_LOG = 'final_log',
  SELLY_BABY = 'selly_baby',
  COMPLETION_CELEBRATION = 'completion_celebration',
}

export interface OnboardingDayConfig {
  day: number;
  title: string;
  description: string;
  steps: OnboardingStep[];
  minRequiredSteps: number; // 최소 완료 단계 수
}

// 7일 온보딩 설정
export const ONBOARDING_DAYS: OnboardingDayConfig[] = [
  {
    day: 0,
    title: '셀리와의 만남',
    description: '당신의 정원에 오신 것을 환영해요',
    steps: [
      OnboardingStep.WELCOME,
      OnboardingStep.PROFILE_SETUP,
      OnboardingStep.GARDEN_INTRO,
      OnboardingStep.SELLY_STYLE_PICKER,
    ],
    minRequiredSteps: 4,
  },
  {
    day: 1,
    title: '감정 기록하기',
    description: '오늘의 감정을 셀리와 함께 나눠봐요',
    steps: [OnboardingStep.FIRST_EMOTION_LOG],
    minRequiredSteps: 1,
  },
  {
    day: 2,
    title: '활동 연동하기',
    description: '신체 활동과 감정의 연결을 발견해요',
    steps: [OnboardingStep.ACTIVITY_SYNC, OnboardingStep.SELLY_SPROUT],
    minRequiredSteps: 1,
  },
  {
    day: 3,
    title: '루틴 시작하기',
    description: '마음을 돌보는 첫 번째 루틴',
    steps: [OnboardingStep.ROUTINE_INTRO, OnboardingStep.FIRST_ROUTINE],
    minRequiredSteps: 1,
  },
  {
    day: 4,
    title: '루틴 연습하기',
    description: '꾸준함이 만드는 변화',
    steps: [OnboardingStep.FIRST_ROUTINE, OnboardingStep.SELLY_FLOWER],
    minRequiredSteps: 1,
  },
  {
    day: 5,
    title: '주간 체크인',
    description: '이번 주 마음 상태를 점검해봐요',
    steps: [
      OnboardingStep.WEEKLY_CHECKIN,
      OnboardingStep.PHQ9_COMPLETE,
      OnboardingStep.GAD7_COMPLETE,
    ],
    minRequiredSteps: 2,
  },
  {
    day: 6,
    title: '지속하기',
    description: '꾸준히 기록하며 셀리와 함께 성장',
    steps: [],
    minRequiredSteps: 0,
  },
  {
    day: 7,
    title: '완성!',
    description: '7일간의 여정을 마쳤어요',
    steps: [
      OnboardingStep.FINAL_LOG,
      OnboardingStep.SELLY_BABY,
      OnboardingStep.COMPLETION_CELEBRATION,
    ],
    minRequiredSteps: 3,
  },
];
