import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { getMascotToday } from '../services/mascot.js';

const router = Router();

/**
 * GET /mascot/today
 * Get current mascot state with contextual message
 */
router.get('/today', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const mascotResponse = await getMascotToday(req.user!.userId);
    res.json(mascotResponse);
  } catch (error) {
    console.error('Get mascot error:', error);
    res.status(500).json({ error: 'Failed to fetch mascot state' });
  }
});

export default router;
