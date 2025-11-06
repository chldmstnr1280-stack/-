/**
 * Store State Management (Zustand)
 *
 * Manages shop items, user points, and purchase operations
 */

import { create } from 'zustand';
import { storeApi } from '../api/store';
import type { ShopItem, ItemType } from '../types/phase2';

interface StoreState {
  items: ShopItem[];
  points: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchItems: (type?: ItemType) => Promise<void>;
  fetchPoints: () => Promise<void>;
  purchaseItem: (itemId: string) => Promise<boolean>;
  refreshStore: () => Promise<void>;
  reset: () => void;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  items: [],
  points: 0,
  isLoading: false,
  error: null,

  fetchItems: async (type?: ItemType) => {
    set({ isLoading: true, error: null });
    try {
      const items = await storeApi.getItems(type);
      set({ items, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch items',
        isLoading: false,
      });
    }
  },

  fetchPoints: async () => {
    try {
      const points = await storeApi.getPoints();
      set({ points });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch points',
      });
    }
  },

  purchaseItem: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      await storeApi.purchaseItem(itemId);

      // Refresh points after successful purchase
      await get().fetchPoints();

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to purchase item';

      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  refreshStore: async () => {
    await Promise.all([get().fetchItems(), get().fetchPoints()]);
  },

  reset: () =>
    set({
      items: [],
      points: 0,
      isLoading: false,
      error: null,
    }),
}));
