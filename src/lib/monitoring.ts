import { NextRequest } from 'next/server'

// Types for monitoring
export interface MetricData {
  name: string
  value: number
  tags?: Record<string, string>
  timestamp?: Date
}

export interface LogData {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  meta?: Record<string, any>
  timestamp?: Date
  requestId?: string
}

// Simple in-memory metrics store (replace with proper monitoring service)
class MetricsStore {
  private metrics: MetricData[] = []
  private maxSize = 1000

  add(metric: MetricData) {
    this.metrics.push({
      ...metric,
      timestamp: metric.timestamp || new Date()
    })

    // Keep only recent metrics
    if (this.metrics.length > this.maxSize) {
      this.metrics = this.metrics.slice(-this.maxSize)
    }
  }

  getMetrics(name?: string): MetricData[] {
    if (name) {
      return this.metrics.filter(m => m.name === name)
    }
    return [...this.metrics]
  }

  clear() {
    this.metrics = []
  }
}

// Simple logger (replace with proper logging service)
class Logger {
  private logs: LogData[] = []
  private maxSize = 1000

  private log(level: LogData['level'], message: string, meta?: Record<string, any>, requestId?: string) {
    const logEntry: LogData = {
      level,
      message,
      meta,
      requestId,
      timestamp: new Date()
    }

    this.logs.push(logEntry)

    // Keep only recent logs
    if (this.logs.length > this.maxSize) {
      this.logs = this.logs.slice(-this.maxSize)
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}] ${message}`, meta || '')
    }

    // In production, you might want to send to external logging service
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      // Send to error tracking service (e.g., Sentry)
      this.sendToErrorTracking(logEntry)
    }
  }

  info(message: string, meta?: Record<string, any>, requestId?: string) {
    this.log('info', message, meta, requestId)
  }

  warn(message: string, meta?: Record<string, any>, requestId?: string) {
    this.log('warn', message, meta, requestId)
  }

  error(message: string, meta?: Record<string, any>, requestId?: string) {
    this.log('error', message, meta, requestId)
  }

  debug(message: string, meta?: Record<string, any>, requestId?: string) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, meta, requestId)
    }
  }

  getLogs(level?: LogData['level']): LogData[] {
    if (level) {
      return this.logs.filter(l => l.level === level)
    }
    return [...this.logs]
  }

  private sendToErrorTracking(logEntry: LogData) {
    // Implement error tracking service integration
    // For example, Sentry, Bugsnag, etc.
    if (process.env.SENTRY_DSN) {
      // Send to Sentry
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics = new MetricsStore()
  private logger = new Logger()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Track API response times
  trackApiCall(endpoint: string, method: string, duration: number, status: number) {
    this.metrics.add({
      name: 'api_response_time',
      value: duration,
      tags: { endpoint, method, status: status.toString() }
    })

    this.logger.info('API call completed', {
      endpoint,
      method,
      duration,
      status
    })
  }

  // Track database query performance
  trackDbQuery(query: string, duration: number) {
    this.metrics.add({
      name: 'db_query_time',
      value: duration,
      tags: { query: query.substring(0, 50) } // Truncate for privacy
    })
  }

  // Track user actions
  trackUserAction(action: string, userId?: string, metadata?: Record<string, any>) {
    this.metrics.add({
      name: 'user_action',
      value: 1,
      tags: { action, userId: userId || 'anonymous' }
    })

    this.logger.info('User action', {
      action,
      userId,
      ...metadata
    })
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    this.metrics.add({
      name: 'error_count',
      value: 1,
      tags: { error: error.name }
    })

    this.logger.error(error.message, {
      stack: error.stack,
      ...context
    })
  }

  // Get metrics for monitoring dashboard
  getMetrics() {
    return {
      apiCalls: this.metrics.getMetrics('api_response_time'),
      dbQueries: this.metrics.getMetrics('db_query_time'),
      userActions: this.metrics.getMetrics('user_action'),
      errors: this.metrics.getMetrics('error_count')
    }
  }

  // Get logs for debugging
  getLogs() {
    return this.logger.getLogs()
  }
}

// Middleware helper for request tracking
export function createRequestTracker(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()
  const monitor = PerformanceMonitor.getInstance()

  return {
    requestId,
    trackCompletion: (status: number) => {
      const duration = Date.now() - startTime
      monitor.trackApiCall(
        request.nextUrl.pathname,
        request.method,
        duration,
        status
      )
    },
    trackError: (error: Error) => {
      monitor.trackError(error, {
        requestId,
        path: request.nextUrl.pathname,
        method: request.method
      })
    }
  }
}

// Export singleton instance
export const monitor = PerformanceMonitor.getInstance()