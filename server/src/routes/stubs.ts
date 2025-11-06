import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

/**
 * Phase 3 Stub Routes
 * These return 200 OK with "Not Implemented" messages
 */

// Phase 3: AI/LLM integration
router.post('/ai/message', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 3, feature: 'llm-integration' });
});

// Phase 3: Outfits & Decor
router.get('/outfits', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 3, feature: 'outfits', items: [] });
});

router.get('/decor', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 3, feature: 'decor', items: [] });
});

export default router;
