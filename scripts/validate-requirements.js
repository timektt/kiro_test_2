#!/usr/bin/env node

/**
 * Requirements Validation Script
 * Validates that all requirements from the spec are properly implemented
 */

const fs = require('fs')
const path = require('path')

class RequirementsValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.passed = []
    this.requirements = this.loadRequirements()
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

  loadRequirements() {
    // Define all requirements from the spec
    return {
      'Requirement 1': {
        name: 'User Authentication System',
        files: [
          'src/app/auth/signin/page.tsx',
          'src/app/auth/signup/page.tsx',
          'src/components/auth/signin-form.tsx',
          'src/components/auth/signup-form.tsx',
          'src/lib/auth.ts',
          'src/app/api/auth/register/route.ts'
        ],
        features: [
          'Google OAuth integration',
          'GitHub OAuth integration',
          'Email/password authentication',
          'Password hashing with bcrypt',
          'Session management with NextAuth',
          'Route protection middleware'
        ]
      },
      'Requirement 2': {
        name: 'Public Landing Page',
        files: [
          'src/app/page.tsx',
          'src/components/landing/hero-section.tsx',
          'src/components/landing/features-section.tsx',
          'src/components/landing/cta-section.tsx'
        ],
        features: [
          'Responsive design',
          'Clear branding and value proposition',
          'Call-to-action buttons',
          'Mobile-first design'
        ]
      },
      'Requirement 3': {
        name: 'Social Feed System',
        files: [
          'src/app/feed/page.tsx',
          'src/components/feed/enhanced-interactive-feed.tsx',
          'src/components/ui/post-composer.tsx',
          'src/components/ui/post-item.tsx',
          'src/components/ui/comment-box.tsx',
          'src/app/api/posts/route.ts',
          'src/app/api/posts/[postId]/like/route.ts',
          'src/app/api/posts/[postId]/comments/route.ts'
        ],
        features: [
          'Post creation and display',
          'Like functionality',
          'Comment system',
          'Chronological ordering',
          'Pagination or infinite scroll'
        ]
      },
      'Requirement 4': {
        name: 'User Profile Management',
        files: [
          'src/app/profile/[username]/page.tsx',
          'src/components/profile/profile-header.tsx',
          'src/components/profile/profile-edit-form.tsx',
          'src/app/api/users/[userId]/route.ts'
        ],
        features: [
          'Profile display and editing',
          'Avatar upload integration',
          'Bio and social links management',
          'User posts history'
        ]
      },
      'Requirement 5': {
        name: 'Notification System',
        files: [
          'src/app/notifications/page.tsx',
          'src/components/ui/notification-dropdown.tsx',
          'src/components/notifications/notifications-list.tsx',
          'src/app/api/notifications/route.ts',
          'src/app/api/notifications/[notificationId]/route.ts'
        ],
        features: [
          'Like notifications',
          'Comment notifications',
          'Follow notifications',
          'Chronological display',
          'Mark as read functionality'
        ]
      },
      'Requirement 6': {
        name: 'Admin Dashboard',
        files: [
          'src/components/admin/admin-dashboard.tsx',
          'src/components/admin/admin-layout.tsx',
          'src/components/admin/user-management.tsx',
          'src/components/admin/content-moderation.tsx',
          'src/lib/admin-auth.ts',
          'src/app/api/admin/users/route.ts',
          'src/app/api/admin/content/route.ts'
        ],
        features: [
          'Admin authentication',
          'User management interface',
          'Content moderation tools',
          'Admin-only route protection'
        ]
      },
      'Requirement 7': {
        name: 'Responsive Design and Theming',
        files: [
          'src/components/theme-provider.tsx',
          'src/components/ui/theme-toggle.tsx',
          'src/app/globals.css',
          'tailwind.config.js'
        ],
        features: [
          'Dark/light mode toggle',
          'Theme persistence',
          'Mobile-first responsive design',
          'Consistent UI with shadcn/ui'
        ]
      },
      'Requirement 8': {
        name: 'Performance and Security',
        files: [
          'src/lib/validations.ts',
          'src/lib/security.ts',
          'src/lib/middleware/validation.ts',
          'src/lib/middleware/security.ts',
          'src/lib/middleware/rate-limit.ts',
          'next.config.js'
        ],
        features: [
          'Input validation with Zod',
          'API route protection',
          'Security headers',
          'Image optimization',
          'Performance monitoring'
        ]
      },
      'Requirement 9': {
        name: 'Optional Enhanced Features',
        files: [
          'src/app/identity/page.tsx',
          'src/components/identity/mbti-selector.tsx',
          'src/app/rankings/page.tsx',
          'src/components/rankings/ranking-board.tsx',
          'src/lib/mbti.ts',
          'src/lib/ranking.ts'
        ],
        features: [
          'User identity system (MBTI)',
          'Ranking boards',
          'Enhanced engagement features'
        ]
      }
    }
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

  validateRequirement1() {
    this.log('Validating Requirement 1: User Authentication System', 'info')
    
    const req = this.requirements['Requirement 1']
    let passed = 0
    let total = req.files.length
    
    // Check required files exist
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing file: ${file}`)
      }
    })
    
    // Check NextAuth configuration
    if (this.checkFileContent('src/lib/auth.ts', ['NextAuth', 'GoogleProvider', 'GitHubProvider'])) {
      this.passed.push('✓ NextAuth properly configured with OAuth providers')
      passed++
    } else {
      this.errors.push('✗ NextAuth configuration incomplete')
    }
    
    // Check password hashing
    if (this.checkFileContent('src/app/api/auth/register/route.ts', ['bcrypt', 'hash'])) {
      this.passed.push('✓ Password hashing implemented')
      passed++
    } else {
      this.warnings.push('⚠ Password hashing may not be properly implemented')
    }
    
    this.log(`Requirement 1: ${passed}/${total + 2} checks passed`, passed === total + 2 ? 'success' : 'warning')
  }

  validateRequirement2() {
    this.log('Validating Requirement 2: Public Landing Page', 'info')
    
    const req = this.requirements['Requirement 2']
    let passed = 0
    let total = req.files.length
    
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing file: ${file}`)
      }
    })
    
    // Check responsive design
    if (this.checkFileContent('src/app/page.tsx', ['responsive', 'mobile', 'sm:', 'md:', 'lg:'])) {
      this.passed.push('✓ Responsive design classes found')
      passed++
    } else {
      this.warnings.push('⚠ Responsive design may not be fully implemented')
    }
    
    this.log(`Requirement 2: ${passed}/${total + 1} checks passed`, passed === total + 1 ? 'success' : 'warning')
  }

  validateRequirement3() {
    this.log('Validating Requirement 3: Social Feed System', 'info')
    
    const req = this.requirements['Requirement 3']
    let passed = 0
    let total = req.files.length
    
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing file: ${file}`)
      }
    })
    
    // Check API endpoints
    const apiEndpoints = [
      'src/app/api/posts/route.ts',
      'src/app/api/posts/[postId]/like/route.ts',
      'src/app/api/posts/[postId]/comments/route.ts'
    ]
    
    apiEndpoints.forEach(endpoint => {
      if (this.checkFileExists(endpoint)) {
        this.passed.push(`✓ API endpoint ${endpoint} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing API endpoint: ${endpoint}`)
      }
    })
    
    this.log(`Requirement 3: ${passed}/${total + 3} checks passed`, passed === total + 3 ? 'success' : 'warning')
  }

  validateRequirement4() {
    this.log('Validating Requirement 4: User Profile Management', 'info')
    
    const req = this.requirements['Requirement 4']
    let passed = 0
    let total = req.files.length
    
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing file: ${file}`)
      }
    })
    
    // Check Cloudinary integration
    if (this.checkFileContent('package.json', ['cloudinary'])) {
      this.passed.push('✓ Cloudinary integration found')
      passed++
    } else {
      this.warnings.push('⚠ Cloudinary integration may be missing')
    }
    
    this.log(`Requirement 4: ${passed}/${total + 1} checks passed`, passed === total + 1 ? 'success' : 'warning')
  }

  validateRequirement5() {
    this.log('Validating Requirement 5: Notification System', 'info')
    
    const req = this.requirements['Requirement 5']
    let passed = 0
    let total = req.files.length
    
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing file: ${file}`)
      }
    })
    
    // Check notification types
    if (this.checkFileContent('prisma/schema.prisma', ['NotificationType', 'LIKE', 'COMMENT', 'FOLLOW'])) {
      this.passed.push('✓ Notification types properly defined')
      passed++
    } else {
      this.errors.push('✗ Notification types not properly defined in schema')
    }
    
    this.log(`Requirement 5: ${passed}/${total + 1} checks passed`, passed === total + 1 ? 'success' : 'warning')
  }

  validateRequirement6() {
    this.log('Validating Requirement 6: Admin Dashboard', 'info')
    
    const req = this.requirements['Requirement 6']
    let passed = 0
    let total = req.files.length
    
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing file: ${file}`)
      }
    })
    
    // Check admin role in schema
    if (this.checkFileContent('prisma/schema.prisma', ['isAdmin', 'Boolean'])) {
      this.passed.push('✓ Admin role properly defined in schema')
      passed++
    } else {
      this.errors.push('✗ Admin role not properly defined in schema')
    }
    
    this.log(`Requirement 6: ${passed}/${total + 1} checks passed`, passed === total + 1 ? 'success' : 'warning')
  }

  validateRequirement7() {
    this.log('Validating Requirement 7: Responsive Design and Theming', 'info')
    
    const req = this.requirements['Requirement 7']
    let passed = 0
    let total = req.files.length
    
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing file: ${file}`)
      }
    })
    
    // Check Tailwind configuration
    if (this.checkFileContent('tailwind.config.js', ['darkMode', 'responsive'])) {
      this.passed.push('✓ Tailwind properly configured')
      passed++
    } else {
      this.warnings.push('⚠ Tailwind configuration may be incomplete')
    }
    
    // Check next-themes integration
    if (this.checkFileContent('package.json', ['next-themes'])) {
      this.passed.push('✓ Theme switching library found')
      passed++
    } else {
      this.warnings.push('⚠ Theme switching library may be missing')
    }
    
    this.log(`Requirement 7: ${passed}/${total + 2} checks passed`, passed === total + 2 ? 'success' : 'warning')
  }

  validateRequirement8() {
    this.log('Validating Requirement 8: Performance and Security', 'info')
    
    const req = this.requirements['Requirement 8']
    let passed = 0
    let total = req.files.length
    
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.errors.push(`✗ Missing file: ${file}`)
      }
    })
    
    // Check Zod validation
    if (this.checkFileContent('package.json', ['zod'])) {
      this.passed.push('✓ Zod validation library found')
      passed++
    } else {
      this.errors.push('✗ Zod validation library missing')
    }
    
    // Check security headers in Next.js config
    if (this.checkFileContent('next.config.js', ['headers', 'X-Frame-Options', 'X-Content-Type-Options'])) {
      this.passed.push('✓ Security headers configured')
      passed++
    } else {
      this.warnings.push('⚠ Security headers may not be properly configured')
    }
    
    this.log(`Requirement 8: ${passed}/${total + 2} checks passed`, passed === total + 2 ? 'success' : 'warning')
  }

  validateRequirement9() {
    this.log('Validating Requirement 9: Optional Enhanced Features', 'info')
    
    const req = this.requirements['Requirement 9']
    let passed = 0
    let total = req.files.length
    
    req.files.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
        passed++
      } else {
        this.warnings.push(`⚠ Optional file missing: ${file}`)
      }
    })
    
    // Check MBTI system
    if (this.checkFileContent('prisma/schema.prisma', ['mbtiType'])) {
      this.passed.push('✓ MBTI system integrated in schema')
      passed++
    } else {
      this.warnings.push('⚠ MBTI system may not be fully integrated')
    }
    
    this.log(`Requirement 9: ${passed}/${total + 1} checks passed (optional features)`, 'info')
  }

  validateDatabaseSchema() {
    this.log('Validating Database Schema Completeness', 'info')
    
    const schemaFile = 'prisma/schema.prisma'
    if (!this.checkFileExists(schemaFile)) {
      this.errors.push('✗ Prisma schema file missing')
      return
    }
    
    const requiredModels = ['User', 'Post', 'Comment', 'Like', 'Follow', 'Notification']
    const requiredEnums = ['NotificationType']
    
    requiredModels.forEach(model => {
      if (this.checkFileContent(schemaFile, [`model ${model}`])) {
        this.passed.push(`✓ ${model} model defined`)
      } else {
        this.errors.push(`✗ ${model} model missing from schema`)
      }
    })
    
    requiredEnums.forEach(enumType => {
      if (this.checkFileContent(schemaFile, [`enum ${enumType}`])) {
        this.passed.push(`✓ ${enumType} enum defined`)
      } else {
        this.errors.push(`✗ ${enumType} enum missing from schema`)
      }
    })
  }

  validateTestCoverage() {
    this.log('Validating Test Coverage', 'info')
    
    const testDirectories = [
      'src/__tests__/components',
      'src/__tests__/hooks',
      'src/__tests__/api',
      'src/__tests__/integration',
      'src/__tests__/lib'
    ]
    
    testDirectories.forEach(dir => {
      const fullPath = path.join(process.cwd(), dir)
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath)
        const testFiles = files.filter(file => file.endsWith('.test.ts') || file.endsWith('.test.tsx'))
        if (testFiles.length > 0) {
          this.passed.push(`✓ ${dir} has ${testFiles.length} test files`)
        } else {
          this.warnings.push(`⚠ ${dir} has no test files`)
        }
      } else {
        this.warnings.push(`⚠ Test directory ${dir} does not exist`)
      }
    })
    
    // Check for Jest configuration
    if (this.checkFileExists('jest.config.js')) {
      this.passed.push('✓ Jest configuration found')
    } else {
      this.warnings.push('⚠ Jest configuration missing')
    }
  }

  validateDeploymentReadiness() {
    this.log('Validating Deployment Readiness', 'info')
    
    const deploymentFiles = [
      'Dockerfile',
      'docker-compose.yml',
      '.github/workflows/deploy.yml',
      'vercel.json',
      '.env.example'
    ]
    
    deploymentFiles.forEach(file => {
      if (this.checkFileExists(file)) {
        this.passed.push(`✓ ${file} exists`)
      } else {
        this.warnings.push(`⚠ Deployment file ${file} missing`)
      }
    })
    
    // Check environment variables
    if (this.checkFileExists('.env.example')) {
      const requiredEnvVars = [
        'DATABASE_URL',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL',
        'GOOGLE_CLIENT_ID',
        'GITHUB_CLIENT_ID'
      ]
      
      requiredEnvVars.forEach(envVar => {
        if (this.checkFileContent('.env.example', [envVar])) {
          this.passed.push(`✓ ${envVar} documented in .env.example`)
        } else {
          this.warnings.push(`⚠ ${envVar} not documented in .env.example`)
        }
      })
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(70))
    this.log('REQUIREMENTS VALIDATION SUMMARY', 'info')
    console.log('='.repeat(70))

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

    console.log('\n' + '='.repeat(70))

    if (this.errors.length === 0) {
      this.log('🎉 All requirements validation completed successfully!', 'success')
      if (this.warnings.length > 0) {
        this.log('Please review the warnings above for optimization opportunities.', 'warning')
      }
      return true
    } else {
      this.log('❌ Requirements validation failed!', 'error')
      this.log('Please fix the errors above before considering the project complete.', 'error')
      return false
    }
  }

  async run() {
    this.log('Starting comprehensive requirements validation...', 'info')
    console.log('='.repeat(70))

    // Validate each requirement
    this.validateRequirement1()
    this.validateRequirement2()
    this.validateRequirement3()
    this.validateRequirement4()
    this.validateRequirement5()
    this.validateRequirement6()
    this.validateRequirement7()
    this.validateRequirement8()
    this.validateRequirement9()
    
    // Additional validations
    this.validateDatabaseSchema()
    this.validateTestCoverage()
    this.validateDeploymentReadiness()

    const success = this.printSummary()
    process.exit(success ? 0 : 1)
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new RequirementsValidator()
  validator.run().catch(error => {
    console.error('Validation failed with error:', error)
    process.exit(1)
  })
}

module.exports = RequirementsValidator