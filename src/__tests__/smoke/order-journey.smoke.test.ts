import mongoose from 'mongoose';
import request from 'supertest';

jest.mock('../../app/modules/notification/notification.service', () => ({
  NotificationService: {
    notifyOrderStatusChange: jest.fn().mockResolvedValue(undefined),
    create: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../app/utils/smsService', () => ({
  sendGuestPasswordSMS: jest.fn().mockResolvedValue(true),
  sendOrderConfirmationSMS: jest.fn().mockResolvedValue(true),
  sendOrderStatusSMS: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../app/utils/orderEmail', () => ({
  sendOrderConfirmationEmail: jest.fn().mockResolvedValue(true),
}));

import app from '../../app';
import { Product } from '../../app/modules/product/product.model';
import { Reseller } from '../../app/modules/reseller/reseller.model';
import { User } from '../../app/modules/User/user.model';
import { Vendor } from '../../app/modules/vendor/vendor.model';

const TEST_PASSWORD = 'Smoke@1234';

type BuyerRole = 'USER' | 'RESELLER';
type UserRole = 'ADMIN' | 'VENDOR' | BuyerRole;
type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

let sequence = 0;

const uniqueKey = () => {
  sequence += 1;
  return `${Date.now()}-${sequence}`;
};

const uniquePhone = (prefix = '017') =>
  `${prefix}${Math.floor(10000000 + Math.random() * 90000000)}`;

const createUser = async (role: UserRole) => {
  const key = uniqueKey();

  return User.create({
    name: `${role}-${key}`,
    email: `${role.toLowerCase()}-${key}@example.com`,
    phone: uniquePhone(role === 'RESELLER' ? '018' : '017'),
    password: TEST_PASSWORD,
    role,
    status: 'ACTIVE',
    emailVerified: true,
  });
};

const loginByEmail = async (email: string) => {
  const loginRes = await request(app).post('/api/auth/login').send({
    email,
    password: TEST_PASSWORD,
  });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body.success).toBe(true);
  expect(loginRes.body.data?.accessToken).toBeTruthy();

  return loginRes.body.data.accessToken as string;
};

const createVendorProductFixture = async (label: string) => {
  const vendorUser = await createUser('VENDOR');
  const key = uniqueKey();

  const vendor = await Vendor.create({
    user: vendorUser._id,
    shopName: `Smoke Shop ${label}-${key}`,
    slug: `smoke-shop-${label.toLowerCase()}-${key}`,
    contactNo: vendorUser.phone,
    address: 'Dhaka',
    districtName: 'Dhaka',
    upazilaName: 'Tejgaon',
    status: 'ACTIVE',
    canProcessOrders: true,
  });

  const product = await Product.create({
    name: { en: `Smoke Product ${label}-${key}`, bn: `Smoke Product ${label}-${key}` },
    description: { en: 'Smoke flow test product', bn: 'Smoke flow test product' },
    categoryId: new mongoose.Types.ObjectId(),
    basePrice: 120,
    baseDiscountedPrice: 100,
    thumbnail: '/uploads/products/smoke-test.png',
    totalStock: 30,
    stockStatus: 'IN_STOCK',
    status: 'ACTIVE',
    vendorPricing: [
      {
        vendorId: vendor._id,
        price: 80,
        stock: 20,
        isActive: true,
      },
    ],
  });

  return { product };
};

const approveResellerProfile = async (userId: mongoose.Types.ObjectId, label: string) => {
  const key = uniqueKey();

  const reseller = await Reseller.create({
    user: userId,
    shopName: `Reseller ${label}-${key}`,
    shopSlug: `reseller-${label.toLowerCase()}-${key}`,
    shopAddress: 'Tejgaon, Dhaka',
    districtName: 'Dhaka',
    upazilaName: 'Tejgaon',
    status: 'ACTIVE',
  });

  await User.findByIdAndUpdate(userId, {
    resellerProfile: reseller._id,
  });
};

const runOrderJourney = async (buyerRole: BuyerRole, label: string) => {
  const admin = await createUser('ADMIN');
  const buyer = await createUser(buyerRole);

  if (buyerRole === 'RESELLER') {
    await approveResellerProfile(buyer._id, label);
  }

  const { product } = await createVendorProductFixture(label);

  const adminToken = await loginByEmail(admin.email as string);
  const buyerToken = await loginByEmail(buyer.email as string);

  const addToCartRes = await request(app)
    .post('/api/cart/add')
    .set('Authorization', `Bearer ${buyerToken}`)
    .send({
      productId: product._id.toString(),
      quantity: 2,
    });

  expect(addToCartRes.status).toBe(200);
  expect(addToCartRes.body.success).toBe(true);
  expect(addToCartRes.body.data?.items?.length).toBe(1);

  const placeOrderRes = await request(app)
    .post('/api/orders/place')
    .set('Authorization', `Bearer ${buyerToken}`)
    .send({
      shippingAddress: {
        name: buyer.name,
        phone: buyer.phone,
        division: 'Dhaka',
        district: 'Dhaka',
        area: 'Tejgaon',
        address: 'Road 1, Tejgaon',
      },
      paymentMethod: 'COD',
      note: `smoke-${label}`,
    });

  expect(placeOrderRes.status).toBe(201);
  expect(placeOrderRes.body.success).toBe(true);

  const orderId = placeOrderRes.body.data?.order?.orderId as string;
  expect(orderId).toBeTruthy();

  const cartAfterOrderRes = await request(app)
    .get('/api/cart')
    .set('Authorization', `Bearer ${buyerToken}`);

  expect(cartAfterOrderRes.status).toBe(200);

  const cartAfterOrder = cartAfterOrderRes.body.data as { items?: unknown[] } | null;
  if (cartAfterOrder) {
    expect(cartAfterOrder.items?.length ?? 0).toBe(0);
  }

  const myOrdersRes = await request(app)
    .get('/api/orders/my-orders')
    .set('Authorization', `Bearer ${buyerToken}`);

  expect(myOrdersRes.status).toBe(200);
  expect(myOrdersRes.body.success).toBe(true);

  const myOrders = myOrdersRes.body.data as Array<{ orderId: string; status: string }>;
  expect(myOrders.some((order) => order.orderId === orderId)).toBe(true);

  const publicOrderRes = await request(app)
    .get(`/api/orders/public/${orderId}`)
    .query({ phone: buyer.phone });

  expect(publicOrderRes.status).toBe(200);
  expect(publicOrderRes.body.success).toBe(true);
  expect(publicOrderRes.body.data?.orderId).toBe(orderId);

  const statusFlow: OrderStatus[] = ['PROCESSING', 'SHIPPED', 'DELIVERED'];

  for (const status of statusFlow) {
    const statusUpdateRes = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status });

    expect(statusUpdateRes.status).toBe(200);
    expect(statusUpdateRes.body.success).toBe(true);
    expect(statusUpdateRes.body.data?.status).toBe(status);
  }

  const orderDetailRes = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Authorization', `Bearer ${buyerToken}`);

  expect(orderDetailRes.status).toBe(200);
  expect(orderDetailRes.body.success).toBe(true);
  expect(orderDetailRes.body.data?.orderId).toBe(orderId);
  expect(orderDetailRes.body.data?.status).toBe('DELIVERED');
  expect(orderDetailRes.body.data?.paymentStatus).toBe('PAID');
};

describe('Order journey smoke tests', () => {
  beforeAll(async () => {
    await Promise.all([User.init(), Vendor.init(), Product.init(), Reseller.init()]);
  });

  it('covers customer add-to-cart to delivered order flow', async () => {
    await runOrderJourney('USER', 'customer');
  });

  it('covers approved reseller add-to-cart to delivered order flow', async () => {
    await runOrderJourney('RESELLER', 'reseller');
  });
});