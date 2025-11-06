import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

/**
 * Phase 2/3 Stub Routes
 * These return 200 OK with "Not Implemented" messages
 */

// Phase 2: Step tracking
router.post('/steps', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 2, feature: 'step-tracking' });
});

router.get('/steps', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 2, feature: 'step-tracking', data: [] });
});

// Phase 2: Cycle tracking
router.post('/cycle', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 2, feature: 'cycle-tracking' });
});

router.get('/cycle', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 2, feature: 'cycle-tracking', data: [] });
});

// Phase 2: Store
router.get('/store', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 2, feature: 'store', items: [] });
});

router.post('/store/purchase', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 2, feature: 'store-purchase' });
});

// Phase 2: Inventory
router.get('/inventory', authenticateJWT, (req, res) => {
  res.json({ message: 'Not Implemented', phase: 2, feature: 'inventory', items: [] });
});

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
