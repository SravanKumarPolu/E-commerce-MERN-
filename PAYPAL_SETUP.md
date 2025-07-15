# PayPal Integration Setup Guide

## Backend Configuration

### 1. Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=AbOtiWHzUtnR9K6vDyyfTHQw0px-yRPwUngXPDoN7HbRZSkyMR65KNCvNEqvEldeouNwTwRKihtu1pCl
PAYPAL_CLIENT_SECRET=EGCwPKmHOKPymyfH2csDwCCbdU2Ppv3C9QHnSOBR7ONYiIUk61nlrNRPq4O2vtAjIouyNd5RwfU6cdmm

# Environment
NODE_ENV=development

# Frontend URL (for PayPal return URLs)
FRONTEND_URL=http://localhost:5173
```

### 2. PayPal SDK
The PayPal SDK is already installed in the backend:
```bash
npm install @paypal/checkout-server-sdk
```

## Frontend Configuration

### 1. PayPal React SDK
The PayPal React SDK is already installed in the frontend:
```bash
npm install @paypal/react-paypal-js
```

### 2. Client ID
The PayPal client ID is configured in the `PayPalPayment.tsx` component.

## Features Implemented

### Backend Features:
1. **PayPal Order Creation** (`/api/orders/paypal/create`)
   - Creates PayPal orders with item details
   - Handles shipping address
   - Returns PayPal order ID and links

2. **Payment Capture** (`/api/orders/paypal/capture`)
   - Captures payments after user approval
   - Updates order status
   - Returns payment confirmation

3. **Webhook Handling** (`/api/orders/paypal/webhook`)
   - Handles PayPal webhook events
   - Processes payment completions, refunds, and denials
   - Updates order status based on events

### Frontend Features:
1. **PayPal Payment Component**
   - Integrates PayPal buttons
   - Handles payment flow
   - Shows loading states and error handling

2. **Payment Method Selection**
   - Added PayPal to payment methods
   - PayPal logo and branding
   - Seamless integration with existing checkout

3. **Order Flow**
   - Address validation before payment
   - PayPal payment processing
   - Success/error handling

## Usage

1. **Select PayPal as payment method** in the checkout page
2. **Fill in delivery address** (required for PayPal)
3. **Click "PLACE ORDER"** to proceed to PayPal
4. **Complete payment** through PayPal interface
5. **Return to order confirmation** after successful payment

## Webhook Events Handled

- `PAYMENT.SALE.COMPLETED` - Payment successful
- `PAYMENT.SALE.REFUNDED` - Payment refunded
- `PAYMENT.SALE.DENIED` - Payment denied

## Security Notes

1. **Environment Variables**: Never commit PayPal credentials to version control
2. **Webhook Verification**: Implement webhook signature verification for production
3. **HTTPS**: Use HTTPS in production for secure communication
4. **Error Handling**: Comprehensive error handling for payment failures

## Testing

### Sandbox Mode
- Uses PayPal sandbox environment for testing
- Test with PayPal sandbox accounts
- No real money transactions

### Production Mode
- Set `NODE_ENV=production` for live environment
- Use real PayPal business account credentials
- Enable webhook signature verification

## Troubleshooting

1. **PayPal Button Not Loading**: Check client ID configuration
2. **Order Creation Fails**: Verify backend environment variables
3. **Payment Capture Fails**: Check PayPal account status and permissions
4. **Webhook Not Working**: Verify webhook URL and signature verification

## Next Steps

1. **Database Integration**: Connect PayPal orders to your database
2. **Order Management**: Implement order tracking and management
3. **Refund Handling**: Add refund functionality
4. **Analytics**: Track payment success rates and user behavior 