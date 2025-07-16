import { allOrders, placeOrder, placeOrderPayPal, capturePayPalPayment, handlePayPalWebhook, updateStatus, userOrders, debugOrders } from '../controllers/orderController.js';
import authUser, { authAdmin } from '../middleware/auth.js';

import express from 'express'

const orderRouter = express.Router();

orderRouter.post('/', authUser, placeOrder)
orderRouter.post('/paypal/create', authUser, placeOrderPayPal)
orderRouter.post('/paypal/capture', authUser, capturePayPalPayment)
orderRouter.post('/paypal/webhook', handlePayPalWebhook)
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.put('/status', authUser, updateStatus)
orderRouter.get('/user', authUser, userOrders)
orderRouter.get('/all', authAdmin, allOrders) // Admin only - all user orders
orderRouter.get('/debug', debugOrders)

export default orderRouter;