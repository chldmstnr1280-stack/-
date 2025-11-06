import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '../src/index.js';

describe('Mascot API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Get auth token
    const magicResponse = await request(app)
      .post('/auth/magic-link')
      .send({ email: 'mascot-test@example.com' });

    const callbackResponse = await request(app)
      .post('/auth/callback')
      .send({ token: magicResponse.body.devToken });

    authToken = callbackResponse.body.token;

    // Create some emotion entries to affect mascot growth
    await request(app)
      .post('/emotion')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ emotionLabel: 'happy', intensity: 5 });

    await request(app)
      .post('/emotion')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ emotionLabel: 'calm', intensity: 3 });
  });

  it('should get mascot state', async () => {
    const response = await request(app)
      .get('/mascot/today')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.stage).toBeDefined();
    expect(response.body.score).toBeDefined();
    expect(response.body.message).toBeDefined();
    expect(['seed', 'sprout', 'kid']).toContain(response.body.stage);
  });

  it('should get weekly report', async () => {
    const response = await request(app)
      .get('/report/weekly')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.avgIntensity).toBeDefined();
    expect(response.body.topEmotions).toBeDefined();
    expect(response.body.daysLogged).toBeDefined();
    expect(response.body.dailyTrend).toBeDefined();
  });
});
