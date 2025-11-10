/**
 * 사용자 관련 타입 정의
 */

export interface User {
  id: string;
  email?: string;
  name: string;
  age: number;
  hspLevel: HSPLevel;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export type HSPLevel = 'low' | 'medium' | 'high';

export interface UserProfile {
  avatarUrl?: string;
  bio?: string;
  location?: string;
  timezone: string;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  reminderTime?: string; // HH:mm format
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
}

export interface HSPAssessment {
  question: string;
  answer: boolean;
}

// HSP 자가 진단 질문
export const HSP_QUESTIONS: string[] = [
  '소리나 냄새에 예민한 편이다',
  '다른 사람의 감정에 쉽게 영향받는다',
  '복잡한 상황에서 압도당한다',
  '섬세한 것을 잘 알아챈다',
  '깊이 생각하는 편이다',
];

export interface UserStats {
  totalEmotionLogs: number;
  currentStreak: number; // 연속 기록 일수
  longestStreak: number;
  totalRoutinesCompleted: number;
  points: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}
