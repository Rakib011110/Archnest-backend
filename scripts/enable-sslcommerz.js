/**
 * Enable SSLCommerz in Settings
 * Run: node scripts/enable-sslcommerz.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function enableSSLCommerz() {
  try {
    const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/caddcore-ecom';
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(dbUrl);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Update settings to enable SSLCommerz
    const result = await db.collection('settings').updateOne(
      {},
      { 
        $set: { 
          'payment.sslcommerz.enabled': true,
          'payment.sslcommerz.useCustomCredentials': false
        } 
      },
      { upsert: true }
    );
    
    console.log(`✅ SSLCommerz enabled! Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount || 0}`);

    // Verify
    const settings = await db.collection('settings').findOne({});
    console.log('📋 Current SSLCommerz settings:', settings?.payment?.sslcommerz);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
  }
}

enableSSLCommerz();
