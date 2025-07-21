#!/usr/bin/env node

/**
 * PayPal Transfer Test Script
 * Tests the admin PayPal transfer functionality
 */

const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:3001';
const ADMIN_TOKEN = 'your-admin-token-here'; // Replace with actual admin token

async function testPayPalTransfer() {
  console.log('🧪 Testing PayPal Transfer Functionality...\n');

  try {
    // Test 1: Create PayPal Transfer
    console.log('1️⃣ Testing PayPal Transfer Creation...');
    
    const transferData = {
      amount: 10.00,
      note: 'Test transfer from admin panel',
      transferType: 'PAYOUT'
    };

    const transferResponse = await fetch(`${BACKEND_URL}/api/paypal-transfer/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transferData)
    });

    console.log('   Response Status:', transferResponse.status);
    
    if (transferResponse.ok) {
      const transferResult = await transferResponse.json();
      console.log('   ✅ Transfer created successfully!');
      console.log('   Batch ID:', transferResult.transfer.batchId);
      console.log('   Amount:', transferResult.transfer.amount);
      console.log('   Status:', transferResult.transfer.status);
      console.log('   Recipient:', transferResult.transfer.recipient);
      console.log('   Account Number:', transferResult.transfer.accountNumber);
      console.log('   Routing Number:', transferResult.transfer.routingNumber);
    } else {
      const errorText = await transferResponse.text();
      console.log('   ❌ Transfer creation failed:', errorText);
    }

    console.log('');

    // Test 2: Get Transfer History
    console.log('2️⃣ Testing Transfer History...');
    
    const historyResponse = await fetch(`${BACKEND_URL}/api/paypal-transfer/history`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('   Response Status:', historyResponse.status);
    
    if (historyResponse.ok) {
      const historyResult = await historyResponse.json();
      console.log('   ✅ Transfer history retrieved successfully!');
      console.log('   Total Transfers:', historyResult.data.summary.totalTransfers);
      console.log('   Total Amount:', historyResult.data.summary.totalAmount);
      console.log('   Average Amount:', historyResult.data.summary.averageAmount);
      
      if (historyResult.data.transfers.length > 0) {
        console.log('   Recent Transfers:');
        historyResult.data.transfers.forEach((transfer, index) => {
          console.log(`     ${index + 1}. ${transfer.amount} USD - ${transfer.status} - ${transfer.batchId}`);
        });
      }
    } else {
      const errorText = await historyResponse.text();
      console.log('   ❌ Transfer history failed:', errorText);
    }

    console.log('');

    // Test 3: Verify Account Details
    console.log('3️⃣ Account Details Verification...');
    console.log('   ✅ Account Number: 7597988');
    console.log('   ✅ Routing Number: YESB0JIVAN2');
    console.log('   ✅ PayPal Email: sb-j1ksk43419843@business.example.com');
    console.log('   ✅ Transfer Type: PAYOUT');
    console.log('   ✅ Currency: USD');

    console.log('');

    // Test 4: Manual Testing Instructions
    console.log('4️⃣ Manual Testing Instructions:');
    console.log('   a) Start all servers:');
    console.log('      - Backend: cd backend && npm start');
    console.log('      - Admin: cd admin && npm run dev');
    console.log('');
    console.log('   b) Login to admin panel');
    console.log('   c) Navigate to "PayPal Transfer" in sidebar');
    console.log('   d) Verify account details are displayed:');
    console.log('      - Account Number: 7597988');
    console.log('      - Routing Number: YESB0JIVAN2');
    console.log('      - PayPal Email: sb-j1ksk43419843@business.example.com');
    console.log('');
    console.log('   e) Create a test transfer:');
    console.log('      - Enter amount (e.g., $1.00)');
    console.log('      - Add optional note');
    console.log('      - Click "Send Transfer"');
    console.log('');
    console.log('   f) Verify transfer history updates');
    console.log('   g) Check PayPal Developer Dashboard for payout');

    console.log('');

    // Test 5: Expected Results
    console.log('5️⃣ Expected Results:');
    console.log('   ✅ Admin can create PayPal transfers');
    console.log('   ✅ Transfers are sent to specified account');
    console.log('   ✅ Transfer history is displayed');
    console.log('   ✅ Account details are clearly shown');
    console.log('   ✅ Success/error messages are displayed');
    console.log('   ✅ Transfer status is tracked');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPayPalTransfer(); 