import { allOrders, placeOrder, placeOrderGPay, placeOrderPatym, placeOrderPayPal, capturePayPalPayment, handlePayPalWebhook, placeOrderRazorpay, placeOrderStripe, updateStatus, userOrders } from '../controllers/orderController';

import express from 'express'

const orderRouter = express.Router();
//Admin features
orderRouter.post('/list',allOrders)
orderRouter.post('/status',updateStatus)

//Payment feature
orderRouter.post('/place',placeOrder)
orderRouter.post('/stripe',placeOrderStripe)
orderRouter.post('razopay',placeOrderRazorpay)
orderRouter.post('/paytm',placeOrderPatym)
orderRouter.post('/gpay',placeOrderGPay)

// PayPal routes
orderRouter.post('/paypal/create', placeOrderPayPal)
orderRouter.post('/paypal/capture', capturePayPalPayment)
orderRouter.post('/paypal/webhook', handlePayPalWebhook)

//User feature
orderRouter.post('userorders',userOrders)

export default orderRouter;