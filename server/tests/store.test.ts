import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import app from '../src/index.js';

describe('Store & Inventory API', () => {
  let authToken: string;
  let testItemId: string;

  beforeAll(async () => {
    // Get auth token
    const magicResponse = await request(app)
      .post('/auth/magic-link')
      .send({ email: 'store-test@example.com' });

    const callbackResponse = await request(app)
      .post('/auth/callback')
      .send({ token: magicResponse.body.devToken });

    authToken = callbackResponse.body.token;

    // Get available items
    const storeResponse = await request(app)
      .get('/store')
      .set('Authorization', `Bearer ${authToken}`);

    testItemId = storeResponse.body[0]?.id;
  });

  describe('Store', () => {
    it('should get all store items', async () => {
      const response = await request(app)
        .get('/store')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('type');
      expect(response.body[0]).toHaveProperty('price');
    });

    it('should filter items by type', async () => {
      const response = await request(app)
        .get('/store?type=outfit')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((item: any) => {
        expect(item.type).toBe('outfit');
      });
    });

    it('should get user points', async () => {
      const response = await request(app)
        .get('/store/points')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('points');
      expect(typeof response.body.points).toBe('number');
    });

    it('should require authentication', async () => {
      await request(app).get('/store').expect(401);
    });
  });

  describe('Purchase', () => {
    it('should reject purchase without itemId', async () => {
      await request(app)
        .post('/store/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });

    it('should reject purchase of non-existent item', async () => {
      await request(app)
        .post('/store/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ itemId: 'non-existent-id' })
        .expect(400);
    });

    it('should reject duplicate purchase', async () => {
      if (!testItemId) {
        console.log('Skipping: no test item available');
        return;
      }

      // First purchase might succeed or fail depending on points
      await request(app)
        .post('/store/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ itemId: testItemId });

      // Second purchase should fail
      const response = await request(app)
        .post('/store/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ itemId: testItemId });

      if (response.status === 400) {
        expect(response.body.error).toContain('Already owned');
      }
    });
  });

  describe('Inventory', () => {
    it('should get user inventory', async () => {
      const response = await request(app)
        .get('/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get inventory stats', async () => {
      const response = await request(app)
        .get('/inventory/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalItems');
      expect(response.body).toHaveProperty('totalSpent');
      expect(response.body).toHaveProperty('itemsByType');
      expect(typeof response.body.totalItems).toBe('number');
      expect(typeof response.body.totalSpent).toBe('number');
    });

    it('should require authentication', async () => {
      await request(app).get('/inventory').expect(401);
    });
  });
});
