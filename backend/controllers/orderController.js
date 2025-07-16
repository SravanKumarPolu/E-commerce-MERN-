import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

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

    // Clear user's cart after successful order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    
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
    const orders = await orderModel.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders: orders.map(order => order.toJSON())
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