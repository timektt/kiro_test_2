#!/usr/bin/env node

/**
 * Final Integration Check Script
 * Runs comprehensive validation of all requirements, performance, and deployment readiness
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

class FinalIntegrationChecker {
  constructor() {
    this.results = {
      requirements: null,
      performance: null,
      environment: null,
      tests: null,
      deployment: null
    }
    this.overallScore = 0
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      header: '\x1b[35m',  // Magenta
      reset: '\x1b[0m'     // Reset
    }

    const prefix = {
      info: 'ℹ',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      header: '🚀'
    }

    console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`)
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        ...options
      })

      let stdout = ''
      let stderr = ''

      child.stdout?.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      child.on('close', (code) => {
        resolve({
          code,
          stdout,
          stderr,
          success: code === 0
        })
      })

      child.on('error', (error) => {
        resolve({
          code: 1,
          stdout,
          stderr: error.message,
          success: false
        })
      })
    })
  }

  async checkRequirements() {
    this.log('Running Requirements Validation...', 'info')
    
    try {
      const result = await this.runCommand('node', ['scripts/validate-requirements.js'])
      this.results.requirements = {
        success: result.success,
        output: result.stdout,
        errors: result.stderr
      }
      
      if (result.success) {
        this.log('Requirements validation passed', 'success')
        this.overallScore += 25
      } else {
        this.log('Requirements validation failed', 'error')
      }
    } catch (error) {
      this.log(`Requirements validation error: ${error.message}`, 'error')
      this.results.requirements = { success: false, error: error.message }
    }
  }

  async checkPerformance() {
    this.log('Running Performance Audit...', 'info')
    
    try {
      const result = await this.runCommand('node', ['scripts/performance-audit.js'])
      this.results.performance = {
        success: result.success,
        output: result.stdout,
        errors: result.stderr
      }
      
      if (result.success) {
        this.log('Performance audit passed', 'success')
        this.overallScore += 20
      } else {
        this.log('Performance audit completed with issues', 'warning')
        this.overallScore += 10
      }
    } catch (error) {
      this.log(`Performance audit error: ${error.message}`, 'error')
      this.results.performance = { success: false, error: error.message }
    }
  }

  async checkEnvironment() {
    this.log('Running Environment Validation...', 'info')
    
    try {
      const result = await this.runCommand('node', ['scripts/validate-env.js'])
      this.results.environment = {
        success: result.success,
        output: result.stdout,
        errors: result.stderr
      }
      
      if (result.success) {
        this.log('Environment validation passed', 'success')
        this.overallScore += 15
      } else {
        this.log('Environment validation failed', 'error')
      }
    } catch (error) {
      this.log(`Environment validation error: ${error.message}`, 'error')
      this.results.environment = { success: false, error: error.message }
    }
  }

  async checkTests() {
    this.log('Running Test Suite...', 'info')
    
    try {
      const result = await this.runCommand('npm', ['run', 'test:ci'])
      this.results.tests = {
        success: result.success,
        output: result.stdout,
        errors: result.stderr
      }
      
      if (result.success) {
        this.log('Test suite passed', 'success')
        this.overallScore += 25
      } else {
        this.log('Test suite failed', 'error')
      }
    } catch (error) {
      this.log(`Test execution error: ${error.message}`, 'error')
      this.results.tests = { success: false, error: error.message }
    }
  }

  async checkBuild() {
    this.log('Running Production Build...', 'info')
    
    try {
      const result = await this.runCommand('npm', ['run', 'build'])
      this.results.deployment = {
        success: result.success,
        output: result.stdout,
        errors: result.stderr
      }
      
      if (result.success) {
        this.log('Production build successful', 'success')
        this.overallScore += 15
      } else {
        this.log('Production build failed', 'error')
      }
    } catch (error) {
      this.log(`Build error: ${error.message}`, 'error')
      this.results.deployment = { success: false, error: error.message }
    }
  }

  generateReport() {
    const reportPath = path.join(process.cwd(), 'integration-report.md')
    const timestamp = new Date().toISOString()
    
    let report = `# Final Integration Report\n\n`
    report += `**Generated:** ${timestamp}\n`
    report += `**Overall Score:** ${this.overallScore}/100\n\n`
    
    // Requirements Section
    report += `## Requirements Validation\n\n`
    if (this.results.requirements?.success) {
      report += `✅ **Status:** PASSED\n\n`
    } else {
      report += `❌ **Status:** FAILED\n\n`
    }
    
    if (this.results.requirements?.output) {
      report += `### Output\n\`\`\`\n${this.results.requirements.output}\n\`\`\`\n\n`
    }
    
    if (this.results.requirements?.errors) {
      report += `### Errors\n\`\`\`\n${this.results.requirements.errors}\n\`\`\`\n\n`
    }
    
    // Performance Section
    report += `## Performance Audit\n\n`
    if (this.results.performance?.success) {
      report += `✅ **Status:** PASSED\n\n`
    } else {
      report += `⚠️ **Status:** COMPLETED WITH ISSUES\n\n`
    }
    
    if (this.results.performance?.output) {
      report += `### Output\n\`\`\`\n${this.results.performance.output}\n\`\`\`\n\n`
    }
    
    // Environment Section
    report += `## Environment Validation\n\n`
    if (this.results.environment?.success) {
      report += `✅ **Status:** PASSED\n\n`
    } else {
      report += `❌ **Status:** FAILED\n\n`
    }
    
    // Tests Section
    report += `## Test Suite\n\n`
    if (this.results.tests?.success) {
      report += `✅ **Status:** PASSED\n\n`
    } else {
      report += `❌ **Status:** FAILED\n\n`
    }
    
    if (this.results.tests?.errors) {
      report += `### Test Errors\n\`\`\`\n${this.results.tests.errors}\n\`\`\`\n\n`
    }
    
    // Deployment Section
    report += `## Production Build\n\n`
    if (this.results.deployment?.success) {
      report += `✅ **Status:** PASSED\n\n`
    } else {
      report += `❌ **Status:** FAILED\n\n`
    }
    
    if (this.results.deployment?.errors) {
      report += `### Build Errors\n\`\`\`\n${this.results.deployment.errors}\n\`\`\`\n\n`
    }
    
    // Summary Section
    report += `## Summary\n\n`
    
    const passedChecks = Object.values(this.results).filter(r => r?.success).length
    const totalChecks = Object.keys(this.results).length
    
    report += `- **Checks Passed:** ${passedChecks}/${totalChecks}\n`
    report += `- **Overall Score:** ${this.overallScore}/100\n\n`
    
    if (this.overallScore >= 90) {
      report += `🎉 **Excellent!** The application is ready for production deployment.\n\n`
    } else if (this.overallScore >= 70) {
      report += `✅ **Good!** The application is mostly ready, but consider addressing the issues above.\n\n`
    } else if (this.overallScore >= 50) {
      report += `⚠️ **Needs Work!** Several issues need to be addressed before deployment.\n\n`
    } else {
      report += `❌ **Not Ready!** Critical issues must be fixed before deployment.\n\n`
    }
    
    // Recommendations
    report += `## Recommendations\n\n`
    
    if (!this.results.requirements?.success) {
      report += `- Fix all requirement validation errors before proceeding\n`
    }
    
    if (!this.results.tests?.success) {
      report += `- Ensure all tests pass before deployment\n`
    }
    
    if (!this.results.deployment?.success) {
      report += `- Fix build errors to enable production deployment\n`
    }
    
    if (!this.results.environment?.success) {
      report += `- Configure all required environment variables\n`
    }
    
    report += `- Review performance audit suggestions for optimization opportunities\n`
    report += `- Ensure all security best practices are implemented\n`
    report += `- Test the application thoroughly in a staging environment\n`
    
    fs.writeFileSync(reportPath, report)
    this.log(`Integration report generated: ${reportPath}`, 'success')
  }

  printSummary() {
    console.log('\n' + '='.repeat(80))
    this.log('FINAL INTEGRATION CHECK SUMMARY', 'header')
    console.log('='.repeat(80))
    
    this.log(`Overall Score: ${this.overallScore}/100`, 'info')
    
    console.log('\nCheck Results:')
    Object.entries(this.results).forEach(([check, result]) => {
      const status = result?.success ? '✅ PASSED' : '❌ FAILED'
      this.log(`${check.toUpperCase().padEnd(15)} ${status}`, result?.success ? 'success' : 'error')
    })
    
    console.log('\n' + '='.repeat(80))
    
    if (this.overallScore >= 90) {
      this.log('🎉 EXCELLENT! Application is ready for production!', 'success')
      return true
    } else if (this.overallScore >= 70) {
      this.log('✅ GOOD! Application is mostly ready with minor issues.', 'success')
      return true
    } else if (this.overallScore >= 50) {
      this.log('⚠️ NEEDS WORK! Address issues before deployment.', 'warning')
      return false
    } else {
      this.log('❌ NOT READY! Critical issues must be fixed.', 'error')
      return false
    }
  }

  async run() {
    this.log('Starting Final Integration Check...', 'header')
    console.log('='.repeat(80))
    
    // Run all checks
    await this.checkRequirements()
    await this.checkPerformance()
    await this.checkEnvironment()
    await this.checkTests()
    await this.checkBuild()
    
    // Generate report and summary
    this.generateReport()
    const success = this.printSummary()
    
    // Additional deployment readiness checks
    this.log('\nDeployment Readiness Checklist:', 'info')
    
    const deploymentFiles = [
      { file: 'Dockerfile', desc: 'Docker configuration' },
      { file: '.github/workflows/deploy.yml', desc: 'CI/CD pipeline' },
      { file: 'vercel.json', desc: 'Vercel configuration' },
      { file: '.env.example', desc: 'Environment variables template' },
      { file: 'docs/deployment.md', desc: 'Deployment documentation' }
    ]
    
    deploymentFiles.forEach(({ file, desc }) => {
      const exists = fs.existsSync(path.join(process.cwd(), file))
      this.log(`${desc}: ${exists ? '✅' : '❌'}`, exists ? 'success' : 'error')
    })
    
    console.log('\n' + '='.repeat(80))
    this.log('Integration check completed. See integration-report.md for details.', 'info')
    
    process.exit(success ? 0 : 1)
  }
}

// Run check if called directly
if (require.main === module) {
  const checker = new FinalIntegrationChecker()
  checker.run().catch(error => {
    console.error('Final integration check failed with error:', error)
    process.exit(1)
  })
}

module.exports = FinalIntegrationChecker