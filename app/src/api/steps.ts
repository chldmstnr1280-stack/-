/**
 * Steps API Client
 *
 * Handles API calls for step tracking and statistics
 */

import { apiClient } from './client';
import type {
  StepLog,
  WeeklyStepStats,
  TodayStepsResponse,
} from '../types/phase2';

export const stepsApi = {
  /**
   * Log daily step count
   * If date is not provided, uses current date/time
   */
  async logSteps(stepCount: number, date?: Date): Promise<StepLog> {
    const { data } = await apiClient.post<StepLog>('/steps', {
      stepCount,
      date: date?.toISOString(),
    });
    return data;
  },

  /**
   * Get step history within date range
   * If dates not provided, returns all history
   */
  async getHistory(from?: Date, to?: Date): Promise<StepLog[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from.toISOString();
    if (to) params.to = to.toISOString();

    const { data } = await apiClient.get<StepLog[]>('/steps', { params });
    return data;
  },

  /**
   * Get today's step count
   */
  async getTodaySteps(): Promise<number> {
    const { data } = await apiClient.get<TodayStepsResponse>('/steps/today');
    return data.stepCount;
  },

  /**
   * Get weekly step statistics
   * Includes total, average, and daily breakdown
   */
  async getWeeklyStats(): Promise<WeeklyStepStats> {
    const { data } = await apiClient.get<WeeklyStepStats>('/steps/weekly');
    return data;
  },
};
