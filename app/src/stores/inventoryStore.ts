/**
 * Inventory State Management (Zustand)
 *
 * Manages user's owned items and purchase statistics
 */

import { create } from 'zustand';
import { inventoryApi } from '../api/inventory';
import type { InventoryItem, InventoryStats } from '../types/phase2';

interface InventoryState {
  items: InventoryItem[];
  stats: InventoryStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchInventory: () => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  reset: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchInventory: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await inventoryApi.getInventory();
      set({ items, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch inventory',
        isLoading: false,
      });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await inventoryApi.getStats();
      set({ stats });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch stats',
      });
    }
  },

  refreshInventory: async () => {
    await Promise.all([get().fetchInventory(), get().fetchStats()]);
  },

  reset: () =>
    set({
      items: [],
      stats: null,
      isLoading: false,
      error: null,
    }),
}));
