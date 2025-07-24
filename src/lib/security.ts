import { NextRequest, NextResponse } from 'next/server'
import { withValidation } from './middleware/validation'
import { withRateLimit, rateLimitConfigs } from './middleware/rate-limit'
import { withSecurity } from './middleware/security'
import { withFileUploadSecurity, fileUploadConfigs } from './middleware/file-upload'
import { z } from 'zod'

/**
 * Security configuration options
 */
export interface SecurityOptions {
  validation?: {
    body?: z.ZodSchema<any>
    query?: z.ZodSchema<any>
    params?: z.ZodSchema<any>
  }
  rateLimit?: keyof typeof rateLimitConfigs | {
    windowMs: number
    maxRequests: number
    message?: string
  }
  csrf?: boolean
  fileUpload?: keyof typeof fileUploadConfigs | {
    maxFileSize: number
    allowedMimeTypes: string[]
    allowedExtensions: string[]
    maxFiles: number
  }
  cors?: {
    origin?: string | string[]
    methods?: string[]
    allowedHeaders?: string[]
  }
  requireAuth?: boolean
}

/**
 * Comprehensive security wrapper for API routes
 */
export function withSecureAPI(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: SecurityOptions = {}
) {
  return async (request: NextRequest, routeContext?: any) => {
    let securedHandler = handler

    // Apply file upload security if specified
    if (options.fileUpload) {
      const config = typeof options.fileUpload === 'string' 
        ? fileUploadConfigs[options.fileUpload]
        : options.fileUpload
      
      securedHandler = withFileUploadSecurity(config)(securedHandler)
    }

    // Apply validation if specified
    if (options.validation) {
      securedHandler = withValidation(options.validation)(securedHandler)
    }

    // Apply rate limiting if specified
    if (options.rateLimit) {
      const config = typeof options.rateLimit === 'string'
        ? rateLimitConfigs[options.rateLimit]
        : options.rateLimit
      
      securedHandler = withRateLimit(config)(securedHandler)
    }

    // Apply general security measures
    securedHandler = withSecurity({
      csrf: options.csrf !== false,
      validateOrigin: true,
      maxRequestSize: 10 * 1024 * 1024, // 10MB default
      allowedContentTypes: ['application/json', 'multipart/form-data'],
    })(securedHandler)

    return securedHandler(request, routeContext)
  }
}

/**
 * Pre-configured security wrappers for common use cases
 */
export const securityWrappers = {
  /**
   * Authentication endpoints (login, register, etc.)
   */
  auth: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withSecureAPI(handler, {
      rateLimit: 'auth',
      csrf: false, // CSRF not needed for auth endpoints
      validation: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }).partial(), // Allow partial for different auth endpoints
      },
    }),

  /**
   * Post creation and management
   */
  posts: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withSecureAPI(handler, {
      rateLimit: 'posts',
      requireAuth: true,
      validation: {
        body: z.object({
          content: z.string().min(1).max(2000),
          imageUrl: z.string().url().optional(),
        }).partial(),
      },
    }),

  /**
   * Comment creation and management
   */
  comments: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withSecureAPI(handler, {
      rateLimit: 'comments',
      requireAuth: true,
      validation: {
        body: z.object({
          content: z.string().min(1).max(1000),
          postId: z.string().cuid().optional(),
        }).partial(),
      },
    }),

  /**
   * User interactions (likes, follows, etc.)
   */
  interactions: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withSecureAPI(handler, {
      rateLimit: 'interactions',
      requireAuth: true,
    }),

  /**
   * File uploads
   */
  uploads: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withSecureAPI(handler, {
      rateLimit: 'uploads',
      fileUpload: 'images',
      requireAuth: true,
    }),

  /**
   * Search endpoints
   */
  search: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withSecureAPI(handler, {
      rateLimit: 'search',
      validation: {
        query: z.object({
          q: z.string().min(1).max(100),
          type: z.enum(['users', 'posts', 'all']).optional(),
          page: z.string().regex(/^\d+$/).optional(),
          limit: z.string().regex(/^\d+$/).optional(),
        }),
      },
    }),

  /**
   * Admin endpoints
   */
  admin: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withSecureAPI(handler, {
      rateLimit: 'general',
      requireAuth: true,
      // Additional admin-specific security would be added here
    }),

  /**
   * General API endpoints
   */
  general: (handler: (request: NextRequest, context?: any) => Promise<NextResponse>) =>
    withSecureAPI(handler, {
      rateLimit: 'general',
    }),
}

/**
 * Security audit utilities
 */
export class SecurityAudit {
  /**
   * Log security events
   */
  static logSecurityEvent(event: {
    type: 'RATE_LIMIT_EXCEEDED' | 'CSRF_VIOLATION' | 'INVALID_FILE_UPLOAD' | 'SUSPICIOUS_ACTIVITY'
    clientId: string
    userAgent?: string
    ip?: string
    details?: any
  }) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    }

    // In production, send to security monitoring service
    console.warn('Security Event:', logEntry)
    
    // Store in database for analysis
    // await prisma.securityLog.create({ data: logEntry })
  }

  /**
   * Check for suspicious patterns
   */
  static detectSuspiciousActivity(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    
    // Check for bot-like behavior
    const suspiciousUserAgents = [
      /curl/i,
      /wget/i,
      /python/i,
      /bot/i,
      /crawler/i,
      /spider/i,
    ]

    if (suspiciousUserAgents.some(pattern => pattern.test(userAgent))) {
      return true
    }

    // Check for missing or suspicious referer
    if (request.method === 'POST' && !referer) {
      return true
    }

    return false
  }

  /**
   * Generate security report
   */
  static async generateSecurityReport(): Promise<{
    rateLimitViolations: number
    csrfViolations: number
    fileUploadViolations: number
    suspiciousActivities: number
    topViolators: Array<{ clientId: string; violations: number }>
  }> {
    // In production, query security logs from database
    return {
      rateLimitViolations: 0,
      csrfViolations: 0,
      fileUploadViolations: 0,
      suspiciousActivities: 0,
      topViolators: [],
    }
  }
}

/**
 * Security configuration validation
 */
export const securityConfigSchema = z.object({
  rateLimit: z.object({
    enabled: z.boolean().default(true),
    windowMs: z.number().min(1000).default(60000),
    maxRequests: z.number().min(1).default(100),
  }),
  csrf: z.object({
    enabled: z.boolean().default(true),
    tokenLength: z.number().min(16).default(32),
  }),
  fileUpload: z.object({
    enabled: z.boolean().default(true),
    maxFileSize: z.number().min(1024).default(10 * 1024 * 1024),
    scanMalware: z.boolean().default(false),
  }),
  cors: z.object({
    enabled: z.boolean().default(true),
    allowedOrigins: z.array(z.string().url()).default([]),
  }),
})

export type SecurityConfig = z.infer<typeof securityConfigSchema>

/**
 * Default security configuration
 */
export const defaultSecurityConfig: SecurityConfig = {
  rateLimit: {
    enabled: true,
    windowMs: 60000, // 1 minute
    maxRequests: 100,
  },
  csrf: {
    enabled: true,
    tokenLength: 32,
  },
  fileUpload: {
    enabled: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    scanMalware: false,
  },
  cors: {
    enabled: true,
    allowedOrigins: [
      process.env.NEXTAUTH_URL || 'http://localhost:3000',
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    ].filter(Boolean),
  },
}