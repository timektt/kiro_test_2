import { NextRequest } from 'next/server'
import logger from './logger'

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Track API response times
  trackApiResponse(endpoint: string, duration: number, status: number) {
    const key = `api_${endpoint}_${status}`
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    const times = this.metrics.get(key)!
    times.push(duration)
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift()
    }
    
    // Log slow responses
    if (duration > 1000) {
      logger.warn('Slow API response detected', {
        endpoint,
        duration: `${duration}ms`,
        status
      })
    }
  }

  // Track database query times
  trackDatabaseQuery(query: string, duration: number) {
    const key = 'db_query'
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    const times = this.metrics.get(key)!
    times.push(duration)
    
    if (times.length > 100) {
      times.shift()
    }
    
    // Log slow queries
    if (duration > 500) {
      logger.warn('Slow database query detected', {
        query: query.substring(0, 100) + '...',
        duration: `${duration}ms`
      })
    }
  }

  // Get performance statistics
  getStats(key: string) {
    const times = this.metrics.get(key)
    if (!times || times.length === 0) {
      return null
    }

    const sorted = [...times].sort((a, b) => a - b)
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length
    const p50 = sorted[Math.floor(sorted.length * 0.5)]
    const p95 = sorted[Math.floor(sorted.length * 0.95)]
    const p99 = sorted[Math.floor(sorted.length * 0.99)]

    return {
      count: times.length,
      avg: Math.round(avg),
      p50: Math.round(p50),
      p95: Math.round(p95),
      p99: Math.round(p99),
      min: Math.round(sorted[0]),
      max: Math.round(sorted[sorted.length - 1])
    }
  }

  // Get all metrics
  getAllStats() {
    const stats: Record<string, any> = {}
    for (const [key] of this.metrics) {
      stats[key] = this.getStats(key)
    }
    return stats
  }
}

// Middleware helper for tracking API performance
export function withPerformanceTracking(
  handler: (req: NextRequest) => Promise<Response>,
  endpoint: string
) {
  return async (req: NextRequest): Promise<Response> => {
    const startTime = Date.now()
    const monitor = PerformanceMonitor.getInstance()
    
    try {
      const response = await handler(req)
      const duration = Date.now() - startTime
      
      monitor.trackApiResponse(endpoint, duration, response.status)
      
      // Add performance headers
      response.headers.set('X-Response-Time', `${duration}ms`)
      
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      monitor.trackApiResponse(endpoint, duration, 500)
      throw error
    }
  }
}

// Database performance tracking
export async function trackDatabaseOperation<T>(
  operation: () => Promise<T>,
  queryName: string
): Promise<T> {
  const startTime = Date.now()
  const monitor = PerformanceMonitor.getInstance()
  
  try {
    const result = await operation()
    const duration = Date.now() - startTime
    monitor.trackDatabaseQuery(queryName, duration)
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    monitor.trackDatabaseQuery(queryName, duration)
    throw error
  }
}

// Web Vitals tracking (client-side)
export const webVitalsConfig = {
  onCLS: (metric: any) => {
    logger.info('CLS metric', { value: metric.value, id: metric.id })
  },
  onFID: (metric: any) => {
    logger.info('FID metric', { value: metric.value, id: metric.id })
  },
  onFCP: (metric: any) => {
    logger.info('FCP metric', { value: metric.value, id: metric.id })
  },
  onLCP: (metric: any) => {
    logger.info('LCP metric', { value: metric.value, id: metric.id })
  },
  onTTFB: (metric: any) => {
    logger.info('TTFB metric', { value: metric.value, id: metric.id })
  }
}
