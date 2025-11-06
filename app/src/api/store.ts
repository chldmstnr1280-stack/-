/**
 * Store API Client
 *
 * Handles API calls for browsing shop items and purchasing
 */

import { apiClient } from './client';
import type {
  ShopItem,
  PurchaseResult,
  PointsResponse,
  ItemType,
} from '../types/phase2';

export const storeApi = {
  /**
   * Fetch all shop items, optionally filtered by type
   */
  async getItems(type?: ItemType): Promise<ShopItem[]> {
    const params = type ? { type } : {};
    const { data } = await apiClient.get<ShopItem[]>('/store', { params });
    return data;
  },

  /**
   * Purchase an item from the store
   * @throws Error if insufficient points or already owned
   */
  async purchaseItem(itemId: string): Promise<PurchaseResult> {
    const { data } = await apiClient.post<PurchaseResult>('/store/purchase', {
      itemId,
    });
    return data;
  },

  /**
   * Get user's available points (mascot score)
   */
  async getPoints(): Promise<number> {
    const { data } = await apiClient.get<PointsResponse>('/store/points');
    return data.points;
  },
};
