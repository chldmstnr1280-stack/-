import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import {
  logCycle,
  getCycleHistory,
  getCurrentPhase,
  getCycleInsights,
  CyclePhase,
} from '../services/cycle.js';

const router = Router();

const VALID_PHASES: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

/**
 * POST /cycle
 * Log cycle phase for a specific date
 */
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { phase, date } = req.body;

    // Validate phase if provided
    if (phase && !VALID_PHASES.includes(phase)) {
      return res.status(400).json({
        error: `Invalid phase. Must be one of: ${VALID_PHASES.join(', ')}`,
      });
    }

    const logDate = date ? new Date(date) : new Date();

    const cycleLog = await logCycle(req.user!.userId, phase || null, logDate);

    res.json(cycleLog);
  } catch (error) {
    console.error('Log cycle error:', error);
    res.status(500).json({ error: 'Failed to log cycle' });
  }
});

/**
 * GET /cycle
 * Get cycle history for date range
 */
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    const fromDate = from
      ? new Date(from as string)
      : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Default: 90 days
    const toDate = to ? new Date(to as string) : new Date();

    const cycles = await getCycleHistory(req.user!.userId, fromDate, toDate);

    res.json(cycles);
  } catch (error) {
    console.error('Get cycle error:', error);
    res.status(500).json({ error: 'Failed to fetch cycle history' });
  }
});

/**
 * GET /cycle/current
 * Get current cycle phase
 */
router.get('/current', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const phase = await getCurrentPhase(req.user!.userId);

    res.json({ phase });
  } catch (error) {
    console.error('Get current phase error:', error);
    res.status(500).json({ error: 'Failed to fetch current phase' });
  }
});

/**
 * GET /cycle/insights
 * Get cycle insights (emotion correlations, avg cycle length, etc.)
 */
router.get('/insights', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const insights = await getCycleInsights(req.user!.userId);

    res.json(insights);
  } catch (error) {
    console.error('Get cycle insights error:', error);
    res.status(500).json({ error: 'Failed to fetch cycle insights' });
  }
});

export default router;
