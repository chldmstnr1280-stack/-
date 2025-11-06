/**
 * AI API Client
 *
 * Handles API calls for AI chat, insights, and conversation history
 */

import { apiClient } from './client';
import type {
  AIConversation,
  AIInsight,
  ChatRequest,
  ChatResponse,
  GenerateInsightResponse,
} from '../types/phase3';

export const aiApi = {
  /**
   * Send message to AI assistant
   * Returns AI response with token usage
   */
  async chat(message: string): Promise<ChatResponse> {
    const { data } = await apiClient.post<ChatResponse>('/ai/chat', {
      message,
    } as ChatRequest);
    return data;
  },

  /**
   * Generate daily personalized insight
   * Returns insight with strategies and pattern
   */
  async generateInsight(): Promise<GenerateInsightResponse> {
    const { data } = await apiClient.post<GenerateInsightResponse>('/ai/insights');
    return data;
  },

  /**
   * Get today's insight if available
   * Returns null if no insight generated yet
   */
  async getTodayInsight(): Promise<AIInsight | null> {
    const { data } = await apiClient.get<AIInsight | null>('/ai/insights');
    return data;
  },

  /**
   * Get conversation history
   * Limit parameter controls how many conversations to return (default: 10)
   */
  async getHistory(limit: number = 10): Promise<AIConversation[]> {
    const { data } = await apiClient.get<AIConversation[]>('/ai/history', {
      params: { limit },
    });
    return data;
  },
};
