/**
 * Phase 2 TypeScript Type Definitions
 *
 * Types for Store, Inventory, Step Tracking, and Cycle Tracking features
 */

// ============================================================================
// Store & Inventory Types
// ============================================================================

export type ItemType = 'outfit' | 'decor' | 'boost';

export interface ShopItem {
  id: string;
  key: string;
  title: string;
  type: ItemType;
  price: number;
}

export interface InventoryItem {
  id: string;
  userId: string;
  itemId: string;
  purchasedAt: string;
  item: ShopItem;
}

export interface InventoryStats {
  totalItems: number;
  totalSpent: number;
  itemsByType: {
    outfit: number;
    decor: number;
    boost: number;
  };
}

export interface PurchaseResult {
  message: string;
  inventory: InventoryItem;
}

// ============================================================================
// Step Tracking Types
// ============================================================================

export interface StepLog {
  id: string;
  userId: string;
  date: string;
  stepCount: number;
}

export interface WeeklyStepStats {
  totalSteps: number;
  avgStepsPerDay: number;
  daysWithSteps: number;
  dailySteps: Array<{
    date: string;
    stepCount: number;
  }>;
}

// ============================================================================
// Cycle Tracking Types
// ============================================================================

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface CycleLog {
  id: string;
  userId: string;
  date: string;
  phase: CyclePhase | null;
}

export interface CycleInsights {
  currentPhase: CyclePhase | null;
  avgIntensityByPhase: Record<string, number>;
  commonEmotionsByPhase: Record<string, string[]>;
  totalCycleDays: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface StoreState {
  items: ShopItem[];
  points: number;
  isLoading: boolean;
  error: string | null;
}

export interface InventoryState {
  items: InventoryItem[];
  stats: InventoryStats | null;
  isLoading: boolean;
  error: string | null;
}

export interface StepState {
  todaySteps: number;
  weeklyStats: WeeklyStepStats | null;
  history: StepLog[];
  isLoading: boolean;
  error: string | null;
}

export interface CycleState {
  currentPhase: CyclePhase | null;
  insights: CycleInsights | null;
  history: CycleLog[];
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PointsResponse {
  points: number;
}

export interface TodayStepsResponse {
  stepCount: number;
}

export interface CurrentPhaseResponse {
  phase: CyclePhase | null;
}

// ============================================================================
// Filter Types
// ============================================================================

export type StoreFilter = 'all' | ItemType;
export type InventoryFilter = 'all' | ItemType;

// ============================================================================
// Mascot Bonus Types
// ============================================================================

export interface MascotBonuses {
  stepBonus: number;
  cycleBonus: number;
  totalBonus: number;
}
