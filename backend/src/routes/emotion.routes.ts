/**
 * Emotion Routes
 * 감정 로그 CRUD
 */

import express, { Request, Response, Router } from 'express';
import { Emotion } from '../models/Emotion.model';
import { authenticate } from '../middleware/auth.middleware';
import { z } from 'zod';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation schema
const createEmotionSchema = z.object({
  text: z.string().min(1).max(100),
  emoji: z.string(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  temperature: z.number().min(0).max(100),
  activities: z
    .object({
      steps: z.number().min(0).optional(),
      distance: z.number().min(0).optional(),
      activeMinutes: z.number().min(0).optional(),
      sleepHours: z.number().min(0).max(24).optional(),
    })
    .optional(),
});

/**
 * POST /api/emotions
 * 감정 로그 생성
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createEmotionSchema.parse(req.body);
    const userId = req.user!.userId;

    const emotion = await Emotion.create({
      ...validatedData,
      userId,
      date: new Date(),
    });

    res.status(201).json({
      message: 'Emotion log created successfully',
      emotion,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.errors,
      });
    }

    console.error('Create emotion error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create emotion log',
    });
  }
});

/**
 * GET /api/emotions
 * 감정 로그 목록 조회 (페이지네이션)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;

    const emotions = await Emotion.find({ userId })
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Emotion.countDocuments({ userId });

    res.status(200).json({
      emotions,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + emotions.length < total,
      },
    });
  } catch (error) {
    console.error('Get emotions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get emotion logs',
    });
  }
});

/**
 * GET /api/emotions/:id
 * 특정 감정 로그 조회
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const emotionId = req.params.id;

    const emotion = await Emotion.findOne({
      _id: emotionId,
      userId,
    });

    if (!emotion) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Emotion log not found',
      });
    }

    res.status(200).json({ emotion });
  } catch (error) {
    console.error('Get emotion error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get emotion log',
    });
  }
});

/**
 * DELETE /api/emotions/:id
 * 감정 로그 삭제
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const emotionId = req.params.id;

    const emotion = await Emotion.findOneAndDelete({
      _id: emotionId,
      userId,
    });

    if (!emotion) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Emotion log not found',
      });
    }

    res.status(200).json({
      message: 'Emotion log deleted successfully',
    });
  } catch (error) {
    console.error('Delete emotion error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete emotion log',
    });
  }
});

export default router;
