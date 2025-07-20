#!/usr/bin/env node

import 'dotenv/config';
import TestUtilities from './test-utilities.js';

class TestRunner {
  constructor() {
    this.testUtils = new TestUtilities();
    this.results = {};
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive test suite...\n');
    
    try {
      // 1. Environment Configuration Test
      await this.testEnvironmentConfiguration();
      
      // 2. Database Connection Test
      await this.testDatabaseConnection();
      
      // 3. Email Service Test
      await this.testEmailService();
      
      // 4. Security Features Test
      await this.testSecurityFeatures();
      
      // 5. Analytics System Test
      await this.testAnalyticsSystem();
      
      // 6. Performance Test
      await this.testPerformance();
      
      // 7. Integration Test
      await this.testIntegration();
      
      // Print final results
      this.printFinalResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    }
  }

  async testEnvironmentConfiguration() {
    console.log('🔧 Testing Environment Configuration...');
    
    const requiredEnvVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'SMTP_HOST',
      'SMTP_USER',
      'SMTP_PASS',
      'FRONTEND_URL',
      'APP_NAME'
    ];

    const missingVars = [];
    const presentVars = [];

    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        presentVars.push(envVar);
      } else {
        missingVars.push(envVar);
      }
    }

    this.results.environment = {
      passed: missingVars.length === 0,
      present: presentVars.length,
      missing: missingVars.length,
      missingVars
    };

    if (this.results.environment.passed) {
      console.log('✅ All required environment variables are configured');
    } else {
      console.log('❌ Missing environment variables:', missingVars.join(', '));
    }
    console.log('');
  }

  async testDatabaseConnection() {
    console.log('🗄️ Testing Database Connection...');
    
    try {
      const connected = await this.testUtils.connectToTestDB();
      this.results.database = { passed: connected };
      
      if (connected) {
        console.log('✅ Database connection successful');
        
        // Test basic operations
        const testUser = await this.testUtils.createTestUser();
        const testProduct = await this.testUtils.createTestProduct();
        
        this.results.database.operations = {
          userCreation: !!testUser,
          productCreation: !!testProduct
        };
        
        console.log('✅ Database operations successful');
      } else {
        console.log('❌ Database connection failed');
      }
    } catch (error) {
      console.log('❌ Database test failed:', error.message);
      this.results.database = { passed: false, error: error.message };
    }
    console.log('');
  }

  async testEmailService() {
    console.log('📧 Testing Email Service...');
    
    try {
      const emailTest = await this.testUtils.testEmailService();
      this.results.email = emailTest;
      
      if (emailTest.success) {
        console.log('✅ Email service is working correctly');
      } else {
        console.log('❌ Email service test failed:', emailTest.message);
      }
    } catch (error) {
      console.log('❌ Email service test failed:', error.message);
      this.results.email = { success: false, message: error.message };
    }
    console.log('');
  }

  async testSecurityFeatures() {
    console.log('🔒 Testing Security Features...');
    
    try {
      const securityTests = await this.testUtils.testSecurityFeatures();
      this.results.security = {
        passed: securityTests.every(test => test.passed),
        tests: securityTests
      };
      
      for (const test of securityTests) {
        const status = test.passed ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${test.message}`);
      }
    } catch (error) {
      console.log('❌ Security test failed:', error.message);
      this.results.security = { passed: false, error: error.message };
    }
    console.log('');
  }

  async testAnalyticsSystem() {
    console.log('📊 Testing Analytics System...');
    
    try {
      const analyticsData = await this.testUtils.createTestAnalyticsData();
      this.results.analytics = {
        passed: true,
        data: analyticsData
      };
      
      console.log(`✅ Created ${analyticsData.activities} user activities`);
      console.log(`✅ Created ${analyticsData.performance} product performance records`);
      console.log(`✅ Created ${analyticsData.searches} search analytics records`);
    } catch (error) {
      console.log('❌ Analytics test failed:', error.message);
      this.results.analytics = { passed: false, error: error.message };
    }
    console.log('');
  }

  async testPerformance() {
    console.log('⚡ Testing Performance...');
    
    try {
      const performanceResults = await this.testUtils.testDatabasePerformance();
      this.results.performance = {
        passed: true,
        results: performanceResults
      };
      
      console.log(`✅ User creation: ${performanceResults.userCreation.count} users in ${performanceResults.userCreation.time}ms (${performanceResults.userCreation.average.toFixed(2)}ms avg)`);
      console.log(`✅ Product creation: ${performanceResults.productCreation.count} products in ${performanceResults.productCreation.time}ms (${performanceResults.productCreation.average.toFixed(2)}ms avg)`);
      console.log(`✅ Query performance: ${performanceResults.queryPerformance.time}ms for ${performanceResults.queryPerformance.userCount} users and ${performanceResults.queryPerformance.productCount} products`);
    } catch (error) {
      console.log('❌ Performance test failed:', error.message);
      this.results.performance = { passed: false, error: error.message };
    }
    console.log('');
  }

  async testIntegration() {
    console.log('🔗 Testing Integration...');
    
    try {
      const integrationResults = await this.testUtils.runFullIntegrationTest();
      this.results.integration = integrationResults;
      
      for (const [test, result] of Object.entries(integrationResults)) {
        const status = result ? '✅' : '❌';
        console.log(`${status} ${test}: ${result ? 'PASS' : 'FAIL'}`);
      }
    } catch (error) {
      console.log('❌ Integration test failed:', error.message);
      this.results.integration = { passed: false, error: error.message };
    }
    console.log('');
  }

  printFinalResults() {
    console.log('📋 FINAL TEST RESULTS');
    console.log('='.repeat(60));
    
    let totalTests = 0;
    let passedTests = 0;
    
    for (const [testName, result] of Object.entries(this.results)) {
      totalTests++;
      const passed = this.isTestPassed(result);
      if (passed) passedTests++;
      
      const status = passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${testName.toUpperCase()}: ${status}`);
      
      if (!passed && result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    
    console.log('='.repeat(60));
    console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All tests passed! Your application is ready for deployment.');
      process.exit(0);
    } else {
      console.log('⚠️ Some tests failed. Please fix the issues before deployment.');
      process.exit(1);
    }
  }

  isTestPassed(result) {
    if (typeof result === 'boolean') return result;
    if (typeof result === 'object') {
      if (result.passed !== undefined) return result.passed;
      if (result.success !== undefined) return result.success;
    }
    return false;
  }

  async cleanup() {
    try {
      if (this.results.database?.passed) {
        await this.testUtils.clearTestDatabase();
        await this.testUtils.disconnectFromTestDB();
      }
    } catch (error) {
      console.error('Cleanup failed:', error.message);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Test interrupted by user');
    await runner.cleanup();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🛑 Test terminated');
    await runner.cleanup();
    process.exit(0);
  });
  
  runner.runAllTests().finally(async () => {
    await runner.cleanup();
  });
}

module.exports = TestRunner; 