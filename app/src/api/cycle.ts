/**
 * Cycle API Client
 *
 * Handles API calls for menstrual cycle tracking and insights
 */

import { apiClient } from './client';
import type {
  CyclePhase,
  CycleLog,
  CycleInsights,
  CurrentPhaseResponse,
} from '../types/phase2';

export const cycleApi = {
  /**
   * Log menstrual cycle phase
   * Pass null to indicate no tracking for that day
   */
  async logCycle(phase: CyclePhase | null, date?: Date): Promise<CycleLog> {
    const { data} = await apiClient.post<CycleLog>('/cycle', {
      phase,
      date: date?.toISOString(),
    });
    return data;
  },

  /**
   * Get cycle history within date range
   * If dates not provided, returns all history
   */
  async getHistory(from?: Date, to?: Date): Promise<CycleLog[]> {
    const params: Record<string, string> = {};
    if (from) params.from = from.toISOString();
    if (to) params.to = to.toISOString();

    const { data } = await apiClient.get<CycleLog[]>('/cycle', { params });
    return data;
  },

  /**
   * Get current cycle phase
   */
  async getCurrentPhase(): Promise<CyclePhase | null> {
    const { data } = await apiClient.get<CurrentPhaseResponse>('/cycle/current');
    return data.phase;
  },

  /**
   * Get emotion correlation insights
   * Shows how emotions vary across cycle phases
   */
  async getInsights(): Promise<CycleInsights> {
    const { data } = await apiClient.get<CycleInsights>('/cycle/insights');
    return data;
  },
};
