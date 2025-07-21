import express from 'express';
import { createPayPalTransfer, getTransferHistory, getTransferStatus, handleTransferWebhook } from '../controllers/paypalTransferController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create PayPal transfer (admin only)
router.post('/create', protect, admin, createPayPalTransfer);

// Get transfer history (admin only)
router.get('/history', protect, admin, getTransferHistory);

// Get transfer status (admin only)
router.get('/status/:batchId', protect, admin, getTransferStatus);

// PayPal transfer webhook (no authentication required for webhooks)
router.post('/webhook', handleTransferWebhook);

export default router; 