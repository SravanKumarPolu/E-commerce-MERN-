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

const orderRouter = express.Router();

// Admin features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment features
orderRouter.post('/place', userAuth, placeOrder);
orderRouter.post('/stripe', userAuth, placeOrderStripe);
orderRouter.post('/razorpay', userAuth, placeOrderRazorpay);
orderRouter.post('/paytm', userAuth, placeOrderPatym);
orderRouter.post('/gpay', userAuth, placeOrderGPay);

// Verification
orderRouter.post('/verifyStripe', userAuth, verifyStripe);
orderRouter.post('/verifyRazorpay', userAuth, verifyRazorpay);

// User features
orderRouter.post('/userorders', userAuth, userOrders);

export default orderRouter;