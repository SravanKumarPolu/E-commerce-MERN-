import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing PayPal Configuration...');
console.log('Client ID:', process.env.PAYPAL_CLIENT_ID ? 'Present' : 'Missing');
console.log('Client Secret:', process.env.PAYPAL_CLIENT_SECRET ? 'Present' : 'Missing');

// PayPal configuration
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

async function testPayPalOrder() {
  try {
    console.log('\n🚀 Creating test PayPal order with USD...');
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '11.00',
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: '1.00'
            },
            shipping: {
              currency_code: 'USD',
              value: '10.00'
            }
          }
        },
        items: [{
          name: 'Test Product',
          unit_amount: {
            currency_code: 'USD',
            value: '1.00'
          },
          quantity: '1',
          category: 'PHYSICAL_GOODS'
        }],
        shipping: {
          address: {
            address_line_1: '123 Test St',
            admin_area_2: 'Test City',
            admin_area_1: 'CA',
            postal_code: '12345',
            country_code: 'US'
          }
        }
      }],
      application_context: {
        return_url: 'http://localhost:5173/payment/success',
        cancel_url: 'http://localhost:5173/payment/cancel',
        user_action: 'PAY_NOW',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        locale: 'en-US',
        brand_name: 'Test Store'
      }
    });

    const order = await client.execute(request);
    console.log('✅ PayPal order created successfully!');
    console.log('Order ID:', order.result.id);
    console.log('Status:', order.result.status);
    console.log('Currency:', order.result.purchase_units[0].amount.currency_code);
    console.log('Amount:', order.result.purchase_units[0].amount.value);
    
    return true;
  } catch (error) {
    console.error('❌ PayPal order creation failed:');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return false;
  }
}

testPayPalOrder().then(success => {
  console.log('\n' + (success ? '✅ PayPal test PASSED' : '❌ PayPal test FAILED'));
  process.exit(success ? 0 : 1);
}); 