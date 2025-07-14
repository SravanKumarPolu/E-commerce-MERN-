import express from 'express';
import { saveAddress } from '../controllers/addressController.js';

const router = express.Router();

// POST /api/address/save
router.post('/save', saveAddress);

export default router; 