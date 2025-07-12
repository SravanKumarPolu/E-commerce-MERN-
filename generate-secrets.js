#!/usr/bin/env node

/**
 * Generate secure JWT secrets for the authentication system
 * 
 * Usage: node generate-secrets.js
 * 
 * This script generates cryptographically secure random strings
 * that can be used for JWT_SECRET and JWT_REFRESH_SECRET
 */

const crypto = require('crypto');

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateSecrets() {
  const jwtSecret = generateSecureSecret(64);
  const jwtRefreshSecret = generateSecureSecret(64);
  
  console.log('🔐 Generated Secure JWT Secrets\n');
  console.log('Copy these values to your .env file:\n');
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}\n`);
  
  console.log('⚠️  Important Security Notes:');
  console.log('1. Keep these secrets secure and never commit them to version control');
  console.log('2. Use different secrets for development and production');
  console.log('3. Rotate these secrets regularly for maximum security');
  console.log('4. Store them securely in your deployment environment\n');
  
  console.log('💡 Additional Environment Variables:');
  console.log('JWT_ACCESS_EXPIRE=15m');
  console.log('JWT_REFRESH_EXPIRE=7d');
  console.log('ADMIN_EMAIL=admin@example.com');
  console.log('ADMIN_PASSWORD=' + generateSecureSecret(16));
  console.log('MONGODB_URI=mongodb://localhost:27017/ecommerce');
  console.log('FRONTEND_URL=http://localhost:5173');
  console.log('ADMIN_URL=http://localhost:5174');
}

if (require.main === module) {
  generateSecrets();
}

module.exports = { generateSecureSecret, generateSecrets }; 