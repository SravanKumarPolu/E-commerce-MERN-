#!/usr/bin/env node

/**
 * PayPal Integration Test Script
 * 
 * This script helps test and debug PayPal sandbox integration
 * Run with: node test-paypal-integration.js
 */

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const PAYPAL_CLIENT_ID = 'AbOtiWHzUtnR9K6vDyyfTHQw0px-yRPwUngXPDoN7HbRZSkyMR65KNCvNEqvEldeouNwTwRKihtu1pCl';
const PAYPAL_CLIENT_SECRET = 'EGCwPKmHOKPymyfH2csDwCCbdU2Ppv3C9QHnSOBR7ONYiIUk61nlrNRPq4O2vtAjIouyNd5RwfU6cdmm';

// Test data
const testItems = [
  {
    productId: 'test-product-1',
    name: 'Test Product 1',
    image: 'https://example.com/image1.jpg',
    price: 10.00,
    quantity: 1,
    color: 'Red'
  }
];

const testAddress = {
  street: '123 Test Street',
  city: 'Test City',
  state: 'CA',
  zipcode: '12345',
  country: 'US'
};

async function testPayPalIntegration() {
  console.log('🧪 Testing PayPal Integration...\n');

  try {
    // Step 1: Test backend connectivity
    console.log('1️⃣ Testing backend connectivity...');
    const healthCheck = await fetch(`${BACKEND_URL}/`);
    if (healthCheck.ok) {
      console.log('✅ Backend is running');
    } else {
      console.log('❌ Backend is not responding');
      return;
    }

    // Step 2: Test PayPal credentials
    console.log('\n2️⃣ Testing PayPal credentials...');
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ PayPal credentials are valid');
      console.log(`   Access Token: ${authData.access_token.substring(0, 20)}...`);
    } else {
      console.log('❌ PayPal credentials are invalid');
      const errorData = await authResponse.text();
      console.log(`   Error: ${errorData}`);
      return;
    }

    // Step 3: Test PayPal order creation (without authentication)
    console.log('\n3️⃣ Testing PayPal order creation...');
    console.log('   Note: This requires a valid user token');
    console.log('   Please test this manually in the frontend');

    // Step 4: Check PayPal sandbox accounts
    console.log('\n4️⃣ PayPal Sandbox Account Information:');
    console.log('   Business Account: sb-business@business.example.com');
    console.log('   Personal Account: sb-43padr43394022@personal.example.com');
    console.log('   Password: 19^nA9JL');
    console.log('   Client ID: AbOtiWHzUtnR9K6vDyyfTHQw0px-yRPwUngXPDoN7HbRZSkyMR65KNCvNEqvEldeouNwTwRKihtu1pCl');

    // Step 5: Manual testing instructions
    console.log('\n5️⃣ Manual Testing Instructions:');
    console.log('   1. Start the backend: cd backend && npm start');
    console.log('   2. Start the frontend: cd frontend && npm run dev');
    console.log('   3. Login to the application');
    console.log('   4. Add items to cart');
    console.log('   5. Go to checkout');
    console.log('   6. Select PayPal payment method');
    console.log('   7. Fill in address details');
    console.log('   8. Click "PLACE ORDER"');
    console.log('   9. Complete payment with sandbox account');
    console.log('   10. Check backend logs for capture messages');

    // Step 6: Expected log messages
    console.log('\n6️⃣ Expected Backend Log Messages:');
    console.log('   🚀 Creating PayPal order with USD ONLY');
    console.log('   ✅ PayPal order created successfully with USD');
    console.log('   🔄 Capturing PayPal payment');
    console.log('   💰 Executing PayPal capture request...');
    console.log('   ✅ PayPal capture response status: COMPLETED');
    console.log('   🎉 Payment completed successfully');
    console.log('   📦 Order updated in database');
    console.log('   🛒 Cart cleared for user');

    // Step 7: Troubleshooting tips
    console.log('\n7️⃣ Troubleshooting Tips:');
    console.log('   - Check if both servers are running');
    console.log('   - Verify PayPal sandbox accounts have sufficient balance');
    console.log('   - Monitor backend logs for error messages');
    console.log('   - Check PayPal Developer Dashboard for transactions');
    console.log('   - Ensure environment variables are set correctly');

    console.log('\n✅ PayPal integration test completed!');
    console.log('   Run the manual test to verify the complete flow.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPayPalIntegration(); 