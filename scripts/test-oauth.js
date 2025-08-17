#!/usr/bin/env node

/**
 * OAuth Configuration Test Script
 * Tests OAuth providers configuration and endpoints
 */

const https = require('https');
const http = require('http');

class OAuthTester {
  constructor() {
    this.results = [];
    this.baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${type.toUpperCase()}]${colors.reset} ${message}`);
  }

  async testEnvironmentVariables() {
    this.log('Testing environment variables...', 'info');
    
    const requiredVars = {
      'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
      'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
      'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
      'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
      'GITHUB_CLIENT_ID': process.env.GITHUB_CLIENT_ID,
      'GITHUB_CLIENT_SECRET': process.env.GITHUB_CLIENT_SECRET
    };

    for (const [key, value] of Object.entries(requiredVars)) {
      if (!value || value.includes('your-')) {
        this.results.push({
          test: 'Environment Variables',
          status: 'warning',
          message: `${key} is not configured or uses placeholder value`
        });
        this.log(`${key} needs to be configured`, 'warning');
      } else {
        this.results.push({
          test: 'Environment Variables',
          status: 'success',
          message: `${key} is configured`
        });
        this.log(`${key} is configured`, 'success');
      }
    }
  }

  async testNextAuthEndpoints() {
    this.log('Testing NextAuth endpoints...', 'info');
    
    try {
      const response = await this.makeRequest('/api/auth/providers');
      
      if (response.statusCode === 200) {
        const providers = JSON.parse(response.data);
        const providerNames = Object.keys(providers);
        
        this.log(`Available providers: ${providerNames.join(', ')}`, 'success');
        
        // Check for expected providers
        const expectedProviders = ['google', 'github', 'credentials'];
        const missingProviders = expectedProviders.filter(p => !providerNames.includes(p));
        
        if (missingProviders.length === 0) {
          this.results.push({
            test: 'NextAuth Endpoints',
            status: 'success',
            message: 'All expected providers are available'
          });
        } else {
          this.results.push({
            test: 'NextAuth Endpoints',
            status: 'warning',
            message: `Missing providers: ${missingProviders.join(', ')}`
          });
        }
      } else {
        throw new Error(`HTTP ${response.statusCode}`);
      }
    } catch (error) {
      this.results.push({
        test: 'NextAuth Endpoints',
        status: 'error',
        message: `Failed to test endpoints: ${error.message}`
      });
      this.log(`Endpoint test failed: ${error.message}`, 'error');
    }
  }

  async testSignInPage() {
    this.log('Testing sign-in page...', 'info');
    
    try {
      const response = await this.makeRequest('/auth/signin');
      
      if (response.statusCode === 200) {
        const hasGoogleButton = response.data.includes('Google');
        const hasGitHubButton = response.data.includes('GitHub');
        
        this.results.push({
          test: 'Sign-in Page',
          status: 'success',
          message: `Sign-in page loads successfully. Google: ${hasGoogleButton}, GitHub: ${hasGitHubButton}`
        });
        this.log('Sign-in page is accessible', 'success');
      } else {
        throw new Error(`HTTP ${response.statusCode}`);
      }
    } catch (error) {
      this.results.push({
        test: 'Sign-in Page',
        status: 'error',
        message: `Failed to load sign-in page: ${error.message}`
      });
      this.log(`Sign-in page test failed: ${error.message}`, 'error');
    }
  }

  makeRequest(path) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  printResults() {
    this.log('\n=== OAuth Configuration Test Results ===', 'info');
    
    const summary = {
      success: 0,
      warning: 0,
      error: 0
    };
    
    this.results.forEach((result, index) => {
      const icon = {
        success: '✅',
        warning: '⚠️',
        error: '❌'
      }[result.status];
      
      console.log(`${index + 1}. ${icon} ${result.test}: ${result.message}`);
      summary[result.status]++;
    });
    
    this.log(`\n=== Summary ===`, 'info');
    this.log(`✅ Success: ${summary.success}`, 'success');
    this.log(`⚠️  Warning: ${summary.warning}`, 'warning');
    this.log(`❌ Error: ${summary.error}`, 'error');
    
    if (summary.warning > 0 || summary.error > 0) {
      this.log('\n=== Next Steps ===', 'info');
      this.log('1. Set up Google OAuth credentials at: https://console.cloud.google.com/', 'info');
      this.log('2. Set up GitHub OAuth app at: https://github.com/settings/developers', 'info');
      this.log('3. Update .env.local with your actual OAuth credentials', 'info');
      this.log('4. Restart the development server after updating credentials', 'info');
    }
  }

  async run() {
    this.log('Starting OAuth Configuration Test...', 'info');
    
    await this.testEnvironmentVariables();
    await this.testNextAuthEndpoints();
    await this.testSignInPage();
    
    this.printResults();
  }
}

// Run the test
if (require.main === module) {
  const tester = new OAuthTester();
  tester.run().catch(console.error);
}

module.exports = OAuthTester;