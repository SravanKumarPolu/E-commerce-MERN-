import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import socketService from '../services/socketService.js';
import { UserActivity, ProductPerformance } from '../models/analyticsModel.js';

dotenv.config();

// PayPal configuration - ONLY USD SUPPORT
const environment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

// Simple country name to ISO code mapping
const getCountryCode = (countryName) => {
  const countryMap = {
    'INDIA': 'IN', 'UNITED STATES': 'US', 'USA': 'US', 'UNITED KINGDOM': 'GB', 'UK': 'GB',
    'CANADA': 'CA', 'AUSTRALIA': 'AU', 'GERMANY': 'DE', 'FRANCE': 'FR', 'ITALY': 'IT',
    'SPAIN': 'ES', 'NETHERLANDS': 'NL', 'BELGIUM': 'BE', 'SWITZERLAND': 'CH', 'AUSTRIA': 'AT'
  };
  
  const normalizedCountry = countryName?.toUpperCase().trim();
  return countryMap[normalizedCountry] || 'US';
};

const placeOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    // Validate required fields
    if (!items || !address || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Items, address, and payment method are required'
      });
    }

    // Calculate total amount
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 10; // Fixed shipping cost
    const total = subtotal + shipping;

    // Create order object
    const orderData = {
      userId,
      items,
      address,
      paymentMethod,
      subtotal,
      shipping,
      total,
      currency: 'USD',
      paymentStatus: 'pending',
      orderStatus: 'Order Placed'
    };

    // Save order to database
    const order = new orderModel(orderData);
    await order.save();

    // Track user activity
    try {
      await UserActivity.trackActivity({
        userId,
        action: 'purchase',
        sessionId: req.session?.id
      });

      // Track product metrics for each item
      for (const item of items) {
        await ProductPerformance.updateProductMetrics(item.productId, {
          purchaseCount: item.quantity,
          revenue: item.price * item.quantity
        });
      }
    } catch (analyticsError) {
      console.error('Analytics tracking error:', analyticsError);
      // Don't fail the order if analytics tracking fails
    }

    // Add order to user's orders array
    await userModel.findByIdAndUpdate(userId, { 
      $push: { orders: order._id },
      cartData: {} 
    });

    // Send real-time notifications
    const orderWithUser = await orderModel.findById(order._id).populate('userId', 'name email');
    
    // Send new order notification to admin
    socketService.sendNewOrderToAdmin(orderWithUser.toJSON());
    
    // Send order update to user
    socketService.sendOrderUpdateToUser(userId, orderWithUser.toJSON());
    
    res.json({
      success: true,
      message: 'Order placed successfully',
      order: order.toJSON()
    });

  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const placeOrderPayPal = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user?.id;
    
    // STRICT USD ONLY - No currency detection, no fallbacks
    console.log('🚀 Creating PayPal order with USD ONLY');
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    if (!items || !address) {
      return res.status(400).json({
        success: false,
        message: 'Items and address are required'
      });
    }

    // Calculate amounts
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 10;
    const total = subtotal + shipping;

    // Validate amounts
    if (total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total'
      });
    }

    // Ensure minimum order amount for PayPal
    if (total < 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Order total must be at least $0.01'
      });
    }

    // Create PayPal order with STRICT USD configuration
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    
    // Force US address for maximum PayPal compatibility
    const paypalShippingAddress = {
      address_line_1: address.street || '123 Test St',
      admin_area_2: address.city || 'Test City',
      admin_area_1: address.state || 'CA',
      postal_code: address.zipcode || '12345',
      country_code: 'US' // ALWAYS US for PayPal sandbox
    };
    
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD', // STRICT USD ONLY
          value: total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: subtotal.toFixed(2)
            },
            shipping: {
              currency_code: 'USD',
              value: shipping.toFixed(2)
            }
          }
        },
        items: items.map(item => ({
          name: item.name,
          unit_amount: {
            currency_code: 'USD', // STRICT USD ONLY
            value: item.price.toFixed(2)
          },
          quantity: item.quantity.toString(),
          category: 'PHYSICAL_GOODS'
        })),
        shipping: {
          address: paypalShippingAddress
        },
        payee: {
          email_address: 'sb-business@business.example.com' // PayPal sandbox business account
        }
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
        user_action: 'PAY_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        },
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        locale: 'en-US', // Force US locale
        landing_page: 'LOGIN', // Force login page
        brand_name: 'E-commerce Store'
      }
    });

    // Debug logging
    console.log('💰 PayPal Order Details:');
    console.log('  - Currency: USD (STRICT)');
    console.log('  - Total Amount:', total.toFixed(2));
    console.log('  - Shipping Address: US (forced)');
    console.log('  - Items Count:', items.length);

    // Execute PayPal order creation
    const order = await client.execute(request);
    console.log('✅ PayPal order created successfully with USD');
    console.log('  - Order ID:', order.result.id);
    console.log('  - Status:', order.result.status);
    
    // Save order to database with PayPal order ID
    const orderData = {
      userId,
      items,
      address,
      paymentMethod: 'PayPal',
      subtotal,
      shipping,
      total,
      currency: 'USD', // STRICT USD
      paypalOrderId: order.result.id,
      paymentStatus: 'pending',
      orderStatus: 'Order Placed'
    };

    const dbOrder = new orderModel(orderData);
    await dbOrder.save();
    
    console.log('📦 Order saved to database:', dbOrder._id);
    
    // Add order to user's orders array
    try {
      await userModel.findByIdAndUpdate(
        userId,
        { $push: { orders: dbOrder._id } }
      );
      console.log('👤 Order added to user:', userId);
    } catch (userUpdateError) {
      console.error('❌ Error adding order to user:', userUpdateError);
      // Don't fail the order creation if user update fails
    }
    
    res.json({
      success: true,
      orderId: order.result.id,
      links: order.result.links,
      dbOrderId: dbOrder._id,
      currency: 'USD' // Confirm USD usage
    });

  } catch (error) {
    console.error('❌ PayPal order creation failed:', error.message);
    
    // Enhanced error analysis
    console.error('🔍 Error Details:');
    console.error('  - Error Type:', error.constructor.name);
    console.error('  - Error Message:', error.message);
    
    if (error.response) {
      console.error('  - PayPal API Status:', error.response.status);
      console.error('  - PayPal API Data:', error.response.data);
      
      // Check for specific PayPal error codes
      if (error.response.data && error.response.data.details) {
        const currencyError = error.response.data.details.find(detail => 
          detail.issue && detail.issue.includes('CURRENCY')
        );
        
        if (currencyError) {
          console.error('🚨 CURRENCY ERROR DETECTED:', currencyError);
          return res.status(400).json({
            success: false,
            message: 'PayPal currency issue detected. Please use Credit/Debit Card or Cash on Delivery instead.',
            error: 'CURRENCY_NOT_SUPPORTED',
            alternative: 'Use Credit/Debit Card or Cash on Delivery'
          });
        }
      }
    }
    
    // Provide user-friendly error message
    let errorMessage = 'PayPal payment is not available. Please try Credit/Debit Card or Cash on Delivery.';
    
    if (error.message && error.message.includes('currency')) {
      errorMessage = 'PayPal currency issue detected. Please use Credit/Debit Card or Cash on Delivery.';
    } else if (error.message && error.message.includes('seller')) {
      errorMessage = 'PayPal payment not available for your region. Please use Credit/Debit Card or Cash on Delivery.';
    } else if (error.message && error.message.includes('country')) {
      errorMessage = 'PayPal payment not available for your country. Please use Credit/Debit Card or Cash on Delivery.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: 'PAYPAL_UNAVAILABLE',
      alternative: 'Use Credit/Debit Card or Cash on Delivery'
    });
  }
};

const capturePayPalPayment = async (req, res) => {
  try {
    const { orderID } = req.body;
    const userId = req.user?.id;
    
    console.log('🔄 Capturing PayPal payment:', { orderID, userId });
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    if (!orderID) {
      return res.status(400).json({
        success: false,
        message: 'PayPal order ID is required'
      });
    }

    // Capture the PayPal payment
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    
    console.log('💰 Executing PayPal capture request...');
    const capture = await client.execute(request);
    console.log('✅ PayPal capture response:', capture.result.status);
    
    if (capture.result.status === 'COMPLETED') {
      console.log('🎉 Payment completed successfully');
      
      // Update order in database
      const order = await orderModel.findOneAndUpdate(
        { paypalOrderId: orderID, userId },
        {
          paymentStatus: 'completed',
          paypalCaptureId: capture.result.purchase_units[0].payments.captures[0].id,
          paypalTransactionId: capture.result.purchase_units[0].payments.captures[0].id
        },
        { new: true }
      );
      
      if (!order) {
        console.error('❌ Order not found for PayPal order ID:', orderID);
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      
      console.log('📦 Order updated in database:', order._id);
      
      // Clear user's cart after successful payment
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      console.log('🛒 Cart cleared for user:', userId);
      
      // Send real-time notifications
      const orderWithUser = await orderModel.findById(order._id).populate('userId', 'name email');
      
      // Send payment status update to user
      socketService.sendPaymentStatusUpdate(orderWithUser.toJSON());
      
      // Send order status update to admin
      socketService.sendOrderUpdateToAdmin(orderWithUser.toJSON());
      
      res.json({
        success: true,
        message: 'Payment captured successfully',
        order: order.toJSON()
      });
    } else {
      console.error('❌ Payment capture failed with status:', capture.result.status);
      res.status(400).json({
        success: false,
        message: 'Payment capture failed'
      });
    }
    
  } catch (error) {
    console.error('❌ PayPal capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture payment'
    });
  }
};

const handlePayPalWebhook = async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature (implement proper verification in production)
    // For now, we'll just process the event
    
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const captureId = event.resource.id;
      
      // Update order status
      await orderModel.findOneAndUpdate(
        { paypalCaptureId: captureId },
        { paymentStatus: 'completed' }
      );
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ success: false });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and status are required'
      });
    }
    
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Send real-time notifications
    const orderWithUser = await orderModel.findById(orderId).populate('userId', 'name email');
    
    // Send order status update to all relevant parties
    socketService.sendOrderStatusUpdate(orderWithUser.toJSON());
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: order.toJSON()
    });
    
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    console.log('🔍 UserOrders Debug:');
    console.log('  - User ID from token:', userId);
    console.log('  - Request method:', req.method);
    console.log('  - Request body:', req.body);
    console.log('  - Request query:', req.query);
    
    if (!userId) {
      console.log('❌ No user ID found in token');
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    // Get pagination and filtering parameters from request body (POST) or query (GET)
    const { page = 1, limit = 10, status } = req.method === 'POST' ? req.body : req.query;
    const skip = (page - 1) * limit;
    
    console.log('  - Pagination params:', { page, limit, status, skip });
    
    // Build query
    let query = { userId, isActive: true };
    if (status) {
      query.orderStatus = status;
    }
    
    console.log('  - Database query:', query);
    
    // Get total count for pagination
    const totalOrders = await orderModel.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);
    
    console.log('  - Total orders found:', totalOrders);
    console.log('  - Total pages:', totalPages);
    
    // Get orders with pagination
    const orders = await orderModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    console.log('  - Orders returned:', orders.length);
    
    res.json({
      success: true,
      orders: orders.map(order => order.toJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('User orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const allOrders = async (req, res) => {
  try {
    // Get filtering and pagination parameters
    const { 
      page = 1, 
      limit = 20, 
      status, 
      paymentStatus, 
      userEmail,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = { isActive: true };
    
    if (status) {
      query.orderStatus = status;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    // Date range filtering
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
      }
    }
    
    // User email filtering (will be handled after population)
    let userEmailFilter = null;
    if (userEmail) {
      userEmailFilter = userEmail.toLowerCase();
    }
    
    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Get total count for pagination
    const totalOrders = await orderModel.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));
    
    // Get orders with population and filtering
    let orders = await orderModel.find(query)
      .populate('userId', 'name email')
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Apply user email filter after population
    if (userEmailFilter) {
      orders = orders.filter(order => 
        order.userId && 
        order.userId.email && 
        order.userId.email.toLowerCase().includes(userEmailFilter)
      );
    }
    
    // Get unique users for filtering dropdown
    const uniqueUsers = await orderModel.aggregate([
      { $match: { isActive: true } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $group: { _id: '$user._id', name: { $first: '$user.name' }, email: { $first: '$user.email' } } },
      { $sort: { name: 1 } }
    ]);
    
    // Get order statistics
    const stats = await orderModel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'Order Placed'] }, 1, 0] } },
          completedOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'Delivered'] }, 1, 0] } },
          pendingPayments: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
          completedPayments: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } }
        }
      }
    ]);
    
    res.json({
      success: true,
      orders: orders.map(order => {
        const orderObj = order.toJSON();
        // Ensure user data is properly structured
        if (orderObj.userId && typeof orderObj.userId === 'object') {
          orderObj.user = orderObj.userId;
          delete orderObj.userId;
        }
        return orderObj;
      }),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      },
      filters: {
        users: uniqueUsers,
        orderStatuses: ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'],
        paymentStatuses: ['pending', 'completed', 'failed', 'refunded']
      },
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        pendingPayments: 0,
        completedPayments: 0
      }
    });
    
  } catch (error) {
    console.error('All orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Debug endpoint to check orders
const debugOrders = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const recentOrders = await orderModel.find().sort({ createdAt: -1 }).limit(5);
    
    // Get users with orders
    const usersWithOrders = await userModel.find({ 
      orders: { $exists: true, $ne: [] } 
    }).select('name email orders').populate('orders', '_id paymentStatus orderStatus total createdAt');
    
    res.json({
      success: true,
      totalOrders,
      recentOrders: recentOrders.map(order => ({
        _id: order._id,
        userId: order.userId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        total: order.total,
        createdAt: order.createdAt
      })),
      usersWithOrders: usersWithOrders.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        orderCount: user.orders.length,
        orders: user.orders
      }))
    });
    
  } catch (error) {
    console.error('Debug orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export { 
  placeOrder, 
  placeOrderPayPal,
  capturePayPalPayment,
  handlePayPalWebhook,
  updateStatus, 
  userOrders, 
  allOrders,
  debugOrders
};