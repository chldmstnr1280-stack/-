import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { getWeeklyStats } from '../services/stats.js';

const router = Router();

/**
 * GET /report/weekly
 * Get weekly emotion statistics
 */
router.get('/weekly', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getWeeklyStats(req.user!.userId);
    res.json(stats);
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly statistics' });
  }
});

export default router;
