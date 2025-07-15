import { allOrders, placeOrder, placeOrderGPay, placeOrderPatym, placeOrderPayPal, capturePayPalPayment, handlePayPalWebhook, placeOrderRazorpay, placeOrderStripe, updateStatus, userOrders } from '../controllers/orderController';
import authUser, { authAdmin } from '../middleware/auth.js';

import express from 'express'

const orderRouter = express.Router();

//Admin features (require admin authentication)
orderRouter.post('/list', authAdmin, allOrders)
orderRouter.post('/status', authAdmin, updateStatus)

//Payment feature (require user authentication)
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('razopay', authUser, placeOrderRazorpay)
orderRouter.post('/paytm', authUser, placeOrderPatym)
orderRouter.post('/gpay', authUser, placeOrderGPay)

// PayPal routes (require user authentication)
orderRouter.post('/paypal/create', authUser, placeOrderPayPal)
orderRouter.post('/paypal/capture', authUser, capturePayPalPayment)
orderRouter.post('/paypal/webhook', handlePayPalWebhook) // No auth for webhooks

//User feature (require user authentication)
orderRouter.post('userorders', authUser, userOrders)

export default orderRouter;