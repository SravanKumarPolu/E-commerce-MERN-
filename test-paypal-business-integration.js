#!/usr/bin/env node

/**
 * PayPal Business Account Integration Test Script
 * 
 * This script verifies that the enhanced PayPal integration is working correctly
 * and that business account payments are being tracked properly.
 * Run with: node test-paypal-business-integration.js
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

async function testPayPalBusinessIntegration() {
  console.log('🧪 Testing PayPal Business Account Integration...\n');

  try {
    // Step 1: Test backend connectivity
    console.log('1️⃣ Testing backend connectivity...');
    const healthCheck = await fetch(`${BACKEND_URL}/`);
    if (healthCheck.ok) {
      console.log('✅ Backend is running and responding');
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
      console.log(`   Token Type: ${authData.token_type}`);
      console.log(`   Expires In: ${authData.expires_in} seconds`);
    } else {
      console.log('❌ PayPal credentials are invalid');
      const errorData = await authResponse.text();
      console.log(`   Error: ${errorData}`);
      return;
    }

    // Step 3: Test PayPal analytics endpoint
    console.log('\n3️⃣ Testing PayPal analytics endpoint...');
    console.log('   Note: This requires admin authentication');
    console.log('   Please test this manually in the admin panel');

    // Step 4: Check PayPal sandbox accounts
    console.log('\n4️⃣ PayPal Sandbox Account Information:');
    console.log('   Business Account: sb-business@business.example.com');
    console.log('   Personal Account: sb-43padr43394022@personal.example.com');
    console.log('   Password: 19^nA9JL');
    console.log('   Client ID: AbOtiWHzUtnR9K6vDyyfTHQw0px-yRPwUngXPDoN7HbRZSkyMR65KNCvNEqvEldeouNwTwRKihtu1pCl');

    // Step 5: Manual testing instructions
    console.log('\n5️⃣ Manual Testing Instructions:');
    console.log('   a) Start all servers:');
    console.log('      - Backend: cd backend && npm start');
    console.log('      - Frontend: cd frontend && npm run dev');
    console.log('      - Admin: cd admin && npm run dev');
    console.log('');
    console.log('   b) Test PayPal payment flow:');
    console.log('      - Login to application');
    console.log('      - Add items to cart');
    console.log('      - Go to checkout');
    console.log('      - Select PayPal payment method');
    console.log('      - Fill in address details');
    console.log('      - Click "PLACE ORDER"');
    console.log('      - Complete payment with sandbox account');
    console.log('');
    console.log('   c) Monitor backend logs for:');
    console.log('      ✅ PayPal order created successfully with USD');
    console.log('      ✅ PayPal capture response status: COMPLETED');
    console.log('      💰 Payment received by business account: sb-business@business.example.com');
    console.log('      💰 Amount received: USD XX.XX');
    console.log('');
    console.log('   d) Check PayPal Sandbox Dashboard:');
    console.log('      - Login to PayPal Developer Dashboard');
    console.log('      - Go to Sandbox > Accounts');
    console.log('      - Check personal account balance (should be reduced)');
    console.log('      - Check business account balance (should be increased)');
    console.log('      - Go to Sandbox > Transactions to see the transaction');
    console.log('');
    console.log('   e) Check Admin Panel:');
    console.log('      - Login to admin panel');
    console.log('      - Go to Analytics > PayPal Analytics');
    console.log('      - Verify payment data is displayed');
    console.log('      - Check business account summary');
    console.log('      - Review recent payments list');

    // Step 6: Expected results
    console.log('\n6️⃣ Expected Results:');
    console.log('   ✅ Personal account balance is reduced');
    console.log('   ✅ Business account balance is increased');
    console.log('   ✅ Transaction appears in PayPal sandbox dashboard');
    console.log('   ✅ Payment data shows in admin PayPal analytics');
    console.log('   ✅ Order status updated to "Order Placed"');
    console.log('   ✅ Payment status updated to "completed"');

    // Step 7: Troubleshooting tips
    console.log('\n7️⃣ Troubleshooting Tips:');
    console.log('   - If payment capture fails, check PayPal order ID validity');
    console.log('   - If business account doesn\'t receive payment, verify payee email');
    console.log('   - If admin panel shows no data, check authentication and API endpoints');
    console.log('   - If sandbox dashboard shows no transaction, verify account configuration');

    console.log('\n🎉 PayPal Business Account Integration Test Complete!');
    console.log('   Follow the manual testing instructions to verify the complete flow.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testPayPalBusinessIntegration(); 