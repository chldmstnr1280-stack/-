// ============================================
// SELLERY 타입 정의
// ============================================

// 사용자 정보
export interface User {
  id: string;
  name: string;
  email?: string;
  age?: number;
  createdAt: Date;
  currentOnboardingDay: number; // 0-7
  onboardingCompleted: boolean;
}

// 셀리 캐릭터 성장 단계
export enum SellyStage {
  SEED = 'seed',           // 씨앗
  SPROUT = 'sprout',       // 새싹
  FLOWER = 'flower',       // 꽃
  CHARACTER = 'character', // 꼬마 셀리
}

// 셀리 스타일
export interface SellyStyle {
  color: 'green' | 'pink' | 'gold';
  accessories: string[]; // 액세서리 ID 배열
}

// 셀리 상태
export interface Selly {
  stage: SellyStage;
  style: SellyStyle;
  experience: number; // 경험치 (0-100)
  level: number;
}

// 감정 기록
export interface Emotion {
  id: string;
  userId: string;
  date: Date;
  text?: string;
  emoji?: string;
  color?: string; // hex 색상
  intensity: number; // 1-10
  activities?: string[]; // 연동된 활동
  createdAt: Date;
}

// 루틴 타입
export enum RoutineType {
  MEDITATION = 'meditation',
  BREATHING = 'breathing',
  ACTIVITY = 'activity',
}

// 루틴 정보
export interface Routine {
  id: string;
  type: RoutineType;
  title: string;
  description: string;
  duration: number; // 분 단위
  icon: string;
  points: number; // 완료 시 획득 포인트
}

// 루틴 완료 기록
export interface RoutineCompletion {
  id: string;
  userId: string;
  routineId: string;
  completedAt: Date;
  pointsEarned: number;
}

// 뱃지
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

// 온보딩 미션
export interface OnboardingMission {
  day: number;
  title: string;
  description: string;
  tasks: string[];
  completed: boolean;
}

// 주간 리포트 데이터
export interface WeeklyReport {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  emotionCount: number;
  routineCompletions: number;
  emotionTemperature: number; // 0-100
  emotionTrend: 'up' | 'down' | 'stable';
  topEmotions: { emoji: string; count: number }[];
}

// 게임화 상태
export interface Gamification {
  points: number;
  level: number;
  badges: Badge[];
  streak: number; // 연속 기록 일수
}

// 온보딩 단계별 상태
export interface OnboardingProgress {
  currentDay: number;
  missions: OnboardingMission[];
  completedDays: number[];
}
