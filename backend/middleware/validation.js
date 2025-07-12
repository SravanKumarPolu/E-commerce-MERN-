import { body, query, validationResult } from 'express-validator';
import validator from 'validator';

// Middleware to handle validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Custom validators
const isStrongPassword = (password) => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    returnScore: false
  });
};

const sanitizeName = (name) => {
  return validator.escape(validator.trim(name));
};

// Validation rules for user registration
export const validateRegistration = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces')
    .customSanitizer(sanitizeName),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    })
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .custom((password) => {
      if (!isStrongPassword(password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      }
      return true;
    })
    .isLength({ max: 128 })
    .withMessage('Password must not exceed 128 characters')
];

// Validation rules for user login
export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    }),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty')
];

// Validation rules for admin login
export const validateAdminLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty')
];

// Validation rules for refresh token
export const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token format')
];

// Validation rules for email verification
export const validateEmailVerification = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required')
    .isLength({ min: 32, max: 64 })
    .withMessage('Invalid verification token format')
    .matches(/^[a-f0-9]+$/)
    .withMessage('Verification token must be a valid hex string')
];

// Validation rules for password reset request
export const validatePasswordResetRequest = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

// Validation rules for password reset
export const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 32, max: 64 })
    .withMessage('Invalid reset token format')
    .matches(/^[a-f0-9]+$/)
    .withMessage('Reset token must be a valid hex string'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .custom((password) => {
      if (!isStrongPassword(password)) {
        throw new Error('New password must contain at least one uppercase letter, one lowercase letter, and one number');
      }
      return true;
    })
    .isLength({ max: 128 })
    .withMessage('New password must not exceed 128 characters')
];

// Validation rules for password change
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ min: 1 })
    .withMessage('Current password cannot be empty'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .custom((password) => {
      if (!isStrongPassword(password)) {
        throw new Error('New password must contain at least one uppercase letter, one lowercase letter, and one number');
      }
      return true;
    })
    .isLength({ max: 128 })
    .withMessage('New password must not exceed 128 characters')
    .custom((newPassword, { req }) => {
      if (newPassword === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

// Validation rules for profile update
export const validateProfileUpdate = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces')
    .customSanitizer(sanitizeName),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    })
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters')
];

// Validation rules for logout
export const validateLogout = [
  body('refreshToken')
    .optional()
    .isJWT()
    .withMessage('Invalid refresh token format')
];

// Validation rules for query parameters
export const validateEmailVerificationQuery = [
  query('token')
    .optional()
    .isLength({ min: 32, max: 64 })
    .withMessage('Invalid verification token format')
    .matches(/^[a-f0-9]+$/)
    .withMessage('Verification token must be a valid hex string')
];

export const validatePasswordResetQuery = [
  query('token')
    .optional()
    .isLength({ min: 32, max: 64 })
    .withMessage('Invalid reset token format')
    .matches(/^[a-f0-9]+$/)
    .withMessage('Reset token must be a valid hex string')
];

// Validation for product-related endpoints (for cart and orders)
export const validateProductId = [
  body('productId')
    .optional()
    .isMongoId()
    .withMessage('Invalid product ID format'),
  
  body('itemId')
    .optional()
    .isMongoId()
    .withMessage('Invalid item ID format')
];

// Validation for cart operations
export const validateCartOperation = [
  body('itemId')
    .notEmpty()
    .withMessage('Item ID is required')
    .isMongoId()
    .withMessage('Invalid item ID format'),
  
  body('size')
    .optional()
    .isString()
    .withMessage('Size must be a string')
    .isLength({ min: 1, max: 10 })
    .withMessage('Size must be between 1 and 10 characters'),
  
  body('color')
    .optional()
    .isString()
    .withMessage('Color must be a string')
    .isLength({ min: 1, max: 20 })
    .withMessage('Color must be between 1 and 20 characters'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Quantity must be a number between 0 and 100')
];

// Validation for order placement
export const validateOrderPlacement = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),
  
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  
  body('items.*.quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
  
  body('items.*.size')
    .optional()
    .isString()
    .withMessage('Size must be a string')
    .isLength({ min: 1, max: 10 })
    .withMessage('Size must be between 1 and 10 characters'),
  
  body('items.*.color')
    .optional()
    .isString()
    .withMessage('Color must be a string')
    .isLength({ min: 1, max: 20 })
    .withMessage('Color must be between 1 and 20 characters'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  
  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isObject()
    .withMessage('Address must be an object'),
  
  body('address.firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('address.lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('address.email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('address.street')
    .notEmpty()
    .withMessage('Street is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Street must be between 5 and 200 characters'),
  
  body('address.city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('address.state')
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be between 2 and 100 characters'),
  
  body('address.zipcode')
    .notEmpty()
    .withMessage('Zipcode is required')
    .matches(/^[0-9]{5,10}$/)
    .withMessage('Zipcode must be 5-10 digits'),
  
  body('address.country')
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  
  body('address.phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
];

// Validation for payment verification
export const validatePaymentVerification = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
  
  body('paymentId')
    .notEmpty()
    .withMessage('Payment ID is required')
    .isString()
    .withMessage('Payment ID must be a string'),
  
  body('signature')
    .optional()
    .isString()
    .withMessage('Signature must be a string')
];

// Validation for order status update
export const validateOrderStatusUpdate = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
  
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status')
];

// Validation for product operations
export const validateProductAdd = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Product description must be between 10 and 2000 characters'),
  
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category must be between 2 and 100 characters'),
  
  body('subCategory')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Sub-category must be between 2 and 100 characters'),
  
  body('sizes')
    .optional()
    .isArray()
    .withMessage('Sizes must be an array'),
  
  body('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),
  
  body('bestseller')
    .optional()
    .isBoolean()
    .withMessage('Bestseller must be a boolean')
];

export const validateProductRemove = [
  body('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format')
];

export const validateProductSingle = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format')
];

// Validation for file uploads (if needed)
export const validateFileUpload = [
  body('file')
    .optional()
    .custom((value, { req }) => {
      if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed');
        }
        if (req.file.size > 5 * 1024 * 1024) { // 5MB
          throw new Error('File size too large. Maximum size is 5MB');
        }
      }
      return true;
    })
];

// Sanitize input middleware
export const sanitizeInput = (req, res, next) => {
  // Sanitize string inputs to prevent XSS
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = validator.escape(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };
  
  if (req.body) {
    sanitizeObject(req.body);
  }
  
  if (req.query) {
    sanitizeObject(req.query);
  }
  
  if (req.params) {
    sanitizeObject(req.params);
  }
  
  next();
};

// Rate limiting validation helper
export const validateRateLimitBypass = [
  body('bypassToken')
    .optional()
    .isLength({ min: 32, max: 64 })
    .withMessage('Invalid bypass token format')
];

// Common validation chains
export const commonValidations = {
  mongoId: (field) => [
    body(field)
      .isMongoId()
      .withMessage(`${field} must be a valid MongoDB ObjectId`)
  ],
  
  optionalString: (field, min = 1, max = 255) => [
    body(field)
      .optional()
      .isString()
      .withMessage(`${field} must be a string`)
      .isLength({ min, max })
      .withMessage(`${field} must be between ${min} and ${max} characters`)
  ],
  
  requiredString: (field, min = 1, max = 255) => [
    body(field)
      .notEmpty()
      .withMessage(`${field} is required`)
      .isString()
      .withMessage(`${field} must be a string`)
      .isLength({ min, max })
      .withMessage(`${field} must be between ${min} and ${max} characters`)
  ]
};

// Custom error formatter
export const formatValidationErrors = (errors) => {
  const formatted = {};
  
  errors.forEach(error => {
    if (!formatted[error.path]) {
      formatted[error.path] = [];
    }
    formatted[error.path].push(error.msg);
  });
  
  return formatted;
};

// Advanced validation middleware with custom error handling
export const advancedValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = formatValidationErrors(errors.array());
    
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