# Backend Environment Setup

Create a `.env` file in the backend directory with the following variables:

## Required Environment Variables

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017

# JWT Secret Key (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server Configuration
PORT=4000

# Frontend URLs (for CORS and payment redirects)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## Setup Instructions

1. **MongoDB**: Set up a MongoDB database (local or MongoDB Atlas)
2. **Cloudinary**: Create account at cloudinary.com for image storage
3. **Stripe**: Create account at stripe.com for payment processing
4. **Razorpay**: Create account at razorpay.com for Indian payments
5. **JWT Secret**: Generate a strong random string for JWT signing

## Payment Gateway Setup

### Stripe
- Sign up at https://stripe.com
- Get your secret key from the dashboard
- Use test keys for development

### Razorpay
- Sign up at https://razorpay.com
- Get API keys from the dashboard
- Use test mode for development

### Other Payment Methods
- Google Pay: Uses Stripe integration
- Paytm: Requires additional paytmchecksum setup (basic implementation provided)

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique passwords for admin accounts
- Regenerate JWT secrets in production
- Use HTTPS in production for payment processing 