/**
 * Inventory API Client
 *
 * Handles API calls for viewing user's owned items and purchase statistics
 */

import { apiClient } from './client';
import type { InventoryItem, InventoryStats } from '../types/phase2';

export const inventoryApi = {
  /**
   * Get user's inventory (all owned items)
   */
  async getInventory(): Promise<InventoryItem[]> {
    const { data } = await apiClient.get<InventoryItem[]>('/inventory');
    return data;
  },

  /**
   * Get purchase statistics
   * Includes total items, total spent, and breakdown by type
   */
  async getStats(): Promise<InventoryStats> {
    const { data } = await apiClient.get<InventoryStats>('/inventory/stats');
    return data;
  },
};
