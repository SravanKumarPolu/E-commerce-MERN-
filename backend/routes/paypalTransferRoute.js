import express from 'express';
import { createPayPalTransfer, getTransferHistory } from '../controllers/paypalTransferController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create PayPal transfer (admin only)
router.post('/create', protect, admin, createPayPalTransfer);

// Get transfer history (admin only)
router.get('/history', protect, admin, getTransferHistory);

export default router; 