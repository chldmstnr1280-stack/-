import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateToken, generateMagicLinkToken, verifyMagicLinkToken } from '../auth/jwt.js';
import { AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /auth/magic-link
 * Request a magic link for email authentication
 * In development, the link is printed to console
 */
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate magic link token (15 min expiry)
    const magicToken = generateMagicLinkToken(email);
    const magicLink = `${process.env.MAGIC_LINK_BASE_URL || 'http://localhost:3000/auth/callback'}?token=${magicToken}`;

    // In production, send email here
    // For now, log to console
    console.log('\n🔗 Magic Link Generated:');
    console.log(`   Email: ${email}`);
    console.log(`   Link: ${magicLink}`);
    console.log(`   Token: ${magicToken}`);
    console.log('   (Valid for 15 minutes)\n');

    res.json({
      message: 'Magic link generated. Check console for link.',
      email,
      // In dev mode, return the token for testing
      ...(process.env.NODE_ENV === 'development' && { devToken: magicToken }),
    });
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ error: 'Failed to generate magic link' });
  }
});

/**
 * POST /auth/callback
 * Verify magic link token and issue JWT
 */
router.post('/callback', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify magic link token
    const { email } = verifyMagicLinkToken(token);

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });

      // Create initial mascot state
      await prisma.mascotState.create({
        data: {
          userId: user.id,
          stage: 'seed',
          score: 0,
        },
      });
    }

    // Generate long-lived JWT
    const jwt = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      token: jwt,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
