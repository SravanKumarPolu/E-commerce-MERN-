# 🛠️ Environment Setup Guide

This guide will help you set up environment variables for all three components of the E-commerce MERN application.

## 📁 Project Structure

```
E-commerce-MERN/
├── backend/           # Node.js/Express API
├── frontend/          # React Customer App
├── admin/            # React Admin Panel
└── ENVIRONMENT_SETUP.md (this file)
```

## 🚀 Quick Setup

### 1. Backend Setup
```bash
cd backend
cp env.example .env
# Edit .env with your actual values
```

### 2. Frontend Setup
```bash
cd frontend
cp env.example .env
# Edit .env with your actual values
```

### 3. Admin Panel Setup
```bash
cd admin
cp env.example .env
# Edit .env with your actual values
```

## 🔧 Detailed Configuration

### Backend Environment Variables

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password

**Optional (for full functionality):**
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY` - For image uploads
- `STRIPE_SECRET_KEY` - For Stripe payments
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` - For Razorpay payments

### Frontend Environment Variables

**Required:**
- `VITE_BACKEND_URL` - Backend API URL

**Optional:**
- `VITE_STRIPE_PUBLISHABLE_KEY` - For Stripe payments (client-side)
- `VITE_RAZORPAY_KEY_ID` - For Razorpay payments (client-side)

### Admin Panel Environment Variables

**Required:**
- `VITE_BACKEND_URL` - Backend API URL (same as frontend)

**Optional:**
- File upload and UI configuration variables

## 🛠️ Service Setup Instructions

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community  # macOS
# or follow instructions for your OS

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Use in .env
MONGODB_URI=mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Use in .env: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/`

### 2. Cloudinary Setup (for Image Uploads)

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to backend .env:
   ```
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_SECRET_KEY=your_api_secret
   ```

### 3. Payment Gateway Setup

**Stripe:**
1. Sign up at [Stripe](https://stripe.com/)
2. Get test keys from Dashboard
3. Backend: `STRIPE_SECRET_KEY=sk_test_...`
4. Frontend: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`

**Razorpay:**
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get test keys from Dashboard
3. Backend: `RAZORPAY_KEY_ID=rzp_test_...` and `RAZORPAY_KEY_SECRET=...`
4. Frontend: `VITE_RAZORPAY_KEY_ID=rzp_test_...`

## 🔐 Security Best Practices

### 1. Environment Files
- ✅ **DO**: Keep `.env` files local only
- ❌ **DON'T**: Commit `.env` files to version control
- ✅ **DO**: Use strong, unique passwords
- ✅ **DO**: Regenerate secrets for production

### 2. JWT Secrets
```bash
# Generate a strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Admin Credentials
- Use strong passwords
- Consider using bcrypt for hashing (implement in backend)
- Change default credentials immediately

## 🌍 Environment-Specific Configurations

### Development
```bash
# Backend
MONGODB_URI=mongodb://localhost:27017
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Frontend
VITE_BACKEND_URL=http://localhost:4000

# Admin
VITE_BACKEND_URL=http://localhost:4000
```

### Production
```bash
# Backend
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com

# Frontend
VITE_BACKEND_URL=https://your-api-domain.com

# Admin
VITE_BACKEND_URL=https://your-api-domain.com
```

## 🚦 Startup Order

1. **Start Backend** (port 4000)
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend** (port 5173)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Start Admin Panel** (port 5174)
   ```bash
   cd admin
   npm run dev
   ```

## 🐛 Troubleshooting

### Common Issues:

1. **Backend won't start:**
   - Check MongoDB connection
   - Verify all required env vars are set
   - Check port 4000 isn't in use

2. **Frontend/Admin can't connect:**
   - Verify `VITE_BACKEND_URL` is correct
   - Check if backend is running
   - Check CORS settings

3. **Payment issues:**
   - Verify payment gateway keys
   - Check if using test/live keys consistently
   - Ensure frontend and backend keys match

4. **Image upload issues:**
   - Check Cloudinary credentials
   - Verify file size limits
   - Check network connectivity

## 📚 Additional Resources

- [Backend Environment Setup](./backend/ENVIRONMENT_SETUP.md)
- [Frontend Environment Setup](./frontend/ENVIRONMENT_SETUP.md)
- [Admin Environment Setup](./admin/ENVIRONMENT_SETUP.md)
- [API Routes Documentation](./backend/ROUTES_OVERVIEW.md)

## 💡 Next Steps

After setting up environment variables:

1. **Test the application:**
   - Try admin login
   - Add a product
   - Test frontend product display
   - Test cart functionality

2. **Set up payment testing:**
   - Use Stripe test cards
   - Test Razorpay integration
   - Verify payment flows

3. **Deploy to production:**
   - Update environment variables for production
   - Set up HTTPS
   - Configure production databases
   - Set up monitoring

Your E-commerce MERN application should now be fully configured and ready to run! 