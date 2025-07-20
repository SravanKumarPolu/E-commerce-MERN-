const mongoose = require('mongoose');
const UserActivity = require('../models/UserActivity');
const ProductPerformance = require('../models/ProductPerformance');
const SearchAnalytics = require('../models/SearchAnalytics');

class AnalyticsService {
  constructor() {
    this.isEnabled = process.env.ENABLE_ANALYTICS === 'true';
    this.sampleRate = parseFloat(process.env.PERFORMANCE_SAMPLE_RATE) || 0.1;
  }

  // =============================================================================
  // USER ACTIVITY TRACKING
  // =============================================================================

  async trackActivity(activityData) {
    if (!this.isEnabled) return null;

    try {
      const activity = new UserActivity({
        userId: activityData.userId,
        action: activityData.action,
        productId: activityData.productId,
        category: activityData.category,
        searchQuery: activityData.searchQuery,
        sessionId: activityData.sessionId,
        userAgent: activityData.userAgent,
        ipAddress: activityData.ipAddress,
        metadata: activityData.metadata || {},
        createdAt: new Date()
      });

      await activity.save();
      return activity;
    } catch (error) {
      console.error('Analytics tracking error:', error.message);
      return null;
    }
  }

  async trackUserLogin(userId, sessionId, userAgent, ipAddress) {
    return this.trackActivity({
      userId,
      action: 'login',
      sessionId,
      userAgent,
      ipAddress
    });
  }

  async trackUserLogout(userId, sessionId) {
    return this.trackActivity({
      userId,
      action: 'logout',
      sessionId
    });
  }

  async trackProductView(userId, productId, category, sessionId, userAgent, ipAddress) {
    // Update product performance
    await this.updateProductPerformance(productId, 'views');
    
    return this.trackActivity({
      userId,
      action: 'view_product',
      productId,
      category,
      sessionId,
      userAgent,
      ipAddress
    });
  }

  async trackAddToCart(userId, productId, category, quantity, sessionId, userAgent, ipAddress) {
    // Update product performance
    await this.updateProductPerformance(productId, 'add_to_cart', quantity);
    
    return this.trackActivity({
      userId,
      action: 'add_to_cart',
      productId,
      category,
      sessionId,
      userAgent,
      ipAddress,
      metadata: { quantity }
    });
  }

  async trackPurchase(userId, orderId, items, totalAmount, sessionId, userAgent, ipAddress) {
    // Update product performance for each item
    for (const item of items) {
      await this.updateProductPerformance(item.productId, 'purchase', item.quantity, item.total);
    }
    
    return this.trackActivity({
      userId,
      action: 'purchase',
      sessionId,
      userAgent,
      ipAddress,
      metadata: { orderId, totalAmount, itemCount: items.length }
    });
  }

  async trackSearch(userId, query, resultsCount, category, sessionId, userAgent, ipAddress) {
    // Update search analytics
    await this.updateSearchAnalytics(query, resultsCount, category);
    
    return this.trackActivity({
      userId,
      action: 'search',
      searchQuery: query,
      category,
      sessionId,
      userAgent,
      ipAddress,
      metadata: { resultsCount }
    });
  }

  // =============================================================================
  // PRODUCT PERFORMANCE TRACKING
  // =============================================================================

  async updateProductPerformance(productId, action, quantity = 1, revenue = 0) {
    try {
      const performance = await ProductPerformance.findOne({ productId });
      
      if (performance) {
        switch (action) {
          case 'views':
            performance.views += 1;
            break;
          case 'add_to_cart':
            performance.addToCartCount += quantity;
            break;
          case 'purchase':
            performance.purchaseCount += quantity;
            performance.revenue += revenue;
            break;
        }
        
        // Recalculate conversion rate
        performance.conversionRate = performance.views > 0 
          ? (performance.purchaseCount / performance.views) * 100 
          : 0;
        
        performance.lastUpdated = new Date();
        await performance.save();
      } else {
        // Create new performance record
        const newPerformance = new ProductPerformance({
          productId,
          views: action === 'views' ? 1 : 0,
          addToCartCount: action === 'add_to_cart' ? quantity : 0,
          purchaseCount: action === 'purchase' ? quantity : 0,
          revenue: action === 'purchase' ? revenue : 0,
          conversionRate: 0,
          lastUpdated: new Date()
        });
        await newPerformance.save();
      }
    } catch (error) {
      console.error('Product performance update error:', error.message);
    }
  }

  // =============================================================================
  // SEARCH ANALYTICS TRACKING
  // =============================================================================

  async updateSearchAnalytics(query, resultsCount, category) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const searchAnalytics = await SearchAnalytics.findOne({
        query: query.toLowerCase(),
        date: today
      });
      
      if (searchAnalytics) {
        searchAnalytics.count += 1;
        searchAnalytics.resultsCount = Math.round((searchAnalytics.resultsCount + resultsCount) / 2);
        await searchAnalytics.save();
      } else {
        const newSearchAnalytics = new SearchAnalytics({
          query: query.toLowerCase(),
          count: 1,
          resultsCount,
          category,
          date: today
        });
        await newSearchAnalytics.save();
      }
    } catch (error) {
      console.error('Search analytics update error:', error.message);
    }
  }

  // =============================================================================
  // ANALYTICS QUERIES
  // =============================================================================

  async getDashboardSummary(startDate = null, endDate = null) {
    try {
      const dateFilter = this.buildDateFilter(startDate, endDate);
      
      const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentActivities,
        lowStockProducts
      ] = await Promise.all([
        this.getTotalUsers(dateFilter),
        this.getTotalProducts(),
        this.getTotalOrders(dateFilter),
        this.getTotalRevenue(dateFilter),
        this.getRecentActivities(10),
        this.getLowStockProducts()
      ]);

      return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentActivities,
        lowStockProducts,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Dashboard summary error:', error.message);
      throw error;
    }
  }

  async getSalesAnalytics(startDate = null, endDate = null) {
    try {
      const dateFilter = this.buildDateFilter(startDate, endDate);
      
      const [
        dailySales,
        categoryBreakdown,
        paymentMethods,
        orderStatuses,
        revenueMetrics
      ] = await Promise.all([
        this.getDailySales(dateFilter),
        this.getCategoryBreakdown(dateFilter),
        this.getPaymentMethodBreakdown(dateFilter),
        this.getOrderStatusBreakdown(dateFilter),
        this.getRevenueMetrics(dateFilter)
      ]);

      return {
        dailySales,
        categoryBreakdown,
        paymentMethods,
        orderStatuses,
        revenueMetrics,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Sales analytics error:', error.message);
      throw error;
    }
  }

  async getProductPerformance(limit = 10, metric = 'revenue', category = null) {
    try {
      let query = {};
      if (category) {
        query.category = category;
      }

      const sortField = this.getSortField(metric);
      const products = await ProductPerformance.find(query)
        .sort({ [sortField]: -1 })
        .limit(limit)
        .populate('productId', 'name category price images');

      return {
        products: products.map(p => ({
          product: p.productId,
          views: p.views,
          addToCartCount: p.addToCartCount,
          purchaseCount: p.purchaseCount,
          revenue: p.revenue,
          conversionRate: p.conversionRate
        })),
        metric,
        category,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Product performance error:', error.message);
      throw error;
    }
  }

  async getUserBehaviorAnalytics(userId = null, startDate = null, endDate = null) {
    try {
      const dateFilter = this.buildDateFilter(startDate, endDate);
      let userFilter = {};
      if (userId) {
        userFilter.userId = userId;
      }

      const [
        dailyActivity,
        mostActiveUsers,
        productInteractions,
        actionBreakdown
      ] = await Promise.all([
        this.getDailyActivityTrends(dateFilter),
        this.getMostActiveUsers(dateFilter, 10),
        this.getProductInteractions(dateFilter),
        this.getActionBreakdown(dateFilter)
      ]);

      return {
        dailyActivity,
        mostActiveUsers,
        productInteractions,
        actionBreakdown,
        userId,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('User behavior analytics error:', error.message);
      throw error;
    }
  }

  async getSearchAnalytics(startDate = null, endDate = null) {
    try {
      const dateFilter = this.buildDateFilter(startDate, endDate);
      
      const [
        popularSearches,
        searchTrends,
        categorySearch,
        searchPerformance
      ] = await Promise.all([
        this.getPopularSearches(dateFilter, 10),
        this.getSearchTrends(dateFilter),
        this.getCategorySearchBreakdown(dateFilter),
        this.getSearchPerformanceMetrics(dateFilter)
      ]);

      return {
        popularSearches,
        searchTrends,
        categorySearch,
        searchPerformance,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Search analytics error:', error.message);
      throw error;
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  buildDateFilter(startDate, endDate) {
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    return filter;
  }

  getSortField(metric) {
    const sortFields = {
      'revenue': 'revenue',
      'views': 'views',
      'add_to_cart': 'addToCartCount',
      'purchases': 'purchaseCount',
      'conversion_rate': 'conversionRate'
    };
    return sortFields[metric] || 'revenue';
  }

  // =============================================================================
  // SPECIFIC QUERY METHODS
  // =============================================================================

  async getTotalUsers(dateFilter) {
    const User = require('../models/User');
    return User.countDocuments({ isActive: true, ...dateFilter });
  }

  async getTotalProducts() {
    const Product = require('../models/Product');
    return Product.countDocuments({ isActive: true });
  }

  async getTotalOrders(dateFilter) {
    const Order = require('../models/Order');
    return Order.countDocuments(dateFilter);
  }

  async getTotalRevenue(dateFilter) {
    const Order = require('../models/Order');
    const result = await Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['completed', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    return result[0]?.total || 0;
  }

  async getRecentActivities(limit) {
    return UserActivity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .populate('productId', 'name category');
  }

  async getLowStockProducts(threshold = 10) {
    const Product = require('../models/Product');
    return Product.find({ stock: { $lte: threshold }, isActive: true })
      .select('name stock category')
      .sort({ stock: 1 });
  }

  async getDailySales(dateFilter) {
    const Order = require('../models/Order');
    return Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['completed', 'delivered'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getCategoryBreakdown(dateFilter) {
    const Order = require('../models/Order');
    return Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['completed', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          revenue: { $sum: '$items.total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
  }

  async getPaymentMethodBreakdown(dateFilter) {
    const Order = require('../models/Order');
    return Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['completed', 'delivered'] } } },
      {
        $group: {
          _id: '$paymentMethod',
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
  }

  async getOrderStatusBreakdown(dateFilter) {
    const Order = require('../models/Order');
    return Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  async getRevenueMetrics(dateFilter) {
    const Order = require('../models/Order');
    const result = await Order.aggregate([
      { $match: { ...dateFilter, status: { $in: ['completed', 'delivered'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);
    
    return result[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
  }

  async getDailyActivityTrends(dateFilter) {
    return UserActivity.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          activities: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          date: '$_id',
          activities: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { date: 1 } }
    ]);
  }

  async getMostActiveUsers(dateFilter, limit) {
    return UserActivity.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$userId',
          activityCount: { $sum: 1 }
        }
      },
      { $sort: { activityCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          activityCount: 1
        }
      }
    ]);
  }

  async getProductInteractions(dateFilter) {
    return UserActivity.aggregate([
      { $match: { ...dateFilter, productId: { $exists: true } } },
      {
        $group: {
          _id: '$productId',
          views: { $sum: { $cond: [{ $eq: ['$action', 'view_product'] }, 1, 0] } },
          addToCart: { $sum: { $cond: [{ $eq: ['$action', 'add_to_cart'] }, 1, 0] } },
          purchases: { $sum: { $cond: [{ $eq: ['$action', 'purchase'] }, 1, 0] } }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);
  }

  async getActionBreakdown(dateFilter) {
    return UserActivity.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  async getPopularSearches(dateFilter, limit) {
    return SearchAnalytics.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$query',
          totalCount: { $sum: '$count' },
          avgResults: { $avg: '$resultsCount' }
        }
      },
      { $sort: { totalCount: -1 } },
      { $limit: limit }
    ]);
  }

  async getSearchTrends(dateFilter) {
    return SearchAnalytics.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          searches: { $sum: '$count' },
          uniqueQueries: { $addToSet: '$query' }
        }
      },
      {
        $project: {
          date: '$_id',
          searches: 1,
          uniqueQueries: { $size: '$uniqueQueries' }
        }
      },
      { $sort: { date: 1 } }
    ]);
  }

  async getCategorySearchBreakdown(dateFilter) {
    return SearchAnalytics.aggregate([
      { $match: { ...dateFilter, category: { $exists: true } } },
      {
        $group: {
          _id: '$category',
          searches: { $sum: '$count' },
          avgResults: { $avg: '$resultsCount' }
        }
      },
      { $sort: { searches: -1 } }
    ]);
  }

  async getSearchPerformanceMetrics(dateFilter) {
    const result = await SearchAnalytics.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalSearches: { $sum: '$count' },
          uniqueQueries: { $addToSet: '$query' },
          avgResultsPerSearch: { $avg: '$resultsCount' }
        }
      }
    ]);
    
    const data = result[0] || { totalSearches: 0, uniqueQueries: [], avgResultsPerSearch: 0 };
    return {
      totalSearches: data.totalSearches,
      uniqueQueries: data.uniqueQueries.length,
      avgResultsPerSearch: data.avgResultsPerSearch,
      queryDiversity: data.totalSearches > 0 ? (data.uniqueQueries.length / data.totalSearches) * 100 : 0
    };
  }
}

module.exports = new AnalyticsService(); 