/**
 * 셀리 캐릭터 관련 타입 정의
 */

export enum SellyStage {
  SEED = 'seed', // 씨앗
  SPROUT = 'sprout', // 새싹
  FLOWER = 'flower', // 꽃
  BABY = 'baby', // 꼬마 셀리
}

export enum SellyStyle {
  GREEN = 'green', // 초록 (기본)
  PINK = 'pink', // 분홍
  BLUE = 'blue', // 파랑
  GOLDEN = 'golden', // 황금 (프리미엄)
}

export interface SellyState {
  userId: string;
  stage: SellyStage;
  style: SellyStyle;
  progress: number; // 0-100 (다음 단계까지)
  experience: number; // 총 경험치
  accessories: SellyAccessory[];
  lastFedAt?: Date;
  mood: SellyMood;
  createdAt: Date;
  updatedAt: Date;
}

export type SellyMood = 'happy' | 'neutral' | 'sad' | 'excited';

export interface SellyAccessory {
  id: string;
  name: string;
  category: 'hat' | 'glasses' | 'decoration';
  imageUrl: string;
  price: number; // 포인트
  isPremium: boolean;
  equipped: boolean;
}

export interface SellyMessage {
  id: string;
  stage: SellyStage;
  trigger: SellyMessageTrigger;
  message: string;
  emoji: string;
}

export type SellyMessageTrigger =
  | 'greeting'
  | 'emotion_logged'
  | 'routine_completed'
  | 'stage_evolved'
  | 'encouragement'
  | 'reminder';

// 셀리 성장 마일스톤
export const SELLY_MILESTONES = {
  [SellyStage.SEED]: { experience: 0, description: '작은 씨앗' },
  [SellyStage.SPROUT]: { experience: 100, description: '새싹이 돋아났어요' },
  [SellyStage.FLOWER]: { experience: 300, description: '아름다운 꽃이 피었어요' },
  [SellyStage.BABY]: { experience: 500, description: '셀리가 탄생했어요!' },
};

// 경험치 획득 규칙
export const EXPERIENCE_REWARDS = {
  EMOTION_LOG: 10,
  ROUTINE_COMPLETE: 20,
  SURVEY_COMPLETE: 30,
  DAILY_STREAK: 5,
};
