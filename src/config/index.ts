import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT, 
  BASE_URL: process.env.BASE_URL,
  db_url: process.env.DB_URL,
  REDIS_URL: process.env.REDIS_URL,
  ENABLE_REDIS: process.env.ENABLE_REDIS === 'true', // Default false (opt-in)
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  admin_email: process.env.ADMIN_EMAIL,


 email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
  email_from: process.env.EMAIL_FROM,
  client_url: process.env.CLIENT_URL,

  // Bulk SMS Configuration
  bulk_sms_api_key: process.env.BULK_SMS_API_KEY,
  bulk_sms_sender_id: process.env.BULK_SMS_SENDER_ID,
  bulk_sms_base_url: process.env.BULK_SMS_BASE_URL,

  // Cloudinary Configuration
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,

  // SSLCommerz Configuration (Sandbox by default)
  ssl_store_id: process.env.SSLCOMMERZ_STORE_ID || 'testbox',
  ssl_store_password: process.env.SSLCOMMERZ_STORE_PASSWORD || 'qwerty',
  ssl_session_api: process.env.SSLCOMMERZ_SESSION_API || 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
  ssl_validation_api: process.env.SSLCOMMERZ_VALIDATION_API || 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
  ssl_success_url: process.env.SSL_PAYMENT_SUCCESS_URL || 'http://localhost:3000/payment/success',
  ssl_fail_url: process.env.SSL_PAYMENT_FAIL_URL || 'http://localhost:3000/payment/fail',
  ssl_cancel_url: process.env.SSL_PAYMENT_CANCEL_URL || 'http://localhost:3000/payment/cancel',
  ssl_ipn_url: process.env.SSL_PAYMENT_IPN_URL || 'http://localhost:5000/api/payments/ssl/ipn',
};