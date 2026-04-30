import request from 'supertest';
import app from '../app';

/**
 * Create authenticated request helper
 */
export const createAuthenticatedRequest = async () => {
  // Register a test user
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
    password: 'Test@1234',
  };

  await request(app).post('/api/auth/register').send(testUser);

  // Login
  const loginRes = await request(app).post('/api/auth/login').send({
    identifier: testUser.email,
    password: testUser.password,
  });

  return {
    token: loginRes.body.data?.accessToken || '',
    user: loginRes.body.data?.user,
    testUser,
  };
};

/**
 * Create admin authenticated request helper
 */
export const createAdminRequest = async () => {
  const adminUser = {
    name: 'Admin User',
    email: 'admin@test.com',
    phone: '01700000001',
    password: 'Admin@1234',
    role: 'ADMIN',
  };

  // Directly create admin in DB (skip registration)
  const { User } = await import('../app/modules/User/user.model');
  const bcrypt = await import('bcryptjs');
  
  const hashedPassword = await bcrypt.hash(adminUser.password, 10);
  await User.create({
    ...adminUser,
    password: hashedPassword,
    status: 'ACTIVE',
    emailVerified: true,
  });

  // Login
  const loginRes = await request(app).post('/api/auth/login').send({
    identifier: adminUser.email,
    password: adminUser.password,
  });

  return {
    token: loginRes.body.data?.accessToken || '',
    user: loginRes.body.data?.user,
  };
};

/**
 * Sample test data
 */
export const testData = {
  product: {
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    price: 1000,
    discountPrice: 800,
    totalStock: 100,
    stockStatus: 'IN_STOCK',
    category: null, // Set in test
    status: 'ACTIVE',
  },
  
  category: {
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test category description',
  },
  
  brand: {
    name: 'Test Brand',
    slug: 'test-brand',
  },
};
