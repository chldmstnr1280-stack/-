import { Badge } from '../types';

// 모든 뱃지 목록
export const allBadges: Omit<Badge, 'unlockedAt'>[] = [
  // 온보딩 뱃지
  {
    id: 'onboarding-complete',
    title: '여정의 시작',
    description: '7일 온보딩을 완료했어요',
    icon: '🎓',
  },
  // 감정 기록 뱃지
  {
    id: 'first-emotion',
    title: '첫 감정 기록',
    description: '처음으로 감정을 기록했어요',
    icon: '💚',
  },
  {
    id: 'emotion-10',
    title: '감정 탐험가',
    description: '10회 감정을 기록했어요',
    icon: '📝',
  },
  {
    id: 'emotion-50',
    title: '감정 마스터',
    description: '50회 감정을 기록했어요',
    icon: '✍️',
  },
  {
    id: 'emotion-100',
    title: '감정 전문가',
    description: '100회 감정을 기록했어요',
    icon: '🏆',
  },
  // 루틴 뱃지
  {
    id: 'first-routine',
    title: '첫 루틴',
    description: '처음으로 루틴을 완료했어요',
    icon: '🧘',
  },
  {
    id: 'routine-10',
    title: '루틴 애호가',
    description: '10회 루틴을 완료했어요',
    icon: '🌟',
  },
  {
    id: 'routine-50',
    title: '루틴 마스터',
    description: '50회 루틴을 완료했어요',
    icon: '⭐',
  },
  // 연속 기록 뱃지
  {
    id: 'streak-3',
    title: '3일 연속',
    description: '3일 연속 기록했어요',
    icon: '🔥',
  },
  {
    id: 'streak-7',
    title: '1주 연속',
    description: '7일 연속 기록했어요',
    icon: '🔥🔥',
  },
  {
    id: 'streak-30',
    title: '1달 연속',
    description: '30일 연속 기록했어요',
    icon: '🔥🔥🔥',
  },
  // 레벨 뱃지
  {
    id: 'level-5',
    title: '레벨 5 달성',
    description: '레벨 5에 도달했어요',
    icon: '🌱',
  },
  {
    id: 'level-10',
    title: '레벨 10 달성',
    description: '레벨 10에 도달했어요',
    icon: '🌿',
  },
  {
    id: 'level-20',
    title: '레벨 20 달성',
    description: '레벨 20에 도달했어요',
    icon: '🌸',
  },
  // 특별 뱃지
  {
    id: 'checkin-complete',
    title: '첫 주간 체크인',
    description: '주간 체크인을 완료했어요',
    icon: '📋',
  },
  {
    id: 'selly-evolved',
    title: '셀리 진화',
    description: '셀리를 최종 진화시켰어요',
    icon: '🧚‍♀️',
  },
];

// 뱃지 획득 조건 체크
export const checkBadgeUnlock = (
  badgeId: string,
  stats: {
    emotionCount: number;
    routineCompletions: number;
    streak: number;
    level: number;
    onboardingCompleted: boolean;
    hasCheckedIn: boolean;
    sellyEvolved: boolean;
  }
): boolean => {
  const conditions: Record<string, boolean> = {
    // 온보딩
    'onboarding-complete': stats.onboardingCompleted,

    // 감정
    'first-emotion': stats.emotionCount >= 1,
    'emotion-10': stats.emotionCount >= 10,
    'emotion-50': stats.emotionCount >= 50,
    'emotion-100': stats.emotionCount >= 100,

    // 루틴
    'first-routine': stats.routineCompletions >= 1,
    'routine-10': stats.routineCompletions >= 10,
    'routine-50': stats.routineCompletions >= 50,

    // 연속
    'streak-3': stats.streak >= 3,
    'streak-7': stats.streak >= 7,
    'streak-30': stats.streak >= 30,

    // 레벨
    'level-5': stats.level >= 5,
    'level-10': stats.level >= 10,
    'level-20': stats.level >= 20,

    // 특별
    'checkin-complete': stats.hasCheckedIn,
    'selly-evolved': stats.sellyEvolved,
  };

  return conditions[badgeId] || false;
};
