/**
 * Phase 3 TypeScript Type Definitions
 *
 * Types for AI Chat, Insights, Strategies, and Mascot Customization features
 */

// ============================================================================
// AI Chat & Conversation Types
// ============================================================================

export interface AIMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokensUsed?: number;
}

export interface AIConversation {
  id: string;
  userId: string;
  createdAt: string;
  messages: AIMessage[];
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;
  tokensUsed: number;
}

// ============================================================================
// AI Insights Types
// ============================================================================

export interface AIInsight {
  id: string;
  userId: string;
  date: string;
  insight: string;
  strategies: string[];
  pattern?: string;
}

export interface GenerateInsightResponse {
  insight: string;
  strategies: string[];
  pattern?: string;
  tokensUsed: number;
}

// ============================================================================
// Strategy Types
// ============================================================================

export type StrategyCategory = 'physical' | 'mental' | 'social' | 'creative' | 'professional';

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  category: StrategyCategory;
  description: string;
  timesUsed: number;
  timesHelpful: number;
  lastUsed?: string;
}

// ============================================================================
// Mascot Customization Types
// ============================================================================

export interface OutfitCustomization {
  hat?: string;
  glasses?: string;
  scarf?: string;
  accessory?: string;
}

export interface DecorCustomization {
  pot?: string;
  fence?: string;
  lamp?: string;
  fountain?: string;
  bench?: string;
  birdhouse?: string;
}

export interface MascotCustomization {
  id: string;
  userId: string;
  outfit: OutfitCustomization;
  decor: DecorCustomization;
  updatedAt: string;
}
