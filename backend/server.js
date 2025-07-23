import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { createServer } from 'http';

import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import { handleMulterError } from './middleware/multer.js';
import socketService from './services/socketService.js';

import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import analyticsRouter from './routes/analyticsRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import addressRouter from './routes/addressRoute.js';

// App config
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3001;

// DB + Cloudinary
connectDB();
connectCloudinary();

// Initialize WebSocket
socketService.initialize(server);

// Helmet security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Compression
app.use(compression());

// ✅ CORS Setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'https://skr-e-commerce.netlify.app',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ CORS blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Request parsing & sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// Routes
app.use('/api/user', authLimiter, userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/orders', orderRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/category', categoryRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'Backend is healthy' });
});

// WebSocket status endpoint
app.get('/api/socket/status', (req, res) => {
  res.json({
    success: true,
    connectedUsers: socketService.getConnectedUsersCount(),
    status: 'WebSocket server is running',
  });
});

// Multer errors
app.use(handleMulterError);

// Root test route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Working' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error Handler:', err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Duplicate field value' });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server started on PORT: ${port}`);
});

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy ✅' });
});
