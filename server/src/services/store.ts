import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ShopItem {
  id: string;
  key: string;
  title: string;
  type: string;
  price: number;
}

export interface UserInventory {
  id: string;
  userId: string;
  itemId: string;
  ownedAt: Date;
  item: ShopItem;
}

export interface PurchaseResult {
  success: boolean;
  inventory?: UserInventory;
  error?: string;
}

/**
 * Get all shop items
 */
export async function getStoreItems(): Promise<ShopItem[]> {
  const items = await prisma.shopItem.findMany({
    orderBy: [{ type: 'asc' }, { price: 'asc' }],
  });

  return items;
}

/**
 * Get shop items by type
 */
export async function getStoreItemsByType(type: string): Promise<ShopItem[]> {
  const items = await prisma.shopItem.findMany({
    where: { type },
    orderBy: { price: 'asc' },
  });

  return items;
}

/**
 * Get single shop item
 */
export async function getShopItem(itemId: string): Promise<ShopItem | null> {
  const item = await prisma.shopItem.findUnique({
    where: { id: itemId },
  });

  return item;
}

/**
 * Purchase an item
 * Uses mascot growth score as currency
 */
export async function purchaseItem(userId: string, itemId: string): Promise<PurchaseResult> {
  // Check if item exists
  const item = await getShopItem(itemId);
  if (!item) {
    return { success: false, error: 'Item not found' };
  }

  // Check if user already owns this item
  const existingItem = await prisma.inventory.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  });

  if (existingItem) {
    return { success: false, error: 'Already owned' };
  }

  // Get user's current score (available points)
  const mascotState = await prisma.mascotState.findUnique({
    where: { userId },
  });

  if (!mascotState) {
    return { success: false, error: 'User not found' };
  }

  // Check if user has enough points
  if (mascotState.score < item.price) {
    return {
      success: false,
      error: `Not enough points. Need ${item.price}, have ${mascotState.score}`,
    };
  }

  // Perform purchase in transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Deduct points from mascot score
      await tx.mascotState.update({
        where: { userId },
        data: {
          score: mascotState.score - item.price,
        },
      });

      // Add item to inventory
      const inventoryItem = await tx.inventory.create({
        data: {
          userId,
          itemId,
        },
        include: {
          item: true,
        },
      });

      return inventoryItem;
    });

    return { success: true, inventory: result };
  } catch (error) {
    console.error('Purchase failed:', error);
    return { success: false, error: 'Purchase failed' };
  }
}

/**
 * Get user's inventory
 */
export async function getUserInventory(userId: string): Promise<UserInventory[]> {
  const inventory = await prisma.inventory.findMany({
    where: { userId },
    include: {
      item: true,
    },
    orderBy: {
      ownedAt: 'desc',
    },
  });

  return inventory;
}

/**
 * Check if user owns an item
 */
export async function userOwnsItem(userId: string, itemId: string): Promise<boolean> {
  const item = await prisma.inventory.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  });

  return !!item;
}

/**
 * Get user's available points (current mascot score)
 */
export async function getUserPoints(userId: string): Promise<number> {
  const mascotState = await prisma.mascotState.findUnique({
    where: { userId },
  });

  return mascotState?.score || 0;
}

/**
 * Get purchase statistics
 */
export async function getPurchaseStats(userId: string): Promise<{
  totalItems: number;
  totalSpent: number;
  itemsByType: Record<string, number>;
}> {
  const inventory = await getUserInventory(userId);

  const totalItems = inventory.length;
  const totalSpent = inventory.reduce((sum, inv) => sum + inv.item.price, 0);

  const itemsByType: Record<string, number> = {};
  inventory.forEach((inv) => {
    itemsByType[inv.item.type] = (itemsByType[inv.item.type] || 0) + 1;
  });

  return {
    totalItems,
    totalSpent,
    itemsByType,
  };
}
