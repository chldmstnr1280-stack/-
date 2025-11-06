/**
 * Store Screen
 *
 * Browse and purchase items from the shop
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useStoreStore } from '../../src/stores/storeStore';
import { useInventoryStore } from '../../src/stores/inventoryStore';
import type { ShopItem, ItemType } from '../../src/types/phase2';

// Item emoji/icon mapping
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

export default function StoreScreen() {
  const { items, points, isLoading, error, fetchItems, fetchPoints, purchaseItem, refreshStore } =
    useStoreStore();
  const { fetchInventory } = useInventoryStore();

  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshStore();
    fetchInventory();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshStore();
    await fetchInventory();
    setRefreshing(false);
  };

  const handlePurchase = (item: ShopItem) => {
    Alert.alert(
      'Purchase Item',
      `Buy "${item.title}" for ${item.price} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: async () => {
            const success = await purchaseItem(item.id);
            if (success) {
              Alert.alert('Success!', `You bought ${item.title}!`);
              await fetchInventory(); // Refresh inventory
            } else if (error) {
              Alert.alert('Purchase Failed', error);
            }
          },
        },
      ]
    );
  };

  const filteredItems =
    filter === 'all' ? items : items.filter((item) => item.type === filter);

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
        <Text style={styles.title}>Shop</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>💰 {points}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'outfit' && styles.filterTabActive]}
          onPress={() => setFilter('outfit')}
        >
          <Text style={[styles.filterText, filter === 'outfit' && styles.filterTextActive]}>
            Outfits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'decor' && styles.filterTabActive]}
          onPress={() => setFilter('decor')}
        >
          <Text style={[styles.filterText, filter === 'decor' && styles.filterTextActive]}>
            Decor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'boost' && styles.filterTabActive]}
          onPress={() => setFilter('boost')}
        >
          <Text style={[styles.filterText, filter === 'boost' && styles.filterTextActive]}>
            Boosts
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
            <Text style={styles.loadingText}>Loading items...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshStore}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        ) : (
          <View style={styles.itemsGrid}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Text style={styles.itemIcon}>{ITEM_ICONS[item.key] || '🎁'}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemType}>{getTypeLabel(item.type)}</Text>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>💰 {item.price}</Text>
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      points < item.price && styles.buyButtonDisabled,
                    ]}
                    onPress={() => handlePurchase(item)}
                    disabled={points < item.price}
                  >
                    <Text style={styles.buyButtonText}>
                      {points < item.price ? 'Not Enough' : 'Buy'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  pointsBadge: {
    backgroundColor: '#FFB84D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#6B9F7D',
  },
  filterText: {
    fontSize: 14,
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
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  itemFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB84D',
  },
  buyButton: {
    backgroundColor: '#6B9F7D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buyButtonText: {
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
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});
