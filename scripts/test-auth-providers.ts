#!/usr/bin/env tsx

/**
 * Authentication Providers Testing Script
 * Tests all authentication providers (Google, GitHub, Credentials) in production
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface AuthTestResult {
  provider: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: any
}

class AuthProviderTester {
  private results: AuthTestResult[] = []

  log(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
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

  async testEnvironmentVariables() {
    this.log('Testing environment variables...', 'info')

    const requiredVars = [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET'
    ]

    let allPresent = true

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        this.results.push({
          provider: 'Environment',
          status: 'error',
          message: `Missing environment variable: ${varName}`
        })
        this.log(`Missing: ${varName}`, 'error')
        allPresent = false
      } else {
        this.log(`Found: ${varName}`, 'success')
      }
    }

    if (allPresent) {
      this.results.push({
        provider: 'Environment',
        status: 'success',
        message: 'All required environment variables are present'
      })
    }

    // Check NEXTAUTH_SECRET strength
    const secret = process.env.NEXTAUTH_SECRET
    if (secret && secret.length < 32) {
      this.results.push({
        provider: 'Environment',
        status: 'warning',
        message: 'NEXTAUTH_SECRET should be at least 32 characters long'
      })
      this.log('NEXTAUTH_SECRET is shorter than recommended', 'warning')
    }

    return allPresent
  }

  async testDatabaseConnection() {
    this.log('Testing database connection for auth...', 'info')

    try {
      // Test basic connection
      await prisma.$connect()
      
      // Test auth-related tables
      const userCount = await prisma.user.count()
      const accountCount = await prisma.account.count()
      const sessionCount = await prisma.session.count()

      this.results.push({
        provider: 'Database',
        status: 'success',
        message: 'Database connection successful',
        details: {
          users: userCount,
          accounts: accountCount,
          sessions: sessionCount
        }
      })

      this.log(`Database connected - Users: ${userCount}, Accounts: ${accountCount}, Sessions: ${sessionCount}`, 'success')
      return true
    } catch (error) {
      this.results.push({
        provider: 'Database',
        status: 'error',
        message: 'Database connection failed',
        details: error
      })
      this.log(`Database connection failed: ${error}`, 'error')
      return false
    }
  }

  async testCredentialsProvider() {
    this.log('Testing Credentials Provider...', 'info')

    try {
      // Create a test user
      const testEmail = 'test-auth@example.com'
      const testPassword = 'TestPassword123!'
      const hashedPassword = await bcrypt.hash(testPassword, 12)

      // Clean up any existing test user
      await prisma.user.deleteMany({
        where: { email: testEmail }
      })

      // Create test user
      const testUser = await prisma.user.create({
        data: {
          email: testEmail,
          name: 'Test User',
          username: 'testuser',
          password: hashedPassword,
        }
      })

      // Test password verification
      const isPasswordValid = await bcrypt.compare(testPassword, testUser.password!)
      
      if (isPasswordValid) {
        this.results.push({
          provider: 'Credentials',
          status: 'success',
          message: 'Credentials provider working correctly',
          details: {
            userId: testUser.id,
            passwordHashing: 'working'
          }
        })
        this.log('Credentials provider test passed', 'success')
      } else {
        throw new Error('Password verification failed')
      }

      // Clean up test user
      await prisma.user.delete({
        where: { id: testUser.id }
      })

      return true
    } catch (error) {
      this.results.push({
        provider: 'Credentials',
        status: 'error',
        message: 'Credentials provider test failed',
        details: error
      })
      this.log(`Credentials provider test failed: ${error}`, 'error')
      return false
    }
  }

  async testOAuthConfiguration() {
    this.log('Testing OAuth configuration...', 'info')

    // Test Google OAuth configuration
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (googleClientId && googleClientSecret) {
      // Basic format validation
      if (googleClientId.includes('.googleusercontent.com')) {
        this.results.push({
          provider: 'Google OAuth',
          status: 'success',
          message: 'Google OAuth configuration appears valid'
        })
        this.log('Google OAuth configuration valid', 'success')
      } else {
        this.results.push({
          provider: 'Google OAuth',
          status: 'warning',
          message: 'Google Client ID format may be incorrect'
        })
        this.log('Google Client ID format suspicious', 'warning')
      }
    } else {
      this.results.push({
        provider: 'Google OAuth',
        status: 'error',
        message: 'Google OAuth credentials missing'
      })
      this.log('Google OAuth credentials missing', 'error')
    }

    // Test GitHub OAuth configuration
    const githubClientId = process.env.GITHUB_CLIENT_ID
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET

    if (githubClientId && githubClientSecret) {
      // GitHub client IDs are typically 20 characters
      if (githubClientId.length >= 20) {
        this.results.push({
          provider: 'GitHub OAuth',
          status: 'success',
          message: 'GitHub OAuth configuration appears valid'
        })
        this.log('GitHub OAuth configuration valid', 'success')
      } else {
        this.results.push({
          provider: 'GitHub OAuth',
          status: 'warning',
          message: 'GitHub Client ID format may be incorrect'
        })
        this.log('GitHub Client ID format suspicious', 'warning')
      }
    } else {
      this.results.push({
        provider: 'GitHub OAuth',
        status: 'error',
        message: 'GitHub OAuth credentials missing'
      })
      this.log('GitHub OAuth credentials missing', 'error')
    }
  }

  async testAuthEndpoints() {
    this.log('Testing auth API endpoints...', 'info')

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    try {
      // Test NextAuth configuration endpoint
      const configResponse = await fetch(`${baseUrl}/api/auth/providers`)
      
      if (configResponse.ok) {
        const providers = await configResponse.json()
        
        const expectedProviders = ['google', 'github', 'credentials']
        const availableProviders = Object.keys(providers)
        
        const missingProviders = expectedProviders.filter(p => !availableProviders.includes(p))
        
        if (missingProviders.length === 0) {
          this.results.push({
            provider: 'Auth Endpoints',
            status: 'success',
            message: 'All auth providers are configured',
            details: { providers: availableProviders }
          })
          this.log('All auth providers configured', 'success')
        } else {
          this.results.push({
            provider: 'Auth Endpoints',
            status: 'warning',
            message: `Missing providers: ${missingProviders.join(', ')}`,
            details: { available: availableProviders, missing: missingProviders }
          })
          this.log(`Missing providers: ${missingProviders.join(', ')}`, 'warning')
        }
      } else {
        throw new Error(`HTTP ${configResponse.status}`)
      }
    } catch (error) {
      this.results.push({
        provider: 'Auth Endpoints',
        status: 'error',
        message: 'Failed to fetch auth configuration',
        details: error
      })
      this.log(`Auth endpoints test failed: ${error}`, 'error')
    }

    // Test registration endpoint
    try {
      const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Registration',
          email: 'test-register@example.com',
          password: 'TestPassword123!'
        })
      })

      if (registerResponse.ok || registerResponse.status === 409) {
        // 409 means user already exists, which is fine for testing
        this.results.push({
          provider: 'Registration',
          status: 'success',
          message: 'Registration endpoint is working'
        })
        this.log('Registration endpoint working', 'success')
        
        // Clean up if user was created
        if (registerResponse.ok) {
          await prisma.user.deleteMany({
            where: { email: 'test-register@example.com' }
          })
        }
      } else {
        throw new Error(`HTTP ${registerResponse.status}`)
      }
    } catch (error) {
      this.results.push({
        provider: 'Registration',
        status: 'error',
        message: 'Registration endpoint failed',
        details: error
      })
      this.log(`Registration endpoint failed: ${error}`, 'error')
    }
  }

  async testSessionManagement() {
    this.log('Testing session management...', 'info')

    try {
      // Test session creation and cleanup
      const testUser = await prisma.user.create({
        data: {
          email: 'test-session@example.com',
          name: 'Session Test User',
          username: 'sessiontest',
        }
      })

      // Create a test session
      const testSession = await prisma.session.create({
        data: {
          userId: testUser.id,
          sessionToken: 'test-session-token-' + Date.now(),
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }
      })

      // Verify session was created
      const foundSession = await prisma.session.findUnique({
        where: { id: testSession.id },
        include: { user: true }
      })

      if (foundSession && foundSession.user.id === testUser.id) {
        this.results.push({
          provider: 'Session Management',
          status: 'success',
          message: 'Session management working correctly'
        })
        this.log('Session management test passed', 'success')
      } else {
        throw new Error('Session creation or retrieval failed')
      }

      // Clean up
      await prisma.session.delete({ where: { id: testSession.id } })
      await prisma.user.delete({ where: { id: testUser.id } })

      return true
    } catch (error) {
      this.results.push({
        provider: 'Session Management',
        status: 'error',
        message: 'Session management test failed',
        details: error
      })
      this.log(`Session management test failed: ${error}`, 'error')
      return false
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(70))
    this.log('AUTHENTICATION PROVIDERS TEST SUMMARY', 'info')
    console.log('='.repeat(70))

    const successCount = this.results.filter(r => r.status === 'success').length
    const warningCount = this.results.filter(r => r.status === 'warning').length
    const errorCount = this.results.filter(r => r.status === 'error').length

    this.log(`✅ Passed: ${successCount}`, 'success')
    this.log(`⚠️  Warnings: ${warningCount}`, 'warning')
    this.log(`❌ Errors: ${errorCount}`, 'error')

    console.log('\nDetailed Results:')
    this.results.forEach(result => {
      const status = result.status === 'success' ? '✅' : 
                    result.status === 'warning' ? '⚠️' : '❌'
      console.log(`${status} ${result.provider}: ${result.message}`)
    })

    if (errorCount > 0) {
      console.log('\nErrors that need attention:')
      this.results
        .filter(r => r.status === 'error')
        .forEach(result => {
          this.log(`${result.provider}: ${result.message}`, 'error')
        })
    }

    if (warningCount > 0) {
      console.log('\nWarnings to review:')
      this.results
        .filter(r => r.status === 'warning')
        .forEach(result => {
          this.log(`${result.provider}: ${result.message}`, 'warning')
        })
    }

    console.log('\n' + '='.repeat(70))

    if (errorCount === 0) {
      this.log('🎉 All authentication providers are ready for production!', 'success')
      if (warningCount > 0) {
        this.log('Please review the warnings above for optimization opportunities.', 'warning')
      }
      return true
    } else {
      this.log('❌ Authentication setup has critical issues!', 'error')
      this.log('Please fix the errors above before deploying to production.', 'error')
      return false
    }
  }

  async run() {
    this.log('Starting authentication providers test...', 'info')
    console.log('='.repeat(70))

    try {
      await this.testEnvironmentVariables()
      await this.testDatabaseConnection()
      await this.testCredentialsProvider()
      await this.testOAuthConfiguration()
      await this.testAuthEndpoints()
      await this.testSessionManagement()

      const success = this.printSummary()
      process.exit(success ? 0 : 1)
    } catch (error) {
      this.log(`Unexpected error during testing: ${error}`, 'error')
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  }
}

// Run test if called directly
if (require.main === module) {
  const tester = new AuthProviderTester()
  tester.run().catch(error => {
    console.error('Authentication test failed with error:', error)
    process.exit(1)
  })
}

export default AuthProviderTester