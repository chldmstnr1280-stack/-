import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '../src/index.js';

describe('Emotion API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Get auth token
    const magicResponse = await request(app)
      .post('/auth/magic-link')
      .send({ email: 'emotion-test@example.com' });

    const callbackResponse = await request(app)
      .post('/auth/callback')
      .send({ token: magicResponse.body.devToken });

    authToken = callbackResponse.body.token;
  });

  it('should create emotion entry', async () => {
    const response = await request(app)
      .post('/emotion')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emotionLabel: 'happy',
        intensity: 8,
        notes: 'Great day!',
        tags: ['work', 'achievement'],
      })
      .expect(201);

    expect(response.body.emotionLabel).toBe('happy');
    expect(response.body.intensity).toBe(8);
    expect(response.body.tags).toEqual(['work', 'achievement']);
  });

  it('should get emotion entries', async () => {
    const response = await request(app)
      .get('/emotion')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should reject invalid intensity', async () => {
    await request(app)
      .post('/emotion')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emotionLabel: 'happy',
        intensity: 15, // Invalid
      })
      .expect(400);
  });
});
