import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  })
}, 5 * 60 * 1000)

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
  // Try to get user ID from session/auth
  const userId = request.headers.get('x-user-id')
  if (userId) {
    return `user:${userId}`
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return `ip:${ip}`
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const clientId = getClientId(request)
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Get or create rate limit entry
    let entry = rateLimitStore[clientId]
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      }
      rateLimitStore[clientId] = entry
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: config.message || 'Too many requests',
            retryAfter,
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
          },
        }
      )
    }

    // Increment counter
    entry.count++

    // Execute handler
    const response = await handler(request)

    // Add rate limit headers
    const remaining = Math.max(0, config.maxRequests - entry.count)
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString())

    return response
  }
}

/**
 * Different rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Authentication endpoints - stricter limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later',
  },

  // Post creation - moderate limits
  posts: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 posts per minute
    message: 'Too many posts created, please slow down',
  },

  // Comments - moderate limits
  comments: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 comments per minute
    message: 'Too many comments, please slow down',
  },

  // Likes/follows - higher limits for quick actions
  interactions: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 interactions per minute
    message: 'Too many interactions, please slow down',
  },

  // General API - default limits
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many requests, please slow down',
  },

  // File uploads - very strict limits
  uploads: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 uploads per minute
    message: 'Too many file uploads, please wait before uploading again',
  },

  // Search - moderate limits to prevent abuse
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 searches per minute
    message: 'Too many search requests, please slow down',
  },
}

/**
 * Higher-order function to apply rate limiting to API handlers
 */
export function withRateLimit(config: RateLimitConfig) {
  return function (
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, ...args: any[]) => {
      return rateLimit(config)(request, () => handler(request, ...args))
    }
  }
}

/**
 * Adaptive rate limiting based on user behavior
 */
export function adaptiveRateLimit(baseConfig: RateLimitConfig) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const clientId = getClientId(request)
    
    // Check if user has been flagged for suspicious behavior
    const suspiciousKey = `suspicious:${clientId}`
    const isSuspicious = rateLimitStore[suspiciousKey]?.count > 0
    
    // Apply stricter limits for suspicious users
    const config = isSuspicious
      ? {
          ...baseConfig,
          maxRequests: Math.floor(baseConfig.maxRequests * 0.5), // 50% of normal limit
          message: 'Account temporarily restricted due to suspicious activity',
        }
      : baseConfig

    return rateLimit(config)(request, handler)
  }
}

/**
 * Mark user as suspicious for adaptive rate limiting
 */
export function markSuspicious(clientId: string, duration: number = 60 * 60 * 1000) {
  const suspiciousKey = `suspicious:${clientId}`
  rateLimitStore[suspiciousKey] = {
    count: 1,
    resetTime: Date.now() + duration,
  }
}

/**
 * Distributed rate limiting for production (Redis implementation)
 */
export class RedisRateLimit {
  private redis: any // Redis client

  constructor(redisClient: any) {
    this.redis = redisClient
  }

  async checkLimit(
    clientId: string,
    config: RateLimitConfig
  ): Promise<{
    allowed: boolean
    count: number
    resetTime: number
    remaining: number
  }> {
    const key = `rate_limit:${clientId}`
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Use Redis pipeline for atomic operations
    const pipeline = this.redis.pipeline()
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart)
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`)
    
    // Count requests in window
    pipeline.zcard(key)
    
    // Set expiration
    pipeline.expire(key, Math.ceil(config.windowMs / 1000))
    
    const results = await pipeline.exec()
    const count = results[2][1]
    
    const allowed = count <= config.maxRequests
    const remaining = Math.max(0, config.maxRequests - count)
    const resetTime = now + config.windowMs

    return {
      allowed,
      count,
      resetTime,
      remaining,
    }
  }
}
