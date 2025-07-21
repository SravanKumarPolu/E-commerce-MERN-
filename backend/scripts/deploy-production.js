#!/usr/bin/env node

/**
 * Production Deployment Script for PayPal Transfer System
 * 
 * This script sets up the production environment for the PayPal transfer functionality.
 * It includes database setup, environment configuration, and security checks.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const PRODUCTION_CONFIG = {
  NODE_ENV: 'production',
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI_PROD || process.env.MONGODB_URI,
  PAYPAL_MODE: 'live',
  WEBHOOK_VERIFICATION: true,
  SSL_ENABLED: true,
  RATE_LIMITING: true,
  LOGGING: 'error'
};

class ProductionDeployer {
  constructor() {
    this.checks = [];
    this.errors = [];
  }

  async run() {
    console.log('🚀 Starting Production Deployment for PayPal Transfer System...\n');

    try {
      // Run all deployment checks
      await this.runPreDeploymentChecks();
      await this.setupDatabase();
      await this.configureEnvironment();
      await this.setupSecurity();
      await this.verifyPayPalConfiguration();
      await this.setupWebhooks();
      await this.runPostDeploymentTests();

      console.log('\n✅ Production deployment completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. Start the production server: npm start');
      console.log('2. Monitor logs for any issues');
      console.log('3. Test PayPal transfers with small amounts');
      console.log('4. Set up monitoring and alerting');

    } catch (error) {
      console.error('\n❌ Deployment failed:', error.message);
      console.error('\n🔧 Troubleshooting:');
      this.errors.forEach((err, index) => {
        console.error(`${index + 1}. ${err}`);
      });
      process.exit(1);
    }
  }

  async runPreDeploymentChecks() {
    console.log('🔍 Running pre-deployment checks...');

    // Check Node.js version
    const nodeVersion = process.version;
    if (!nodeVersion.startsWith('v18') && !nodeVersion.startsWith('v20')) {
      this.errors.push('Node.js version 18+ required');
    } else {
      console.log('✅ Node.js version:', nodeVersion);
    }

    // Check environment variables
    const requiredEnvVars = [
      'PAYPAL_CLIENT_ID',
      'PAYPAL_CLIENT_SECRET',
      'JWT_SECRET',
      'MONGODB_URI'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        this.errors.push(`Missing environment variable: ${envVar}`);
      } else {
        console.log(`✅ ${envVar}: ${envVar.includes('SECRET') ? '***' : process.env[envVar]}`);
      }
    }

    // Check if running in production mode
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  Not running in production mode. Set NODE_ENV=production');
    }

    if (this.errors.length > 0) {
      throw new Error('Pre-deployment checks failed');
    }
  }

  async setupDatabase() {
    console.log('\n🗄️  Setting up database...');

    try {
      // Connect to MongoDB
      await mongoose.connect(PRODUCTION_CONFIG.MONGODB_URI);
      console.log('✅ Connected to MongoDB');

      // Create indexes for Transfer model
      const Transfer = mongoose.model('transfer');
      await Transfer.createIndexes();
      console.log('✅ Database indexes created');

      // Verify Transfer model
      const transferCount = await Transfer.countDocuments();
      console.log(`✅ Transfer model verified (${transferCount} existing transfers)`);

      await mongoose.disconnect();
    } catch (error) {
      this.errors.push(`Database setup failed: ${error.message}`);
      throw error;
    }
  }

  async configureEnvironment() {
    console.log('\n⚙️  Configuring environment...');

    // Create production environment file
    const envContent = `# Production Environment Configuration
NODE_ENV=production
PORT=${PRODUCTION_CONFIG.PORT}
MONGODB_URI=${PRODUCTION_CONFIG.MONGODB_URI}
PAYPAL_CLIENT_ID=${process.env.PAYPAL_CLIENT_ID}
PAYPAL_CLIENT_SECRET=${process.env.PAYPAL_CLIENT_SECRET}
PAYPAL_MODE=live
JWT_SECRET=${process.env.JWT_SECRET}
FRONTEND_URL=${process.env.FRONTEND_URL || 'https://yourdomain.com'}

# Security Configuration
WEBHOOK_VERIFICATION=true
SSL_ENABLED=true
RATE_LIMITING=true
LOG_LEVEL=error

# PayPal Webhook Configuration
PAYPAL_WEBHOOK_ID=${process.env.PAYPAL_WEBHOOK_ID || ''}
PAYPAL_WEBHOOK_SECRET=${process.env.PAYPAL_WEBHOOK_SECRET || ''}
`;

    try {
      fs.writeFileSync('.env.production', envContent);
      console.log('✅ Production environment file created');
    } catch (error) {
      this.errors.push(`Failed to create environment file: ${error.message}`);
    }
  }

  async setupSecurity() {
    console.log('\n🔒 Setting up security...');

    // Generate secure JWT secret if not provided
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 64) {
      const secureSecret = crypto.randomBytes(64).toString('hex');
      console.log('✅ Generated secure JWT secret');
      console.log('⚠️  Update your JWT_SECRET environment variable with:', secureSecret);
    }

    // Check for common security issues
    const securityChecks = [
      { name: 'HTTPS Required', check: () => process.env.FRONTEND_URL?.startsWith('https://') },
      { name: 'Strong JWT Secret', check: () => process.env.JWT_SECRET?.length >= 64 },
      { name: 'Production Mode', check: () => process.env.NODE_ENV === 'production' }
    ];

    for (const check of securityChecks) {
      if (check.check()) {
        console.log(`✅ ${check.name}`);
      } else {
        console.warn(`⚠️  ${check.name} - Review recommended`);
      }
    }
  }

  async verifyPayPalConfiguration() {
    console.log('\n💰 Verifying PayPal configuration...');

    try {
      // Test PayPal API connection
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
      
      const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (response.ok) {
        console.log('✅ PayPal API connection successful');
      } else {
        this.errors.push('PayPal API connection failed - check credentials');
      }
    } catch (error) {
      this.errors.push(`PayPal verification failed: ${error.message}`);
    }
  }

  async setupWebhooks() {
    console.log('\n🔗 Setting up webhooks...');

    const webhookUrl = `${process.env.FRONTEND_URL || 'https://yourdomain.com'}/api/paypal-transfer/webhook`;
    
    console.log('📋 Webhook Configuration:');
    console.log(`   URL: ${webhookUrl}`);
    console.log('   Events: PAYMENT.PAYOUTS-ITEM.SUCCEEDED, PAYMENT.PAYOUTS-ITEM.FAILED');
    console.log('\n⚠️  Manual Setup Required:');
    console.log('1. Go to PayPal Developer Dashboard');
    console.log('2. Navigate to Webhooks');
    console.log('3. Add webhook endpoint with the URL above');
    console.log('4. Select the required events');
    console.log('5. Copy the webhook ID and secret to environment variables');
  }

  async runPostDeploymentTests() {
    console.log('\n🧪 Running post-deployment tests...');

    // Test database connection
    try {
      await mongoose.connect(PRODUCTION_CONFIG.MONGODB_URI);
      const Transfer = mongoose.model('transfer');
      await Transfer.countDocuments();
      console.log('✅ Database connection test passed');
      await mongoose.disconnect();
    } catch (error) {
      this.errors.push(`Database test failed: ${error.message}`);
    }

    // Test environment variables
    const envTest = [
      'NODE_ENV',
      'PAYPAL_CLIENT_ID',
      'PAYPAL_CLIENT_SECRET',
      'JWT_SECRET'
    ];

    for (const envVar of envTest) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar} configured`);
      } else {
        this.errors.push(`${envVar} not configured`);
      }
    }
  }
}

// Run deployment if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployer = new ProductionDeployer();
  deployer.run().catch(console.error);
}

export default ProductionDeployer; 