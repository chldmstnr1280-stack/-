/**
 * AI Routes
 *
 * Endpoints for AI-powered emotional insights and chat
 */

import express from 'express';
import * as llmService from '../services/llm.js';

const router = express.Router();

/**
 * POST /ai/chat
 * Send a message to AI and get a response
 */
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = (req as any).user.id;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 characters)' });
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: 'AI service not configured',
        message: 'OpenAI API key not set. AI features are currently unavailable.',
      });
    }

    // Generate AI response
    const { response, tokensUsed } = await llmService.generateAIResponse(userId, message);

    // Save conversation
    await llmService.saveConversation(userId, message, response, tokensUsed);

    res.json({
      message: response,
      tokensUsed,
    });
  } catch (error: any) {
    console.error('AI chat error:', error);

    // Handle OpenAI-specific errors
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    if (error.status === 401) {
      return res.status(503).json({ error: 'AI service authentication failed' });
    }

    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

/**
 * POST /ai/insights
 * Generate personalized daily insight
 */
router.post('/insights', async (req, res) => {
  try {
    const userId = (req as any).user.id;

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: 'AI service not configured',
      });
    }

    // Check if insight already exists for today
    const existingInsight = await llmService.getTodayInsight(userId);
    if (existingInsight) {
      return res.json(existingInsight);
    }

    // Generate new insight
    const { insight, strategies, pattern, tokensUsed } = await llmService.generateDailyInsight(userId);

    // Save to database
    await llmService.saveDailyInsight(userId, insight, strategies, pattern);

    res.json({
      insight,
      strategies,
      pattern,
      tokensUsed,
    });
  } catch (error: any) {
    console.error('AI insight error:', error);

    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    res.status(500).json({ error: 'Failed to generate insight' });
  }
});

/**
 * GET /ai/insights
 * Get today's insight (if exists)
 */
router.get('/insights', async (req, res) => {
  try {
    const userId = (req as any).user.id;

    const insight = await llmService.getTodayInsight(userId);

    if (!insight) {
      return res.status(404).json({ error: 'No insight for today yet' });
    }

    res.json(insight);
  } catch (error) {
    console.error('Get insight error:', error);
    res.status(500).json({ error: 'Failed to fetch insight' });
  }
});

/**
 * GET /ai/history
 * Get conversation history
 */
router.get('/history', async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const conversations = await llmService.getConversationHistory(userId, limit);

    res.json({ conversations });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
