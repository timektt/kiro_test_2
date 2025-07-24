import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import crypto from 'crypto'

/**
 * Security headers configuration
 */
const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', '),
}

/**
 * Apply security headers to response
 */
export function withSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

/**
 * CSRF token generation and validation
 */
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32
  private static readonly HEADER_NAME = 'x-csrf-token'
  private static readonly COOKIE_NAME = 'csrf-token'

  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH).toString('hex')
  }

  /**
   * Validate CSRF token
   */
  static async validateToken(request: NextRequest): Promise<boolean> {
    // Skip CSRF validation for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true
    }

    // Skip CSRF validation for API routes with valid session
    const session = await getServerSession(authOptions)
    if (!session) {
      return false // Require authentication for state-changing operations
    }

    const tokenFromHeader = request.headers.get(this.HEADER_NAME)
    const tokenFromCookie = request.cookies.get(this.COOKIE_NAME)?.value

    if (!tokenFromHeader || !tokenFromCookie) {
      return false
    }

    // Use timing-safe comparison to prevent timing attacks
    return this.timingSafeEqual(tokenFromHeader, tokenFromCookie)
  }

  /**
   * Timing-safe string comparison
   */
  private static timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return result === 0
  }

  /**
   * Set CSRF token in response
   */
  static setToken(response: NextResponse, token: string): NextResponse {
    response.cookies.set(this.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  }
}

/**
 * CSRF protection middleware
 */
export function withCSRFProtection() {
  return function (
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, ...args: any[]) => {
      // Validate CSRF token
      const isValidToken = await CSRFProtection.validateToken(request)
      
      if (!isValidToken) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'CSRF_TOKEN_INVALID',
              message: 'Invalid or missing CSRF token',
            },
          },
          { status: 403 }
        )
      }

      // Execute handler
      const response = await handler(request, ...args)

      // Generate and set new CSRF token for next request
      const newToken = CSRFProtection.generateToken()
      return CSRFProtection.setToken(response, newToken)
    }
  }
}

/**
 * Input sanitization utilities
 */
export class InputSanitizer {
  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/&/g, '&amp;')
  }

  /**
   * Sanitize SQL input (basic protection)
   */
  static sanitizeSql(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
  }

  /**
   * Remove potentially dangerous characters
   */
  static sanitizeGeneral(input: string): string {
    return input
      .replace(/[<>\"'&]/g, '')
      .trim()
      .substring(0, 10000) // Limit length
  }

  /**
   * Validate and sanitize file names
   */
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.{2,}/g, '.')
      .substring(0, 255)
  }
}

/**
 * Request validation utilities
 */
export class RequestValidator {
  /**
   * Validate request origin
   */
  static validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    
    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000', // Development
    ].filter(Boolean)

    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed!))) {
      return false
    }

    if (referer && !allowedOrigins.some(allowed => referer.startsWith(allowed!))) {
      return false
    }

    return true
  }

  /**
   * Validate request size
   */
  static validateRequestSize(request: NextRequest, maxSize: number = 1024 * 1024): boolean {
    const contentLength = request.headers.get('content-length')
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return false
    }

    return true
  }

  /**
   * Validate content type
   */
  static validateContentType(request: NextRequest, allowedTypes: string[]): boolean {
    const contentType = request.headers.get('content-type')
    
    if (!contentType) {
      return false
    }

    return allowedTypes.some(type => contentType.includes(type))
  }
}

/**
 * Comprehensive security middleware
 */
export function withSecurity(options: {
  csrf?: boolean
  rateLimit?: boolean
  validateOrigin?: boolean
  maxRequestSize?: number
  allowedContentTypes?: string[]
} = {}) {
  return function (
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, ...args: any[]) => {
      // Validate origin
      if (options.validateOrigin !== false && !RequestValidator.validateOrigin(request)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ORIGIN',
              message: 'Request from invalid origin',
            },
          },
          { status: 403 }
        )
      }

      // Validate request size
      if (options.maxRequestSize && !RequestValidator.validateRequestSize(request, options.maxRequestSize)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'REQUEST_TOO_LARGE',
              message: 'Request size exceeds limit',
            },
          },
          { status: 413 }
        )
      }

      // Validate content type for POST/PUT requests
      if (options.allowedContentTypes && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        if (!RequestValidator.validateContentType(request, options.allowedContentTypes)) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVALID_CONTENT_TYPE',
                message: 'Invalid content type',
              },
            },
            { status: 415 }
          )
        }
      }

      // CSRF protection
      if (options.csrf !== false) {
        const isValidToken = await CSRFProtection.validateToken(request)
        if (!isValidToken) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'CSRF_TOKEN_INVALID',
                message: 'Invalid or missing CSRF token',
              },
            },
            { status: 403 }
          )
        }
      }

      // Execute handler
      let response = await handler(request, ...args)

      // Apply security headers
      response = withSecurityHeaders(response)

      // Set new CSRF token
      if (options.csrf !== false) {
        const newToken = CSRFProtection.generateToken()
        response = CSRFProtection.setToken(response, newToken)
      }

      return response
    }
  }
}