import 'dotenv/config';

import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import cors from 'cors';
import express from 'express';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App config
const app = express();
const port = process.env.PORT || 4000;

// Initialize database and cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
  credentials: true
}));

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => console.log('Server started on PORT: ' + port));
