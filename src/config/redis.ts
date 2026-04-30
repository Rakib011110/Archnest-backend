// ============================================================================
// REDIS CONFIGURATION & CACHE SERVICE
// ============================================================================

import { createClient, RedisClientType } from 'redis';
import config from './index';

// Redis client instance
let redisClient: RedisClientType | null = null;

/**
 * Initialize Redis connection
 */
export const connectRedis = async (): Promise<void> => {
  if (!config.ENABLE_REDIS) {
    console.log('🚫 Redis disabled by config');
    return;
  }

  try {
    redisClient = createClient({
      url: config.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('❌ Redis: Too many retries, giving up');
            return new Error('Redis connection failed');
          }
          return retries * 100; // Exponential backoff
        },
      },
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('🔄 Redis connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis connected successfully');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    // Don't crash the app if Redis is not available
    // Application will work without cache
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

// ============================================================================
// CACHE SERVICE - Reusable caching utilities
// ============================================================================

export class CacheService {
  private client: RedisClientType | null;
  private isAvailable: boolean = false;

  constructor() {
    this.client = null;
  }

  /**
   * Initialize cache service
   */
  async init(): Promise<void> {
    this.client = getRedisClient();
    this.isAvailable = this.client !== null && this.client.isReady;
  }

  /**
   * Check if Redis is available
   */
  isReady(): boolean {
    return this.isAvailable && this.client !== null && this.client.isReady;
  }

  /**
   * Set cache with expiry (TTL in seconds)
   */
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    if (!this.isReady()) return;

    try {
      await this.client!.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error(`Cache SET error for key "${key}":`, error);
    }
  }

  /**
   * Get cache by key
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isReady()) return null;

    try {
      const data = await this.client!.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Cache GET error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Delete cache by key
   */
  async del(key: string): Promise<void> {
    if (!this.isReady()) return;

    try {
      await this.client!.del(key);
    } catch (error) {
      console.error(`Cache DEL error for key "${key}":`, error);
    }
  }

  /**
   * Delete all keys matching pattern
   */
  async delPattern(pattern: string): Promise<void> {
    if (!this.isReady()) return;

    try {
      const keys = await this.client!.keys(pattern);
      if (keys.length > 0) {
        await this.client!.del(keys);
        console.log(`✅ Invalidated ${keys.length} cache keys matching "${pattern}"`);
      }
    } catch (error) {
      console.error(`Cache DELPATTERN error for pattern "${pattern}":`, error);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isReady()) return false;

    try {
      return (await this.client!.exists(key)) === 1;
    } catch (error) {
      console.error(`Cache EXISTS error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  async ttl(key: string): Promise<number> {
    if (!this.isReady()) return -1;

    try {
      return await this.client!.ttl(key);
    } catch (error) {
      console.error(`Cache TTL error for key "${key}":`, error);
      return -1;
    }
  }

  /**
   * Flush all cache (use with caution!)
   */
  async flushAll(): Promise<void> {
    if (!this.isReady()) return;

    try {
      await this.client!.flushAll();
      console.log('⚠️ All cache flushed');
    } catch (error) {
      console.error('Cache FLUSHALL error:', error);
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// ============================================================================
// CACHE KEY GENERATORS - Consistent key naming
// ============================================================================

export const CacheKeys = {
  // Products
  product: (id: string) => `product:${id}`,
  productSlug: (slug: string) => `product:slug:${slug}`,
  products: (query: string) => `products:${query}`,
  featuredProducts: () => `products:featured`,
  newArrivals: () => `products:new`,
  
  // Categories
  category: (id: string) => `category:${id}`,
  categorySlug: (slug: string) => `category:slug:${slug}`,
  categoryTree: () => `category:tree`,
  categories: () => `categories:all`,
  
  // Brands
  brand: (id: string) => `brand:${id}`,
  brandSlug: (slug: string) => `brand:slug:${slug}`,
  featuredBrands: () => `brands:featured`,
  brands: () => `brands:all`,
  
  // Users
  user: (id: string) => `user:${id}`,
  userWishlist: (userId: string) => `user:${userId}:wishlist`,
  
  // Home page
  homeBanners: () => `home:banners`,
  homeData: () => `home:data`,
  
  // Settings
  siteSettings: () => `settings:site`,
  commissionSettings: () => `settings:commission`,
};

// ============================================================================
// CACHE INVALIDATION HELPERS
// ============================================================================

export const invalidateCache = {
  // Invalidate all product cache
  products: async () => {
    await cacheService.delPattern('product*');
    await cacheService.delPattern('products*');
  },
  
  // Invalidate all category cache
  categories: async () => {
    await cacheService.delPattern('category*');
    await cacheService.delPattern('categories*');
  },
  
  // Invalidate all brand cache
  brands: async () => {
    await cacheService.delPattern('brand*');
    await cacheService.delPattern('brands*');
  },
  
  // Invalidate home page cache
  home: async () => {
    await cacheService.delPattern('home*');
  },
  
  // Invalidate user cache
  user: async (userId: string) => {
    await cacheService.delPattern(`user:${userId}*`);
  },
};
