/**
 * Caching strategies for frequently accessed data
 */

// In-memory cache implementation
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>()
  private timers = new Map<string, NodeJS.Timeout>()

  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    const expires = Date.now() + ttlMs
    
    // Clear existing timer
    const existingTimer = this.timers.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Set new data
    this.cache.set(key, { data, expires })

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key)
      this.timers.delete(key)
    }, ttlMs)
    
    this.timers.set(key, timer)
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      const timer = this.timers.get(key)
      if (timer) {
        clearTimeout(timer)
        this.timers.delete(key)
      }
      return null
    }

    return item.data
  }

  delete(key: string) {
    this.cache.delete(key)
    const timer = this.timers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(key)
    }
  }

  clear() {
    this.cache.clear()
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }

  size() {
    return this.cache.size
  }

  keys() {
    return Array.from(this.cache.keys())
  }
}

// Global cache instance
const cache = new MemoryCache()

/**
 * Cache configuration for different data types
 */
export const cacheConfig = {
  user: {
    ttl: 10 * 60 * 1000, // 10 minutes
    keyPrefix: 'user:',
  },
  post: {
    ttl: 5 * 60 * 1000, // 5 minutes
    keyPrefix: 'post:',
  },
  feed: {
    ttl: 2 * 60 * 1000, // 2 minutes
    keyPrefix: 'feed:',
  },
  notifications: {
    ttl: 1 * 60 * 1000, // 1 minute
    keyPrefix: 'notifications:',
  },
  search: {
    ttl: 5 * 60 * 1000, // 5 minutes
    keyPrefix: 'search:',
  },
  stats: {
    ttl: 15 * 60 * 1000, // 15 minutes
    keyPrefix: 'stats:',
  },
  trending: {
    ttl: 10 * 60 * 1000, // 10 minutes
    keyPrefix: 'trending:',
  },
}

/**
 * Cache utility functions
 */
export class CacheManager {
  /**
   * Get data from cache or execute function and cache result
   */
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number = 5 * 60 * 1000
  ): Promise<T> {
    // Try to get from cache first
    const cached = cache.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Fetch data and cache it
    const data = await fetchFn()
    cache.set(key, data, ttlMs)
    return data
  }

  /**
   * Set data in cache
   */
  static set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    cache.set(key, data, ttlMs)
  }

  /**
   * Get data from cache
   */
  static get<T>(key: string): T | null {
    return cache.get<T>(key)
  }

  /**
   * Delete data from cache
   */
  static delete(key: string) {
    cache.delete(key)
  }

  /**
   * Clear all cache
   */
  static clear() {
    cache.clear()
  }

  /**
   * Invalidate cache by pattern
   */
  static invalidatePattern(pattern: string) {
    const keys = cache.keys()
    const regex = new RegExp(pattern)
    
    keys.forEach(key => {
      if (regex.test(key)) {
        cache.delete(key)
      }
    })
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    return {
      size: cache.size(),
      keys: cache.keys(),
    }
  }
}

/**
 * Cached data access functions
 */
export class CachedData {
  /**
   * Get user profile with caching
   */
  static async getUserProfile(userId: string, fetchFn: () => Promise<any>) {
    const key = `${cacheConfig.user.keyPrefix}${userId}`
    return CacheManager.getOrSet(key, fetchFn, cacheConfig.user.ttl)
  }

  /**
   * Get user feed with caching
   */
  static async getUserFeed(
    userId: string,
    type: string,
    page: number,
    fetchFn: () => Promise<any>
  ) {
    const key = `${cacheConfig.feed.keyPrefix}${userId}:${type}:${page}`
    return CacheManager.getOrSet(key, fetchFn, cacheConfig.feed.ttl)
  }

  /**
   * Get post with caching
   */
  static async getPost(postId: string, fetchFn: () => Promise<any>) {
    const key = `${cacheConfig.post.keyPrefix}${postId}`
    return CacheManager.getOrSet(key, fetchFn, cacheConfig.post.ttl)
  }

  /**
   * Get notifications with caching
   */
  static async getNotifications(
    userId: string,
    page: number,
    fetchFn: () => Promise<any>
  ) {
    const key = `${cacheConfig.notifications.keyPrefix}${userId}:${page}`
    return CacheManager.getOrSet(key, fetchFn, cacheConfig.notifications.ttl)
  }

  /**
   * Get search results with caching
   */
  static async getSearchResults(
    query: string,
    type: string,
    page: number,
    fetchFn: () => Promise<any>
  ) {
    const key = `${cacheConfig.search.keyPrefix}${query}:${type}:${page}`
    return CacheManager.getOrSet(key, fetchFn, cacheConfig.search.ttl)
  }

  /**
   * Get trending content with caching
   */
  static async getTrendingContent(type: string, fetchFn: () => Promise<any>) {
    const key = `${cacheConfig.trending.keyPrefix}${type}`
    return CacheManager.getOrSet(key, fetchFn, cacheConfig.trending.ttl)
  }

  /**
   * Get stats with caching
   */
  static async getStats(type: string, fetchFn: () => Promise<any>) {
    const key = `${cacheConfig.stats.keyPrefix}${type}`
    return CacheManager.getOrSet(key, fetchFn, cacheConfig.stats.ttl)
  }
}

/**
 * Cache invalidation helpers
 */
export class CacheInvalidation {
  /**
   * Invalidate user-related cache
   */
  static invalidateUser(userId: string) {
    CacheManager.invalidatePattern(`user:${userId}`)
    CacheManager.invalidatePattern(`feed:${userId}`)
    CacheManager.invalidatePattern(`notifications:${userId}`)
  }

  /**
   * Invalidate post-related cache
   */
  static invalidatePost(postId: string, authorId: string) {
    CacheManager.delete(`post:${postId}`)
    CacheManager.invalidatePattern(`feed:.*`)
    CacheManager.invalidatePattern(`user:${authorId}`)
    CacheManager.invalidatePattern(`trending:.*`)
  }

  /**
   * Invalidate feed cache
   */
  static invalidateFeed(userId?: string) {
    if (userId) {
      CacheManager.invalidatePattern(`feed:${userId}`)
    } else {
      CacheManager.invalidatePattern(`feed:.*`)
    }
  }

  /**
   * Invalidate search cache
   */
  static invalidateSearch() {
    CacheManager.invalidatePattern(`search:.*`)
  }

  /**
   * Invalidate trending cache
   */
  static invalidateTrending() {
    CacheManager.invalidatePattern(`trending:.*`)
  }

  /**
   * Invalidate stats cache
   */
  static invalidateStats() {
    CacheManager.invalidatePattern(`stats:.*`)
  }
}

/**
 * Cache warming functions
 */
export class CacheWarming {
  /**
   * Warm up user cache
   */
  static async warmUserCache(userId: string, userData: any) {
    const key = `${cacheConfig.user.keyPrefix}${userId}`
    CacheManager.set(key, userData, cacheConfig.user.ttl)
  }

  /**
   * Warm up popular content cache
   */
  static async warmPopularContent() {
    // This would typically be called by a background job
    // to pre-populate cache with trending/popular content
  }

  /**
   * Warm up user feeds for active users
   */
  static async warmUserFeeds(activeUserIds: string[]) {
    // This would pre-populate feed cache for active users
    // to improve their experience when they visit
  }
}

/**
 * Redis cache implementation for production
 */
export class RedisCache {
  private redis: any // Redis client

  constructor(redisClient: any) {
    this.redis = redisClient
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async set(key: string, data: any, ttlSeconds: number = 300) {
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(data))
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }

  async delete(key: string) {
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error('Redis delete error:', error)
    }
  }

  async invalidatePattern(pattern: string) {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Redis invalidate pattern error:', error)
    }
  }

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetchFn()
    await this.set(key, data, ttlSeconds)
    return data
  }
}

/**
 * Cache middleware for API routes
 */
export function withCache(
  keyGenerator: (req: any) => string,
  ttlMs: number = 5 * 60 * 1000
) {
  return function <T extends (...args: any[]) => Promise<any>>(handler: T): T {
    return (async (...args: any[]) => {
      const [request] = args
      const cacheKey = keyGenerator(request)
      
      // Try to get from cache
      const cached = CacheManager.get(cacheKey)
      if (cached) {
        return cached
      }

      // Execute handler and cache result
      const result = await handler(...args)
      CacheManager.set(cacheKey, result, ttlMs)
      
      return result
    }) as T
  }
}

/**
 * SWR cache integration
 */
export const swrCacheConfig = {
  // Custom cache provider for SWR
  provider: () => new Map(),
  
  // Global SWR configuration
  config: {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    dedupingInterval: 2000,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    focusThrottleInterval: 5000,
  },
}

export default CacheManager
