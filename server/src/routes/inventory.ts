import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { getUserInventory, getPurchaseStats } from '../services/store.js';

const router = Router();

/**
 * GET /inventory
 * Get user's inventory
 */
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const inventory = await getUserInventory(req.user!.userId);

    res.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

/**
 * GET /inventory/stats
 * Get purchase statistics
 */
router.get('/stats', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getPurchaseStats(req.user!.userId);

    res.json(stats);
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory stats' });
  }
});

export default router;
