#!/usr/bin/env node

/**
 * Production Environment Validation Script
 * Validates that all required environment variables are set
 * and that the application can connect to external services
 */

const { PrismaClient } = require('@prisma/client')
const https = require('https')
const http = require('http')

// Required environment variables
const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
]

// Optional but recommended variables
const RECOMMENDED_VARS = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'EMAIL_SERVER_HOST',
  'REDIS_URL'
]

class EnvironmentValidator {
  constructor() {
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

  validateEnvironmentVariables() {
    this.log('Validating environment variables...', 'info')

    // Check required variables
    for (const varName of REQUIRED_VARS) {
      if (!process.env[varName]) {
        this.errors.push(`Missing required environment variable: ${varName}`)
        this.log(`Missing required variable: ${varName}`, 'error')
      } else {
        this.passed.push(`Required variable set: ${varName}`)
        this.log(`Required variable set: ${varName}`, 'success')
      }
    }

    // Check recommended variables
    for (const varName of RECOMMENDED_VARS) {
      if (!process.env[varName]) {
        this.warnings.push(`Missing recommended environment variable: ${varName}`)
        this.log(`Missing recommended variable: ${varName}`, 'warning')
      } else {
        this.passed.push(`Recommended variable set: ${varName}`)
        this.log(`Recommended variable set: ${varName}`, 'success')
      }
    }

    // Validate NEXTAUTH_URL format
    if (process.env.NEXTAUTH_URL) {
      try {
        new URL(process.env.NEXTAUTH_URL)
        this.log('NEXTAUTH_URL format is valid', 'success')
      } catch (error) {
        this.errors.push('NEXTAUTH_URL is not a valid URL')
        this.log('NEXTAUTH_URL format is invalid', 'error')
      }
    }

    // Validate NEXTAUTH_SECRET length
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
      this.warnings.push('NEXTAUTH_SECRET should be at least 32 characters long')
      this.log('NEXTAUTH_SECRET is shorter than recommended (32+ chars)', 'warning')
    }
  }

  async validateDatabaseConnection() {
    this.log('Validating database connection...', 'info')

    if (!process.env.DATABASE_URL) {
      this.errors.push('Cannot test database connection: DATABASE_URL not set')
      return
    }

    try {
      const prisma = new PrismaClient()
      await prisma.$connect()
      await prisma.$queryRaw`SELECT 1`
      await prisma.$disconnect()
      
      this.passed.push('Database connection successful')
      this.log('Database connection successful', 'success')
    } catch (error) {
      this.errors.push(`Database connection failed: ${error.message}`)
      this.log(`Database connection failed: ${error.message}`, 'error')
    }
  }

  async validateExternalServices() {
    this.log('Validating external services...', 'info')

    // Test Redis connection if configured
    if (process.env.REDIS_URL) {
      try {
        // Simple Redis ping test would go here
        this.log('Redis URL configured (connection test skipped)', 'info')
      } catch (error) {
        this.warnings.push(`Redis connection test failed: ${error.message}`)
        this.log(`Redis connection test failed: ${error.message}`, 'warning')
      }
    }

    // Test email server if configured
    if (process.env.EMAIL_SERVER_HOST) {
      this.log('Email server configured (connection test skipped)', 'info')
    }
  }

  validateProductionSettings() {
    this.log('Validating production settings...', 'info')

    // Check NODE_ENV
    if (process.env.NODE_ENV !== 'production') {
      this.warnings.push('NODE_ENV is not set to "production"')
      this.log('NODE_ENV is not set to "production"', 'warning')
    } else {
      this.log('NODE_ENV is set to production', 'success')
    }

    // Check if running on default port in production
    if (process.env.NODE_ENV === 'production' && process.env.PORT === '3000') {
      this.warnings.push('Using default port 3000 in production')
      this.log('Using default port 3000 in production', 'warning')
    }

    // Check for development dependencies in production
    if (process.env.NODE_ENV === 'production') {
      try {
        require('nodemon')
        this.warnings.push('Development dependencies detected in production')
        this.log('Development dependencies detected in production', 'warning')
      } catch {
        this.log('No development dependencies in production', 'success')
      }
    }
  }

  async validateHealthEndpoint() {
    this.log('Validating health endpoint...', 'info')

    if (!process.env.NEXTAUTH_URL) {
      this.warnings.push('Cannot test health endpoint: NEXTAUTH_URL not set')
      return
    }

    return new Promise((resolve) => {
      const url = new URL('/api/health', process.env.NEXTAUTH_URL)
      const client = url.protocol === 'https:' ? https : http

      const req = client.get(url, (res) => {
        if (res.statusCode === 200) {
          this.passed.push('Health endpoint is accessible')
          this.log('Health endpoint is accessible', 'success')
        } else {
          this.warnings.push(`Health endpoint returned status ${res.statusCode}`)
          this.log(`Health endpoint returned status ${res.statusCode}`, 'warning')
        }
        resolve()
      })

      req.on('error', (error) => {
        this.warnings.push(`Health endpoint test failed: ${error.message}`)
        this.log(`Health endpoint test failed: ${error.message}`, 'warning')
        resolve()
      })

      req.setTimeout(5000, () => {
        req.destroy()
        this.warnings.push('Health endpoint test timed out')
        this.log('Health endpoint test timed out', 'warning')
        resolve()
      })
    })
  }

  printSummary() {
    console.log('\n' + '='.repeat(50))
    this.log('VALIDATION SUMMARY', 'info')
    console.log('='.repeat(50))

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

    console.log('\n' + '='.repeat(50))

    if (this.errors.length === 0) {
      this.log('Environment validation completed successfully!', 'success')
      if (this.warnings.length > 0) {
        this.log('Please review the warnings above.', 'warning')
      }
      return true
    } else {
      this.log('Environment validation failed!', 'error')
      this.log('Please fix the errors above before deploying.', 'error')
      return false
    }
  }

  async run() {
    this.log('Starting environment validation...', 'info')
    console.log('='.repeat(50))

    this.validateEnvironmentVariables()
    await this.validateDatabaseConnection()
    await this.validateExternalServices()
    this.validateProductionSettings()
    
    // Skip health endpoint test if app is not running
    // await this.validateHealthEndpoint()

    const success = this.printSummary()
    process.exit(success ? 0 : 1)
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new EnvironmentValidator()
  validator.run().catch(error => {
    console.error('Validation failed with error:', error)
    process.exit(1)
  })
}

module.exports = EnvironmentValidator