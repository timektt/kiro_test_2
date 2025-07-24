/**
 * Bundle optimization and code splitting utilities
 */

import dynamic from 'next/dynamic'
import { ComponentType, lazy, Suspense } from 'react'

/**
 * Dynamic import wrapper with loading states
 */
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    loading?: ComponentType
    ssr?: boolean
    suspense?: boolean
  } = {}
) {
  const { loading, ssr = true, suspense = false } = options

  if (suspense) {
    const LazyComponent = lazy(importFn)
    return (props: T) => (
      <Suspense fallback={loading ? <loading /> : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }

  return dynamic(importFn, {
    loading: loading ? () => <loading /> : () => <div>Loading...</div>,
    ssr,
  })
}

/**
 * Pre-configured dynamic components for common use cases
 */
export const DynamicComponents = {
  // Admin components (loaded only when needed)
  AdminDashboard: createDynamicComponent(
    () => import('@/components/admin/admin-dashboard'),
    { ssr: false }
  ),
  
  AdminUserManagement: createDynamicComponent(
    () => import('@/components/admin/user-management'),
    { ssr: false }
  ),
  
  ContentModeration: createDynamicComponent(
    () => import('@/components/admin/content-moderation'),
    { ssr: false }
  ),

  // Profile components
  ProfileEditForm: createDynamicComponent(
    () => import('@/components/profile/profile-edit-form'),
    { ssr: false }
  ),
  
  FollowingList: createDynamicComponent(
    () => import('@/components/profile/following-list'),
    { ssr: false }
  ),
  
  FollowersList: createDynamicComponent(
    () => import('@/components/profile/followers-list'),
    { ssr: false }
  ),

  // Feed components
  PostComposer: createDynamicComponent(
    () => import('@/components/ui/post-composer'),
    { ssr: false }
  ),
  
  EnhancedInteractiveFeed: createDynamicComponent(
    () => import('@/components/feed/enhanced-interactive-feed'),
    { ssr: false }
  ),

  // Notification components
  NotificationsList: createDynamicComponent(
    () => import('@/components/notifications/notifications-list'),
    { ssr: false }
  ),
  
  NotificationDropdown: createDynamicComponent(
    () => import('@/components/ui/notification-dropdown'),
    { ssr: false }
  ),

  // Search components
  SearchResults: createDynamicComponent(
    () => import('@/components/search/search-results'),
    { ssr: false }
  ),
  
  TrendingContent: createDynamicComponent(
    () => import('@/components/search/trending-content'),
    { ssr: false }
  ),

  // Chart/Analytics components (heavy libraries)
  AnalyticsChart: createDynamicComponent(
    () => import('@/components/analytics/chart'),
    { ssr: false }
  ),
  
  StatsVisualization: createDynamicComponent(
    () => import('@/components/analytics/stats-visualization'),
    { ssr: false }
  ),
}

/**
 * Route-based code splitting configuration
 */
export const routeComponents = {
  // Public routes
  home: () => import('@/app/page'),
  feed: () => import('@/app/feed/page'),
  profile: () => import('@/app/profile/[username]/page'),
  
  // Auth routes
  signin: () => import('@/app/auth/signin/page'),
  signup: () => import('@/app/auth/signup/page'),
  
  // Admin routes (heavy, load only when needed)
  admin: () => import('@/app/admin/page'),
  adminUsers: () => import('@/app/admin/users/page'),
  adminContent: () => import('@/app/admin/content/page'),
  
  // Settings routes
  settings: () => import('@/app/settings/page'),
  settingsProfile: () => import('@/app/settings/profile/page'),
  settingsNotifications: () => import('@/app/settings/notifications/page'),
}

/**
 * Library code splitting for heavy dependencies
 */
export const DynamicLibraries = {
  // Chart library (only load when needed)
  Chart: createDynamicComponent(
    async () => {
      const { Chart } = await import('chart.js')
      return { default: Chart as any }
    },
    { ssr: false }
  ),
  
  // Rich text editor (heavy)
  RichTextEditor: createDynamicComponent(
    () => import('@/components/ui/rich-text-editor'),
    { ssr: false }
  ),
  
  // Image cropper
  ImageCropper: createDynamicComponent(
    () => import('@/components/ui/image-cropper'),
    { ssr: false }
  ),
  
  // PDF viewer
  PDFViewer: createDynamicComponent(
    () => import('@/components/ui/pdf-viewer'),
    { ssr: false }
  ),
  
  // Video player
  VideoPlayer: createDynamicComponent(
    () => import('@/components/ui/video-player'),
    { ssr: false }
  ),
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
      // Preload feed page for authenticated users
      const isAuthenticated = document.cookie.includes('next-auth.session-token')
      if (isAuthenticated) {
        routeComponents.feed()
      }
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
        DynamicComponents.AdminDashboard
        DynamicComponents.AdminUserManagement
        DynamicComponents.ContentModeration
        break
      case 'MODERATOR':
        // Preload moderation components
        DynamicComponents.ContentModeration
        break
      default:
        // Preload common user components
        DynamicComponents.PostComposer
        DynamicComponents.NotificationDropdown
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
      if (window.gtag) {
        window.gtag('event', 'component_load', {
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
        console.log('FID:', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Monitor CLS (Cumulative Layout Shift)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('CLS:', entry.value)
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