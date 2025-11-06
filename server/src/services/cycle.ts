import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface CycleLog {
  id: string;
  userId: string;
  date: Date;
  phase: string | null;
}

export interface CycleInsights {
  currentPhase: string | null;
  emotionCorrelations: Array<{
    phase: string;
    commonEmotions: string[];
    avgIntensity: number;
  }>;
  cycleLength: number | null; // Average cycle length in days
  lastLogDate: Date | null;
}

/**
 * Log cycle phase for a specific date
 */
export async function logCycle(
  userId: string,
  phase: CyclePhase | null,
  date: Date = new Date()
): Promise<CycleLog> {
  // Normalize date to start of day
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  // Upsert: update if exists for this date, create if not
  const cycleLog = await prisma.cycleLog.upsert({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    update: {
      phase,
    },
    create: {
      userId,
      date: normalizedDate,
      phase,
    },
  });

  return cycleLog;
}

/**
 * Get cycle history for date range
 */
export async function getCycleHistory(
  userId: string,
  from: Date,
  to: Date
): Promise<CycleLog[]> {
  const cycles = await prisma.cycleLog.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return cycles;
}

/**
 * Get current cycle phase (most recent log)
 */
export async function getCurrentPhase(userId: string): Promise<string | null> {
  const latestLog = await prisma.cycleLog.findFirst({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return latestLog?.phase || null;
}

/**
 * Calculate cycle bonus for mascot growth
 * Rule: +1 point if logged cycle today
 */
export async function calculateCycleBonus(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayLog = await prisma.cycleLog.findFirst({
    where: {
      userId,
      date: today,
    },
  });

  const BONUS_POINTS = 1;
  return todayLog ? BONUS_POINTS : 0;
}

/**
 * Get insights: correlate cycle phases with emotions
 */
export async function getCycleInsights(userId: string): Promise<CycleInsights> {
  // Get last 90 days of data for better insights
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const cycleLogs = await getCycleHistory(userId, ninetyDaysAgo, new Date());
  const emotions = await prisma.emotionEntry.findMany({
    where: {
      userId,
      timestamp: {
        gte: ninetyDaysAgo,
      },
    },
  });

  // Get current phase
  const currentPhase = await getCurrentPhase(userId);

  // Calculate correlations: which emotions are common in each phase
  const phaseEmotionMap = new Map<string, { emotions: string[]; intensities: number[] }>();

  cycleLogs.forEach((cycle) => {
    if (!cycle.phase) return;

    const cycleDate = cycle.date.toISOString().split('T')[0];

    // Find emotions on the same day
    const sameDayEmotions = emotions.filter(
      (e) => e.timestamp.toISOString().split('T')[0] === cycleDate
    );

    if (!phaseEmotionMap.has(cycle.phase)) {
      phaseEmotionMap.set(cycle.phase, { emotions: [], intensities: [] });
    }

    const phaseData = phaseEmotionMap.get(cycle.phase)!;
    sameDayEmotions.forEach((e) => {
      phaseData.emotions.push(e.emotionLabel);
      phaseData.intensities.push(e.intensity);
    });
  });

  // Build correlation results
  const emotionCorrelations = Array.from(phaseEmotionMap.entries()).map(([phase, data]) => {
    // Count emotion frequencies
    const emotionCounts = new Map<string, number>();
    data.emotions.forEach((emotion) => {
      emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
    });

    // Get top 3 most common emotions
    const commonEmotions = Array.from(emotionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion]) => emotion);

    // Calculate average intensity for this phase
    const avgIntensity =
      data.intensities.length > 0
        ? Math.round((data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length) * 10) / 10
        : 0;

    return {
      phase,
      commonEmotions,
      avgIntensity,
    };
  });

  // Calculate average cycle length (menstrual to menstrual)
  let cycleLength: number | null = null;
  const menstrualLogs = cycleLogs.filter((log) => log.phase === 'menstrual');

  if (menstrualLogs.length >= 2) {
    const cycleLengths: number[] = [];
    for (let i = 0; i < menstrualLogs.length - 1; i++) {
      const days = Math.floor(
        (menstrualLogs[i].date.getTime() - menstrualLogs[i + 1].date.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days > 0 && days < 60) {
        // Reasonable cycle length
        cycleLengths.push(days);
      }
    }

    if (cycleLengths.length > 0) {
      cycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    }
  }

  // Get last log date
  const lastLogDate = cycleLogs.length > 0 ? cycleLogs[0].date : null;

  return {
    currentPhase,
    emotionCorrelations,
    cycleLength,
    lastLogDate,
  };
}
