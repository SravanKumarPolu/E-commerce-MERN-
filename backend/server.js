import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { createServer } from 'http';

// Service connections
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import { handleMulterError } from './middleware/multer.js';
import socketService from './services/socketService.js';

// Routers
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import analyticsRouter from './routes/analyticsRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import addressRouter from './routes/addressRoute.js';

// Initialize Express app
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Connect DB & Cloud services
connectDB();
connectCloudinary();
socketService.initialize(server);

// Helmet (Security Headers)
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

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { success: false, message: 'Too many requests from this IP, try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Compression
app.use(compression());

// ✅ Cleaned-up CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://skr-e-commerce.netlify.app',
  'https://admin-skr-e-commerce.netlify.app',
  process.env.FRONTEND_URL?.replace(/\/$/, ''),
  process.env.ADMIN_URL?.replace(/\/$/, ''),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const cleanedOrigin = origin?.replace(/\/$/, '');
      const isAllowed = !origin || allowedOrigins.includes(cleanedOrigin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.error('❌ CORS blocked request from:', origin);
        console.log('🌐 Allowed Origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body Parsing & Sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// Register API Routes
app.use('/api/user', authLimiter, userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/orders', orderRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/category', categoryRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy ✅' });
});

// WebSocket Info
app.get('/api/socket/status', (req, res) => {
  res.json({
    success: true,
    connectedUsers: socketService.getConnectedUsersCount(),
    status: 'WebSocket server is running',
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Working 🚀' });
});

// Multer Error Middleware
app.use(handleMulterError);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack);

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
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

// 404 Route
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server (Render requires 0.0.0.0 binding)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on PORT: ${PORT}`);
  console.log(`🌍 ENV: ${process.env.NODE_ENV}`);
  console.log(`🌐 Server listening on http://0.0.0.0:${PORT}`);
});
