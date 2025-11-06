import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { CreateEmotionRequest } from '../types/index.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /emotion
 * Create a new emotion entry
 */
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { emotionLabel, intensity, notes, tags }: CreateEmotionRequest = req.body;

    if (!emotionLabel || intensity === undefined) {
      return res.status(400).json({ error: 'emotionLabel and intensity are required' });
    }

    if (intensity < 0 || intensity > 10) {
      return res.status(400).json({ error: 'intensity must be between 0 and 10' });
    }

    const entry = await prisma.emotionEntry.create({
      data: {
        userId: req.user!.userId,
        emotionLabel,
        intensity,
        notes: notes || null,
        tags: JSON.stringify(tags || []),
      },
    });

    res.status(201).json({
      ...entry,
      tags: JSON.parse(entry.tags),
    });
  } catch (error) {
    console.error('Create emotion error:', error);
    res.status(500).json({ error: 'Failed to create emotion entry' });
  }
});

/**
 * GET /emotion
 * Get emotion entries with optional date range
 */
router.get('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    const where: any = {
      userId: req.user!.userId,
    };

    if (from || to) {
      where.timestamp = {};
      if (from) {
        where.timestamp.gte = new Date(from as string);
      }
      if (to) {
        where.timestamp.lte = new Date(to as string);
      }
    }

    const entries = await prisma.emotionEntry.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
    });

    const formattedEntries = entries.map((entry) => ({
      ...entry,
      tags: JSON.parse(entry.tags),
    }));

    res.json(formattedEntries);
  } catch (error) {
    console.error('Get emotions error:', error);
    res.status(500).json({ error: 'Failed to fetch emotion entries' });
  }
});

export default router;
