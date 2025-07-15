import { allOrders, placeOrder, placeOrderPayPal, capturePayPalPayment, handlePayPalWebhook, updateStatus, userOrders } from '../controllers/orderController';
import { authUser } from '../middleware/authUser.js';

import express from 'express'

const orderRouter = express.Router();

orderRouter.post('/', authUser, placeOrder)
orderRouter.post('/paypal/create', authUser, placeOrderPayPal)
orderRouter.post('/paypal/capture', authUser, capturePayPalPayment)
orderRouter.post('/paypal/webhook', handlePayPalWebhook)
orderRouter.put('/status', authUser, updateStatus)
orderRouter.get('/user', authUser, userOrders)
orderRouter.get('/all', authUser, allOrders)

export default orderRouter;