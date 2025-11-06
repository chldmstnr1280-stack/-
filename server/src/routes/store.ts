import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import {
  getStoreItems,
  getStoreItemsByType,
  purchaseItem,
  getUserInventory,
  getUserPoints,
  getPurchaseStats,
} from '../services/store.js';

const router = Router();

/**
 * GET /store
 * Get all shop items
 */
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.query;

    const items = type
      ? await getStoreItemsByType(type as string)
      : await getStoreItems();

    res.json(items);
  } catch (error) {
    console.error('Get store items error:', error);
    res.status(500).json({ error: 'Failed to fetch store items' });
  }
});

/**
 * POST /store/purchase
 * Purchase an item
 */
router.post('/purchase', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: 'itemId is required' });
    }

    const result = await purchaseItem(req.user!.userId, itemId);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      message: 'Purchase successful',
      inventory: result.inventory,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Failed to purchase item' });
  }
});

/**
 * GET /store/points
 * Get user's available points
 */
router.get('/points', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const points = await getUserPoints(req.user!.userId);

    res.json({ points });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ error: 'Failed to fetch points' });
  }
});

export default router;
