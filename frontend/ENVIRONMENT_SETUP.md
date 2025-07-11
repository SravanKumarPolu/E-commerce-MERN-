# Frontend Environment Setup

Create a `.env` file in the frontend directory with the following variables:

## Required Environment Variables

```bash
# Backend API URL - Change this to your backend server URL
VITE_BACKEND_URL=http://localhost:4000

# App Configuration
VITE_APP_NAME=SKR E-Commerce
VITE_APP_VERSION=1.0.0
```

## Optional Environment Variables

```bash
# Payment Gateway Configuration (Frontend Keys)
# Stripe Publishable Key (for client-side payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Razorpay Key ID (for client-side payments)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Google Analytics (optional)
VITE_GA_TRACKING_ID=GA-XXXXXXXXX

# Development/Production Mode
VITE_NODE_ENV=development

# Currency Settings
VITE_DEFAULT_CURRENCY=USD
VITE_CURRENCY_SYMBOL=$

# Features Toggle (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CHAT_SUPPORT=false
VITE_ENABLE_NOTIFICATIONS=true

# CDN/Assets URL (optional)
VITE_ASSETS_URL=https://your-cdn-url.com
```

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the backend URL:**
   - For development: `VITE_BACKEND_URL=http://localhost:4000`
   - For production: `VITE_BACKEND_URL=https://your-api-domain.com`

3. **Configure payment gateways (if using):**
   - Get Stripe publishable key from [Stripe Dashboard](https://dashboard.stripe.com)
   - Get Razorpay key ID from [Razorpay Dashboard](https://dashboard.razorpay.com)

## Important Notes

- **Vite Environment Variables**: Must be prefixed with `VITE_` to be accessible in the frontend
- **Security**: Never commit your `.env` file to version control
- **Public Keys**: Only use publishable/public keys in frontend environment variables
- **Build Time**: Environment variables are embedded at build time in Vite

## Usage in Code

Access environment variables in your React components:

```typescript
// Backend URL
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// App configuration
const appName = import.meta.env.VITE_APP_NAME;

// Payment keys
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
```

## Development vs Production

### Development (.env.development)
```bash
VITE_BACKEND_URL=http://localhost:4000
VITE_NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
```

### Production (.env.production)
```bash
VITE_BACKEND_URL=https://your-api-domain.com
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
``` 