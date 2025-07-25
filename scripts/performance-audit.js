#!/usr/bin/env node

/**
 * Performance Audit Script
 * Validates performance optimizations and identifies potential issues
 */

const fs = require('fs')
const path = require('path')

class PerformanceAuditor {
  constructor() {
    this.errors = []
    this.warnings = []
    this.passed = []
    this.suggestions = []
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      suggestion: '\x1b[35m', // Magenta
      reset: '\x1b[0m'     // Reset
    }

    const prefix = {
      info: 'ℹ',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      suggestion: '💡'
    }

    console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`)
  }

  checkFileExists(filePath) {
    const fullPath = path.join(process.cwd(), filePath)
    return fs.existsSync(fullPath)
  }

  checkFileContent(filePath, patterns) {
    try {
      const fullPath = path.join(process.cwd(), filePath)
      if (!fs.existsSync(fullPath)) return false
      
      const content = fs.readFileSync(fullPath, 'utf8')
      return patterns.every(pattern => {
        if (typeof pattern === 'string') {
          return content.includes(pattern)
        } else if (pattern instanceof RegExp) {
          return pattern.test(content)
        }
        return false
      })
    } catch (error) {
      return false
    }
  }

  getFileSize(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath)
      if (!fs.existsSync(fullPath)) return 0
      const stats = fs.statSync(fullPath)
      return stats.size
    } catch (error) {
      return 0
    }
  }

  countLinesInFile(filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath)
      if (!fs.existsSync(fullPath)) return 0
      const content = fs.readFileSync(fullPath, 'utf8')
      return content.split('\n').length
    } catch (error) {
      return 0
    }
  }

  auditNextJsConfiguration() {
    this.log('Auditing Next.js Configuration', 'info')
    
    const configFile = 'next.config.js'
    if (!this.checkFileExists(configFile)) {
      this.errors.push('Next.js configuration file missing')
      return
    }

    // Check for performance optimizations
    const optimizations = [
      { pattern: 'compress: true', name: 'Compression enabled' },
      { pattern: 'optimizeCss', name: 'CSS optimization' },
      { pattern: 'optimizePackageImports', name: 'Package import optimization' },
      { pattern: 'images:', name: 'Image optimization configuration' },
      { pattern: 'experimental:', name: 'Experimental features' }
    ]

    optimizations.forEach(opt => {
      if (this.checkFileContent(configFile, [opt.pattern])) {
        this.passed.push(`✓ ${opt.name} configured`)
      } else {
        this.warnings.push(`⚠ ${opt.name} not configured`)
      }
    })

    // Check for bundle optimization
    if (this.checkFileContent(configFile, ['splitChunks', 'optimization'])) {
      this.passed.push('✓ Bundle splitting configured')
    } else {
      this.suggestions.push('💡 Consider implementing bundle splitting for better performance')
    }

    // Check for security headers
    if (this.checkFileContent(configFile, ['headers', 'X-Frame-Options'])) {
      this.passed.push('✓ Security headers configured')
    } else {
      this.warnings.push('⚠ Security headers not configured')
    }
  }

  auditImageOptimization() {
    this.log('Auditing Image Optimization', 'info')
    
    // Check for Next.js Image component usage
    const componentFiles = this.findFiles('src/components', '.tsx')
    let imageComponentUsage = 0
    let regularImgUsage = 0

    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8')
      if (content.includes('next/image') || content.includes('Image from')) {
        imageComponentUsage++
      }
      if (content.match(/<img\s/g)) {
        regularImgUsage++
      }
    })

    if (imageComponentUsage > 0) {
      this.passed.push(`✓ Next.js Image component used in ${imageComponentUsage} files`)
    } else {
      this.warnings.push('⚠ Next.js Image component not found in components')
    }

    if (regularImgUsage > 0) {
      this.warnings.push(`⚠ Regular <img> tags found in ${regularImgUsage} files - consider using Next.js Image`)
    }

    // Check for Cloudinary integration
    if (this.checkFileContent('package.json', ['cloudinary'])) {
      this.passed.push('✓ Cloudinary integration for image optimization')
    } else {
      this.suggestions.push('💡 Consider using Cloudinary for advanced image optimization')
    }

    // Check for optimized image component
    if (this.checkFileExists('src/components/ui/optimized-image.tsx')) {
      this.passed.push('✓ Custom optimized image component found')
    } else {
      this.suggestions.push('💡 Consider creating a custom optimized image component')
    }
  }

  auditBundleSize() {
    this.log('Auditing Bundle Size', 'info')
    
    // Check for large files that might impact bundle size
    const jsFiles = this.findFiles('src', '.ts', '.tsx', '.js', '.jsx')
    const largeFiles = []
    
    jsFiles.forEach(file => {
      const size = this.getFileSize(file)
      const lines = this.countLinesInFile(file)
      
      if (size > 50000) { // 50KB
        largeFiles.push({ file: path.relative(process.cwd(), file), size, lines })
      }
    })

    if (largeFiles.length > 0) {
      this.warnings.push(`⚠ Large files found that may impact bundle size:`)
      largeFiles.forEach(({ file, size, lines }) => {
        this.warnings.push(`  - ${file}: ${Math.round(size/1024)}KB (${lines} lines)`)
      })
      this.suggestions.push('💡 Consider code splitting for large components')
    } else {
      this.passed.push('✓ No excessively large files found')
    }

    // Check for dynamic imports
    const dynamicImports = jsFiles.filter(file => 
      this.checkFileContent(file, ['dynamic(', 'import('])
    )

    // Check for dedicated dynamic imports file
    if (this.checkFileExists('src/components/dynamic-imports.tsx')) {
      this.passed.push('✓ Dedicated dynamic imports configuration found')
    }

    if (dynamicImports.length > 0) {
      this.passed.push(`✓ Dynamic imports found in ${dynamicImports.length} files`)
    } else {
      this.suggestions.push('💡 Consider using dynamic imports for code splitting')
    }

    // Check for tree shaking optimization
    if (this.checkFileContent('next.config.js', ['sideEffects: false', 'usedExports: true'])) {
      this.passed.push('✓ Tree shaking optimization configured')
    } else {
      this.suggestions.push('💡 Configure tree shaking for better bundle optimization')
    }
  }

  auditDatabaseOptimization() {
    this.log('Auditing Database Optimization', 'info')
    
    const schemaFile = 'prisma/schema.prisma'
    if (!this.checkFileExists(schemaFile)) {
      this.errors.push('Prisma schema file missing')
      return
    }

    // Check for database indexes
    const content = fs.readFileSync(path.join(process.cwd(), schemaFile), 'utf8')
    const indexCount = (content.match(/@@index/g) || []).length
    const uniqueCount = (content.match(/@@unique/g) || []).length

    if (indexCount > 0) {
      this.passed.push(`✓ ${indexCount} database indexes defined`)
    } else {
      this.warnings.push('⚠ No database indexes found - may impact query performance')
    }

    if (uniqueCount > 0) {
      this.passed.push(`✓ ${uniqueCount} unique constraints defined`)
    }

    // Check for connection pooling
    if (this.checkFileExists('src/lib/prisma-pool.ts')) {
      this.passed.push('✓ Database connection pooling implemented')
    } else if (this.checkFileContent('src/lib/prisma.ts', ['connectionLimit', 'pool'])) {
      this.passed.push('✓ Database connection pooling configured')
    } else {
      this.suggestions.push('💡 Consider implementing database connection pooling')
    }

    // Check for query optimization utilities
    if (this.checkFileExists('src/lib/db-optimization.ts')) {
      this.passed.push('✓ Database optimization utilities found')
    } else {
      this.suggestions.push('💡 Consider creating database optimization utilities')
    }
  }

  auditCachingStrategy() {
    this.log('Auditing Caching Strategy', 'info')
    
    // Check for SWR usage
    if (this.checkFileContent('package.json', ['swr'])) {
      this.passed.push('✓ SWR for client-side caching')
      
      // Count SWR usage in hooks
      const hookFiles = this.findFiles('src/hooks', '.ts', '.tsx')
      const swrUsage = hookFiles.filter(file => 
        this.checkFileContent(file, ['useSWR', 'from \'swr\''])
      )
      
      if (swrUsage.length > 0) {
        this.passed.push(`✓ SWR used in ${swrUsage.length} custom hooks`)
      }
    } else {
      this.warnings.push('⚠ No client-side caching library found')
    }

    // Check for cache utilities
    if (this.checkFileExists('src/lib/cache.ts')) {
      this.passed.push('✓ Cache utilities implemented')
    }

    // Check for Redis caching implementation
    if (this.checkFileExists('src/lib/redis-cache.ts')) {
      this.passed.push('✓ Redis caching implementation found')
    } else if (this.checkFileContent('.env.example', ['REDIS_URL'])) {
      this.passed.push('✓ Redis caching configured')
    } else {
      this.suggestions.push('💡 Consider Redis for server-side caching')
    }

    // Check for Next.js caching headers
    if (this.checkFileContent('next.config.js', ['Cache-Control', 'max-age'])) {
      this.passed.push('✓ HTTP caching headers configured')
    } else {
      this.suggestions.push('💡 Configure HTTP caching headers for static assets')
    }
  }

  auditStateManagement() {
    this.log('Auditing State Management', 'info')
    
    // Check for Zustand usage
    if (this.checkFileContent('package.json', ['zustand'])) {
      this.passed.push('✓ Zustand for state management')
      
      const storeFiles = this.findFiles('src/stores', '.ts')
      if (storeFiles.length > 0) {
        this.passed.push(`✓ ${storeFiles.length} Zustand stores found`)
        
        // Check for store optimization
        const optimizedStores = storeFiles.filter(file =>
          this.checkFileContent(file, ['immer', 'devtools'])
        )
        
        if (optimizedStores.length > 0) {
          this.passed.push(`✓ ${optimizedStores.length} stores have optimization features`)
        }
      }
    } else {
      this.warnings.push('⚠ No state management library found')
    }

    // Check for unnecessary re-renders prevention
    const componentFiles = this.findFiles('src/components', '.tsx')
    const memoizedComponents = componentFiles.filter(file =>
      this.checkFileContent(file, ['React.memo', 'useMemo', 'useCallback', 'MemoizedComponent', 'memo('])
    )

    // Check for dedicated memoization file
    if (this.checkFileExists('src/components/optimized/memoized-components.tsx')) {
      this.passed.push('✓ Dedicated memoization components found')
    }

    if (memoizedComponents.length > 0) {
      this.passed.push(`✓ ${memoizedComponents.length} components use memoization`)
    } else {
      this.suggestions.push('💡 Consider using React.memo, useMemo, and useCallback to prevent unnecessary re-renders')
    }
  }

  auditLoadingStates() {
    this.log('Auditing Loading States and UX', 'info')
    
    // Check for loading components
    const loadingComponents = [
      'src/components/ui/loading-skeleton.tsx',
      'src/components/ui/loading-feed.tsx',
      'src/components/ui/loading-spinner.tsx',
      'src/components/ui/suspense-wrapper.tsx'
    ]

    let loadingComponentsFound = 0
    loadingComponents.forEach(component => {
      if (this.checkFileExists(component)) {
        loadingComponentsFound++
      }
    })

    if (loadingComponentsFound > 0) {
      this.passed.push(`✓ ${loadingComponentsFound} loading components found`)
    } else {
      this.warnings.push('⚠ No loading components found - may impact UX')
    }

    // Check for error boundaries
    const errorBoundaryFiles = [
      'src/components/ui/error-boundary.tsx',
      'src/app/layout.tsx'
    ]
    
    let errorBoundariesFound = 0
    errorBoundaryFiles.forEach(file => {
      if (this.checkFileContent(file, ['ErrorBoundary', 'componentDidCatch', 'getDerivedStateFromError'])) {
        errorBoundariesFound++
      }
    })

    if (errorBoundariesFound > 0) {
      this.passed.push(`✓ ${errorBoundariesFound} error boundaries found`)
    } else {
      this.warnings.push('⚠ No error boundaries found - may impact error handling')
    }

    // Check for suspense usage
    const componentFiles = this.findFiles('src/components', '.tsx')
    const suspenseUsage = componentFiles.filter(file =>
      this.checkFileContent(file, ['Suspense', 'fallback=', 'SuspenseWrapper'])
    )

    if (suspenseUsage.length > 0) {
      this.passed.push(`✓ Suspense used in ${suspenseUsage.length} components`)
    } else {
      this.suggestions.push('💡 Consider using React Suspense for better loading UX')
    }
  }

  auditAccessibility() {
    this.log('Auditing Accessibility Performance', 'info')
    
    // Check for semantic HTML usage
    const componentFiles = this.findFiles('src/components', '.tsx')
    const semanticElements = ['<main', '<nav', '<header', '<footer', '<section', '<article', '<aside']
    
    let semanticUsage = 0
    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8')
      semanticElements.forEach(element => {
        if (content.includes(element)) {
          semanticUsage++
        }
      })
    })

    if (semanticUsage > 0) {
      this.passed.push(`✓ Semantic HTML elements used ${semanticUsage} times`)
    } else {
      this.warnings.push('⚠ Limited semantic HTML usage found')
    }

    // Check for ARIA attributes
    const ariaUsage = componentFiles.filter(file =>
      this.checkFileContent(file, ['aria-', 'role='])
    )

    if (ariaUsage.length > 0) {
      this.passed.push(`✓ ARIA attributes used in ${ariaUsage.length} components`)
    } else {
      this.warnings.push('⚠ Limited ARIA attribute usage found')
    }

    // Check for keyboard navigation
    const keyboardNavigation = componentFiles.filter(file =>
      this.checkFileContent(file, ['onKeyDown', 'onKeyPress', 'tabIndex'])
    )

    if (keyboardNavigation.length > 0) {
      this.passed.push(`✓ Keyboard navigation implemented in ${keyboardNavigation.length} components`)
    } else {
      this.suggestions.push('💡 Consider implementing keyboard navigation for better accessibility')
    }
  }

  auditSEOOptimization() {
    this.log('Auditing SEO Optimization', 'info')
    
    // Check for metadata API usage
    const pageFiles = this.findFiles('src/app', 'page.tsx', 'layout.tsx')
    const metadataUsage = pageFiles.filter(file =>
      this.checkFileContent(file, ['metadata', 'generateMetadata', 'title:', 'description:', 'openGraph', 'twitter'])
    )

    if (metadataUsage.length > 0) {
      this.passed.push(`✓ Metadata configured in ${metadataUsage.length} pages`)
    } else {
      this.warnings.push('⚠ Limited metadata configuration found')
    }

    // Check for enhanced metadata in layout
    if (this.checkFileContent('src/app/layout.tsx', ['openGraph', 'twitter', 'keywords', 'authors'])) {
      this.passed.push('✓ Enhanced metadata configuration found')
    }

    // Check for structured data
    const structuredData = pageFiles.filter(file =>
      this.checkFileContent(file, ['application/ld+json', 'schema.org'])
    )

    if (structuredData.length > 0) {
      this.passed.push(`✓ Structured data found in ${structuredData.length} pages`)
    } else {
      this.suggestions.push('💡 Consider adding structured data for better SEO')
    }

    // Check for sitemap
    if (this.checkFileExists('src/app/sitemap.ts') || this.checkFileExists('public/sitemap.xml')) {
      this.passed.push('✓ Sitemap configuration found')
    } else {
      this.suggestions.push('💡 Consider adding a sitemap for better SEO')
    }

    // Check for robots.txt
    if (this.checkFileExists('src/app/robots.ts') || this.checkFileExists('public/robots.txt')) {
      this.passed.push('✓ Robots.txt configuration found')
    } else {
      this.suggestions.push('💡 Consider adding robots.txt for better SEO')
    }
  }

  findFiles(directory, ...extensions) {
    const files = []
    
    const scanDirectory = (dir) => {
      try {
        const items = fs.readdirSync(dir)
        items.forEach(item => {
          const fullPath = path.join(dir, item)
          const stat = fs.statSync(fullPath)
          
          if (stat.isDirectory()) {
            scanDirectory(fullPath)
          } else if (extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath)
          }
        })
      } catch (error) {
        // Directory doesn't exist or can't be read
      }
    }
    
    const fullDirectory = path.join(process.cwd(), directory)
    if (fs.existsSync(fullDirectory)) {
      scanDirectory(fullDirectory)
    }
    
    return files
  }

  printSummary() {
    console.log('\n' + '='.repeat(70))
    this.log('PERFORMANCE AUDIT SUMMARY', 'info')
    console.log('='.repeat(70))

    this.log(`✅ Optimizations Found: ${this.passed.length}`, 'success')
    this.log(`⚠️  Warnings: ${this.warnings.length}`, 'warning')
    this.log(`❌ Critical Issues: ${this.errors.length}`, 'error')
    this.log(`💡 Suggestions: ${this.suggestions.length}`, 'suggestion')

    if (this.warnings.length > 0) {
      console.log('\nWarnings:')
      this.warnings.forEach(warning => this.log(warning, 'warning'))
    }

    if (this.errors.length > 0) {
      console.log('\nCritical Issues:')
      this.errors.forEach(error => this.log(error, 'error'))
    }

    if (this.suggestions.length > 0) {
      console.log('\nSuggestions for Improvement:')
      this.suggestions.forEach(suggestion => this.log(suggestion, 'suggestion'))
    }

    console.log('\n' + '='.repeat(70))

    const score = Math.round((this.passed.length / (this.passed.length + this.warnings.length + this.errors.length)) * 100)
    
    if (this.errors.length === 0) {
      this.log(`🎉 Performance audit completed! Score: ${score}%`, 'success')
      if (this.warnings.length === 0 && this.suggestions.length === 0) {
        this.log('Excellent! No issues found.', 'success')
      } else {
        this.log('Consider addressing warnings and suggestions for optimal performance.', 'info')
      }
      return true
    } else {
      this.log(`❌ Performance audit failed! Score: ${score}%`, 'error')
      this.log('Please fix critical issues before deployment.', 'error')
      return false
    }
  }

  async run() {
    this.log('Starting comprehensive performance audit...', 'info')
    console.log('='.repeat(70))

    this.auditNextJsConfiguration()
    this.auditImageOptimization()
    this.auditBundleSize()
    this.auditDatabaseOptimization()
    this.auditCachingStrategy()
    this.auditStateManagement()
    this.auditLoadingStates()
    this.auditAccessibility()
    this.auditSEOOptimization()

    const success = this.printSummary()
    process.exit(success ? 0 : 1)
  }
}

// Run audit if called directly
if (require.main === module) {
  const auditor = new PerformanceAuditor()
  auditor.run().catch(error => {
    console.error('Performance audit failed with error:', error)
    process.exit(1)
  })
}

module.exports = PerformanceAuditor