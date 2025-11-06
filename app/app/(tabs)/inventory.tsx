/**
 * Inventory Screen
 *
 * View owned items and purchase statistics
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useInventoryStore } from '../../src/stores/inventoryStore';
import type { InventoryItem, ItemType } from '../../src/types/phase2';
import { format } from 'date-fns';

// Item emoji/icon mapping (same as store)
const ITEM_ICONS: Record<string, string> = {
  item_cool_hat: '🎩',
  item_sunglasses: '🕶️',
  item_flower_crown: '👑',
  item_scarf: '🧣',
  item_bow_tie: '🎀',
  item_fancy_pot: '🏺',
  item_garden_fence: '🚧',
  item_street_lamp: '💡',
  item_water_fountain: '⛲',
  item_bench: '🪑',
  item_bird_house: '🏠',
  item_energy_boost: '⚡',
  item_calm_boost: '🧘',
  item_growth_boost: '🌟',
};

type FilterType = 'all' | ItemType;

export default function InventoryScreen() {
  const { items, stats, isLoading, error, refreshInventory } = useInventoryStore();

  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshInventory();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshInventory();
    setRefreshing(false);
  };

  const filteredItems =
    filter === 'all' ? items : items.filter((item) => item.item.type === filter);

  const getTypeLabel = (type: ItemType): string => {
    const labels: Record<ItemType, string> = {
      outfit: 'Outfits',
      decor: 'Decor',
      boost: 'Boosts',
    };
    return labels[type];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Inventory</Text>
      </View>

      {/* Statistics Card */}
      {stats && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalItems}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalSpent}</Text>
            <Text style={styles.statLabel}>Points Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.itemsByType.outfit + stats.itemsByType.decor + stats.itemsByType.boost}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({items.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'outfit' && styles.filterTabActive]}
          onPress={() => setFilter('outfit')}
        >
          <Text style={[styles.filterText, filter === 'outfit' && styles.filterTextActive]}>
            Outfits ({stats?.itemsByType.outfit || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'decor' && styles.filterTabActive]}
          onPress={() => setFilter('decor')}
        >
          <Text style={[styles.filterText, filter === 'decor' && styles.filterTextActive]}>
            Decor ({stats?.itemsByType.decor || 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'boost' && styles.filterTabActive]}
          onPress={() => setFilter('boost')}
        >
          <Text style={[styles.filterText, filter === 'boost' && styles.filterTextActive]}>
            Boosts ({stats?.itemsByType.boost || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <ScrollView
        style={styles.itemsList}
        contentContainerStyle={styles.itemsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6B9F7D" />
            <Text style={styles.loadingText}>Loading inventory...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshInventory}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Items Yet</Text>
            <Text style={styles.emptyText}>
              Visit the shop to purchase items for your garden!
            </Text>
          </View>
        ) : (
          filteredItems.map((inventoryItem) => (
            <View key={inventoryItem.id} style={styles.itemCard}>
              <Text style={styles.itemIcon}>
                {ITEM_ICONS[inventoryItem.item.key] || '🎁'}
              </Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{inventoryItem.item.title}</Text>
                <Text style={styles.itemType}>{getTypeLabel(inventoryItem.item.type)}</Text>
                <Text style={styles.itemDate}>
                  Purchased {format(new Date(inventoryItem.purchasedAt), 'MMM d, yyyy')}
                </Text>
              </View>
              <View style={styles.itemBadge}>
                <Text style={styles.itemBadgeText}>Owned</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B9F7D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#6B9F7D',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  itemsList: {
    flex: 1,
  },
  itemsContent: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 11,
    color: '#999999',
  },
  itemBadge: {
    backgroundColor: '#6B9F7D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6B9F7D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
