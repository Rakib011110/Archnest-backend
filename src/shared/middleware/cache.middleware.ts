// ============================================================================
// CACHE MIDDLEWARE - Reusable HTTP caching
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../../config/redis';

/**
 * Cache middleware for GET requests
 * 
 * @param ttl - Time to live in seconds (default: 5 minutes)
 * @param keyGenerator - Optional custom key generator function
 * 
 * @example
 * // Basic usage
 * router.get('/products', cache(600), getProducts);
 * 
 * // Custom key generator
 * router.get('/search', cache(300, (req) => `search:${req.query.q}`), search);
 */
export const cache = (
  ttl: number = 300,
  keyGenerator?: (req: Request) => string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip cache if not ready
    if (!cacheService.isReady()) {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator
        ? keyGenerator(req)
        : `cache:${req.originalUrl || req.url}`;

      // Try to get from cache
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        console.log(`✅ Cache HIT: ${cacheKey}`);
        
        // Add cache header
        res.setHeader('X-Cache', 'HIT');
        
        return res.json(cachedData);
      }

      console.log(`❌ Cache MISS: ${cacheKey}`);
      res.setHeader('X-Cache', 'MISS');

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = (data: any) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Cache in background (don't await)
          cacheService.set(cacheKey, data, ttl).catch((err) => {
            console.error('Cache set error:', err);
          });
        }

        // Send response
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // Continue without cache on error
    }
  };
};

/**
 * Conditional cache middleware
 * Only caches if condition function returns true
 * 
 * @example
 * router.get('/user/:id', 
 *   conditionalCache(
 *     600, 
 *     (req) => req.user?.role === 'USER' // Only cache for regular users
 *   ), 
 *   getUser
 * );
 */
export const conditionalCache = (
  ttl: number,
  condition: (req: Request) => boolean,
  keyGenerator?: (req: Request) => string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (condition(req)) {
      return cache(ttl, keyGenerator)(req, res, next);
    }
    return next();
  };
};

/**
 * Cache headers middleware
 * Sets browser cache headers
 * 
 * @example
 * router.get('/static-data', setCacheHeaders(3600), getData);
 */
export const setCacheHeaders = (maxAge: number = 300) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    // Public cacheable for maxAge seconds
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString());
    next();
  };
};

/**
 * No cache headers middleware
 * Prevents caching for sensitive routes
 * 
 * @example
 * router.get('/user/profile', noCacheHeaders, getProfile);
 */
export const noCacheHeaders = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};
