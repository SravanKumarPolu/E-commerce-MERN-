# E-commerce MERN Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring comprehensive authentication, input validation, and modern security practices.

## 🔐 Security Features

### Comprehensive Security Implementation

The application implements enterprise-grade security measures to protect against common web vulnerabilities and attacks.

#### 🛡️ Authentication & Authorization
- **JWT-based Authentication** with secure token management
- **Dual Token System**: Access tokens (15min) + Refresh tokens (7d)
- **Role-based Access Control** (User/Admin permissions)
- **Account Lockout**: Automatic lockout after 5 failed attempts (15min)
- **Password Policy**: Strong password requirements with validation
- **Session Management**: Secure HTTP-only cookies with SameSite protection

#### 🔒 Input Validation & Sanitization
- **Express Validator**: Comprehensive server-side validation
- **XSS Protection**: HTML sanitization and script injection prevention
- **NoSQL Injection Prevention**: MongoDB query sanitization
- **CSRF Protection**: Cross-Site Request Forgery tokens
- **File Upload Security**: Type validation, size limits, malicious file detection
- **Parameter Pollution Protection**: HTTP Parameter Pollution prevention

#### ⚡ Rate Limiting & DDoS Protection
- **Authentication Endpoints**: 5 attempts per 15 minutes
- **API Endpoints**: 100 requests per 15 minutes  
- **Payment Endpoints**: 3 attempts per minute
- **Progressive Delays**: Exponential backoff for suspicious behavior
- **IP-based Tracking**: Per-client rate limiting

#### 🛠️ Security Headers & CORS
- **Helmet.js**: Comprehensive security headers
- **HSTS**: HTTP Strict Transport Security (1 year)
- **CSP**: Content Security Policy with strict directives
- **CORS**: Restricted to configured origins only
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing prevention

#### 🔐 Data Protection
- **Encryption at Rest**: AES-256-GCM for sensitive data
- **Password Hashing**: bcrypt with 12 salt rounds
- **Environment Variables**: Secure secret management
- **Data Sanitization**: Input/output cleaning
- **Secure File Storage**: Cloudinary integration with validation

#### 📊 Security Monitoring & Logging
- **Audit Trails**: Comprehensive security event logging
- **Real-time Monitoring**: Failed login attempts, rate limit hits
- **Alert System**: Automated security threat detection
- **Error Tracking**: Secure error reporting without data leaks
- **Admin Action Logging**: All administrative operations tracked

### Security Configuration

#### Environment Variables Setup

Create a `.env` file with these security configurations:

```bash
# JWT Security (Required - Generate strong secrets)
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_at_least_64_characters_long
JWT_REFRESH_SECRET=your_different_refresh_secret_key_at_least_64_characters_long

# Database Security
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Admin Security
ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=Your_Very_Secure_Admin_Password_123!

# CORS Security
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Optional Security Settings
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
PAYMENT_RATE_LIMIT_MAX=3
ENCRYPTION_KEY=your_64_character_encryption_key_here
```

#### Security Testing

Run comprehensive security tests:

```bash
# Backend security tests
cd backend
npm run security:test

# Security audit
npm run security:audit

# Check for vulnerabilities
npm run security:check
```

#### Security Headers Implemented

```javascript
// Content Security Policy
{
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:", "https:", "http:"],
  scriptSrc: ["'self'"],
  connectSrc: ["'self'", "https:", "wss:"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"]
}
```

### Production Security Checklist

#### Before Deployment
- [ ] Generate strong JWT secrets (64+ characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set NODE_ENV=production
- [ ] Configure secure CORS origins
- [ ] Review and test all security measures
- [ ] Set up monitoring and alerting
- [ ] Configure database security
- [ ] Review file upload restrictions
- [ ] Test rate limiting effectiveness
- [ ] Verify input validation coverage

#### Security Monitoring
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure security alerts
- [ ] Monitor failed authentication attempts
- [ ] Track suspicious IP addresses
- [ ] Log administrative actions
- [ ] Monitor API usage patterns

#### Regular Security Maintenance
- [ ] Weekly dependency updates
- [ ] Monthly security reviews
- [ ] Quarterly penetration testing
- [ ] Annual security audits
- [ ] Regular backup testing
- [ ] Security training updates

### Compliance & Standards

#### Security Standards Compliance
- **OWASP Top 10**: Complete protection against all OWASP threats
- **PCI DSS**: Payment card industry security standards
- **GDPR**: General Data Protection Regulation compliance
- **SOC 2**: Security and availability controls

#### Data Protection Features
- **Right to be Forgotten**: User data deletion
- **Data Portability**: Export user data
- **Consent Management**: Privacy preferences
- **Data Minimization**: Collect only necessary data
- **Encryption**: End-to-end data protection

### Security Incident Response

#### Response Procedures
1. **Detection**: Automated monitoring and manual reporting
2. **Analysis**: Threat assessment and impact evaluation  
3. **Containment**: Immediate threat isolation
4. **Eradication**: Remove threats and vulnerabilities
5. **Recovery**: Restore systems and monitor
6. **Documentation**: Incident report and lessons learned

#### Emergency Contacts
- Security Team: security@yourstore.com
- Emergency Response: +1-XXX-XXX-XXXX
- Incident Reporting: incidents@yourstore.com

### Security Documentation

For detailed security configuration and procedures, see:
- [Security Configuration Guide](./backend/SECURITY_CONFIGURATION.md)
- [Environment Setup](./backend/.env.security.example)
- [API Security Documentation](./API_SECURITY.md)

## 🛡️ Error Handling & Boundaries

### Error Boundary System

The application implements a comprehensive error boundary system that catches JavaScript errors during rendering and provides fallback UI with error reporting capabilities.

#### Main Error Boundary
- **Component**: `ErrorBoundary.tsx`
- **Features**:
  - Catches rendering errors
  - Shows user-friendly fallback UI
  - Automatic error reporting
  - Retry functionality
  - Development mode error details
  - Production error logging

#### Async Error Boundary
- **Component**: `AsyncErrorBoundary.tsx`
- **Features**:
  - Specialized for async operations
  - Automatic retry with exponential backoff
  - Network error detection
  - Queue-based error handling
  - Custom retry logic

### Error Handling Hook

#### useErrorHandler Hook
```typescript
const { loading, error, execute, retry, clearError } = useErrorHandler();

// Usage
const result = await execute(
  async () => {
    return await apiCall();
  },
  {
    toastMessage: 'Operation failed',
    retryAttempts: 3,
    onError: (error) => console.error(error)
  }
);
```

**Features**:
- Automatic loading states
- Error state management
- Retry functionality with exponential backoff
- Toast notifications
- Custom error handling
- Error reporting integration

#### useApiCall Hook
```typescript
const { apiCall } = useApiCall();

const result = await apiCall(
  () => apiService.getProducts(),
  {
    successMessage: 'Products loaded successfully',
    retryAttempts: 2
  }
);
```

### Error Reporting System

#### Global Error Reporting
- **Service**: `errorReporting.ts`
- **Features**:
  - Automatic error capture
  - Local storage fallback
  - Online/offline handling
  - User context tracking
  - Error queuing and batch sending

#### Error Report Structure
```typescript
interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  componentStack?: string;
  extra?: Record<string, any>;
}
```

#### Setup & Configuration
```typescript
import { setupGlobalErrorReporting } from './utils/errorReporting';

// Initialize with user context
setupGlobalErrorReporting(userId, userEmail);

// Manual error reporting
reportError(new Error('Custom error'), {
  context: 'UserAction',
  severity: 'high'
});
```

### Error Boundary Usage

#### Application Level
```tsx
<ErrorBoundary 
  onError={handleAppError}
  showDetails={isDevelopment}
>
  <App />
</ErrorBoundary>
```

#### Component Level
```tsx
<ErrorBoundary>
  <ProtectedRoute>
    <SensitiveComponent />
  </ProtectedRoute>
</ErrorBoundary>
```

#### Async Operations
```tsx
<AsyncErrorBoundary
  maxRetries={3}
  onRetry={handleRetry}
>
  <DataComponent />
</AsyncErrorBoundary>
```

### Error Types & Handling

#### Network Errors
- Automatic retry with exponential backoff
- Offline/online state detection
- User-friendly error messages
- Fallback to cached data when possible

#### Validation Errors
- Field-specific error display
- Real-time validation feedback
- Server-side validation integration
- Form state management

#### Authentication Errors
- Automatic token refresh
- Redirect to login when needed
- Session timeout handling
- Multi-tab synchronization

#### Application Errors
- Component error boundaries
- Graceful degradation
- Alternative UI paths
- Error recovery mechanisms

### Development Features

#### Error Demo Page
- Interactive error testing
- Error boundary demonstrations
- Async error handling examples
- Error reporting testing

#### Debug Information
- Stack traces in development
- Component stack information
- Error reproduction steps
- Environment details

#### Error Analytics
- Error frequency tracking
- User impact analysis
- Performance impact monitoring
- Error trend analysis

### Production Features

#### Error Monitoring
- Automatic error capture
- Error aggregation
- Alert notifications
- Performance metrics

#### User Experience
- Graceful error fallbacks
- Retry mechanisms
- Offline support
- Progress indicators

#### Recovery Strategies
- Automatic retry logic
- Manual retry options
- Alternative workflows
- State restoration

### Integration with External Services

#### Error Reporting Services
```typescript
// Sentry integration example
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Custom error reporting
export const reportError = (error: Error, extra?: any) => {
  Sentry.captureException(error, { extra });
};
```

#### Analytics Integration
```typescript
// Google Analytics error tracking
gtag('event', 'exception', {
  'description': error.message,
  'fatal': false
});
```

### Best Practices

#### Error Boundary Placement
- Place at route level for navigation errors
- Wrap complex components
- Use specialized boundaries for specific error types
- Avoid catching errors in event handlers

#### Error Message Guidelines
- Use clear, actionable language
- Provide specific error context
- Include recovery instructions
- Avoid technical jargon

#### Performance Considerations
- Limit error boundary depth
- Implement error throttling
- Use efficient error logging
- Monitor error impact on performance

### Testing Error Boundaries

#### Unit Tests
```typescript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

test('catches and displays error', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

#### Integration Tests
```typescript
// Test error recovery
test('retries failed operation', async () => {
  const mockFn = jest.fn()
    .mockRejectedValueOnce(new Error('Network error'))
    .mockResolvedValueOnce('Success');
  
  const { result } = renderHook(() => useErrorHandler());
  
  await result.current.execute(mockFn, { retryAttempts: 1 });
  
  expect(mockFn).toHaveBeenCalledTimes(2);
});
```

### Environment Variables

Add these to your `.env` file:
```bash
# Error Reporting
VITE_ERROR_REPORTING_API_KEY=your_error_reporting_api_key
VITE_PROJECT_ID=your_project_id
VITE_ENABLE_ERROR_REPORTING=true

# Sentry (Optional)
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_ENVIRONMENT=production
```

### Monitoring & Alerts

#### Error Thresholds
- Set up alerts for error rate spikes
- Monitor critical user journeys
- Track error resolution time
- Measure user impact

#### Dashboard Metrics
- Error frequency by component
- User journey success rates
- Error resolution effectiveness
- Performance impact analysis

This comprehensive error handling system ensures your application provides a smooth user experience even when things go wrong, while giving you the tools to quickly identify and fix issues.

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


