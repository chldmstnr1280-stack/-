/**
 * 감정 관련 타입 정의
 */

export interface EmotionLog {
  id: string;
  userId: string;
  date: Date;
  text: string; // 감정 텍스트 (최대 100자)
  emoji: string; // 선택한 이모지
  color: string; // 감정 색상 (HEX)
  temperature: number; // 감정 온도 (0-100)
  activities?: ActivityData; // 연동된 활동 데이터
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityData {
  steps?: number; // 걸음 수
  sleepHours?: number; // 수면 시간
  heartRate?: number; // 심박수 (선택)
  source: 'apple_health' | 'google_fit' | 'manual';
}

export interface EmotionColor {
  id: string;
  name: string;
  color: string;
  emoji: string;
  description: string;
}

// 기본 감정 색상 팔레트
export const EMOTION_COLORS: EmotionColor[] = [
  { id: '1', name: '행복', color: '#FFD700', emoji: '😊', description: '기쁘고 행복한' },
  { id: '2', name: '평온', color: '#98D8C8', emoji: '😌', description: '차분하고 평온한' },
  { id: '3', name: '슬픔', color: '#87CEEB', emoji: '😢', description: '우울하고 슬픈' },
  { id: '4', name: '불안', color: '#DDA0DD', emoji: '😰', description: '불안하고 걱정되는' },
  { id: '5', name: '분노', color: '#FF6347', emoji: '😠', description: '화나고 짜증나는' },
  { id: '6', name: '피곤', color: '#D3D3D3', emoji: '😴', description: '지치고 피곤한' },
  { id: '7', name: '설렘', color: '#FFB6C1', emoji: '🤗', description: '설레고 기대되는' },
];

export interface WeeklyEmotionSummary {
  weekStart: Date;
  weekEnd: Date;
  averageTemperature: number;
  totalLogs: number;
  mostFrequentEmotion: string;
  emotionTrend: 'improving' | 'stable' | 'declining';
  dailyTemperatures: { date: Date; temperature: number }[];
}
