/**
 * AI State Management (Zustand)
 *
 * Manages AI chat, insights, and conversation history
 */

import { create } from 'zustand';
import { aiApi } from '../api/ai';
import type { AIConversation, AIInsight, AIMessage } from '../types/phase3';

interface AIState {
  // Chat state
  currentConversation: AIMessage[];
  isChatLoading: boolean;
  chatError: string | null;

  // Insights state
  todayInsight: AIInsight | null;
  isInsightLoading: boolean;
  insightError: string | null;

  // History state
  conversationHistory: AIConversation[];
  isHistoryLoading: boolean;
  historyError: string | null;

  // Actions
  sendMessage: (message: string) => Promise<boolean>;
  generateInsight: () => Promise<boolean>;
  fetchTodayInsight: () => Promise<void>;
  fetchHistory: (limit?: number) => Promise<void>;
  clearCurrentConversation: () => void;
  refreshAI: () => Promise<void>;
  reset: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  // Initial state
  currentConversation: [],
  isChatLoading: false,
  chatError: null,

  todayInsight: null,
  isInsightLoading: false,
  insightError: null,

  conversationHistory: [],
  isHistoryLoading: false,
  historyError: null,

  sendMessage: async (message: string) => {
    set({ isChatLoading: true, chatError: null });
    try {
      // Add user message to conversation
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        conversationId: 'current',
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        currentConversation: [...state.currentConversation, userMessage],
      }));

      // Get AI response
      const response = await aiApi.chat(message);

      // Add AI response to conversation
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        conversationId: 'current',
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        tokensUsed: response.tokensUsed,
      };

      set((state) => ({
        currentConversation: [...state.currentConversation, aiMessage],
        isChatLoading: false,
      }));

      return true;
    } catch (error: any) {
      set({
        chatError:
          error.response?.data?.error || error.message || 'Failed to send message',
        isChatLoading: false,
      });
      return false;
    }
  },

  generateInsight: async () => {
    set({ isInsightLoading: true, insightError: null });
    try {
      const response = await aiApi.generateInsight();

      // Create insight object
      const insight: AIInsight = {
        id: Date.now().toString(),
        userId: 'current',
        date: new Date().toISOString(),
        insight: response.insight,
        strategies: response.strategies,
        pattern: response.pattern,
      };

      set({ todayInsight: insight, isInsightLoading: false });
      return true;
    } catch (error: any) {
      set({
        insightError:
          error.response?.data?.error || error.message || 'Failed to generate insight',
        isInsightLoading: false,
      });
      return false;
    }
  },

  fetchTodayInsight: async () => {
    set({ isInsightLoading: true, insightError: null });
    try {
      const insight = await aiApi.getTodayInsight();
      set({ todayInsight: insight, isInsightLoading: false });
    } catch (error: any) {
      set({
        insightError:
          error.response?.data?.error || error.message || 'Failed to fetch insight',
        isInsightLoading: false,
      });
    }
  },

  fetchHistory: async (limit: number = 10) => {
    set({ isHistoryLoading: true, historyError: null });
    try {
      const history = await aiApi.getHistory(limit);
      set({ conversationHistory: history, isHistoryLoading: false });
    } catch (error: any) {
      set({
        historyError:
          error.response?.data?.error || error.message || 'Failed to fetch history',
        isHistoryLoading: false,
      });
    }
  },

  clearCurrentConversation: () => {
    set({ currentConversation: [] });
  },

  refreshAI: async () => {
    await Promise.all([get().fetchTodayInsight(), get().fetchHistory()]);
  },

  reset: () =>
    set({
      currentConversation: [],
      isChatLoading: false,
      chatError: null,
      todayInsight: null,
      isInsightLoading: false,
      insightError: null,
      conversationHistory: [],
      isHistoryLoading: false,
      historyError: null,
    }),
}));
