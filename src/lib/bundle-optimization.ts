/**
 * Bundle optimization and code splitting utilities
 */

import dynamic from 'next/dynamic'
import * as React from 'react'
import { ComponentType } from 'react'

/**
 * Dynamic import wrapper with loading states
 */
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    loading?: () => React.ReactElement
    ssr?: boolean
  } = {}
) {
  const { loading, ssr = true } = options

  return dynamic(importFn, {
    loading: loading || (() => React.createElement('div', {}, 'Loading...')),
    ssr,
  })
}

/**
 * Pre-configured dynamic components for common use cases
 */
export const DynamicComponents = {
  // Placeholder for future dynamic components
}

/**
 * Route-based code splitting configuration
 */
export const routeComponents = {
  // Placeholder for future route components
}

/**
 * Library code splitting for heavy dependencies
 */
export const DynamicLibraries = {
  // Placeholder for future heavy libraries
}

/**
 * Preload utilities for critical resources
 */
export class ResourcePreloader {
  /**
   * Preload critical routes
   */
  static preloadCriticalRoutes() {
    if (typeof window !== 'undefined') {
      // Preload critical routes based on authentication
      console.log('Preloading critical routes...')
    }
  }

  /**
   * Preload component based on user interaction
   */
  static preloadOnHover(componentLoader: () => Promise<any>) {
    return {
      onMouseEnter: () => {
        componentLoader()
      },
    }
  }

  /**
   * Preload component based on viewport intersection
   */
  static preloadOnIntersection(
    componentLoader: () => Promise<any>,
    threshold: number = 0.1
  ) {
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            componentLoader()
            observer.disconnect()
          }
        })
      },
      { threshold }
    )

    return observer
  }

  /**
   * Preload based on user role
   */
  static preloadByRole(userRole: string) {
    switch (userRole) {
      case 'ADMIN':
        // Preload admin components
        console.log('Preloading admin components for', userRole)
        break
      case 'MODERATOR':
        // Preload moderation components
        console.log('Preloading moderation components for', userRole)
        break
      default:
        // Preload common user components
        console.log('Preloading user components for', userRole)
        break
    }
  }
}

/**
 * Bundle analysis utilities
 */
export class BundleAnalyzer {
  /**
   * Track component load times
   */
  static trackComponentLoad(componentName: string) {
    if (typeof window === 'undefined') return

    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      // Send to analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', 'component_load', {
          component_name: componentName,
          load_time: loadTime,
        })
      }
      
      console.log(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`)
    }
  }

  /**
   * Monitor bundle size impact
   */
  static monitorBundleSize() {
    if (typeof window === 'undefined') return

    // Monitor performance entries
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          console.log('Bundle load metrics:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            transferSize: navEntry.transferSize,
          })
        }
      })
    })

    observer.observe({ entryTypes: ['navigation'] })
  }
}

/**
 * Webpack bundle optimization helpers
 */
export const webpackOptimizations = {
  // Split chunks configuration
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // Vendor libraries
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
        priority: 10,
      },
      
      // Common components
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'all',
        priority: 5,
        reuseExistingChunk: true,
      },
      
      // Admin-specific code
      admin: {
        test: /[\\/]admin[\\/]/,
        name: 'admin',
        chunks: 'all',
        priority: 8,
      },
      
      // UI components
      ui: {
        test: /[\\/]components[\\/]ui[\\/]/,
        name: 'ui',
        chunks: 'all',
        priority: 7,
      },
    },
  },

  // Tree shaking configuration
  treeShaking: {
    usedExports: true,
    sideEffects: false,
  },

  // Module concatenation
  concatenateModules: true,

  // Minimize configuration
  minimize: true,
  minimizer: [
    // TerserPlugin configuration would go here
  ],
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  /**
   * Monitor Core Web Vitals
   */
  static monitorWebVitals() {
    if (typeof window === 'undefined') return

    // Monitor LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('LCP:', entry.startTime)
      })
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Monitor FID (First Input Delay)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const fidEntry = entry as any
        console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Monitor CLS (Cumulative Layout Shift)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const clsEntry = entry as any
        console.log('CLS:', clsEntry.value)
      })
    }).observe({ entryTypes: ['layout-shift'] })
  }

  /**
   * Monitor resource loading
   */
  static monitorResourceLoading() {
    if (typeof window === 'undefined') return

    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming
        if (resourceEntry.transferSize > 100000) { // > 100KB
          console.warn('Large resource detected:', {
            name: resourceEntry.name,
            size: resourceEntry.transferSize,
            duration: resourceEntry.duration,
          })
        }
      })
    }).observe({ entryTypes: ['resource'] })
  }
}

export default {
  DynamicComponents,
  DynamicLibraries,
  ResourcePreloader,
  BundleAnalyzer,
  PerformanceMonitor,
}

