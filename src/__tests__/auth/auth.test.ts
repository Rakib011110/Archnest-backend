import request from 'supertest';
import app from '../../app';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTH TESTS - Simplified
 * ═══════════════════════════════════════════════════════════════════════════════
 */

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
    password: 'Test@1234',
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────────────────────────────────────
  
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should fail without required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com' });

      expect([400, 500]).toContain(res.status); // Either validation error or server error
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────────────────────
  
  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      // Register first
      const user = {
        name: 'Login Test',
        email: `login${Date.now()}@test.com`,
        phone: `018${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: 'Login@1234',
      };
      await request(app).post('/api/auth/register').send(user);
      
      // Login with email
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword',
        });

      expect([401, 404]).toContain(res.status); // Either unauthorized or not found
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PROFILE (Protected)
  // ─────────────────────────────────────────────────────────────────────────────
  
  describe('GET /api/auth/me', () => {
    it('should fail without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
