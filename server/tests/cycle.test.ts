import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '../src/index.js';

describe('Cycle Tracking API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Get auth token
    const magicResponse = await request(app)
      .post('/auth/magic-link')
      .send({ email: 'cycle-test@example.com' });

    const callbackResponse = await request(app)
      .post('/auth/callback')
      .send({ token: magicResponse.body.devToken });

    authToken = callbackResponse.body.token;
  });

  it('should log cycle phase', async () => {
    const response = await request(app)
      .post('/cycle')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        phase: 'menstrual',
        date: new Date().toISOString(),
      })
      .expect(200);

    expect(response.body.phase).toBe('menstrual');
    expect(response.body.userId).toBeDefined();
  });

  it('should get cycle history', async () => {
    // Log cycle
    await request(app)
      .post('/cycle')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ phase: 'follicular' });

    // Get history
    const response = await request(app)
      .get('/cycle')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get current phase', async () => {
    // Log phase
    await request(app)
      .post('/cycle')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ phase: 'ovulation' });

    // Get current phase
    const response = await request(app)
      .get('/cycle/current')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.phase).toBe('ovulation');
  });

  it('should get cycle insights', async () => {
    const response = await request(app)
      .get('/cycle/insights')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.currentPhase).toBeDefined();
    expect(Array.isArray(response.body.emotionCorrelations)).toBe(true);
    expect(response.body.cycleLength).toBeDefined();
  });

  it('should reject invalid phase', async () => {
    await request(app)
      .post('/cycle')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ phase: 'invalid_phase' })
      .expect(400);
  });

  it('should allow null phase', async () => {
    const response = await request(app)
      .post('/cycle')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ phase: null })
      .expect(200);

    expect(response.body.phase).toBeNull();
  });

  it('should require authentication', async () => {
    await request(app)
      .post('/cycle')
      .send({ phase: 'menstrual' })
      .expect(401);
  });
});
