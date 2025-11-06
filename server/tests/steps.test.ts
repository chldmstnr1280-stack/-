import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '../src/index.js';

describe('Step Tracking API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Get auth token
    const magicResponse = await request(app)
      .post('/auth/magic-link')
      .send({ email: 'steps-test@example.com' });

    const callbackResponse = await request(app)
      .post('/auth/callback')
      .send({ token: magicResponse.body.devToken });

    authToken = callbackResponse.body.token;
  });

  it('should log step count', async () => {
    const response = await request(app)
      .post('/steps')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        stepCount: 5000,
        date: new Date().toISOString(),
      })
      .expect(200);

    expect(response.body.stepCount).toBe(5000);
    expect(response.body.userId).toBeDefined();
  });

  it('should get step history', async () => {
    // Log steps for today
    await request(app)
      .post('/steps')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ stepCount: 3000 });

    // Get history
    const response = await request(app)
      .get('/steps')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get today\'s steps', async () => {
    // Log steps
    await request(app)
      .post('/steps')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ stepCount: 7000 });

    // Get today's steps
    const response = await request(app)
      .get('/steps/today')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.stepCount).toBe(7000);
    expect(response.body.date).toBeDefined();
  });

  it('should get weekly step stats', async () => {
    const response = await request(app)
      .get('/steps/weekly')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.totalSteps).toBeDefined();
    expect(response.body.avgSteps).toBeDefined();
    expect(response.body.daysActive).toBeDefined();
    expect(Array.isArray(response.body.dailySteps)).toBe(true);
  });

  it('should reject invalid step count', async () => {
    await request(app)
      .post('/steps')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ stepCount: -100 })
      .expect(400);
  });

  it('should require authentication', async () => {
    await request(app)
      .post('/steps')
      .send({ stepCount: 1000 })
      .expect(401);
  });
});
