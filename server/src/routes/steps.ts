import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import {
  logSteps,
  getStepHistory,
  getTodaySteps,
  getWeeklyStepStats,
} from '../services/steps.js';

const router = Router();

/**
 * POST /steps
 * Log step count for a specific date
 */
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { stepCount, date } = req.body;

    if (stepCount === undefined || stepCount < 0) {
      return res.status(400).json({ error: 'Valid stepCount is required' });
    }

    const logDate = date ? new Date(date) : new Date();

    const stepLog = await logSteps(req.user!.userId, stepCount, logDate);

    res.json(stepLog);
  } catch (error) {
    console.error('Log steps error:', error);
    res.status(500).json({ error: 'Failed to log steps' });
  }
});

/**
 * GET /steps
 * Get step history for date range
 */
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    const fromDate = from ? new Date(from as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to as string) : new Date();

    const steps = await getStepHistory(req.user!.userId, fromDate, toDate);

    res.json(steps);
  } catch (error) {
    console.error('Get steps error:', error);
    res.status(500).json({ error: 'Failed to fetch step history' });
  }
});

/**
 * GET /steps/today
 * Get today's step count
 */
router.get('/today', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const stepCount = await getTodaySteps(req.user!.userId);

    res.json({ stepCount, date: new Date().toISOString().split('T')[0] });
  } catch (error) {
    console.error('Get today steps error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s steps' });
  }
});

/**
 * GET /steps/weekly
 * Get weekly step statistics
 */
router.get('/weekly', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getWeeklyStepStats(req.user!.userId);

    res.json(stats);
  } catch (error) {
    console.error('Get weekly steps error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly step stats' });
  }
});

export default router;
