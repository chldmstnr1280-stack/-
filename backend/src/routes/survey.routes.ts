/**
 * Survey Routes
 * PHQ-9, GAD-7 설문 결과 저장 및 조회
 */

import express, { Request, Response, Router } from 'express';
import { Survey } from '../models/Survey.model';
import { authenticate } from '../middleware/auth.middleware';
import { z } from 'zod';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation schema
const createSurveySchema = z.object({
  type: z.enum(['phq9', 'gad7']),
  responses: z.array(
    z.object({
      questionId: z.string(),
      value: z.number().int().min(0).max(3),
    })
  ),
  totalScore: z.number().min(0),
  severity: z.enum(['minimal', 'mild', 'moderate', 'severe']),
});

/**
 * POST /api/surveys
 * 설문 결과 저장
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createSurveySchema.parse(req.body);
    const userId = req.user!.userId;

    // Validate response count
    const expectedCount = validatedData.type === 'phq9' ? 9 : 7;
    if (validatedData.responses.length !== expectedCount) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Expected ${expectedCount} responses for ${validatedData.type}`,
      });
    }

    const survey = await Survey.create({
      ...validatedData,
      userId,
      completedAt: new Date(),
    });

    res.status(201).json({
      message: 'Survey result saved successfully',
      survey,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.errors,
      });
    }

    console.error('Create survey error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save survey result',
    });
  }
});

/**
 * GET /api/surveys
 * 설문 결과 목록 조회
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const type = req.query.type as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;

    const query: any = { userId };
    if (type) {
      query.type = type;
    }

    const surveys = await Survey.find(query).sort({ completedAt: -1 }).limit(limit);

    res.status(200).json({ surveys });
  } catch (error) {
    console.error('Get surveys error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get survey results',
    });
  }
});

/**
 * GET /api/surveys/latest
 * 최근 설문 결과 조회 (PHQ-9, GAD-7 각 1개씩)
 */
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const latestPhq9 = await Survey.findOne({ userId, type: 'phq9' }).sort({
      completedAt: -1,
    });

    const latestGad7 = await Survey.findOne({ userId, type: 'gad7' }).sort({
      completedAt: -1,
    });

    res.status(200).json({
      phq9: latestPhq9,
      gad7: latestGad7,
    });
  } catch (error) {
    console.error('Get latest surveys error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get latest survey results',
    });
  }
});

/**
 * GET /api/surveys/trend
 * 설문 추이 데이터 (최근 N주)
 */
router.get('/trend', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const type = req.query.type as string;
    const weeks = parseInt(req.query.weeks as string) || 4;

    if (!type || (type !== 'phq9' && type !== 'gad7')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Type must be either phq9 or gad7',
      });
    }

    const surveys = await Survey.find({ userId, type })
      .sort({ completedAt: -1 })
      .limit(weeks);

    const trendData = surveys.reverse().map((s) => ({
      date: s.completedAt,
      score: s.totalScore,
      severity: s.severity,
    }));

    res.status(200).json({
      type,
      weeks,
      data: trendData,
    });
  } catch (error) {
    console.error('Get survey trend error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get survey trend',
    });
  }
});

export default router;
