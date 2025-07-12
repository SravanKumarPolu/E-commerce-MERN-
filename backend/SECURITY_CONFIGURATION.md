# Security Configuration Guide

## Overview

This document outlines the comprehensive security measures implemented in the E-commerce MERN application and provides configuration guidelines for secure deployment.

## Environment Variables

### Required Security Variables

```bash
# JWT Configuration (Required)
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_at_least_64_characters_long_here
JWT_REFRESH_SECRET=your_very_long_and_secure_refresh_secret_key_different_from_above

# Database Security
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Admin Security
ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=Your_Very_Secure_Admin_Password_123!

# CORS Security
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### Optional Security Variables

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
PAYMENT_RATE_LIMIT_MAX=3

# IP Security
IP_WHITELIST=127.0.0.1,::1
IP_BLACKLIST=

# File Upload Security
MAX_FILE_SIZE=5242880
MAX_FILES_PER_REQUEST=10

# Encryption
ENCRYPTION_KEY=your_64_character_encryption_key_for_sensitive_data_storage_here

# Monitoring
ENABLE_SECURITY_MONITORING=true
ENABLE_AUDIT_LOGGING=true
```

## Security Features Implemented

### 1. Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Token Refresh**: Automatic token refresh mechanism
- **Role-based Access**: Admin and user role separation
- **Account Lockout**: Protection against brute force attacks
- **Password Policy**: Strong password requirements

### 2. Input Validation & Sanitization

- **Express Validator**: Comprehensive input validation
- **XSS Protection**: Cross-site scripting prevention
- **NoSQL Injection**: MongoDB injection protection
- **HTML Sanitization**: Safe HTML content handling
- **File Upload Validation**: Secure file upload handling

### 3. Rate Limiting

- **Authentication Endpoints**: 5 attempts per 15 minutes
- **API Endpoints**: 100 requests per 15 minutes
- **Payment Endpoints**: 3 attempts per minute
- **Progressive Delays**: Exponential backoff for repeated requests

### 4. Security Headers

- **Helmet**: Comprehensive security headers
- **HSTS**: HTTP Strict Transport Security
- **CSP**: Content Security Policy
- **CORS**: Cross-Origin Resource Sharing configuration
- **XSS Protection**: X-XSS-Protection header

### 5. Data Protection

- **Encryption**: AES-256-GCM for sensitive data
- **Password Hashing**: bcrypt with salt rounds
- **Data Sanitization**: Input/output data cleaning
- **Secure Sessions**: HTTP-only, secure cookies

### 6. Monitoring & Logging

- **Security Events**: Authentication, authorization events
- **Audit Trails**: Admin action logging
- **Error Tracking**: Comprehensive error monitoring
- **Alert System**: Automated security alerts

## Security Middleware Stack

```javascript
// Security middleware order (critical)
app.use(securityHeaders);           // Security headers
app.use(secureCompression);         // Secure compression
app.use(requestSizeLimit);          // Request size limits
app.use(mongoSanitization);         // NoSQL injection protection
app.use(parameterPollutionProtection); // HPP protection
app.use(xssProtection);             // XSS protection
app.use(auditLogger);               // Security logging
```

## Rate Limiting Configuration

### Authentication Endpoints
- Window: 15 minutes
- Max Attempts: 5
- Endpoints: `/api/user/login`, `/api/user/register`, `/api/user/admin`

### Payment Endpoints
- Window: 1 minute
- Max Attempts: 3
- Endpoints: `/api/order/stripe`, `/api/order/razorpay`

### General API
- Window: 15 minutes
- Max Requests: 100
- Applies to: All `/api/*` endpoints

## File Upload Security

### Allowed File Types
- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/gif`
- `image/webp`

### Security Checks
- File type validation
- File size limits (5MB max)
- Filename sanitization
- Double extension detection
- Malicious file detection

## Password Security Policy

### Requirements
- Minimum 8 characters
- Maximum 128 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters (optional)

### Protection Measures
- bcrypt hashing (12 salt rounds)
- Password history (prevents reuse)
- Account lockout after 5 failed attempts
- 15-minute lockout duration

## CORS Configuration

### Allowed Origins
- Frontend URL (from environment)
- Admin URL (from environment)

### Allowed Methods
- GET, POST, PUT, DELETE, OPTIONS

### Allowed Headers
- Content-Type
- Authorization
- X-Requested-With
- Accept
- Origin
- X-CSRF-Token

## Content Security Policy

```javascript
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

## Security Monitoring

### Logged Events
- Authentication attempts
- Authorization failures
- Admin actions
- Payment transactions
- File uploads
- Rate limit violations
- Validation failures

### Alert Thresholds
- Failed logins: 10 per minute
- Rate limit hits: 50 per minute
- Error rate: 5%

## Production Security Checklist

### Environment Setup
- [ ] Use strong JWT secrets (64+ characters)
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure secure CORS origins
- [ ] Use environment variables for secrets

### Database Security
- [ ] Use MongoDB Atlas or secure deployment
- [ ] Enable authentication
- [ ] Use connection pooling
- [ ] Regular backups
- [ ] Network security groups

### Server Security
- [ ] Keep dependencies updated
- [ ] Use process manager (PM2)
- [ ] Configure firewall
- [ ] Regular security scans
- [ ] SSL/TLS certificates

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure log aggregation
- [ ] Set up alerts
- [ ] Monitor performance
- [ ] Regular security audits

## Security Testing

### Automated Tests
```bash
# Run security audit
npm audit

# Check for vulnerabilities
npm audit fix

# Run security tests
npm run test:security
```

### Manual Testing
- [ ] Authentication bypass attempts
- [ ] Authorization escalation tests
- [ ] Input validation testing
- [ ] Rate limiting verification
- [ ] File upload security tests

## Incident Response

### Security Breach Response
1. Isolate affected systems
2. Assess scope of breach
3. Notify stakeholders
4. Preserve evidence
5. Implement containment
6. Eradicate threat
7. Recover systems
8. Post-incident review

### Contact Information
- Security Team: security@yourstore.com
- Emergency Contact: +1-XXX-XXX-XXXX
- Incident Response: incidents@yourstore.com

## Compliance

### Data Protection
- GDPR compliance features
- Data encryption at rest
- Secure data transmission
- Right to be forgotten
- Data portability

### Industry Standards
- OWASP Top 10 protection
- PCI DSS for payments
- SOC 2 Type II
- ISO 27001 alignment

## Security Updates

### Regular Maintenance
- Weekly dependency updates
- Monthly security reviews
- Quarterly penetration testing
- Annual security audits

### Security Patches
- Critical: Immediate deployment
- High: Within 24 hours
- Medium: Within 1 week
- Low: Next maintenance window

## Additional Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

**Important**: This security configuration should be reviewed and updated regularly to address new threats and vulnerabilities. 