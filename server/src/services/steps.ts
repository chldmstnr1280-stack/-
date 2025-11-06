import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface StepLog {
  id: string;
  userId: string;
  date: Date;
  stepCount: number;
}

/**
 * Log daily step count
 */
export async function logSteps(
  userId: string,
  stepCount: number,
  date: Date = new Date()
): Promise<StepLog> {
  // Normalize date to start of day
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  // Upsert: update if exists for this date, create if not
  const stepLog = await prisma.stepLog.upsert({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    update: {
      stepCount,
    },
    create: {
      userId,
      date: normalizedDate,
      stepCount,
    },
  });

  return stepLog;
}

/**
 * Get step history for date range
 */
export async function getStepHistory(
  userId: string,
  from: Date,
  to: Date
): Promise<StepLog[]> {
  const steps = await prisma.stepLog.findMany({
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

  return steps;
}

/**
 * Get today's step count
 */
export async function getTodaySteps(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stepLog = await prisma.stepLog.findFirst({
    where: {
      userId,
      date: today,
    },
  });

  return stepLog?.stepCount || 0;
}

/**
 * Calculate step bonus for mascot growth
 * Rule: +3 points if reached 8000 steps today
 */
export async function calculateStepBonus(userId: string): Promise<number> {
  const todaySteps = await getTodaySteps(userId);
  const STEP_GOAL = 8000;
  const BONUS_POINTS = 3;

  return todaySteps >= STEP_GOAL ? BONUS_POINTS : 0;
}

/**
 * Get weekly step stats
 */
export async function getWeeklyStepStats(userId: string): Promise<{
  totalSteps: number;
  avgSteps: number;
  daysActive: number;
  dailySteps: Array<{ date: string; steps: number }>;
}> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const steps = await getStepHistory(userId, sevenDaysAgo, new Date());

  const totalSteps = steps.reduce((sum, log) => sum + log.stepCount, 0);
  const avgSteps = steps.length > 0 ? Math.round(totalSteps / steps.length) : 0;
  const daysActive = steps.filter((log) => log.stepCount > 0).length;

  const dailySteps = steps.map((log) => ({
    date: log.date.toISOString().split('T')[0],
    steps: log.stepCount,
  }));

  return {
    totalSteps,
    avgSteps,
    daysActive,
    dailySteps,
  };
}
