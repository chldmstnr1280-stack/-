// Type definitions for SELLERY API

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface EmotionEntry {
  id: string;
  userId: string;
  timestamp: Date;
  emotionLabel: string;
  intensity: number;
  notes?: string;
  tags: string[];
}

export type MascotStage = 'seed' | 'sprout' | 'kid';

export interface MascotState {
  id: string;
  userId: string;
  stage: MascotStage;
  score: number;
  updatedAt: Date;
}

export interface MascotResponse {
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

// Phase 2/3 stub types
export interface StepLog {
  id: string;
  userId: string;
  date: Date;
  stepCount: number;
}

export interface CycleLog {
  id: string;
  userId: string;
  date: Date;
  phase?: string;
}

export interface ShopItem {
  id: string;
  key: string;
  title: string;
  type: 'outfit' | 'decor' | 'boost';
  price: number;
}

export interface Inventory {
  id: string;
  userId: string;
  itemId: string;
  ownedAt: Date;
}

// Request/Response types
export interface AuthRequest {
  email: string;
}

export interface AuthCallbackRequest {
  token: string;
}

export interface CreateEmotionRequest {
  emotionLabel: string;
  intensity: number;
  notes?: string;
  tags?: string[];
}

export interface JWTPayload {
  userId: string;
  email: string;
}
