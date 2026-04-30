// ============================================================================
// RATE LIMITING MIDDLEWARE - API Protection
// ============================================================================

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getRedisClient } from '../../config/redis';

// ============================================================================
// GENERAL API RATE LIMITER
// ============================================================================

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  // Use Redis store if available, fallback to memory store
  store: getRedisClient()
    ? new RedisStore({
        // @ts-ignore - Redis client type mismatch
        client: getRedisClient(),
        prefix: 'rl:api:',
      })
    : undefined,
});

// ============================================================================
// STRICT LIMITER FOR AUTH ENDPOINTS
// ============================================================================

/**
 * Strict rate limiter for authentication
 * Limits: 5 attempts per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
    retryAfter: '15 minutes',
  },
  skipSuccessfulRequests: true, // Don't count successful logins
  skipFailedRequests: false,
  store: getRedisClient()
    ? new RedisStore({
        // @ts-ignore
        client: getRedisClient(),
        prefix: 'rl:auth:',
      })
    : undefined,
});

// ============================================================================
// CREATE ACCOUNT LIMITER
// ============================================================================

/**
 * Account creation rate limiter
 * Limits: 3 accounts per IP per hour
 * Prevents spam account creation
 */
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 accounts per IP per hour
  message: {
    success: false,
    message: 'Too many accounts created from this IP. Please try again later.',
    retryAfter: '1 hour',
  },
  skipSuccessfulRequests: false,
  skipFailedRequests: true, // Don't count failed registrations
  store: getRedisClient()
    ? new RedisStore({
        // @ts-ignore
        client: getRedisClient(),
        prefix: 'rl:signup:',
      })
    : undefined,
});

// ============================================================================
// PASSWORD RESET LIMITER
// ============================================================================

/**
 * Password reset rate limiter
 * Limits: 3 reset requests per hour per IP
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again later.',
    retryAfter: '1 hour',
  },
  store: getRedisClient()
    ? new RedisStore({
        // @ts-ignore
        client: getRedisClient(),
        prefix: 'rl:reset:',
      })
    : undefined,
});

// ============================================================================
// UPLOAD LIMITER
// ============================================================================

/**
 * File upload rate limiter
 * Limits: 20 uploads per hour per IP
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: {
    success: false,
    message: 'Too many uploads from this IP. Please try again later.',
    retryAfter: '1 hour',
  },
  store: getRedisClient()
    ? new RedisStore({
        // @ts-ignore
        client: getRedisClient(),
        prefix: 'rl:upload:',
      })
    : undefined,
});

// ============================================================================
// CUSTOM RATE LIMITER FACTORY
// ============================================================================

/**
 * Create a custom rate limiter
 * 
 * @example
 * const searchLimiter = createRateLimiter({
 *   windowMs: 60000, // 1 minute
 *   max: 30, // 30 searches per minute
 *   message: 'Too many searches'
 * });
 */
export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
  prefix?: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      message: options.message || 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: getRedisClient()
      ? new RedisStore({
          // @ts-ignore
          client: getRedisClient(),
          prefix: options.prefix || 'rl:custom:',
        })
      : undefined,
  });
};
