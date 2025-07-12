# Input Validation Middleware Guide

## Overview

This guide covers the comprehensive input validation middleware system implemented using `express-validator` to ensure data integrity, security, and proper error handling across all API endpoints.

## 🛡️ Security Features

### Input Sanitization
- **XSS Prevention**: All string inputs are sanitized using `validator.escape()`
- **SQL Injection Protection**: MongoDB ObjectId validation prevents injection attacks
- **Data Trimming**: Automatic whitespace removal from inputs
- **Email Normalization**: Consistent email format handling

### Validation Rules
- **Strong Password Requirements**: Minimum 8 characters with complexity rules
- **Email Format Validation**: RFC-compliant email validation
- **Input Length Limits**: Prevents buffer overflow attacks
- **Type Validation**: Ensures data types match expected formats
- **Range Validation**: Numeric values within acceptable ranges

## 📋 Available Validation Rules

### Authentication Validations

#### User Registration
```javascript
validateRegistration = [
  // Name: 2-50 characters, letters and spaces only
  body('name').notEmpty().isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z\s]+$/),
  
  // Email: Valid format, normalized, max 255 characters
  body('email').notEmpty().isEmail().normalizeEmail().isLength({ max: 255 }),
  
  // Password: 8-128 characters, must contain uppercase, lowercase, and number
  body('password').notEmpty().isLength({ min: 8, max: 128 }).custom(isStrongPassword)
]
```

#### User Login
```javascript
validateLogin = [
  body('email').notEmpty().isEmail().normalizeEmail(),
  body('password').notEmpty().isLength({ min: 1 })
]
```

#### Password Reset
```javascript
validatePasswordReset = [
  body('token').notEmpty().isLength({ min: 32, max: 64 }).matches(/^[a-f0-9]+$/),
  body('newPassword').notEmpty().isLength({ min: 8, max: 128 }).custom(isStrongPassword)
]
```

### Order Validations

#### Order Placement
```javascript
validateOrderPlacement = [
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isMongoId(),
  body('items.*.quantity').isInt({ min: 1, max: 100 }),
  body('amount').isFloat({ min: 0.01 }),
  body('address.firstName').notEmpty().isLength({ min: 2, max: 50 }),
  body('address.email').notEmpty().isEmail(),
  body('address.phone').notEmpty().matches(/^[\+]?[1-9][\d]{0,15}$/)
]
```

#### Payment Verification
```javascript
validatePaymentVerification = [
  body('orderId').notEmpty().isMongoId(),
  body('paymentId').notEmpty().isString(),
  body('signature').optional().isString()
]
```

### Product Validations

#### Product Addition
```javascript
validateProductAdd = [
  body('name').notEmpty().isLength({ min: 2, max: 200 }),
  body('description').notEmpty().isLength({ min: 10, max: 2000 }),
  body('price').isFloat({ min: 0.01 }),
  body('category').notEmpty().isLength({ min: 2, max: 100 }),
  body('bestseller').optional().isBoolean()
]
```

### Cart Validations

#### Cart Operations
```javascript
validateCartOperation = [
  body('itemId').notEmpty().isMongoId(),
  body('quantity').optional().isInt({ min: 0, max: 100 }),
  body('size').optional().isString().isLength({ min: 1, max: 10 }),
  body('color').optional().isString().isLength({ min: 1, max: 20 })
]
```

## 🚀 Usage Examples

### Basic Usage in Routes

```javascript
import { 
  validateRegistration, 
  handleValidationErrors,
  sanitizeInput 
} from '../middleware/validation.js';

// Apply sanitization to all routes
router.use(sanitizeInput);

// Use validation middleware
router.post('/register', 
  validateRegistration,
  handleValidationErrors,
  registerUser
);
```

### Advanced Usage with Custom Validation

```javascript
import { body, validationResult } from 'express-validator';

const customValidation = [
  body('customField')
    .custom((value, { req }) => {
      if (value === 'forbidden') {
        throw new Error('This value is not allowed');
      }
      return true;
    })
];

router.post('/custom', 
  customValidation,
  handleValidationErrors,
  customHandler
);
```

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long",
      "value": "123"
    }
  ]
}
```

## 🔧 Configuration

### Password Strength Requirements
```javascript
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
```

### Email Normalization Settings
```javascript
normalizeEmail({
  gmail_remove_dots: false,
  gmail_remove_subaddress: false,
  outlookdotcom_remove_subaddress: false,
  yahoo_remove_subaddress: false,
  icloud_remove_subaddress: false
})
```

## 🛠️ Custom Validators

### Creating Custom Validation Rules

```javascript
// Custom validator for MongoDB ObjectId
export const validateMongoId = (field) => [
  body(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId`)
];

// Custom validator for phone numbers
export const validatePhone = [
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
];

// Custom validator for file uploads
export const validateFileUpload = [
  body('file')
    .custom((value, { req }) => {
      if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          throw new Error('Invalid file type');
        }
        if (req.file.size > 5 * 1024 * 1024) {
          throw new Error('File size too large');
        }
      }
      return true;
    })
];
```

## 📊 Validation Chains

### Common Validation Patterns

```javascript
export const commonValidations = {
  // Required string with length limits
  requiredString: (field, min = 1, max = 255) => [
    body(field)
      .notEmpty()
      .withMessage(`${field} is required`)
      .isString()
      .withMessage(`${field} must be a string`)
      .isLength({ min, max })
      .withMessage(`${field} must be between ${min} and ${max} characters`)
  ],

  // Optional string with length limits
  optionalString: (field, min = 1, max = 255) => [
    body(field)
      .optional()
      .isString()
      .withMessage(`${field} must be a string`)
      .isLength({ min, max })
      .withMessage(`${field} must be between ${min} and ${max} characters`)
  ],

  // MongoDB ObjectId validation
  mongoId: (field) => [
    body(field)
      .isMongoId()
      .withMessage(`${field} must be a valid MongoDB ObjectId`)
  ]
};
```

## 🔒 Security Best Practices

### Input Sanitization
```javascript
// Sanitize all string inputs to prevent XSS
export const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = validator.escape(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };
  
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  
  next();
};
```

### Rate Limiting Integration
```javascript
// Combine with rate limiting for enhanced security
router.post('/sensitive-endpoint',
  rateLimiter,
  validateInput,
  handleValidationErrors,
  controller
);
```

## 📈 Advanced Features

### Conditional Validation
```javascript
const conditionalValidation = [
  body('field')
    .if(body('condition').equals('true'))
    .notEmpty()
    .withMessage('Field is required when condition is true')
];
```

### Custom Error Messages
```javascript
const customErrorMessages = [
  body('email')
    .isEmail()
    .withMessage('Oops! That email doesn't look right. Please try again.')
    .normalizeEmail()
];
```

### Validation Chaining
```javascript
const chainedValidation = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number')
];
```

## 🐛 Troubleshooting

### Common Validation Errors

#### 1. "ValidationError: Invalid input"
```javascript
// Issue: Field not properly validated
// Solution: Check field names match request body
body('correctFieldName').notEmpty()
```

#### 2. "TypeError: Cannot read property"
```javascript
// Issue: Nested object validation
// Solution: Use dot notation for nested fields
body('address.street').notEmpty()
```

#### 3. "Validation passed but data incorrect"
```javascript
// Issue: Missing sanitization
// Solution: Always apply sanitization
router.use(sanitizeInput);
```

### Debugging Validation

```javascript
// Log validation results for debugging
const debugValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
  }
  next();
};
```

## 🔄 Testing Validation

### Unit Testing Example
```javascript
import request from 'supertest';
import app from '../app.js';

describe('User Registration Validation', () => {
  it('should reject invalid email', async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toHaveLength(1);
  });
});
```

## 📚 Reference

### Validation Rules Reference

| Rule | Description | Example |
|------|-------------|---------|
| `notEmpty()` | Field must not be empty | `body('name').notEmpty()` |
| `isEmail()` | Valid email format | `body('email').isEmail()` |
| `isLength()` | String length validation | `body('name').isLength({ min: 2, max: 50 })` |
| `isInt()` | Integer validation | `body('age').isInt({ min: 0, max: 120 })` |
| `isFloat()` | Float validation | `body('price').isFloat({ min: 0.01 })` |
| `isMongoId()` | MongoDB ObjectId | `body('id').isMongoId()` |
| `matches()` | Regex pattern | `body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/)` |
| `isArray()` | Array validation | `body('items').isArray({ min: 1 })` |
| `isBoolean()` | Boolean validation | `body('active').isBoolean()` |
| `custom()` | Custom validation | `body('field').custom(customValidator)` |

### Common Regex Patterns
```javascript
// Phone number: International format
/^[\+]?[1-9][\d]{0,15}$/

// Strong password: At least 8 chars, uppercase, lowercase, number
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

// Alphanumeric with spaces
/^[a-zA-Z0-9\s]+$/

// Hexadecimal string
/^[a-f0-9]+$/

// Postal code (US)
/^\d{5}(-\d{4})?$/
```

## 🚦 Migration Guide

### From Manual Validation
```javascript
// Before: Manual validation in controller
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || name.length < 2) {
    return res.status(400).json({ message: 'Invalid name' });
  }
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  
  // ... rest of controller
};

// After: Validation middleware
router.post('/register',
  validateRegistration,
  handleValidationErrors,
  registerUser
);
```

### Best Practices for Migration
1. **Gradual Implementation**: Start with critical endpoints
2. **Test Thoroughly**: Verify all validation rules work correctly
3. **Update Error Handling**: Ensure frontend handles new error format
4. **Monitor Performance**: Validation adds minimal overhead
5. **Documentation**: Update API documentation with validation rules

---

## 📝 Notes

- All validation rules are applied before the request reaches the controller
- Sanitization is applied automatically to prevent XSS attacks
- Custom validators can be created for specific business logic
- Error messages are user-friendly and informative
- Validation is integrated with rate limiting for enhanced security
- Performance impact is minimal due to express-validator's efficiency 