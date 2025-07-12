import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { body, validationResult } from 'express-validator';
import hpp from 'hpp';
import compression from 'compression';
import slowDown from 'express-slow-down';
import xss from 'xss';

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting configurations
export const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      error: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/' || req.path === '/health';
    }
  });
};

// Strict rate limiting for authentication endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts. Please try again later.'
);

// General API rate limiting
export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests. Please try again later.'
);

// Payment endpoints rate limiting
export const paymentRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  3, // 3 payment attempts
  'Too many payment attempts. Please wait before trying again.'
);

// Progressive delay for suspicious behavior
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// MongoDB injection protection
export const mongoSanitization = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized NoSQL injection attempt on key: ${key} from IP: ${req.ip}`);
  }
});

// HTTP Parameter Pollution protection
export const parameterPollutionProtection = hpp({
  whitelist: ['tags', 'categories', 'sizes', 'colors'] // Allow arrays for these fields
});

// XSS protection middleware
export const xssProtection = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Recursive object sanitization
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = xss(value, {
          whiteList: {}, // No HTML tags allowed
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script']
        });
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  
  if (typeof obj === 'string') {
    return xss(obj, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    });
  }
  
  return obj;
};

// Request size limiting
export const requestSizeLimit = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB for file uploads
  const contentLength = parseInt(req.get('content-length') || '0');
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large',
      error: 'PAYLOAD_TOO_LARGE'
    });
  }
  
  next();
};

// Content type validation
export const contentTypeValidation = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    // Skip validation for GET requests
    if (req.method === 'GET') {
      return next();
    }

    const contentType = req.get('content-type');
    
    // Check for multipart/form-data (file uploads)
    if (contentType && contentType.startsWith('multipart/form-data')) {
      return next();
    }
    
    if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
      return res.status(415).json({
        success: false,
        message: 'Unsupported media type',
        error: 'UNSUPPORTED_MEDIA_TYPE'
      });
    }
    
    next();
  };
};

// Security audit logging
export const auditLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log security-relevant events
  const securityEvents = {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    user: req.user?.id || 'anonymous'
  };

  // Log authentication attempts
  if (req.path.includes('/login') || req.path.includes('/register')) {
    console.log(`[SECURITY] Auth attempt:`, securityEvents);
  }

  // Log admin actions
  if (req.user?.role === 'admin') {
    console.log(`[SECURITY] Admin action:`, securityEvents);
  }

  // Log payment actions
  if (req.path.includes('/payment') || req.path.includes('/order')) {
    console.log(`[SECURITY] Payment action:`, securityEvents);
  }

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log suspicious activities
    if (res.statusCode >= 400) {
      console.warn(`[SECURITY] Suspicious activity:`, {
        ...securityEvents,
        statusCode: res.statusCode,
        duration
      });
    }
  });

  next();
};

// CSRF protection for state-changing operations
export const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Check for CSRF token in custom header
  const csrfToken = req.get('X-CSRF-Token');
  const sessionToken = req.user?.csrfToken;

  if (!csrfToken || csrfToken !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
      error: 'CSRF_TOKEN_INVALID'
    });
  }

  next();
};

// File upload security
export const fileUploadSecurity = (req, res, next) => {
  if (!req.files && !req.file) {
    return next();
  }

  const files = req.files ? Object.values(req.files).flat() : [req.file];
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  for (const file of files) {
    // Check file type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only images are allowed.',
        error: 'INVALID_FILE_TYPE'
      });
    }

    // Check file size
    if (file.size > maxFileSize) {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
        error: 'FILE_TOO_LARGE'
      });
    }

    // Check for malicious file names
    if (file.originalname.includes('..') || file.originalname.includes('/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file name.',
        error: 'INVALID_FILE_NAME'
      });
    }
  }

  next();
};

// IP whitelist/blacklist middleware
export const ipFilter = (whitelist = [], blacklist = []) => {
  return (req, res, next) => {
    const clientIP = req.ip;

    // Check blacklist first
    if (blacklist.length > 0 && blacklist.includes(clientIP)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied from this IP address',
        error: 'IP_BLACKLISTED'
      });
    }

    // Check whitelist if provided
    if (whitelist.length > 0 && !whitelist.includes(clientIP)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied from this IP address',
        error: 'IP_NOT_WHITELISTED'
      });
    }

    next();
  };
};

// Compression with security considerations
export const secureCompression = compression({
  filter: (req, res) => {
    // Don't compress if the request is marked as not compressible
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Don't compress already compressed formats
    const contentType = res.get('content-type');
    if (contentType && (
      contentType.includes('image/') ||
      contentType.includes('video/') ||
      contentType.includes('audio/')
    )) {
      return false;
    }

    return compression.filter(req, res);
  },
  level: 6, // Balanced compression level
  threshold: 1024 // Only compress if response is larger than 1KB
});

// Security configuration object
export const securityConfig = {
  rateLimiting: {
    auth: { windowMs: 15 * 60 * 1000, max: 5 },
    api: { windowMs: 15 * 60 * 1000, max: 100 },
    payment: { windowMs: 60 * 1000, max: 3 }
  },
  fileUpload: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  },
  request: {
    maxSize: 10 * 1024 * 1024,
    allowedContentTypes: ['application/json', 'multipart/form-data']
  }
}; 