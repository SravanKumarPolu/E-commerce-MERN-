# E-commerce MERN Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring comprehensive authentication, input validation, and modern security practices.

## 🚀 Features

### Authentication & Security
- **JWT-based Authentication** with access/refresh tokens
- **Email Verification** for new accounts
- **Password Reset** functionality
- **Rate Limiting** to prevent brute force attacks
- **Account Lockout** after failed login attempts
- **Input Validation** with comprehensive sanitization
- **XSS Protection** and MongoDB injection prevention
- **Role-based Access Control** (user/admin)

### E-commerce Features
- **Product Management** (CRUD operations)
- **Shopping Cart** with real-time updates
- **Order Management** with status tracking
- **Payment Integration** (Stripe, Razorpay)
- **Search & Filter** functionality
- **Responsive Design** for all devices

### Backend Features
- **RESTful API** with proper error handling
- **Database Models** for users, products, orders, cart
- **File Upload** with Cloudinary integration
- **Email Service** for notifications
- **Comprehensive Logging** for debugging

### Frontend Features
- **React TypeScript** with modern hooks
- **Context API** for state management
- **Protected Routes** for authenticated users
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Responsive UI** with Tailwind CSS

## 🛠️ Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- express-validator for input validation
- Cloudinary for image storage
- Nodemailer for email services

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- React-Toastify for notifications
- Context API for state management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd E-commerce-MERN-
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_very_secure_refresh_secret_key_here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password

# Email Configuration
EMAIL_FROM=noreply@yourstore.com
EMAIL_SERVICE=console
# For production, use:
# EMAIL_SERVICE=sendgrid
# SENDGRID_API_KEY=your_sendgrid_api_key

# Frontend URLs
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Payment Gateways (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000

# App Configuration
VITE_APP_NAME=SKR E-Commerce
VITE_APP_VERSION=1.0.0

# Payment Gateway Keys (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Generate JWT Secrets
```bash
cd backend
node generate-secrets.js
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd backend
npm run server
```
The backend will run on `http://localhost:4000`

2. **Start the frontend (in a new terminal):**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Start the backend:**
```bash
cd backend
npm start
```

## 🔐 Authentication Flow

### User Registration
1. User creates an account with name, email, and password
2. System validates input and creates user account
3. Email verification link sent to user's email
4. User clicks verification link to activate account
5. User can now access protected features

### User Login
1. User enters email and password
2. System validates credentials
3. Returns access token (15min) and refresh token (7d)
4. Frontend automatically handles token refresh
5. User stays logged in until logout or token expiry

### Password Reset
1. User requests password reset via email
2. System sends secure reset link to user's email
3. User clicks link and enters new password
4. System updates password and invalidates old tokens

## 📝 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login
- `POST /api/user/refresh-token` - Token refresh
- `POST /api/user/logout` - User logout
- `POST /api/user/verify-email` - Email verification
- `POST /api/user/request-password-reset` - Request password reset
- `POST /api/user/reset-password` - Reset password

### Products
- `GET /api/product/list` - Get all products
- `POST /api/product/single` - Get single product
- `POST /api/product/add` - Add product (admin)
- `POST /api/product/remove` - Remove product (admin)

### Cart
- `POST /api/cart/get` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update cart item

### Orders
- `POST /api/order/place` - Place order
- `POST /api/order/userorders` - Get user orders
- `POST /api/order/list` - Get all orders (admin)
- `POST /api/order/status` - Update order status (admin)

## 🛡️ Security Features

### Input Validation
- All inputs are validated before processing
- XSS prevention through input sanitization
- SQL injection protection with parameterized queries
- File upload validation with type and size checks

### Authentication Security
- Strong password requirements (8+ chars, uppercase, lowercase, numbers)
- JWT tokens with short expiration times
- Refresh token rotation for enhanced security
- Account lockout after failed login attempts
- Rate limiting to prevent brute force attacks

### Database Security
- MongoDB injection prevention
- Sensitive data encryption
- Secure password hashing with bcrypt
- Environment variables for sensitive configuration

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Loading States** - Visual feedback during operations
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback
- **Protected Routes** - Automatic login redirects
- **Form Validation** - Real-time form validation
- **Search & Filter** - Advanced product filtering

## 📚 Documentation

- [Authentication Guide](./AUTHENTICATION_GUIDE.md) - Comprehensive auth documentation
- [Validation Guide](./VALIDATION_GUIDE.md) - Input validation details
- [API Documentation](./API_DOCS.md) - Complete API reference

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your deployment platform
2. Update `FRONTEND_URL` and `ADMIN_URL` to production URLs
3. Configure MongoDB Atlas connection string
4. Set up email service (SendGrid/Nodemailer)

### Frontend Deployment (Vercel/Netlify)
1. Update `VITE_BACKEND_URL` to production backend URL
2. Build and deploy the frontend
3. Set up environment variables in deployment platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- React team for the powerful frontend library
- MongoDB team for the flexible database
- All contributors and open-source libraries used

## 📞 Support

For support, email support@yourstore.com or create an issue in the repository.

---

**Happy coding!** 🎉


