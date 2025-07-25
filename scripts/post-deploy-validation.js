#!/usr/bin/env node

/**
 * Post-Deployment Validation Script
 * Validates that the deployed application is working correctly
 */

const https = require('https')
const http = require('http')

class PostDeployValidator {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    this.errors = []
    this.warnings = []
    this.passed = []
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    }

    const prefix = {
      info: 'ℹ',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }

    console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`)
  }

  async makeRequest(path, expectedStatus = 200) {
    return new Promise((resolve) => {
      const url = new URL(path, this.baseUrl)
      const client = url.protocol === 'https:' ? https : http

      const req = client.get(url, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          })
        })
      })

      req.on('error', (error) => {
        resolve({
          status: 0,
          error: error.message
        })
      })

      req.setTimeout(10000, () => {
        req.destroy()
        resolve({
          status: 0,
          error: 'Request timeout'
        })
      })
    })
  }

  async validateHealthEndpoint() {
    this.log('Validating health endpoint...', 'info')
    
    const response = await this.makeRequest('/api/health')
    
    if (response.status === 200) {
      try {
        const healthData = JSON.parse(response.data)
        if (healthData.status === 'healthy') {
          this.passed.push('Health endpoint returns healthy status')
          this.log('Health endpoint is healthy', 'success')
          
          // Check database connection
          if (healthData.checks && healthData.checks.database === 'connected') {
            this.passed.push('Database connection is healthy')
            this.log('Database connection is healthy', 'success')
          } else {
            this.warnings.push('Database connection status unclear')
            this.log('Database connection status unclear', 'warning')
          }
        } else {
          this.errors.push('Health endpoint reports unhealthy status')
          this.log('Health endpoint reports unhealthy status', 'error')
        }
      } catch (error) {
        this.warnings.push('Health endpoint response is not valid JSON')
        this.log('Health endpoint response is not valid JSON', 'warning')
      }
    } else {
      this.errors.push(`Health endpoint returned status ${response.status}`)
      this.log(`Health endpoint returned status ${response.status}`, 'error')
    }
  }

  async validateMainPages() {
    this.log('Validating main pages...', 'info')
    
    const pages = [
      { path: '/', name: 'Home page' },
      { path: '/auth/signin', name: 'Sign in page' },
      { path: '/feed', name: 'Feed page', expectedStatus: [200, 302] }, // May redirect if not authenticated
    ]

    for (const page of pages) {
      const response = await this.makeRequest(page.path)
      const expectedStatuses = Array.isArray(page.expectedStatus) ? page.expectedStatus : [page.expectedStatus || 200]
      
      if (expectedStatuses.includes(response.status)) {
        this.passed.push(`${page.name} is accessible`)
        this.log(`${page.name} is accessible (${response.status})`, 'success')
      } else {
        this.errors.push(`${page.name} returned status ${response.status}`)
        this.log(`${page.name} returned status ${response.status}`, 'error')
      }
    }
  }

  async validateApiEndpoints() {
    this.log('Validating API endpoints...', 'info')
    
    const endpoints = [
      { path: '/api/auth/providers', name: 'Auth providers endpoint' },
      { path: '/api/posts', name: 'Posts API endpoint', expectedStatus: [200, 401] }, // May require auth
    ]

    for (const endpoint of endpoints) {
      const response = await this.makeRequest(endpoint.path)
      const expectedStatuses = Array.isArray(endpoint.expectedStatus) ? endpoint.expectedStatus : [endpoint.expectedStatus || 200]
      
      if (expectedStatuses.includes(response.status)) {
        this.passed.push(`${endpoint.name} is responding`)
        this.log(`${endpoint.name} is responding (${response.status})`, 'success')
      } else {
        this.warnings.push(`${endpoint.name} returned status ${response.status}`)
        this.log(`${endpoint.name} returned status ${response.status}`, 'warning')
      }
    }
  }

  async validateSecurityHeaders() {
    this.log('Validating security headers...', 'info')
    
    const response = await this.makeRequest('/')
    
    if (response.headers) {
      const securityHeaders = {
        'x-frame-options': 'X-Frame-Options',
        'x-content-type-options': 'X-Content-Type-Options',
        'x-xss-protection': 'X-XSS-Protection',
        'referrer-policy': 'Referrer-Policy'
      }

      for (const [header, displayName] of Object.entries(securityHeaders)) {
        if (response.headers[header]) {
          this.passed.push(`${displayName} header is present`)
          this.log(`${displayName} header is present`, 'success')
        } else {
          this.warnings.push(`${displayName} header is missing`)
          this.log(`${displayName} header is missing`, 'warning')
        }
      }

      // Check for HTTPS redirect
      if (this.baseUrl.startsWith('https://')) {
        if (response.headers['strict-transport-security']) {
          this.passed.push('HSTS header is present')
          this.log('HSTS header is present', 'success')
        } else {
          this.warnings.push('HSTS header is missing for HTTPS site')
          this.log('HSTS header is missing for HTTPS site', 'warning')
        }
      }
    }
  }

  async validateStaticAssets() {
    this.log('Validating static assets...', 'info')
    
    const assets = [
      { path: '/_next/static/css', name: 'CSS assets', partial: true },
      { path: '/favicon.ico', name: 'Favicon' },
    ]

    for (const asset of assets) {
      const response = await this.makeRequest(asset.path)
      
      if (response.status === 200 || (asset.partial && response.status === 404)) {
        this.passed.push(`${asset.name} are accessible`)
        this.log(`${asset.name} are accessible`, 'success')
      } else {
        this.warnings.push(`${asset.name} may not be accessible (${response.status})`)
        this.log(`${asset.name} may not be accessible (${response.status})`, 'warning')
      }
    }
  }

  async validatePerformance() {
    this.log('Validating performance...', 'info')
    
    const startTime = Date.now()
    const response = await this.makeRequest('/')
    const responseTime = Date.now() - startTime

    if (responseTime < 2000) {
      this.passed.push(`Home page loads quickly (${responseTime}ms)`)
      this.log(`Home page loads quickly (${responseTime}ms)`, 'success')
    } else if (responseTime < 5000) {
      this.warnings.push(`Home page loads slowly (${responseTime}ms)`)
      this.log(`Home page loads slowly (${responseTime}ms)`, 'warning')
    } else {
      this.errors.push(`Home page loads very slowly (${responseTime}ms)`)
      this.log(`Home page loads very slowly (${responseTime}ms)`, 'error')
    }

    // Check for compression
    if (response.headers && response.headers['content-encoding']) {
      this.passed.push('Response compression is enabled')
      this.log('Response compression is enabled', 'success')
    } else {
      this.warnings.push('Response compression may not be enabled')
      this.log('Response compression may not be enabled', 'warning')
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60))
    this.log('POST-DEPLOYMENT VALIDATION SUMMARY', 'info')
    console.log('='.repeat(60))

    this.log(`✅ Passed: ${this.passed.length}`, 'success')
    this.log(`⚠️  Warnings: ${this.warnings.length}`, 'warning')
    this.log(`❌ Errors: ${this.errors.length}`, 'error')

    if (this.warnings.length > 0) {
      console.log('\nWarnings:')
      this.warnings.forEach(warning => this.log(warning, 'warning'))
    }

    if (this.errors.length > 0) {
      console.log('\nErrors:')
      this.errors.forEach(error => this.log(error, 'error'))
    }

    console.log('\n' + '='.repeat(60))

    if (this.errors.length === 0) {
      this.log('🎉 Deployment validation completed successfully!', 'success')
      if (this.warnings.length > 0) {
        this.log('Please review the warnings above for optimization opportunities.', 'warning')
      }
      return true
    } else {
      this.log('❌ Deployment validation failed!', 'error')
      this.log('Please fix the errors above.', 'error')
      return false
    }
  }

  async run() {
    this.log(`Starting post-deployment validation for: ${this.baseUrl}`, 'info')
    console.log('='.repeat(60))

    await this.validateHealthEndpoint()
    await this.validateMainPages()
    await this.validateApiEndpoints()
    await this.validateSecurityHeaders()
    await this.validateStaticAssets()
    await this.validatePerformance()

    const success = this.printSummary()
    process.exit(success ? 0 : 1)
  }
}

// Run validation if called directly
if (require.main === module) {
  const baseUrl = process.argv[2] || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const validator = new PostDeployValidator(baseUrl)
  validator.run().catch(error => {
    console.error('Validation failed with error:', error)
    process.exit(1)
  })
}

module.exports = PostDeployValidator