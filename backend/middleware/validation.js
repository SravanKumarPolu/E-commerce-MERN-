import { body, query, validationResult } from 'express-validator';
import validator from 'validator';
import { SecurityUtils, securityMonitor } from '../config/security.js';

// Middleware to handle validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    // Log validation failures for security monitoring
    securityMonitor.logEvent('validation_failed', {
      ip: req.ip,
      url: req.originalUrl,
      errors: errorMessages,
      userAgent: req.get('User-Agent')
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Enhanced validation middleware with security checks
export const advancedValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    
    // Enhanced security logging
    securityMonitor.logEvent('validation_failed', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      errors: formattedErrors,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    });
  }
  
  next();
};

// Format validation errors with security considerations
const formatValidationErrors = (errors) => {
  return errors.map(error => {
    // Don't expose sensitive field values in errors
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const exposedValue = sensitiveFields.some(field => 
      error.path.toLowerCase().includes(field)
    ) ? '[HIDDEN]' : error.value;
    
    return {
      field: error.path,
      message: error.msg,
      value: exposedValue,
      location: error.location
    };
  });
};

// Custom validator functions with security enhancements
export const secureValidators = {
  // Enhanced email validation
  email: body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email address is too long')
    .custom((value) => {
      // Check for suspicious email patterns
      const suspiciousPatterns = [
        /(.{1,64}@.{1,255}){2,}/, // Multiple @ symbols
        /[<>"]/, // HTML injection attempts
        /@.*@/, // Double @ symbols
      ];
      
      const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(value));
      if (isSuspicious) {
        throw new Error('Email format appears to be invalid or suspicious');
      }
      return true;
    }),

  // Secure password validation
  password: body('password')
    .custom((value) => {
      const validation = SecurityUtils.isValidPassword(value);
      if (!validation.valid) {
        throw new Error(validation.message);
      }
      return true;
    })
    .customSanitizer((value) => {
      // Don't log or store passwords in plain text anywhere
      return value;
    }),

  // Enhanced name validation
  name: body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s\-\.\']+$/)
    .withMessage('Name contains invalid characters')
    .custom((value) => {
      // Check for potential XSS or injection attempts
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:text\/html/i
      ];
      
      const isDangerous = dangerousPatterns.some(pattern => pattern.test(value));
      if (isDangerous) {
        throw new Error('Name contains potentially dangerous content');
      }
      return true;
    }),

  // Secure product ID validation
  productId: body('productId')
    .isMongoId()
    .withMessage('Invalid product ID format')
    .customSanitizer((value) => {
      return validator.escape(value);
    }),

  // Enhanced quantity validation
  quantity: body('quantity')
    .isInt({ min: 0, max: 999 })
    .withMessage('Quantity must be between 0 and 999')
    .toInt(),

  // Secure size validation
  size: body('size')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Size is too long')
    .matches(/^[a-zA-Z0-9\s\-]+$/)
    .withMessage('Size contains invalid characters'),

  // Color validation with security
  color: body('color')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Color name is too long')
    .matches(/^[a-zA-Z0-9\s\-#]+$/)
    .withMessage('Color contains invalid characters'),

  // Search query validation
  search: query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query is too long')
    .custom((value) => {
      // Prevent NoSQL injection attempts in search
      const dangerousPatterns = [
        /\$where/i,
        /\$ne/i,
        /\$gt/i,
        /\$lt/i,
        /\$regex/i,
        /\$or/i,
        /\$and/i
      ];
      
      const isDangerous = dangerousPatterns.some(pattern => pattern.test(value));
      if (isDangerous) {
        throw new Error('Search query contains invalid operators');
      }
      return true;
    }),

  // Pagination validation
  page: query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be between 1 and 1000')
    .toInt(),

  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  // Order status validation
  status: body('status')
    .isIn(['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status'),

  // Address validation with security
  address: {
    firstName: body('address.firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters')
      .matches(/^[a-zA-Z\s\-\.\']+$/)
      .withMessage('First name contains invalid characters'),

    lastName: body('address.lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters')
      .matches(/^[a-zA-Z\s\-\.\']+$/)
      .withMessage('Last name contains invalid characters'),

    street: body('address.street')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Street address must be between 1 and 200 characters')
      .matches(/^[a-zA-Z0-9\s\-\.,#]+$/)
      .withMessage('Street address contains invalid characters'),

    city: body('address.city')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('City must be between 1 and 100 characters')
      .matches(/^[a-zA-Z\s\-\.\']+$/)
      .withMessage('City contains invalid characters'),

    state: body('address.state')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('State must be between 1 and 100 characters')
      .matches(/^[a-zA-Z\s\-\.\']+$/)
      .withMessage('State contains invalid characters'),

    zipcode: body('address.zipcode')
      .trim()
      .matches(/^[a-zA-Z0-9\s\-]+$/)
      .withMessage('Zipcode contains invalid characters')
      .isLength({ min: 3, max: 15 })
      .withMessage('Zipcode must be between 3 and 15 characters'),

    country: body('address.country')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Country must be between 1 and 100 characters')
      .matches(/^[a-zA-Z\s\-\.\']+$/)
      .withMessage('Country contains invalid characters'),

    phone: body('address.phone')
      .isMobilePhone()
      .withMessage('Please provide a valid phone number')
      .customSanitizer((value) => {
        // Normalize phone number format
        return value.replace(/[^\d+]/g, '');
      })
  }
};

// Product validation with enhanced security
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters')
    .custom((value) => {
      // Check for XSS attempts
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];
      
      const hasXSS = xssPatterns.some(pattern => pattern.test(value));
      if (hasXSS) {
        throw new Error('Product name contains potentially dangerous content');
      }
      return true;
    }),

  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Product description must be between 1 and 2000 characters')
    .custom((value) => {
      // Allow basic HTML but sanitize dangerous content
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /<form/i
      ];
      
      const isDangerous = dangerousPatterns.some(pattern => pattern.test(value));
      if (isDangerous) {
        throw new Error('Product description contains potentially dangerous content');
      }
      return true;
    }),

  body('price')
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Price must be between 0 and 999999.99')
    .toFloat(),

  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('Category contains invalid characters'),

  body('subCategory')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Sub-category must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('Sub-category contains invalid characters'),

  body('sizes')
    .isArray({ max: 20 })
    .withMessage('Sizes must be an array with maximum 20 items')
    .custom((sizes) => {
      if (sizes.some(size => typeof size !== 'string' || size.length > 10)) {
        throw new Error('Each size must be a string with maximum 10 characters');
      }
      return true;
    }),

  body('colors')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Colors must be an array with maximum 20 items')
    .custom((colors) => {
      if (colors && colors.some(color => typeof color !== 'string' || color.length > 30)) {
        throw new Error('Each color must be a string with maximum 30 characters');
      }
      return true;
    }),

  body('bestseller')
    .optional()
    .isBoolean()
    .withMessage('Bestseller must be a boolean value')
    .toBoolean(),

  advancedValidationHandler
];

// User registration validation
export const validateUserRegistration = [
  secureValidators.name,
  secureValidators.email,
  secureValidators.password,
  
  // Additional security checks
  body().custom((value, { req }) => {
    // Rate limiting check for registration attempts
    const clientIP = req.ip;
    // This would integrate with your rate limiting system
    return true;
  }),

  advancedValidationHandler
];

// User login validation
export const validateUserLogin = [
  secureValidators.email,
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password is too long'),

  advancedValidationHandler
];

// Cart operations validation
export const validateCartOperation = [
  secureValidators.productId,
  secureValidators.quantity.optional(),
  secureValidators.size,
  secureValidators.color,
  advancedValidationHandler
];

// Order placement validation
export const validateOrderPlacement = [
  body('items')
    .isArray({ min: 1, max: 50 })
    .withMessage('Order must contain between 1 and 50 items'),
  
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID in order items'),
  
  body('items.*.quantity')
    .isInt({ min: 1, max: 99 })
    .withMessage('Item quantity must be between 1 and 99'),
  
  body('amount')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Order amount must be between 0.01 and 999999.99'),

  secureValidators.address.firstName,
  secureValidators.address.lastName,
  secureValidators.address.street,
  secureValidators.address.city,
  secureValidators.address.state,
  secureValidators.address.zipcode,
  secureValidators.address.country,
  secureValidators.address.phone,

  advancedValidationHandler
];

// Search validation
export const validateSearch = [
  secureValidators.search,
  secureValidators.page,
  secureValidators.limit,
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category filter is too long')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('Category contains invalid characters'),
  
  query('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'popular'])
    .withMessage('Invalid sort parameter'),

  advancedValidationHandler
];

// Security-focused validation for admin operations
export const validateAdminOperation = [
  body().custom((value, { req }) => {
    // Log all admin operations for security auditing
    securityMonitor.logEvent('admin_operation', {
      adminId: req.user?.id,
      ip: req.ip,
      action: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    });
    return true;
  }),
  advancedValidationHandler
];

// File upload validation with security checks
export const validateFileUpload = [
  body().custom((value, { req }) => {
    if (!req.files && !req.file) {
      return true; // No files to validate
    }

    const files = req.files ? Object.values(req.files).flat() : [req.file];
    
    for (const file of files) {
      // Additional security checks beyond middleware
      const suspiciousExtensions = ['.php', '.asp', '.jsp', '.exe', '.bat', '.cmd'];
      const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      
      if (suspiciousExtensions.includes(fileExt)) {
        throw new Error('File type not allowed for security reasons');
      }

      // Check for double extensions (file.jpg.php)
      const doubleDotPattern = /\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
      if (doubleDotPattern.test(file.originalname)) {
        throw new Error('Files with double extensions are not allowed');
      }
    }

    return true;
  }),
  advancedValidationHandler
]; 