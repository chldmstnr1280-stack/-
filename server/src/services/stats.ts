import { PrismaClient } from '@prisma/client';
import { WeeklyStats } from '../types/index.js';

const prisma = new PrismaClient();

export async function getWeeklyStats(userId: string): Promise<WeeklyStats> {
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
      timestamp: 'asc',
    },
  });

  if (entries.length === 0) {
    return {
      avgIntensity: 0,
      topEmotions: [],
      daysLogged: 0,
      dailyTrend: [],
    };
  }

  // Calculate average intensity
  const totalIntensity = entries.reduce((sum, e) => sum + e.intensity, 0);
  const avgIntensity = Math.round((totalIntensity / entries.length) * 10) / 10;

  // Calculate top emotions
  const emotionCounts = new Map<string, number>();
  entries.forEach((entry) => {
    const count = emotionCounts.get(entry.emotionLabel) || 0;
    emotionCounts.set(entry.emotionLabel, count + 1);
  });

  const topEmotions = Array.from(emotionCounts.entries())
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Count unique days logged
  const uniqueDays = new Set(
    entries.map((e) => e.timestamp.toISOString().split('T')[0])
  );
  const daysLogged = uniqueDays.size;

  // Calculate daily trend
  const dailyMap = new Map<string, number[]>();
  entries.forEach((entry) => {
    const dateKey = entry.timestamp.toISOString().split('T')[0];
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, []);
    }
    dailyMap.get(dateKey)!.push(entry.intensity);
  });

  const dailyTrend = Array.from(dailyMap.entries())
    .map(([date, intensities]) => ({
      date,
      avgIntensity: Math.round((intensities.reduce((a, b) => a + b, 0) / intensities.length) * 10) / 10,
      count: intensities.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    avgIntensity,
    topEmotions,
    daysLogged,
    dailyTrend,
  };
}
