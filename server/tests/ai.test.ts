import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '../src/index.js';

describe('AI API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Get auth token
    const magicResponse = await request(app)
      .post('/auth/magic-link')
      .send({ email: 'ai-test@example.com' });

    const callbackResponse = await request(app)
      .post('/auth/callback')
      .send({ token: magicResponse.body.devToken });

    authToken = callbackResponse.body.token;

    // Create some emotion data for context
    await request(app)
      .post('/emotion')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emotionLabel: 'happy',
        intensity: 8,
        notes: 'Feeling great today!',
      });
  });

  describe('POST /ai/chat', () => {
    it('should require authentication', async () => {
      await request(app)
        .post('/ai/chat')
        .send({ message: 'Hello' })
        .expect(401);
    });

    it('should reject empty message', async () => {
      await request(app)
        .post('/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: '' })
        .expect(400);
    });

    it('should reject message over 500 characters', async () => {
      const longMessage = 'a'.repeat(501);
      await request(app)
        .post('/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: longMessage })
        .expect(400);
    });

    it('should return error if OpenAI key not configured', async () => {
      // Skip if OPENAI_API_KEY is set
      if (process.env.OPENAI_API_KEY) {
        return;
      }

      const response = await request(app)
        .post('/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Hello, how are you?' })
        .expect(503);

      expect(response.body.error).toContain('not configured');
    });

    // This test will only run if OPENAI_API_KEY is set
    it('should generate AI response when key is configured', async () => {
      if (!process.env.OPENAI_API_KEY) {
        console.log('Skipping AI chat test - OPENAI_API_KEY not set');
        return;
      }

      const response = await request(app)
        .post('/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Hello' })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('tokensUsed');
      expect(typeof response.body.message).toBe('string');
      expect(response.body.message.length).toBeGreaterThan(0);
    });
  });

  describe('POST /ai/insights', () => {
    it('should require authentication', async () => {
      await request(app)
        .post('/ai/insights')
        .expect(401);
    });

    it('should return error if OpenAI key not configured', async () => {
      if (process.env.OPENAI_API_KEY) {
        return;
      }

      const response = await request(app)
        .post('/ai/insights')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(503);

      expect(response.body.error).toContain('not configured');
    });

    it('should generate daily insight when key is configured', async () => {
      if (!process.env.OPENAI_API_KEY) {
        console.log('Skipping AI insights test - OPENAI_API_KEY not set');
        return;
      }

      const response = await request(app)
        .post('/ai/insights')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('insight');
      expect(response.body).toHaveProperty('strategies');
      expect(response.body).toHaveProperty('tokensUsed');
      expect(Array.isArray(response.body.strategies)).toBe(true);
    });

    it('should not regenerate insight on same day', async () => {
      if (!process.env.OPENAI_API_KEY) {
        console.log('Skipping insight regeneration test - OPENAI_API_KEY not set');
        return;
      }

      // First request
      await request(app)
        .post('/ai/insights')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Second request same day should return existing
      const response = await request(app)
        .post('/ai/insights')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('insight');
    });
  });

  describe('GET /ai/insights', () => {
    it('should require authentication', async () => {
      await request(app)
        .get('/ai/insights')
        .expect(401);
    });

    it('should return today insight if available', async () => {
      const response = await request(app)
        .get('/ai/insights')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // May be null if no insight generated yet
      expect(response.body).toBeDefined();
    });
  });

  describe('GET /ai/history', () => {
    it('should require authentication', async () => {
      await request(app)
        .get('/ai/history')
        .expect(401);
    });

    it('should return conversation history', async () => {
      const response = await request(app)
        .get('/ai/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/ai/history?limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });
});
