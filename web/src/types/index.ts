// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  isHSP: boolean;
}

// Emotion Types
export interface EmotionLog {
  id: string;
  text: string;
  emoji: string;
  color: string;
  temperature: number;
  date: Date;
}

// Selly Types
export type SellyStage = 'seed' | 'sprout' | 'flower' | 'baby';
export type SellyStyle = 'green' | 'pink' | 'blue' | 'yellow';

export interface Selly {
  stage: SellyStage;
  style: SellyStyle;
  experience: number;
}

// Routine Types
export interface Routine {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  category: 'meditation' | 'breathing' | 'activity';
  isPremium: boolean;
  rating?: number;
}

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
}

// Survey Types
export type SurveyType = 'phq9' | 'gad7';
export type Severity = 'minimal' | 'mild' | 'moderate' | 'severe';

export interface SurveyQuestion {
  id: string;
  text: string;
}

export interface SurveyResponse {
  questionId: string;
  value: number; // 0-3 for PHQ-9/GAD-7
}

export interface SurveyResult {
  id: string;
  type: SurveyType;
  responses: SurveyResponse[];
  totalScore: number;
  severity: Severity;
  completedAt: Date;
}

// Onboarding Types
export interface OnboardingStep {
  day: number;
  title: string;
  completed: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
