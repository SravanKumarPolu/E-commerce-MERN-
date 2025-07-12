import crypto from 'crypto';

// Security configuration constants
export const SECURITY_CONFIG = {
  // JWT Configuration
  jwt: {
    algorithm: 'HS256',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    issuer: 'ecommerce-api',
    audience: 'ecommerce-clients'
  },

  // Password Policy
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    saltRounds: 12
  },

  // Session Configuration
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  },

  // File Upload Limits
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10,
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ],
    fileNamePattern: /^[a-zA-Z0-9\-_\.]+$/
  },

  // Rate Limiting
  rateLimiting: {
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts
      skipSuccessfulRequests: true
    },
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests
      skipSuccessfulRequests: true
    },
    payment: {
      windowMs: 60 * 1000, // 1 minute
      max: 3, // 3 attempts
      skipSuccessfulRequests: false
    },
    fileUpload: {
      windowMs: 60 * 1000, // 1 minute
      max: 10, // 10 uploads
      skipSuccessfulRequests: true
    }
  },

  // Security Headers
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https:", "wss:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    }
  },

  // Encryption Settings
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16
  },

  // CORS Settings
  cors: {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-CSRF-Token'
    ],
    exposedHeaders: ['X-Total-Count'],
    credentials: true,
    maxAge: 86400 // 24 hours
  },

  // Monitoring & Audit
  audit: {
    enableLogging: true,
    logSensitiveData: false,
    logRetention: 30, // days
    alertThresholds: {
      failedLogins: 10,
      rateLimitHits: 50,
      errorRate: 0.05 // 5%
    }
  }
};

// Encryption utilities
export class SecurityUtils {
  static generateSecretKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  static generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  static encrypt(text, key) {
    const iv = crypto.randomBytes(SECURITY_CONFIG.encryption.ivLength);
    const cipher = crypto.createCipher(SECURITY_CONFIG.encryption.algorithm, key);
    cipher.setAAD(Buffer.from('ecommerce-api', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  static decrypt(encryptedData, key) {
    const decipher = crypto.createDecipher(SECURITY_CONFIG.encryption.algorithm, key);
    decipher.setAAD(Buffer.from('ecommerce-api', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  static hash(data, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  static generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static isValidPassword(password) {
    const policy = SECURITY_CONFIG.password;
    
    if (password.length < policy.minLength || password.length > policy.maxLength) {
      return { valid: false, message: `Password must be between ${policy.minLength} and ${policy.maxLength} characters` };
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }

    return { valid: true, message: 'Password is valid' };
  }

  static sanitizeFileName(fileName) {
    // Remove dangerous characters
    let sanitized = fileName.replace(/[^a-zA-Z0-9\-_\.]/g, '');
    
    // Limit length
    if (sanitized.length > 100) {
      const ext = sanitized.substring(sanitized.lastIndexOf('.'));
      sanitized = sanitized.substring(0, 100 - ext.length) + ext;
    }
    
    return sanitized;
  }

  static isValidIPAddress(ip) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }
}

// Security monitoring
export class SecurityMonitor {
  constructor() {
    this.events = new Map();
    this.alerts = [];
  }

  logEvent(type, data) {
    const event = {
      type,
      data,
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID()
    };

    if (!this.events.has(type)) {
      this.events.set(type, []);
    }
    
    this.events.get(type).push(event);

    // Check for alert conditions
    this.checkAlerts(type);

    if (SECURITY_CONFIG.audit.enableLogging) {
      console.log(`[SECURITY_MONITOR] ${type}:`, data);
    }
  }

  checkAlerts(type) {
    const thresholds = SECURITY_CONFIG.audit.alertThresholds;
    const events = this.events.get(type) || [];
    const recentEvents = events.filter(event => 
      Date.now() - new Date(event.timestamp).getTime() < 60000 // Last minute
    );

    let shouldAlert = false;
    let alertMessage = '';

    switch (type) {
      case 'failed_login':
        if (recentEvents.length >= thresholds.failedLogins) {
          shouldAlert = true;
          alertMessage = `High number of failed login attempts: ${recentEvents.length}`;
        }
        break;
      
      case 'rate_limit_hit':
        if (recentEvents.length >= thresholds.rateLimitHits) {
          shouldAlert = true;
          alertMessage = `High number of rate limit hits: ${recentEvents.length}`;
        }
        break;
    }

    if (shouldAlert) {
      this.createAlert(type, alertMessage, recentEvents);
    }
  }

  createAlert(type, message, events) {
    const alert = {
      id: crypto.randomUUID(),
      type,
      message,
      severity: this.getSeverity(type),
      timestamp: new Date().toISOString(),
      events: events.length,
      resolved: false
    };

    this.alerts.push(alert);
    console.warn(`[SECURITY_ALERT] ${alert.severity}: ${message}`);

    // In production, you would send this to your monitoring service
    // Example: notificationService.sendAlert(alert);
  }

  getSeverity(type) {
    const severityMap = {
      'failed_login': 'medium',
      'rate_limit_hit': 'low',
      'suspicious_activity': 'high',
      'data_breach_attempt': 'critical'
    };

    return severityMap[type] || 'low';
  }

  getAlerts(unreadOnly = false) {
    return unreadOnly ? this.alerts.filter(alert => !alert.resolved) : this.alerts;
  }

  resolveAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
    }
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor();

// Environment validation
export const validateEnvironment = () => {
  const required = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'MONGODB_URI'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Check JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('[SECURITY] JWT_SECRET should be at least 32 characters long');
  }

  if (process.env.JWT_REFRESH_SECRET.length < 32) {
    console.warn('[SECURITY] JWT_REFRESH_SECRET should be at least 32 characters long');
  }

  // Validate environment
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.FRONTEND_URL || !process.env.ADMIN_URL) {
      console.warn('[SECURITY] FRONTEND_URL and ADMIN_URL should be set in production');
    }
  }

  console.log('[SECURITY] Environment validation passed');
}; 