/**
 * Performance testing utilities
 */

import { performance } from 'perf_hooks'

/**
 * Performance timer utility
 */
export class PerformanceTimer {
  private startTime: number
  private endTime?: number
  private label: string

  constructor(label: string) {
    this.label = label
    this.startTime = performance.now()
  }

  end(): number {
    this.endTime = performance.now()
    const duration = this.endTime - this.startTime
    console.log(`[TIMER] ${this.label}: ${duration.toFixed(2)}ms`)
    return duration
  }

  static async measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const timer = new PerformanceTimer(label)
    try {
      const result = await fn()
      timer.end()
      return result
    } catch (error) {
      timer.end()
      throw error
    }
  }

  static measureSync<T>(label: string, fn: () => T): T {
    const timer = new PerformanceTimer(label)
    try {
      const result = fn()
      timer.end()
      return result
    } catch (error) {
      timer.end()
      throw error
    }
  }
}

/**
 * Database query performance testing
 */
export class DatabasePerformanceTester {
  private static queryTimes: Map<string, number[]> = new Map()

  static async testQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    iterations: number = 10
  ): Promise<{
    results: T[]
    stats: {
      avg: number
      min: number
      max: number
      p95: number
      p99: number
    }
  }> {
    const results: T[] = []
    const times: number[] = []

    console.log(`[TEST] Testing query: ${queryName} (${iterations} iterations)`)

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()
      const result = await queryFn()
      const endTime = performance.now()
      
      results.push(result)
      times.push(endTime - startTime)
    }

    // Calculate statistics
    times.sort((a, b) => a - b)
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length
    const min = times[0]
    const max = times[times.length - 1]
    const p95 = times[Math.floor(times.length * 0.95)]
    const p99 = times[Math.floor(times.length * 0.99)]

    const stats = { avg, min, max, p95, p99 }

    console.log(`[STATS] Query stats for ${queryName}:`, {
      avg: `${avg.toFixed(2)}ms`,
      min: `${min.toFixed(2)}ms`,
      max: `${max.toFixed(2)}ms`,
      p95: `${p95.toFixed(2)}ms`,
      p99: `${p99.toFixed(2)}ms`,
    })

    // Store for comparison
    this.queryTimes.set(queryName, times)

    return { results, stats }
  }

  static compareQueries(queryName1: string, queryName2: string) {
    const times1 = this.queryTimes.get(queryName1)
    const times2 = this.queryTimes.get(queryName2)

    if (!times1 || !times2) {
      console.error('Query times not found for comparison')
      return
    }

    const avg1 = times1.reduce((sum, time) => sum + time, 0) / times1.length
    const avg2 = times2.reduce((sum, time) => sum + time, 0) / times2.length

    const improvement = ((avg1 - avg2) / avg1) * 100

    console.log(`[COMPARISON] Query comparison:`)
    console.log(`  ${queryName1}: ${avg1.toFixed(2)}ms`)
    console.log(`  ${queryName2}: ${avg2.toFixed(2)}ms`)
    console.log(`  Improvement: ${improvement.toFixed(2)}%`)
  }
}

/**
 * Component render performance testing
 */
export class ComponentPerformanceTester {
  static measureRenderTime(componentName: string) {
    if (typeof window === 'undefined') return () => {}

    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      console.log(`[RENDER] ${componentName} render time: ${renderTime.toFixed(2)}ms`)
      
      // Send to analytics if available
      if (window.gtag) {
        window.gtag('event', 'component_render', {
          component_name: componentName,
          render_time: renderTime,
        })
      }
      
      return renderTime
    }
  }

  static measureReRenders(componentName: string) {
    if (typeof window === 'undefined') return { count: 0, log: () => {} }

    let renderCount = 0
    
    return {
      count: renderCount,
      log: () => {
        renderCount++
        console.log(`[RE-RENDER] ${componentName} re-render #${renderCount}`)
        
        if (renderCount > 10) {
          console.warn(`[WARNING] ${componentName} has re-rendered ${renderCount} times - consider optimization`)
        }
      }
    }
  }
}

/**
 * Bundle size analysis
 */
export class BundleSizeAnalyzer {
  static analyzeBundleSize() {
    if (typeof window === 'undefined') return

    // Analyze loaded resources
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    const jsResources = resources.filter(r => r.name.includes('.js'))
    const cssResources = resources.filter(r => r.name.includes('.css'))
    
    const totalJSSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
    const totalCSSSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
    
    console.log('[BUNDLE] Bundle Analysis:')
    console.log(`  JavaScript: ${(totalJSSize / 1024).toFixed(2)} KB`)
    console.log(`  CSS: ${(totalCSSSize / 1024).toFixed(2)} KB`)
    console.log(`  Total: ${((totalJSSize + totalCSSSize) / 1024).toFixed(2)} KB`)
    
    // Identify large resources
    const largeResources = resources
      .filter(r => (r.transferSize || 0) > 100 * 1024) // > 100KB
      .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
    
    if (largeResources.length > 0) {
      console.log('[ALERT] Large resources detected:')
      largeResources.forEach(r => {
        console.log(`  ${r.name}: ${((r.transferSize || 0) / 1024).toFixed(2)} KB`)
      })
    }
  }

  static monitorBundleGrowth() {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming
        
        if (resourceEntry.name.includes('.js') && resourceEntry.transferSize) {
          const sizeKB = resourceEntry.transferSize / 1024
          
          if (sizeKB > 200) { // > 200KB
            console.warn(`[LARGE] Large JS bundle loaded: ${resourceEntry.name} (${sizeKB.toFixed(2)} KB)`)
          }
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
  }
}

/**
 * Memory usage monitoring
 */
export class MemoryMonitor {
  static monitorMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) return

    const memory = (performance as any).memory
    
    const usedJSHeapSize = memory.usedJSHeapSize / 1024 / 1024 // MB
    const totalJSHeapSize = memory.totalJSHeapSize / 1024 / 1024 // MB
    const jsHeapSizeLimit = memory.jsHeapSizeLimit / 1024 / 1024 // MB
    
    console.log('[MEMORY] Memory Usage:')
    console.log(`  Used: ${usedJSHeapSize.toFixed(2)} MB`)
    console.log(`  Total: ${totalJSHeapSize.toFixed(2)} MB`)
    console.log(`  Limit: ${jsHeapSizeLimit.toFixed(2)} MB`)
    console.log(`  Usage: ${((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(2)}%`)
    
    // Warn if memory usage is high
    if (usedJSHeapSize > jsHeapSizeLimit * 0.8) {
      console.warn('[WARNING] High memory usage detected - consider optimization')
    }
    
    return {
      used: usedJSHeapSize,
      total: totalJSHeapSize,
      limit: jsHeapSizeLimit,
      percentage: (usedJSHeapSize / jsHeapSizeLimit) * 100,
    }
  }

  static startMemoryMonitoring(intervalMs: number = 30000) {
    if (typeof window === 'undefined') return

    const interval = setInterval(() => {
      this.monitorMemoryUsage()
    }, intervalMs)

    return () => clearInterval(interval)
  }
}

/**
 * Network performance testing
 */
export class NetworkPerformanceTester {
  static async testAPIEndpoint(
    endpoint: string,
    options: RequestInit = {},
    iterations: number = 5
  ) {
    const times: number[] = []
    const results: any[] = []

    console.log(`[API] Testing API endpoint: ${endpoint} (${iterations} iterations)`)

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()
      
      try {
        const response = await fetch(endpoint, options)
        const data = await response.json()
        const endTime = performance.now()
        
        times.push(endTime - startTime)
        results.push(data)
      } catch (error) {
        console.error(`API test failed on iteration ${i + 1}:`, error)
      }
    }

    if (times.length === 0) {
      console.error('All API tests failed')
      return null
    }

    // Calculate statistics
    times.sort((a, b) => a - b)
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length
    const min = times[0]
    const max = times[times.length - 1]
    const p95 = times[Math.floor(times.length * 0.95)]

    const stats = { avg, min, max, p95, successRate: (times.length / iterations) * 100 }

    console.log(`[STATS] API endpoint stats for ${endpoint}:`, {
      avg: `${avg.toFixed(2)}ms`,
      min: `${min.toFixed(2)}ms`,
      max: `${max.toFixed(2)}ms`,
      p95: `${p95.toFixed(2)}ms`,
      successRate: `${stats.successRate.toFixed(2)}%`,
    })

    return { results, stats }
  }

  static monitorNetworkRequests() {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming
        
        if (resourceEntry.name.includes('/api/')) {
          const duration = resourceEntry.responseEnd - resourceEntry.requestStart
          
          if (duration > 1000) { // > 1 second
            console.warn(`[SLOW] Slow API request: ${resourceEntry.name} (${duration.toFixed(2)}ms)`)
          }
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
  }
}

/**
 * Performance test suite
 */
export class PerformanceTestSuite {
  static async runFullSuite() {
    console.log('[START] Starting performance test suite...')

    // Bundle analysis
    BundleSizeAnalyzer.analyzeBundleSize()
    
    // Memory monitoring
    MemoryMonitor.monitorMemoryUsage()
    
    // Start monitoring
    BundleSizeAnalyzer.monitorBundleGrowth()
    NetworkPerformanceTester.monitorNetworkRequests()
    
    console.log('[SUCCESS] Performance monitoring started')
  }

  static generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      memory: MemoryMonitor.monitorMemoryUsage(),
      bundle: 'See console for bundle analysis',
      recommendations: [
        'Monitor memory usage regularly',
        'Optimize large JavaScript bundles',
        'Implement code splitting for admin features',
        'Use image optimization for all images',
        'Cache frequently accessed data',
      ],
    }

    console.log('[REPORT] Performance Report:', report)
    return report
  }
}

export default {
  PerformanceTimer,
  DatabasePerformanceTester,
  ComponentPerformanceTester,
  BundleSizeAnalyzer,
  MemoryMonitor,
  NetworkPerformanceTester,
  PerformanceTestSuite,
}

