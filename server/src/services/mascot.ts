import { PrismaClient } from '@prisma/client';
import { MascotStage, MascotResponse } from '../types/index.js';

const prisma = new PrismaClient();

// Emotional support message mapping (rule-based, no LLM)
const SUPPORT_MESSAGES: Record<string, Record<string, string>> = {
  anxious: {
    low: '괜찮아요, 차분히 호흡해봐요 🌿',
    medium: '불안한 마음을 함께 나눠요. 깊게 숨을 쉬어봐요.',
    high: '지금은 호흡에 집중해요. 천천히, 깊게. 당신 곁에 있어요.',
  },
  sad: {
    low: '슬픔도 소중한 감정이에요 🌧️',
    medium: '슬플 때는 슬퍼도 괜찮아요. 함께할게요.',
    high: '힘든 하루네요. 울어도 괜찮아요. 제가 옆에 있어요.',
  },
  happy: {
    low: '기분 좋은 하루네요! 🌞',
    medium: '행복한 순간을 함께 축하해요!',
    high: '정말 멋진 날이네요! 이 기쁨을 오래 간직해봐요!',
  },
  stressed: {
    low: '조금 스트레스 받는 날이네요.',
    medium: '스트레스가 느껴질 땐 잠시 쉬어가요.',
    high: '지금은 충분히 쉬어도 돼요. 잠시 멈춰도 괜찮아요.',
  },
  excited: {
    low: '기대되는 일이 있나봐요! ✨',
    medium: '설레는 마음이 전해져요!',
    high: '와! 정말 신나는 일이네요! 함께 응원할게요!',
  },
  calm: {
    low: '평온한 시간이네요 🍃',
    medium: '고요하고 평화로운 순간이에요.',
    high: '완벽한 평온함이에요. 이 순간을 즐겨봐요.',
  },
  grateful: {
    low: '감사한 마음이 드는군요 🙏',
    medium: '감사를 느낄 수 있다는 건 축복이에요.',
    high: '감사함이 가득한 하루네요! 정말 아름다워요.',
  },
  default: {
    low: '오늘 하루도 함께해요 🌱',
    medium: '당신의 감정을 기록해주셔서 고마워요.',
    high: '어떤 감정이든 소중해요. 함께 성장해요.',
  },
};

function getIntensityLevel(intensity: number): 'low' | 'medium' | 'high' {
  if (intensity <= 3) return 'low';
  if (intensity <= 7) return 'medium';
  return 'high';
}

export function getSupportMessage(emotionLabel: string, intensity: number): string {
  const level = getIntensityLevel(intensity);
  const emotionMessages = SUPPORT_MESSAGES[emotionLabel.toLowerCase()] || SUPPORT_MESSAGES.default;
  return emotionMessages[level] || emotionMessages.low;
}

/**
 * Calculate mascot growth score based on recent emotion entries
 *
 * Rules:
 * - For each day with at least 1 entry: +2 points
 * - Intensity adjustment: (10 - avgIntensity) bonus (encourages emotional awareness)
 *
 * Stage thresholds:
 * - score < 10: seed
 * - score 10-19: sprout
 * - score >= 20: kid
 */
export async function calculateMascotGrowth(userId: string): Promise<{ stage: MascotStage; score: number }> {
  // Get entries from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const entries = await prisma.emotionEntry.findMany({
    where: {
      userId,
      timestamp: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

  if (entries.length === 0) {
    return { stage: 'seed', score: 0 };
  }

  // Group by day
  const dayMap = new Map<string, number[]>();

  entries.forEach((entry) => {
    const dateKey = entry.timestamp.toISOString().split('T')[0];
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, []);
    }
    dayMap.get(dateKey)!.push(entry.intensity);
  });

  let totalScore = 0;

  // Calculate score for each day
  dayMap.forEach((intensities) => {
    // +2 for having any entry that day
    totalScore += 2;

    // Intensity bonus: reward lower average intensity (less distress)
    const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;
    const intensityBonus = Math.max(0, Math.floor((10 - avgIntensity) / 2));
    totalScore += intensityBonus;
  });

  // Determine stage
  let stage: MascotStage = 'seed';
  if (totalScore >= 20) {
    stage = 'kid';
  } else if (totalScore >= 10) {
    stage = 'sprout';
  }

  return { stage, score: totalScore };
}

export async function getMascotToday(userId: string): Promise<MascotResponse> {
  // Calculate current growth
  const growth = await calculateMascotGrowth(userId);

  // Update or create mascot state
  await prisma.mascotState.upsert({
    where: { userId },
    update: {
      stage: growth.stage,
      score: growth.score,
    },
    create: {
      userId,
      stage: growth.stage,
      score: growth.score,
    },
  });

  // Get latest emotion entry for contextual message
  const latestEntry = await prisma.emotionEntry.findFirst({
    where: { userId },
    orderBy: { timestamp: 'desc' },
  });

  let message = '안녕하세요! 오늘 감정을 기록해주세요 🌱';

  if (latestEntry) {
    message = getSupportMessage(latestEntry.emotionLabel, latestEntry.intensity);
  }

  // Add stage-specific message prefix
  const stageMessages: Record<MascotStage, string> = {
    seed: '🌰 씨앗 셀리: ',
    sprout: '🌱 새싹 셀리: ',
    kid: '🌿 꼬마 셀리: ',
  };

  message = stageMessages[growth.stage] + message;

  return {
    stage: growth.stage,
    score: growth.score,
    message,
  };
}
