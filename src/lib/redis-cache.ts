/**
 * Redis caching implementation for performance optimization
 */

import { Redis } from 'ioredis'

// Redis client instance
let redis: Redis | null = null

// Initialize Redis connection
function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('Redis URL not configured, caching disabled')
    return null
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
      })

      redis.on('error', (error) => {
        console.error('Redis connection error:', error)
      })

      redis.on('connect', () => {
        console.log('Redis connected successfully')
      })
    } catch (error) {
      console.error('Failed to initialize Redis:', error)
      return null
    }
  }

  return redis
}

// Cache interface
export interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
}

export class CacheManager {
  private client: Redis | null
  private defaultTTL = 3600 // 1 hour

  constructor() {
    this.client = getRedisClient()
  }

  // Generate cache key with optional prefix
  private generateKey(key: string, prefix?: string): string {
    const basePrefix = process.env.NODE_ENV === 'production' ? 'prod:' : 'dev:'
    const customPrefix = prefix ? `${prefix}:` : ''
    return `${basePrefix}${customPrefix}${key}`
  }

  // Get value from cache
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    if (!this.client) return null

    try {
      const cacheKey = this.generateKey(key, options.prefix)
      const value = await this.client.get(cacheKey)
      
      if (value) {
        return JSON.parse(value) as T
      }
      
      return null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  // Set value in cache
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    if (!this.client) return false

    try {
      const cacheKey = this.generateKey(key, options.prefix)
      const ttl = options.ttl || this.defaultTTL
      
      await this.client.setex(cacheKey, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  // Delete value from cache
  async delete(key: string, options: CacheOptions = {}): Promise<boolean> {
    if (!this.client) return false

    try {
      const cacheKey = this.generateKey(key, options.prefix)
      await this.client.del(cacheKey)
      return true
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  // Delete multiple keys by pattern
  async deletePattern(pattern: string, options: CacheOptions = {}): Promise<number> {
    if (!this.client) return 0

    try {
      const cachePattern = this.generateKey(pattern, options.prefix)
      const keys = await this.client.keys(cachePattern)
      
      if (keys.length > 0) {
        return await this.client.del(...keys)
      }
      
      return 0
    } catch (error) {
      console.error('Cache delete pattern error:', error)
      return 0
    }
  }

  // Check if key exists
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    if (!this.client) return false

    try {
      const cacheKey = this.generateKey(key, options.prefix)
      const result = await this.client.exists(cacheKey)
      return result === 1
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  // Increment counter
  async increment(key: string, options: CacheOptions = {}): Promise<number> {
    if (!this.client) return 0

    try {
      const cacheKey = this.generateKey(key, options.prefix)
      const result = await this.client.incr(cacheKey)
      
      // Set TTL if it's a new key
      if (result === 1 && options.ttl) {
        await this.client.expire(cacheKey, options.ttl)
      }
      
      return result
    } catch (error) {
      console.error('Cache increment error:', error)
      return 0
    }
  }

  // Get cache statistics
  async getStats(): Promise<{
    connected: boolean
    memory: string
    keys: number
    hits: number
    misses: number
  }> {
    if (!this.client) {
      return {
        connected: false,
        memory: '0',
        keys: 0,
        hits: 0,
        misses: 0,
      }
    }

    try {
      const info = await this.client.info('memory')
      const keyspace = await this.client.info('keyspace')
      const stats = await this.client.info('stats')

      // Parse memory usage
      const memoryMatch = info.match(/used_memory_human:(.+)/)
      const memory = memoryMatch ? memoryMatch[1].trim() : '0'

      // Parse key count
      const keyMatch = keyspace.match(/keys=(\d+)/)
      const keys = keyMatch ? parseInt(keyMatch[1]) : 0

      // Parse hit/miss stats
      const hitsMatch = stats.match(/keyspace_hits:(\d+)/)
      const missesMatch = stats.match(/keyspace_misses:(\d+)/)
      const hits = hitsMatch ? parseInt(hitsMatch[1]) : 0
      const misses = missesMatch ? parseInt(missesMatch[1]) : 0

      return {
        connected: true,
        memory,
        keys,
        hits,
        misses,
      }
    } catch (error) {
      console.error('Cache stats error:', error)
      return {
        connected: false,
        memory: '0',
        keys: 0,
        hits: 0,
        misses: 0,
      }
    }
  }

  // Close connection
  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit()
      this.client = null
    }
  }
}

// Singleton instance
export const cache = new CacheManager()

// Utility functions for common caching patterns
export const cacheUtils = {
  // Cache with fallback
  async getOrSet<T>(
    key: string,
    fallback: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await cache.get<T>(key, options)
    if (cached !== null) {
      return cached
    }

    // Fallback to data source
    const data = await fallback()
    
    // Cache the result
    await cache.set(key, data, options)
    
    return data
  },

  // Cache user data
  async cacheUser(userId: string, userData: any, ttl = 1800): Promise<void> {
    await cache.set(`user:${userId}`, userData, { ttl, prefix: 'users' })
  },

  async getCachedUser(userId: string): Promise<any> {
    return cache.get(`user:${userId}`, { prefix: 'users' })
  },

  // Cache post data
  async cachePost(postId: string, postData: any, ttl = 900): Promise<void> {
    await cache.set(`post:${postId}`, postData, { ttl, prefix: 'posts' })
  },

  async getCachedPost(postId: string): Promise<any> {
    return cache.get(`post:${postId}`, { prefix: 'posts' })
  },

  // Cache feed data
  async cacheFeed(userId: string, feedData: any, ttl = 300): Promise<void> {
    await cache.set(`feed:${userId}`, feedData, { ttl, prefix: 'feeds' })
  },

  async getCachedFeed(userId: string): Promise<any> {
    return cache.get(`feed:${userId}`, { prefix: 'feeds' })
  },

  // Cache rankings
  async cacheRankings(type: string, period: string, rankings: any, ttl = 3600): Promise<void> {
    await cache.set(`rankings:${type}:${period}`, rankings, { ttl, prefix: 'rankings' })
  },

  async getCachedRankings(type: string, period: string): Promise<any> {
    return cache.get(`rankings:${type}:${period}`, { prefix: 'rankings' })
  },

  // Invalidate user-related caches
  async invalidateUserCaches(userId: string): Promise<void> {
    await Promise.all([
      cache.delete(`user:${userId}`, { prefix: 'users' }),
      cache.delete(`feed:${userId}`, { prefix: 'feeds' }),
      cache.deletePattern(`*:${userId}:*`, { prefix: 'user-data' }),
    ])
  },

  // Rate limiting
  async checkRateLimit(
    identifier: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`
    const current = await cache.increment(key, { ttl: window })
    
    const remaining = Math.max(0, limit - current)
    const resetTime = Date.now() + (window * 1000)
    
    return {
      allowed: current <= limit,
      remaining,
      resetTime,
    }
  },
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await cache.close()
})

process.on('SIGTERM', async () => {
  await cache.close()
})

export default cache