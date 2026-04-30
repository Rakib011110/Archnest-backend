/// <reference types="jest" />
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryReplSet;

/**
 * Setup before all tests - In-memory MongoDB
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to Test MongoDB');
});

/**
 * Clean up collections after each test
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

/**
 * Disconnect after all tests
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('🛑 Disconnected from Test MongoDB');
});
