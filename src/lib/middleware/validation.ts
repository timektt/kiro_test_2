import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export interface ValidationError {
  field: string
  message: string
}

export class ValidationException extends Error {
  public errors: ValidationError[]
  
  constructor(errors: ValidationError[]) {
    super('Validation failed')
    this.name = 'ValidationException'
    this.errors = errors
  }
}

/**
 * Validates request body against a Zod schema
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      const body = await request.json()
      return schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        throw new ValidationException(validationErrors)
      }
      throw new Error('Invalid JSON body')
    }
  }
}

/**
 * Validates query parameters against a Zod schema
 */
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (request: NextRequest): T => {
    try {
      const { searchParams } = new URL(request.url)
      const query = Object.fromEntries(searchParams.entries())
      return schema.parse(query)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        throw new ValidationException(validationErrors)
      }
      throw new Error('Invalid query parameters')
    }
  }
}

/**
 * Validates path parameters against a Zod schema
 */
export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (params: any): T => {
    try {
      return schema.parse(params)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        throw new ValidationException(validationErrors)
      }
      throw new Error('Invalid path parameters')
    }
  }
}

/**
 * Higher-order function to create validated API handlers
 */
export function withValidation<TBody = any, TQuery = any, TParams = any>(
  options: {
    body?: z.ZodSchema<TBody>
    query?: z.ZodSchema<TQuery>
    params?: z.ZodSchema<TParams>
  }
) {
  return function (
    handler: (
      request: NextRequest,
      context: {
        body?: TBody
        query?: TQuery
        params?: TParams
      }
    ) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, { params }: { params?: any } = {}) => {
      try {
        const context: {
          body?: TBody
          query?: TQuery
          params?: TParams
        } = {}

        // Validate body if schema provided
        if (options.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
          context.body = await validateBody(options.body)(request)
        }

        // Validate query if schema provided
        if (options.query) {
          context.query = validateQuery(options.query)(request)
        }

        // Validate params if schema provided
        if (options.params && params) {
          context.params = validateParams(options.params)(params)
        }

        return await handler(request, context)
      } catch (error) {
        if (error instanceof ValidationException) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: error.errors,
              },
            },
            { status: 400 }
          )
        }

        console.error('Validation middleware error:', error)
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
            },
          },
          { status: 500 }
        )
      }
    }
  }
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(content: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validates and sanitizes user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .substring(0, 10000) // Limit length to prevent DoS
}

/**
 * Validates file uploads
 */
export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string().min(1, 'File name is required'),
    size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
    type: z.string().refine(
      (type) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type),
      'Only JPEG, PNG, GIF, and WebP images are allowed'
    ),
  }),
})

/**
 * Validates image dimensions and content
 */
export async function validateImageFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      // Check dimensions
      if (img.width > 4000 || img.height > 4000) {
        reject(new Error('Image dimensions must be less than 4000x4000 pixels'))
        return
      }
      
      if (img.width < 50 || img.height < 50) {
        reject(new Error('Image dimensions must be at least 50x50 pixels'))
        return
      }
      
      resolve()
    }
    
    img.onerror = () => {
      reject(new Error('Invalid image file'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}