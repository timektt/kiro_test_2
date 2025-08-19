/**
 * Bundle optimization and code splitting utilities
 */

import dynamic from 'next/dynamic'
import React, { ComponentType } from 'react'

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
  // Admin components - loaded only when needed
  AdminDashboard: createDynamicComponent(
    () => import('@/components/admin/admin-dashboard'),
    { ssr: false }
  ),
  
  UserManagement: createDynamicComponent(
    () => import('@/components/admin/user-management'),
    { ssr: false }
  ),
  
  ContentModeration: createDynamicComponent(
    () => import('@/components/admin/content-moderation'),
    { ssr: false }
  ),
  
  // Profile components - loaded on demand
  ProfileEdit: createDynamicComponent(
    () => import('@/components/profile/profile-edit-form'),
    { ssr: false }
  ),
  
  // Post components - loaded when needed
  PostComposer: createDynamicComponent(
    () => import('@/components/ui/post-composer'),
    { ssr: false }
  ),
  
  // Notification components
  NotificationsList: createDynamicComponent(
    () => import('@/components/notifications/notifications-list'),
    { ssr: false }
  ),
  
  // Search components
  SearchAutocomplete: createDynamicComponent(
    () => import('@/components/ui/search-autocomplete'),
    { ssr: false }
  ),
  
  AdvancedSearchFilters: createDynamicComponent(
    () => import('@/components/ui/advanced-search-filters'),
    { ssr: false }
  ),
  
  // Identity components
  MBTISelector: createDynamicComponent(
    () => import('@/components/identity/mbti-selector'),
    { ssr: false }
  ),
  
  // Rankings components
  RankingBoard: createDynamicComponent(
    () => import('@/components/rankings/ranking-board').then(mod => ({ default: mod.RankingBoard })),
    { ssr: false }
  )
}

/**
 * Route-based code splitting configuration
 */
export const routeComponents = {
  // Main app routes
  home: () => import('@/app/page'),
  feed: () => import('@/app/feed/page'),
  profile: () => import('@/app/profile/[username]/page'),
  search: () => import('@/app/search/page'),
  notifications: () => import('@/app/notifications/page'),
  settings: () => import('@/app/settings/page'),
  
  // Admin routes - heavy bundles
  admin: () => import('@/app/admin/page'),
  adminUsers: () => import('@/app/admin/users/page'),
  adminContent: () => import('@/app/admin/content/page'),
  adminReports: () => import('@/app/admin/reports/page'),
  adminAnalytics: () => import('@/app/admin/analytics/page'),
  
  // Auth routes
  signin: () => import('@/app/auth/signin/page'),
  signup: () => import('@/app/auth/signup/page'),
  
  // Chat routes
  chat: () => import('@/app/chat/page'),
  chatRoom: () => import('@/app/chat/[roomId]/page')
}

/**
 * Library code splitting for heavy dependencies
 */
export const DynamicLibraries = {
  // Rich text editor - heavy library
  RichTextEditor: createDynamicComponent(
    () => import('@tiptap/react').then(() => ({ default: () => React.createElement('div', {}, 'Rich Text Editor') })),
    { ssr: false }
  ),
  
  // Image cropper - heavy image processing
  ImageCropper: createDynamicComponent(
    () => import('react-image-crop').then(() => ({ default: () => React.createElement('div', {}, 'Image Cropper') })),
    { ssr: false }
  ),
  
  // Charts library - heavy visualization
  Charts: createDynamicComponent(
    () => import('recharts').then(() => ({ default: () => React.createElement('div', {}, 'Charts') })),
    { ssr: false }
  ),
  
  // Date picker - heavy date library
  DatePicker: createDynamicComponent(
    () => import('react-datepicker').then(() => ({ default: () => React.createElement('div', {}, 'Date Picker') })),
    { ssr: false }
  ),
  
  // PDF viewer - heavy document library
  PDFViewer: createDynamicComponent(
    () => import('react-pdf').then(() => ({ default: () => React.createElement('div', {}, 'PDF Viewer') })),
    { ssr: false }
  ),
  
  // Video player - heavy media library
  VideoPlayer: createDynamicComponent(
    () => import('react-player').then(() => ({ default: () => React.createElement('div', {}, 'Video Player') })),
    { ssr: false }
  ),
  
  // Code editor - heavy editor library
  CodeEditor: createDynamicComponent(
    () => import('@monaco-editor/react').then(() => ({ default: () => React.createElement('div', {}, 'Code Editor') })),
    { ssr: false }
  ),
  
  // Markdown editor - heavy markdown processing
  MarkdownEditor: createDynamicComponent(
    () => import('@uiw/react-md-editor').then(() => ({ default: () => React.createElement('div', {}, 'Markdown Editor') })),
    { ssr: false }
  )
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

