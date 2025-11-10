/**
 * Selly Routes
 * 셀리 성장 상태 관리
 */

import express, { Request, Response, Router } from 'express';
import { Selly } from '../models/Selly.model';
import { authenticate } from '../middleware/auth.middleware';
import { z } from 'zod';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const updateSellySchema = z.object({
  stage: z.enum(['seed', 'sprout', 'flower', 'baby']).optional(),
  style: z.enum(['green', 'pink', 'blue']).optional(),
  experience: z.number().min(0).optional(),
});

const addExperienceSchema = z.object({
  amount: z.number().min(0),
});

/**
 * GET /api/selly
 * 셀리 상태 조회
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    let selly = await Selly.findOne({ userId });

    // If Selly doesn't exist, create one
    if (!selly) {
      selly = await Selly.create({
        userId,
        stage: 'seed',
        style: 'green',
        experience: 0,
      });
    }

    res.status(200).json({ selly });
  } catch (error) {
    console.error('Get selly error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get Selly status',
    });
  }
});

/**
 * PATCH /api/selly
 * 셀리 상태 업데이트
 */
router.patch('/', async (req: Request, res: Response) => {
  try {
    const validatedData = updateSellySchema.parse(req.body);
    const userId = req.user!.userId;

    const selly = await Selly.findOneAndUpdate(
      { userId },
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!selly) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Selly not found',
      });
    }

    res.status(200).json({
      message: 'Selly updated successfully',
      selly,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.errors,
      });
    }

    console.error('Update selly error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update Selly',
    });
  }
});

/**
 * POST /api/selly/experience
 * 경험치 추가
 */
router.post('/experience', async (req: Request, res: Response) => {
  try {
    const validatedData = addExperienceSchema.parse(req.body);
    const userId = req.user!.userId;

    const selly = await Selly.findOne({ userId });

    if (!selly) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Selly not found',
      });
    }

    // Add experience
    selly.experience += validatedData.amount;

    // Auto-evolution logic
    const milestones = {
      seed: 0,
      sprout: 100,
      flower: 300,
      baby: 500,
    };

    if (selly.experience >= milestones.baby && selly.stage !== 'baby') {
      selly.stage = 'baby';
    } else if (selly.experience >= milestones.flower && selly.stage !== 'flower' && selly.stage !== 'baby') {
      selly.stage = 'flower';
    } else if (selly.experience >= milestones.sprout && selly.stage === 'seed') {
      selly.stage = 'sprout';
    }

    await selly.save();

    res.status(200).json({
      message: 'Experience added successfully',
      selly,
      evolved: true, // Could add logic to detect actual evolution
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.errors,
      });
    }

    console.error('Add experience error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add experience',
    });
  }
});

export default router;
