# Authentication System Guide

## Overview

This E-commerce MERN application now includes a comprehensive authentication system with modern security features including JWT tokens, email verification, password reset, rate limiting, and more.

## 🔐 Security Features

### Backend Security
- **JWT Access & Refresh Tokens**: Short-lived access tokens (15 minutes) with long-lived refresh tokens (7 days)
- **Password Hashing**: bcrypt with salt rounds of 12
- **Rate Limiting**: Protection against brute force attacks
- **Account Locking**: Temporary lockout after failed login attempts
- **Email Verification**: Required for new user accounts
- **Password Reset**: Secure token-based password reset
- **Strong Password Requirements**: Minimum 8 characters with uppercase, lowercase, and numbers
- **Role-based Access Control**: User and admin roles
- **Input Validation**: Comprehensive validation for all user inputs

### Frontend Security
- **Automatic Token Refresh**: Seamless token renewal without user intervention
- **Secure Token Storage**: localStorage with proper cleanup
- **Protected Routes**: Authentication guards for sensitive pages
- **CSRF Protection**: Proper token handling in headers

## 🚀 Features

### User Authentication
- ✅ User Registration with email verification
- ✅ User Login with account lockout protection
- ✅ Password reset via email
- ✅ Change password for logged-in users
- ✅ Email verification and re-verification
- ✅ User profile management
- ✅ Logout (single device or all devices)

### Admin Authentication
- ✅ Admin login with enhanced security
- ✅ Legacy admin login support (backward compatibility)
- ✅ Admin-specific rate limiting
- ✅ Role-based access control

### Security & Validation
- ✅ Rate limiting on login attempts
- ✅ Account lockout after failed attempts
- ✅ Strong password validation
- ✅ Email format validation
- ✅ JWT token expiration handling
- ✅ Refresh token rotation

## 📋 API Endpoints

### Public Endpoints (No Authentication Required)

#### User Registration
```
POST /api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### User Login
```
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Admin Login
```
POST /api/user/admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "AdminPass123"
}
```

#### Refresh Token
```
POST /api/user/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

#### Email Verification
```
POST /api/user/verify-email
Content-Type: application/json

{
  "token": "verification_token_from_email"
}
```

#### Request Password Reset
```
POST /api/user/request-password-reset
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```
POST /api/user/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123"
}
```

### Protected Endpoints (Authentication Required)

#### Get User Profile
```
GET /api/user/profile
Authorization: Bearer your_access_token
```

#### Update User Profile
```
PUT /api/user/profile
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Change Password
```
POST /api/user/change-password
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "currentPassword": "CurrentPass123",
  "newPassword": "NewSecurePass123"
}
```

#### Logout
```
POST /api/user/logout
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here" // optional
}
```

#### Resend Verification Email
```
POST /api/user/resend-verification
Authorization: Bearer your_access_token
```

## 🔧 Environment Setup

### Backend (.env)
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
```

### Frontend (.env)
```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:4000

# App Configuration
VITE_APP_NAME=SKR E-Commerce
VITE_APP_VERSION=1.0.0
```

## 💻 Frontend Usage

### Using the Authentication Context

```typescript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    isEmailVerified, 
    login, 
    register, 
    logout,
    loading 
  } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  // Check if email is verified
  if (!isEmailVerified) {
    return <div>Please verify your email</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
};
```

### Login Example
```typescript
const handleLogin = async (email: string, password: string) => {
  const success = await login(email, password);
  if (success) {
    // Redirect to dashboard or home
    navigate('/dashboard');
  }
  // Error handling is done automatically via toast
};
```

### Registration Example
```typescript
const handleRegister = async (name: string, email: string, password: string) => {
  const success = await register(name, email, password);
  if (success) {
    // User is registered and logged in
    // Show verification reminder
    toast.info('Please check your email to verify your account');
  }
};
```

## 🛡️ Security Best Practices

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters recommended

### Rate Limiting
- **Login attempts**: 5 attempts per 15 minutes per IP
- **Account lockout**: 10 minutes after 5 failed attempts
- **Registration**: 5 attempts per 15 minutes per IP
- **Password reset**: 3 attempts per 15 minutes per IP

### Token Management
- **Access tokens**: 15 minutes expiration
- **Refresh tokens**: 7 days expiration
- **Automatic refresh**: Handled by frontend
- **Token cleanup**: Old tokens are automatically removed

## 🔄 Migration from Old System

### For Existing Users
1. Existing users can continue to log in with their current credentials
2. Their accounts will be automatically updated with the new security features
3. They will need to verify their email address for full access

### For Admins
1. Legacy admin login still works for backward compatibility
2. Recommended to create a proper admin user account with the new system
3. Legacy admin tokens are still supported

## 📧 Email Configuration

### Development
- Emails are logged to the console
- No actual emails are sent
- Perfect for testing

### Production
1. **SendGrid Integration**:
   ```bash
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

2. **SMTP Configuration**:
   ```bash
   EMAIL_SERVICE=smtp
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

## 🐛 Troubleshooting

### Common Issues

#### "Token expired" errors
- **Solution**: The frontend automatically handles token refresh
- **Manual fix**: Clear localStorage and log in again

#### "Account locked" message
- **Cause**: Too many failed login attempts
- **Solution**: Wait 10 minutes or contact support

#### Email verification not working
- **Check**: Console logs in development mode
- **Check**: Email configuration in production
- **Solution**: Use resend verification endpoint

#### Rate limiting errors
- **Cause**: Too many requests from same IP
- **Solution**: Wait for the rate limit window to reset

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in backend.

## 🔄 Updates and Maintenance

### Regular Security Updates
1. Rotate JWT secrets regularly
2. Update bcrypt salt rounds if needed
3. Review and update rate limiting rules
4. Monitor for failed login attempts

### Database Maintenance
1. Clean up expired tokens periodically
2. Remove old email verification tokens
3. Monitor user login patterns

## 📊 Monitoring

### Security Metrics to Track
- Failed login attempts per IP
- Account lockouts
- Password reset requests
- Email verification rates
- Token refresh patterns

### Recommended Monitoring Tools
- MongoDB Atlas monitoring
- Application logs
- Rate limiting statistics
- Email delivery reports

## 🆘 Support

### For Users
- Forgot password? Use the "Reset Password" link
- Email not verified? Check spam folder or resend verification
- Account locked? Wait 10 minutes and try again

### For Developers
- Check console logs for detailed error messages
- Review environment variables
- Test with different email providers
- Monitor rate limiting logs

---

## 📝 Notes

- All passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens are signed with separate secrets for access and refresh
- Email verification is required for full account access
- Rate limiting is IP-based and configurable
- All sensitive operations are logged for security monitoring 