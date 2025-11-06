// Shared types for SELLERY app

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface EmotionEntry {
  id: string;
  userId: string;
  timestamp: string;
  emotionLabel: string;
  intensity: number;
  notes?: string;
  tags: string[];
}

export type MascotStage = 'seed' | 'sprout' | 'kid';

export interface MascotState {
  stage: MascotStage;
  score: number;
  message: string;
}

export interface WeeklyStats {
  avgIntensity: number;
  topEmotions: Array<{ emotion: string; count: number }>;
  daysLogged: number;
  dailyTrend: Array<{ date: string; avgIntensity: number; count: number }>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateEmotionRequest {
  emotionLabel: string;
  intensity: number;
  notes?: string;
  tags?: string[];
}
