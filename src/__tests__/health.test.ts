import request from 'supertest';
import app from '../app';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * HEALTH CHECK TESTS
 * Basic test to verify the test setup is working
 * ═══════════════════════════════════════════════════════════════════════════════
 */

describe('Health Check', () => {
  it('should return 200 for API health', async () => {
    const res = await request(app).get('/api/settings/public');
    expect(res.status).toBe(200);
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});
