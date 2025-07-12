import 'dotenv/config';

import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import cors from 'cors';
import express from 'express';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// Import security middleware
import {
  securityHeaders,
  apiRateLimit,
  authRateLimit,
  paymentRateLimit,
  speedLimiter,
  mongoSanitization,
  parameterPollutionProtection,
  xssProtection,
  requestSizeLimit,
  contentTypeValidation,
  auditLogger,
  fileUploadSecurity,
  secureCompression
} from './middleware/security.js';

// Import security configuration
import { validateEnvironment } from './config/security.js';

// App config
const app = express();
const port = process.env.PORT || 4000;
const isDevelopment = process.env.NODE_ENV === 'development';

// Validate environment variables
try {
  validateEnvironment();
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  process.exit(1);
}

// Initialize database and cloudinary
connectDB();
connectCloudinary();

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// Security middleware (applied early)
app.use(securityHeaders);
app.use(secureCompression);
app.use(requestSizeLimit);
app.use(mongoSanitization);
app.use(parameterPollutionProtection);
app.use(xssProtection);

// Audit logging
app.use(auditLogger);

// CORS configuration with security considerations
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman)
    if (!origin && isDevelopment) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[SECURITY] Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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
  maxAge: 86400 // Cache preflight for 24 hours
}));

// Content type validation and body parsing
app.use(contentTypeValidation(['application/json', 'multipart/form-data']));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to different endpoint groups
app.use('/api/user/login', authRateLimit);
app.use('/api/user/register', authRateLimit);
app.use('/api/user/admin', authRateLimit);
app.use('/api/order/stripe', paymentRateLimit);
app.use('/api/order/razorpay', paymentRateLimit);
app.use('/api', apiRateLimit);
app.use(speedLimiter);

// File upload security (applied before routes that handle file uploads)
app.use('/api/product', fileUploadSecurity);

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API is running",
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Security endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  console.error(`[ERROR] ${error.message}`, {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_SERVER_ERROR'
    });
  } else {
    res.status(500).json({
      success: false,
      message: error.message,
      error: 'INTERNAL_SERVER_ERROR',
      stack: error.stack
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  console.warn(`[SECURITY] 404 request:`, {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error: 'NOT_FOUND'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Server started on PORT: ${port}`);
  console.log(`🛡️ Security middleware enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check available at: http://localhost:${port}/health`);
  console.log(`🔒 Security features active:`);
  console.log(`   ✅ Rate limiting`);
  console.log(`   ✅ Input validation`);
  console.log(`   ✅ XSS protection`);
  console.log(`   ✅ CSRF protection`);
  console.log(`   ✅ Security headers`);
  console.log(`   ✅ Audit logging`);
  console.log(`   ✅ File upload security`);
});
