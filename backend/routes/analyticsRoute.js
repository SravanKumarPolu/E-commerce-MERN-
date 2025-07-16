import express from 'express';
import {
  trackUserActivity,
  getSalesAnalytics,
  getProductPerformance,
  getUserBehavior,
  getSearchAnalytics,
  getDashboardSummary
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Track user activity (for frontend tracking)
router.post('/track-activity', protect, trackUserActivity);

// Dashboard summary (admin only)
router.get('/dashboard-summary', protect, admin, getDashboardSummary);

// Sales analytics (admin only)
router.get('/sales', protect, admin, getSalesAnalytics);

// Product performance analytics (admin only)
router.get('/products', protect, admin, getProductPerformance);

// User behavior analytics (admin only)
router.get('/user-behavior', protect, admin, getUserBehavior);

// Search analytics (admin only)
router.get('/search', protect, admin, getSearchAnalytics);

export default router; 