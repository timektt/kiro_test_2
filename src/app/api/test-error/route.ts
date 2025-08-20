import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Log the test error attempt
    logger.info('Test error endpoint called')
    
    // Capture a test message to Sentry
    Sentry.captureMessage('Test error endpoint called', 'info')
    
    // Throw a test error
    throw new Error('This is a test error for monitoring purposes')
  } catch (error) {
    // Log the error
    logger.error('Test error thrown', error)
    
    // Capture the error to Sentry
    Sentry.captureException(error)
    
    return NextResponse.json({
      message: 'Test error thrown successfully',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      note: 'This error should appear in your monitoring dashboard'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { errorType = 'generic', message = 'Test error' } = body
    
    logger.info('Custom test error requested', { errorType, message })
    
    // Add custom context to Sentry
    Sentry.setContext('test_error', {
      errorType,
      customMessage: message,
      timestamp: new Date().toISOString()
    })
    
    // Throw different types of errors based on request
    switch (errorType) {
      case 'validation':
        throw new Error(`Validation Error: ${message}`)
      case 'database':
        throw new Error(`Database Error: ${message}`)
      case 'auth':
        throw new Error(`Authentication Error: ${message}`)
      default:
        throw new Error(`Generic Error: ${message}`)
    }
  } catch (error) {
    logger.error('Custom test error thrown', error)
    Sentry.captureException(error)
    
    return NextResponse.json({
      message: 'Custom test error thrown successfully',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
