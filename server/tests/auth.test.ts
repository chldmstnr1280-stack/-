import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../src/index.js';

describe('Auth API', () => {
  it('should generate magic link', async () => {
    const response = await request(app)
      .post('/auth/magic-link')
      .send({ email: 'test@example.com' })
      .expect(200);

    expect(response.body.message).toContain('Magic link generated');
    expect(response.body.email).toBe('test@example.com');
  });

  it('should reject invalid magic link request', async () => {
    await request(app)
      .post('/auth/magic-link')
      .send({})
      .expect(400);
  });

  it('should verify valid magic link token', async () => {
    // First, get a magic link token
    const magicResponse = await request(app)
      .post('/auth/magic-link')
      .send({ email: 'test2@example.com' })
      .expect(200);

    const token = magicResponse.body.devToken;

    // Then verify it
    const response = await request(app)
      .post('/auth/callback')
      .send({ token })
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test2@example.com');
  });
});
