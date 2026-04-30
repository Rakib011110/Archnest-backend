/**
 * MongoDB Email Index Fix Script
 * Run this once to fix the duplicate email:null issue
 * 
 * Usage: node scripts/fix-email-index.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function fixEmailIndex() {
  try {
    // Connect to MongoDB
    const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/caddcore-ecom';
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // 1. Drop the old email index
    console.log('\n Step 1: Dropping old email_1 index...');
    try {
      await usersCollection.dropIndex('email_1');
      console.log('✅ Dropped email_1 index');
    } catch (err) {
      if (err.code === 27) {
        console.log('⚠️ Index email_1 not found (already dropped or never existed)');
      } else {
        throw err;
      }
    }

    // 2. Remove null email values from existing users
    console.log('\n Step 2: Cleaning null email values...');
    const result = await usersCollection.updateMany(
      { email: null },
      { $unset: { email: '' } }
    );
    console.log(`✅ Updated ${result.modifiedCount} users (removed null email)`);

    // 3. Create new sparse unique index
    console.log('\n Step 3: Creating new sparse unique index on email...');
    await usersCollection.createIndex(
      { email: 1 },
      { unique: true, sparse: true }
    );
    console.log('✅ Created new sparse unique email index');

    console.log('\n🎉 Email index fix completed successfully!');
    console.log('Guest users without email can now be created without conflicts.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📴 Disconnected from MongoDB');
  }
}

fixEmailIndex();
