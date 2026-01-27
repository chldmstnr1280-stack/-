
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: Role;
  text: string;
}

// 감정 타입
export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'anxiety' | 'peace' | 'love' | 'confusion';

// 잡초 (부정적 사고 패턴) 타입
export interface Weed {
  id: string;
  name: string;
  description: string;
  rootDepth: 'shallow' | 'medium' | 'deep'; // 뿌리 깊이 = 얼마나 오래된/깊은 문제인지
  emotion: EmotionType;
  createdAt: Date;
  isRemoved: boolean;
  removedAt?: Date;
  journalIds: string[]; // 관련 일기 ID들
}

// 식물 (긍정적 성장) 타입
export interface Plant {
  id: string;
  name: string;
  type: 'flower' | 'tree' | 'herb' | 'succulent';
  growthStage: number; // 1-5
  plantedAt: Date;
  lastWatered: Date;
  associatedWeeds: string[]; // 이 식물이 대체한 잡초 ID들
}

// 일기 엔트리
export interface JournalEntry {
  id: string;
  content: string;
  createdAt: Date;
  emotions: EmotionType[];
  identifiedWeeds: string[];
  aiAnalysis?: string;
  moodScore: number; // 1-10
}

// 정원 상태
export interface GardenState {
  plants: Plant[];
  weeds: Weed[];
  gardenHealth: number; // 0-100
  totalWeedsRemoved: number;
  currentStreak: number; // 연속 일기 작성 일수
}

// 구독 플랜
export type SubscriptionPlan = 'free' | 'seed' | 'bloom' | 'evergreen';

export interface SubscriptionTier {
  id: SubscriptionPlan;
  name: string;
  nameKo: string;
  price: number;
  priceDisplay: string;
  features: string[];
  journalLimit: number; // 월간 일기 제한 (-1 = 무제한)
  weedRemovalLimit: number; // 월간 잡초 뽑기 제한 (-1 = 무제한)
  aiAnalysisDepth: 'basic' | 'detailed' | 'comprehensive';
  hasVoiceJournal: boolean;
  hasGroupGarden: boolean;
  hasProfessionalSupport: boolean;
}

// 사용자 프로필
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  subscription: SubscriptionPlan;
  garden: GardenState;
  journals: JournalEntry[];
  createdAt: Date;
  lastActive: Date;
}

// 뷰/페이지 타입
export type ViewType = 'landing' | 'garden' | 'journal' | 'weeds' | 'chat' | 'pricing' | 'profile';

// 잡초 뽑기 세션
export interface WeedPullingSession {
  weedId: string;
  startedAt: Date;
  messages: Message[];
  isComplete: boolean;
  reflection?: string;
}
