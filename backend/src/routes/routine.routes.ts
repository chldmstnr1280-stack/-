/**
 * Routine Routes
 * 루틴 완료 기록 CRUD
 */

import express, { Request, Response, Router } from 'express';
import { Routine } from '../models/Routine.model';
import { authenticate } from '../middleware/auth.middleware';
import { z } from 'zod';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation schema
const createRoutineSchema = z.object({
  routineId: z.string(),
  type: z.enum(['meditation', 'breathing', 'activity']),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  duration: z.number().min(0),
  rating: z.number().int().min(1).max(5),
});

/**
 * POST /api/routines
 * 루틴 완료 기록 생성
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createRoutineSchema.parse(req.body);
    const userId = req.user!.userId;

    const routine = await Routine.create({
      ...validatedData,
      userId,
      startedAt: new Date(validatedData.startedAt),
      completedAt: new Date(validatedData.completedAt),
    });

    res.status(201).json({
      message: 'Routine record created successfully',
      routine,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.errors,
      });
    }

    console.error('Create routine error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create routine record',
    });
  }
});

/**
 * GET /api/routines
 * 루틴 완료 기록 목록 조회
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const type = req.query.type as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;

    const query: any = { userId };
    if (type) {
      query.type = type;
    }

    const routines = await Routine.find(query)
      .sort({ completedAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Routine.countDocuments(query);

    res.status(200).json({
      routines,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + routines.length < total,
      },
    });
  } catch (error) {
    console.error('Get routines error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get routine records',
    });
  }
});

/**
 * GET /api/routines/stats
 * 루틴 통계 조회
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const totalCount = await Routine.countDocuments({ userId });

    // Average rating
    const routines = await Routine.find({ userId });
    const avgRating =
      routines.length > 0
        ? routines.reduce((sum, r) => sum + r.rating, 0) / routines.length
        : 0;

    // Count by type
    const meditationCount = await Routine.countDocuments({ userId, type: 'meditation' });
    const breathingCount = await Routine.countDocuments({ userId, type: 'breathing' });
    const activityCount = await Routine.countDocuments({ userId, type: 'activity' });

    res.status(200).json({
      stats: {
        totalCount,
        avgRating: Math.round(avgRating * 10) / 10,
        byType: {
          meditation: meditationCount,
          breathing: breathingCount,
          activity: activityCount,
        },
      },
    });
  } catch (error) {
    console.error('Get routine stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get routine statistics',
    });
  }
});

export default router;
