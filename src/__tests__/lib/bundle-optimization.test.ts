import { 
  DynamicComponents, 
  DynamicLibraries, 
  ResourcePreloader, 
  PerformanceMonitor, 
  BundleAnalyzer 
} from '@/lib/bundle-optimization'

// Mock dynamic imports
jest.mock('next/dynamic', () => {
  return jest.fn((importFn) => {
    const MockComponent = () => 'Mocked Component'
    MockComponent.displayName = 'MockDynamicComponent'
    return MockComponent
  })
})

// Mock performance APIs
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    observer: jest.fn(),
  },
  writable: true,
})

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}))

describe('DynamicComponents', () => {
  it('should provide dynamic admin dashboard component', () => {
    const AdminDashboard = DynamicComponents.AdminDashboard
    expect(AdminDashboard).toBeDefined()
    expect(typeof AdminDashboard).toBe('function')
  })

  it('should provide dynamic content moderation component', () => {
    const ContentModeration = DynamicComponents.ContentModeration
    expect(ContentModeration).toBeDefined()
    expect(typeof ContentModeration).toBe('function')
  })

  it('should provide dynamic user management component', () => {
    const UserManagement = DynamicComponents.UserManagement
    expect(UserManagement).toBeDefined()
    expect(typeof UserManagement).toBe('function')
  })

  it('should provide dynamic profile edit component', () => {
    const ProfileEdit = DynamicComponents.ProfileEdit
    expect(ProfileEdit).toBeDefined()
    expect(typeof ProfileEdit).toBe('function')
  })

  it('should provide dynamic post composer component', () => {
    const PostComposer = DynamicComponents.PostComposer
    expect(PostComposer).toBeDefined()
    expect(typeof PostComposer).toBe('function')
  })
})

describe('DynamicLibraries', () => {
  it('should provide dynamic rich text editor', () => {
    const RichTextEditor = DynamicLibraries.RichTextEditor
    expect(RichTextEditor).toBeDefined()
    expect(typeof RichTextEditor).toBe('function')
  })

  it('should provide dynamic image cropper', () => {
    const ImageCropper = DynamicLibraries.ImageCropper
    expect(ImageCropper).toBeDefined()
    expect(typeof ImageCropper).toBe('function')
  })

  it('should provide dynamic chart library', () => {
    const Charts = DynamicLibraries.Charts
    expect(Charts).toBeDefined()
    expect(typeof Charts).toBe('function')
  })

  it('should provide dynamic date picker', () => {
    const DatePicker = DynamicLibraries.DatePicker
    expect(DatePicker).toBeDefined()
    expect(typeof DatePicker).toBe('function')
  })
})

describe('ResourcePreloader', () => {
  beforeEach(() => {
    // Clear any existing preloaded resources
    document.head.innerHTML = ''
  })

  it('should preload critical routes', () => {
    ResourcePreloader.preloadCriticalRoutes()
    
    // Check if preload links were added to document head
    const preloadLinks = document.querySelectorAll('link[rel="preload"]')
    expect(preloadLinks.length).toBeGreaterThan(0)
  })

  it('should preload route on hover', () => {
    const mockImport = jest.fn(() => Promise.resolve({ default: () => 'Component' }))
    const hoverProps = ResourcePreloader.preloadOnHover(mockImport)
    
    expect(hoverProps).toHaveProperty('onMouseEnter')
    expect(typeof hoverProps.onMouseEnter).toBe('function')
    
    // Simulate hover
    hoverProps.onMouseEnter()
    expect(mockImport).toHaveBeenCalled()
  })

  it('should preload based on user role', () => {
    ResourcePreloader.preloadByRole('ADMIN')
    
    // Check if admin-specific resources were preloaded
    const preloadLinks = document.querySelectorAll('link[rel="preload"]')
    const adminLinks = Array.from(preloadLinks).some(link => 
      link.getAttribute('href')?.includes('admin')
    )
    expect(adminLinks).toBe(true)
  })

  it('should not preload for regular users', () => {
    ResourcePreloader.preloadByRole('USER')
    
    // Check that admin resources are not preloaded
    const preloadLinks = document.querySelectorAll('link[rel="preload"]')
    const adminLinks = Array.from(preloadLinks).some(link => 
      link.getAttribute('href')?.includes('admin')
    )
    expect(adminLinks).toBe(false)
  })

  it('should handle preload errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const mockImport = jest.fn(() => Promise.reject(new Error('Import failed')))
    
    const hoverProps = ResourcePreloader.preloadOnHover(mockImport)
    hoverProps.onMouseEnter()
    
    // Should not throw error
    expect(() => hoverProps.onMouseEnter()).not.toThrow()
    
    consoleSpy.mockRestore()
  })
})

describe('PerformanceMonitor', () => {
  let mockObserver: jest.Mock

  beforeEach(() => {
    mockObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }))
    global.PerformanceObserver = mockObserver
  })

  it('should monitor web vitals', () => {
    PerformanceMonitor.monitorWebVitals()
    
    expect(mockObserver).toHaveBeenCalled()
    const observerInstance = mockObserver.mock.results[0].value
    expect(observerInstance.observe).toHaveBeenCalled()
  })

  it('should monitor resource loading', () => {
    PerformanceMonitor.monitorResourceLoading()
    
    expect(mockObserver).toHaveBeenCalled()
  })

  it('should track navigation timing', () => {
    const timing = PerformanceMonitor.getNavigationTiming()
    
    expect(timing).toHaveProperty('loadTime')
    expect(timing).toHaveProperty('domContentLoaded')
    expect(timing).toHaveProperty('firstPaint')
    expect(timing).toHaveProperty('firstContentfulPaint')
  })

  it('should get performance metrics', () => {
    const metrics = PerformanceMonitor.getPerformanceMetrics()
    
    expect(metrics).toHaveProperty('navigation')
    expect(metrics).toHaveProperty('resources')
    expect(metrics).toHaveProperty('vitals')
  })

  it('should handle missing performance API gracefully', () => {
    const originalPerformance = window.performance
    // @ts-ignore
    delete window.performance
    
    expect(() => PerformanceMonitor.getNavigationTiming()).not.toThrow()
    
    window.performance = originalPerformance
  })
})

describe('BundleAnalyzer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset component load times
    BundleAnalyzer['componentLoadTimes'] = new Map()
  })

  it('should track component load time', () => {
    const componentName = 'TestComponent'
    const trackLoad = BundleAnalyzer.trackComponentLoad(componentName)
    
    // Simulate some loading time
    setTimeout(() => {
      trackLoad()
      
      const loadTimes = BundleAnalyzer.getComponentLoadTimes()
      expect(loadTimes.has(componentName)).toBe(true)
      expect(loadTimes.get(componentName)).toBeGreaterThan(0)
    }, 10)
  })

  it('should get bundle size estimates', () => {
    const estimates = BundleAnalyzer.getBundleSizeEstimates()
    
    expect(estimates).toHaveProperty('main')
    expect(estimates).toHaveProperty('admin')
    expect(estimates).toHaveProperty('vendor')
    expect(estimates).toHaveProperty('total')
    
    expect(typeof estimates.main).toBe('number')
    expect(typeof estimates.admin).toBe('number')
    expect(typeof estimates.vendor).toBe('number')
    expect(typeof estimates.total).toBe('number')
  })

  it('should analyze chunk loading', () => {
    const analysis = BundleAnalyzer.analyzeChunkLoading()
    
    expect(analysis).toHaveProperty('loadedChunks')
    expect(analysis).toHaveProperty('failedChunks')
    expect(analysis).toHaveProperty('loadTimes')
    
    expect(Array.isArray(analysis.loadedChunks)).toBe(true)
    expect(Array.isArray(analysis.failedChunks)).toBe(true)
    expect(typeof analysis.loadTimes).toBe('object')
  })

  it('should get performance recommendations', () => {
    const recommendations = BundleAnalyzer.getPerformanceRecommendations()
    
    expect(Array.isArray(recommendations)).toBe(true)
    
    recommendations.forEach(rec => {
      expect(rec).toHaveProperty('type')
      expect(rec).toHaveProperty('message')
      expect(rec).toHaveProperty('priority')
      expect(['high', 'medium', 'low']).toContain(rec.priority)
    })
  })

  it('should track multiple component loads', () => {
    const components = ['ComponentA', 'ComponentB', 'ComponentC']
    const trackers = components.map(name => BundleAnalyzer.trackComponentLoad(name))
    
    // Complete all loads
    trackers.forEach(tracker => tracker())
    
    const loadTimes = BundleAnalyzer.getComponentLoadTimes()
    components.forEach(name => {
      expect(loadTimes.has(name)).toBe(true)
    })
  })

  it('should calculate average load times', () => {
    const componentName = 'TestComponent'
    
    // Track multiple loads
    for (let i = 0; i < 3; i++) {
      const tracker = BundleAnalyzer.trackComponentLoad(componentName)
      tracker()
    }
    
    const stats = BundleAnalyzer.getLoadTimeStats(componentName)
    expect(stats).toHaveProperty('average')
    expect(stats).toHaveProperty('min')
    expect(stats).toHaveProperty('max')
    expect(stats).toHaveProperty('count')
    expect(stats.count).toBe(3)
  })

  it('should return null for non-existent component stats', () => {
    const stats = BundleAnalyzer.getLoadTimeStats('NonExistentComponent')
    expect(stats).toBeNull()
  })
})

describe('Performance Integration', () => {
  it('should work together for comprehensive monitoring', () => {
    // Start monitoring
    PerformanceMonitor.monitorWebVitals()
    PerformanceMonitor.monitorResourceLoading()
    
    // Track component loading
    const tracker = BundleAnalyzer.trackComponentLoad('IntegrationTest')
    tracker()
    
    // Preload resources
    ResourcePreloader.preloadCriticalRoutes()
    
    // Get comprehensive metrics
    const performanceMetrics = PerformanceMonitor.getPerformanceMetrics()
    const bundleAnalysis = BundleAnalyzer.analyzeChunkLoading()
    const loadTimes = BundleAnalyzer.getComponentLoadTimes()
    
    expect(performanceMetrics).toBeDefined()
    expect(bundleAnalysis).toBeDefined()
    expect(loadTimes.size).toBeGreaterThan(0)
  })

  it('should handle errors in monitoring gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    // Simulate error conditions
    const originalPerformanceObserver = global.PerformanceObserver
    global.PerformanceObserver = jest.fn().mockImplementation(() => {
      throw new Error('Observer error')
    })
    
    expect(() => PerformanceMonitor.monitorWebVitals()).not.toThrow()
    
    global.PerformanceObserver = originalPerformanceObserver
    consoleSpy.mockRestore()
  })
})
