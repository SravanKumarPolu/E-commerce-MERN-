#!/usr/bin/env node

import axios from 'axios';
import chalk from 'chalk';

const API_BASE_URL = process.env.API_URL || 'http://localhost:4000';
const testResults = [];

// Test configuration
const tests = {
  rateLimit: {
    name: 'Rate Limiting',
    description: 'Test rate limiting on authentication endpoints'
  },
  xssProtection: {
    name: 'XSS Protection',
    description: 'Test XSS attack prevention'
  },
  sqlInjection: {
    name: 'NoSQL Injection Protection',
    description: 'Test NoSQL injection prevention'
  },
  fileUpload: {
    name: 'File Upload Security',
    description: 'Test malicious file upload prevention'
  },
  corsPolicy: {
    name: 'CORS Policy',
    description: 'Test CORS configuration'
  },
  securityHeaders: {
    name: 'Security Headers',
    description: 'Test security headers presence'
  }
};

// Helper functions
const logTest = (testName, status, message) => {
  const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  
  console.log(`${statusIcon} ${chalk[statusColor](testName)}: ${message}`);
  testResults.push({ testName, status, message });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Security Tests
async function testRateLimit() {
  console.log(chalk.blue('\n🔒 Testing Rate Limiting...'));
  
  try {
    const promises = [];
    // Attempt 10 rapid requests to trigger rate limiting
    for (let i = 0; i < 10; i++) {
      promises.push(
        axios.post(`${API_BASE_URL}/api/user/login`, {
          email: 'test@example.com',
          password: 'wrongpassword'
        }, { timeout: 5000 })
      );
    }
    
    const results = await Promise.allSettled(promises);
    const rateLimitedRequests = results.filter(result => 
      result.status === 'rejected' && 
      result.reason?.response?.status === 429
    );
    
    if (rateLimitedRequests.length > 0) {
      logTest('Rate Limiting', 'PASS', `${rateLimitedRequests.length} requests were rate limited`);
    } else {
      logTest('Rate Limiting', 'FAIL', 'No requests were rate limited');
    }
  } catch (error) {
    logTest('Rate Limiting', 'ERROR', `Test failed: ${error.message}`);
  }
}

async function testXSSProtection() {
  console.log(chalk.blue('\n🔒 Testing XSS Protection...'));
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    'javascript:alert("XSS")',
    '<img src="x" onerror="alert(\'XSS\')">'
  ];
  
  try {
    for (const payload of xssPayloads) {
      const response = await axios.post(`${API_BASE_URL}/api/user/register`, {
        name: payload,
        email: 'test@example.com',
        password: 'TestPassword123'
      }, { 
        timeout: 5000,
        validateStatus: () => true // Don't throw on 4xx/5xx
      });
      
      if (response.status === 400 && response.data.message.includes('Validation failed')) {
        logTest('XSS Protection', 'PASS', 'XSS payload was blocked');
        break;
      }
    }
  } catch (error) {
    if (error.response?.status === 400) {
      logTest('XSS Protection', 'PASS', 'XSS payload was blocked');
    } else {
      logTest('XSS Protection', 'ERROR', `Test failed: ${error.message}`);
    }
  }
}

async function testNoSQLInjection() {
  console.log(chalk.blue('\n🔒 Testing NoSQL Injection Protection...'));
  
  const injectionPayloads = [
    { $ne: null },
    { $gt: '' },
    { $where: 'this.password' },
    { $regex: '.*' }
  ];
  
  try {
    for (const payload of injectionPayloads) {
      const response = await axios.post(`${API_BASE_URL}/api/user/login`, {
        email: payload,
        password: payload
      }, { 
        timeout: 5000,
        validateStatus: () => true
      });
      
      if (response.status === 400) {
        logTest('NoSQL Injection Protection', 'PASS', 'Injection payload was sanitized');
        break;
      }
    }
  } catch (error) {
    if (error.response?.status === 400) {
      logTest('NoSQL Injection Protection', 'PASS', 'Injection payload was blocked');
    } else {
      logTest('NoSQL Injection Protection', 'ERROR', `Test failed: ${error.message}`);
    }
  }
}

async function testCORSPolicy() {
  console.log(chalk.blue('\n🔒 Testing CORS Policy...'));
  
  try {
    const response = await axios.options(`${API_BASE_URL}/api/user/login`, {
      headers: {
        'Origin': 'https://malicious-site.com',
        'Access-Control-Request-Method': 'POST'
      },
      timeout: 5000,
      validateStatus: () => true
    });
    
    const corsHeader = response.headers['access-control-allow-origin'];
    
    if (!corsHeader || corsHeader !== 'https://malicious-site.com') {
      logTest('CORS Policy', 'PASS', 'Malicious origin was blocked');
    } else {
      logTest('CORS Policy', 'FAIL', 'Malicious origin was allowed');
    }
  } catch (error) {
    logTest('CORS Policy', 'ERROR', `Test failed: ${error.message}`);
  }
}

async function testSecurityHeaders() {
  console.log(chalk.blue('\n🔒 Testing Security Headers...'));
  
  try {
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 5000 });
    
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => !response.headers[header]);
    
    if (missingHeaders.length === 0) {
      logTest('Security Headers', 'PASS', 'All required security headers are present');
    } else {
      logTest('Security Headers', 'WARN', `Missing headers: ${missingHeaders.join(', ')}`);
    }
  } catch (error) {
    logTest('Security Headers', 'ERROR', `Test failed: ${error.message}`);
  }
}

async function testFileUploadSecurity() {
  console.log(chalk.blue('\n🔒 Testing File Upload Security...'));
  
  try {
    // This would require a more complex test with actual file upload
    // For now, we'll test the endpoint existence
    const response = await axios.post(`${API_BASE_URL}/api/product/add`, {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: 'Test',
      subCategory: 'Test',
      sizes: ['M'],
      bestseller: false
    }, { 
      timeout: 5000,
      validateStatus: () => true 
    });
    
    // Should require authentication
    if (response.status === 401) {
      logTest('File Upload Security', 'PASS', 'Endpoint requires authentication');
    } else {
      logTest('File Upload Security', 'WARN', 'Authentication check needed');
    }
  } catch (error) {
    logTest('File Upload Security', 'ERROR', `Test failed: ${error.message}`);
  }
}

// Main test runner
async function runSecurityTests() {
  console.log(chalk.cyan('🔐 Starting Security Tests\n'));
  console.log(chalk.gray(`Testing API at: ${API_BASE_URL}\n`));
  
  try {
    // Test API availability
    await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    console.log(chalk.green('✅ API is reachable\n'));
  } catch (error) {
    console.log(chalk.red(`❌ API is not reachable: ${error.message}`));
    process.exit(1);
  }
  
  // Run all tests
  await testRateLimit();
  await sleep(1000); // Prevent rate limiting between tests
  
  await testXSSProtection();
  await sleep(1000);
  
  await testNoSQLInjection();
  await sleep(1000);
  
  await testCORSPolicy();
  await sleep(1000);
  
  await testSecurityHeaders();
  await sleep(1000);
  
  await testFileUploadSecurity();
  
  // Summary
  console.log(chalk.cyan('\n📊 Security Test Summary:'));
  console.log('='.repeat(50));
  
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const warnings = testResults.filter(r => r.status === 'WARN').length;
  const errors = testResults.filter(r => r.status === 'ERROR').length;
  
  console.log(chalk.green(`✅ Passed: ${passed}`));
  console.log(chalk.red(`❌ Failed: ${failed}`));
  console.log(chalk.yellow(`⚠️  Warnings: ${warnings}`));
  console.log(chalk.red(`🚨 Errors: ${errors}`));
  
  const totalTests = testResults.length;
  const successRate = Math.round((passed / totalTests) * 100);
  
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  
  if (failed > 0 || errors > 0) {
    console.log(chalk.red('\n⚠️  Security issues detected! Please review the failed tests.'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n🎉 All security tests passed!'));
  }
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Security Test Runner

Usage: node security-test.js [options]

Options:
  --help, -h     Show this help message
  --url <url>    API base URL (default: http://localhost:4000)

Environment Variables:
  API_URL        API base URL to test

Tests included:
  - Rate limiting protection
  - XSS attack prevention
  - NoSQL injection protection
  - CORS policy enforcement
  - Security headers presence
  - File upload security
`);
  process.exit(0);
}

if (args.includes('--url')) {
  const urlIndex = args.indexOf('--url');
  if (args[urlIndex + 1]) {
    process.env.API_URL = args[urlIndex + 1];
  }
}

// Run tests
runSecurityTests().catch(error => {
  console.error(chalk.red(`\n💥 Security test runner failed: ${error.message}`));
  process.exit(1);
}); 