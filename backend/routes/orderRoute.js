import { 
  allOrders, 
  placeOrder, 
  placeOrderGPay, 
  placeOrderPatym, 
  placeOrderRazorpay, 
  placeOrderStripe, 
  updateStatus, 
  userOrders,
  verifyStripe,
  verifyRazorpay
} from '../controllers/orderController.js';
import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';
import {
  validateOrderPlacement,
  validatePaymentVerification,
  validateOrderStatusUpdate,
  handleValidationErrors,
  sanitizeInput,
  commonValidations
} from '../middleware/validation.js';

const orderRouter = express.Router();

// Apply input sanitization to all routes
orderRouter.use(sanitizeInput);

// Admin features
orderRouter.post('/list', adminAuth, allOrders);

orderRouter.post('/status', 
  adminAuth,
  validateOrderStatusUpdate,
  handleValidationErrors,
  updateStatus
);

// Payment features
orderRouter.post('/place', 
  userAuth,
  validateOrderPlacement,
  handleValidationErrors,
  placeOrder
);

orderRouter.post('/stripe', 
  userAuth,
  validateOrderPlacement,
  handleValidationErrors,
  placeOrderStripe
);

orderRouter.post('/razorpay', 
  userAuth,
  validateOrderPlacement,
  handleValidationErrors,
  placeOrderRazorpay
);

orderRouter.post('/paytm', 
  userAuth,
  validateOrderPlacement,
  handleValidationErrors,
  placeOrderPatym
);

orderRouter.post('/gpay', 
  userAuth,
  validateOrderPlacement,
  handleValidationErrors,
  placeOrderGPay
);

// Verification
orderRouter.post('/verifyStripe', 
  userAuth,
  validatePaymentVerification,
  handleValidationErrors,
  verifyStripe
);

orderRouter.post('/verifyRazorpay', 
  userAuth,
  validatePaymentVerification,
  handleValidationErrors,
  verifyRazorpay
);

// User features
orderRouter.post('/userorders', userAuth, userOrders);

export default orderRouter;