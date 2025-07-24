#!/usr/bin/env tsx

/**
 * Comprehensive Test Runner Script
 * 
 * This script runs all tests in the community platform and generates
 * detailed reports for different test categories.
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

interface TestResult {
  category: string
  passed: number
  failed: number
  total: number
  coverage?: number
  duration: number
}

interface TestSuite {
  name: string
  pattern: string
  description: string
}

const testSuites: TestSuite[] = [
  {
    name: 'Unit Tests - Components',
    pattern: 'src/__tests__/components/**/*.test.{ts,tsx}',
    description: 'Tests for React components and UI elements'
  },
  {
    name: 'Unit Tests - Hooks',
    pattern: 'src/__tests__/hooks/**/*.test.{ts,tsx}',
    description: 'Tests for custom React hooks'
  },
  {
    name: 'Unit Tests - Utilities',
    pattern: 'src/__tests__/lib/**/*.test.ts',
    description: 'Tests for utility functions and libraries'
  },
  {
    name: 'Unit Tests - Stores',
    pattern: 'src/__tests__/stores/**/*.test.ts',
    description: 'Tests for Zustand stores and state management'
  },
  {
    name: 'Integration Tests - API',
    pattern: 'src/__tests__/api/**/*.test.ts',
    description: 'Tests for API endpoints and routes'
  },
  {
    name: 'Integration Tests - Flows',
    pattern: 'src/__tests__/integration/**/*.test.ts',
    description: 'Tests for complete user flows and interactions'
  }
]

class TestRunner {
  private results: TestResult[] = []
  private startTime: number = Date.now()

  constructor() {
    console.log('🚀 Starting Community Platform Test Suite')
    console.log('=' .repeat(60))
  }

  async runAllTests(): Promise<void> {
    try {
      // Run each test suite
      for (const suite of testSuites) {
        await this.runTestSuite(suite)
      }

      // Generate comprehensive report
      this.generateReport()
      
      // Check if all tests passed
      const totalFailed = this.results.reduce((sum, result) => sum + result.failed, 0)
      
      if (totalFailed > 0) {
        console.log(`\n❌ ${totalFailed} tests failed`)
        process.exit(1)
      } else {
        console.log('\n✅ All tests passed!')
        process.exit(0)
      }
    } catch (error) {
      console.error('❌ Test runner failed:', error)
      process.exit(1)
    }
  }

  private async runTestSuite(suite: TestSuite): Promise<void> {
    console.log(`\n📋 Running: ${suite.name}`)
    console.log(`📝 ${suite.description}`)
    console.log('-'.repeat(40))

    const startTime = Date.now()

    try {
      // Run Jest with specific pattern
      const command = `npx jest "${suite.pattern}" --coverage --json --outputFile=test-results-${suite.name.replace(/\s+/g, '-').toLowerCase()}.json`
      
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      })

      const duration = Date.now() - startTime
      const result = this.parseJestOutput(suite, output, duration)
      this.results.push(result)

      console.log(`✅ ${result.passed}/${result.total} tests passed (${duration}ms)`)
      
      if (result.coverage) {
        console.log(`📊 Coverage: ${result.coverage}%`)
      }

    } catch (error: any) {
      const duration = Date.now() - startTime
      
      // Parse error output to get test results
      const result = this.parseJestError(suite, error.stdout || error.message, duration)
      this.results.push(result)

      console.log(`❌ ${result.failed}/${result.total} tests failed (${duration}ms)`)
      
      if (error.stdout) {
        console.log('Error details:')
        console.log(error.stdout.substring(0, 500) + '...')
      }
    }
  }

  private parseJestOutput(suite: TestSuite, output: string, duration: number): TestResult {
    try {
      // Try to parse JSON output
      const lines = output.split('\n')
      const jsonLine = lines.find(line => line.startsWith('{'))
      
      if (jsonLine) {
        const result = JSON.parse(jsonLine)
        return {
          category: suite.name,
          passed: result.numPassedTests || 0,
          failed: result.numFailedTests || 0,
          total: result.numTotalTests || 0,
          coverage: result.coverageMap ? this.calculateCoverage(result.coverageMap) : undefined,
          duration
        }
      }
    } catch (error) {
      console.warn('Failed to parse Jest JSON output, falling back to text parsing')
    }

    // Fallback to text parsing
    return this.parseJestText(suite, output, duration)
  }

  private parseJestError(suite: TestSuite, output: string, duration: number): TestResult {
    return this.parseJestText(suite, output, duration)
  }

  private parseJestText(suite: TestSuite, output: string, duration: number): TestResult {
    // Extract test results from Jest text output
    const passedMatch = output.match(/(\d+) passed/)
    const failedMatch = output.match(/(\d+) failed/)
    const totalMatch = output.match(/(\d+) total/)

    const passed = passedMatch ? parseInt(passedMatch[1]) : 0
    const failed = failedMatch ? parseInt(failedMatch[1]) : 0
    const total = totalMatch ? parseInt(totalMatch[1]) : passed + failed

    return {
      category: suite.name,
      passed,
      failed,
      total,
      duration
    }
  }

  private calculateCoverage(coverageMap: any): number {
    if (!coverageMap) return 0

    let totalStatements = 0
    let coveredStatements = 0

    Object.values(coverageMap).forEach((file: any) => {
      if (file.s) {
        Object.values(file.s).forEach((count: any) => {
          totalStatements++
          if (count > 0) coveredStatements++
        })
      }
    })

    return totalStatements > 0 ? Math.round((coveredStatements / totalStatements) * 100) : 0
  }

  private generateReport(): void {
    const totalDuration = Date.now() - this.startTime
    const totalTests = this.results.reduce((sum, result) => sum + result.total, 0)
    const totalPassed = this.results.reduce((sum, result) => sum + result.passed, 0)
    const totalFailed = this.results.reduce((sum, result) => sum + result.failed, 0)

    console.log('\n' + '='.repeat(60))
    console.log('📊 TEST SUMMARY REPORT')
    console.log('='.repeat(60))

    // Overall statistics
    console.log(`\n🎯 Overall Results:`)
    console.log(`   Total Tests: ${totalTests}`)
    console.log(`   Passed: ${totalPassed} (${Math.round((totalPassed / totalTests) * 100)}%)`)
    console.log(`   Failed: ${totalFailed} (${Math.round((totalFailed / totalTests) * 100)}%)`)
    console.log(`   Duration: ${Math.round(totalDuration / 1000)}s`)

    // Detailed breakdown
    console.log(`\n📋 Detailed Breakdown:`)
    this.results.forEach(result => {
      const passRate = result.total > 0 ? Math.round((result.passed / result.total) * 100) : 0
      const status = result.failed === 0 ? '✅' : '❌'
      
      console.log(`   ${status} ${result.category}:`)
      console.log(`      ${result.passed}/${result.total} passed (${passRate}%)`)
      console.log(`      Duration: ${Math.round(result.duration / 1000)}s`)
      
      if (result.coverage) {
        console.log(`      Coverage: ${result.coverage}%`)
      }
    })

    // Performance analysis
    console.log(`\n⚡ Performance Analysis:`)
    const slowestSuite = this.results.reduce((prev, current) => 
      prev.duration > current.duration ? prev : current
    )
    console.log(`   Slowest suite: ${slowestSuite.category} (${Math.round(slowestSuite.duration / 1000)}s)`)

    const avgDuration = totalDuration / this.results.length
    console.log(`   Average duration: ${Math.round(avgDuration / 1000)}s per suite`)

    // Coverage summary
    const coverageResults = this.results.filter(r => r.coverage !== undefined)
    if (coverageResults.length > 0) {
      const avgCoverage = coverageResults.reduce((sum, r) => sum + (r.coverage || 0), 0) / coverageResults.length
      console.log(`\n📈 Coverage Summary:`)
      console.log(`   Average coverage: ${Math.round(avgCoverage)}%`)
      
      coverageResults.forEach(result => {
        const status = (result.coverage || 0) >= 80 ? '✅' : '⚠️'
        console.log(`   ${status} ${result.category}: ${result.coverage}%`)
      })
    }

    // Recommendations
    console.log(`\n💡 Recommendations:`)
    
    if (totalFailed > 0) {
      console.log(`   • Fix ${totalFailed} failing tests before deployment`)
    }
    
    const lowCoverageSuites = coverageResults.filter(r => (r.coverage || 0) < 80)
    if (lowCoverageSuites.length > 0) {
      console.log(`   • Improve test coverage for: ${lowCoverageSuites.map(s => s.category).join(', ')}`)
    }
    
    if (slowestSuite.duration > 30000) {
      console.log(`   • Optimize slow test suite: ${slowestSuite.category}`)
    }
    
    if (totalTests < 100) {
      console.log(`   • Consider adding more comprehensive tests (current: ${totalTests})`)
    }

    // Generate JSON report for CI/CD
    this.generateJSONReport()
  }

  private generateJSONReport(): void {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.reduce((sum, result) => sum + result.total, 0),
        passed: this.results.reduce((sum, result) => sum + result.passed, 0),
        failed: this.results.reduce((sum, result) => sum + result.failed, 0),
        duration: Date.now() - this.startTime
      },
      suites: this.results,
      recommendations: this.generateRecommendations()
    }

    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2))
    console.log(`\n📄 Detailed report saved to: test-report.json`)
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    
    const totalFailed = this.results.reduce((sum, result) => sum + result.failed, 0)
    if (totalFailed > 0) {
      recommendations.push(`Fix ${totalFailed} failing tests`)
    }

    const coverageResults = this.results.filter(r => r.coverage !== undefined)
    const lowCoverageSuites = coverageResults.filter(r => (r.coverage || 0) < 80)
    if (lowCoverageSuites.length > 0) {
      recommendations.push(`Improve coverage for: ${lowCoverageSuites.map(s => s.category).join(', ')}`)
    }

    const slowSuites = this.results.filter(r => r.duration > 30000)
    if (slowSuites.length > 0) {
      recommendations.push(`Optimize slow suites: ${slowSuites.map(s => s.category).join(', ')}`)
    }

    return recommendations
  }
}

// Run the test suite
if (require.main === module) {
  const runner = new TestRunner()
  runner.runAllTests().catch(error => {
    console.error('Test runner failed:', error)
    process.exit(1)
  })
}

export { TestRunner }