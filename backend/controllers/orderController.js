import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

dotenv.config();

// PayPal configuration
const environment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

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
    const { items, address, currency = 'USD' } = req.body;
    const userId = req.user?.id;
    
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

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: subtotal.toFixed(2)
            },
            shipping: {
              currency_code: currency,
              value: shipping.toFixed(2)
            }
          }
        },
        items: items.map(item => ({
          name: item.name,
          unit_amount: {
            currency_code: currency,
            value: item.price.toFixed(2)
          },
          quantity: item.quantity.toString(),
          category: 'PHYSICAL_GOODS'
        })),
        shipping: {
          address: {
            address_line_1: address.street,
            admin_area_2: address.city,
            admin_area_1: address.state,
            postal_code: address.zipcode,
            country_code: address.country || 'US'
          }
        }
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`
      }
    });

    const order = await client.execute(request);
    
    // Save order to database with PayPal order ID
    const orderData = {
      userId,
      items,
      address,
      paymentMethod: 'PayPal',
      subtotal,
      shipping,
      total,
      currency,
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
      dbOrderId: dbOrder._id
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order'
    });
  }
};

const capturePayPalPayment = async (req, res) => {
  try {
    const { orderID } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }
    
    if (!orderID) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);
    
    // Find and update the order in database
    const order = await orderModel.findOne({ 
      paypalOrderId: orderID, 
      userId,
      isActive: true 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order with PayPal capture details
    order.paypalCaptureId = capture.result.purchase_units[0].payments.captures[0].id;
    order.paypalTransactionId = capture.result.purchase_units[0].payments.captures[0].id;
    order.paymentStatus = 'completed';
    order.orderStatus = 'Order Placed';
    await order.save();

    // Clear user's cart after successful payment
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: 'Payment captured successfully',
      order: order.toJSON()
    });

  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture payment'
    });
  }
};

const handlePayPalWebhook = async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature (you should implement this for production)
    // const isValid = verifyWebhookSignature(req.headers, req.body, webhookId);
    
    console.log('PayPal webhook received:', event.event_type);
    
    switch (event.event_type) {
      case 'PAYMENT.SALE.COMPLETED':
        // Handle successful payment
        await handlePaymentCompleted(event);
        break;
      case 'PAYMENT.SALE.REFUNDED':
        // Handle refund
        await handlePaymentRefunded(event);
        break;
      case 'PAYMENT.SALE.DENIED':
        // Handle denied payment
        await handlePaymentDenied(event);
        break;
      default:
        console.log('Unhandled webhook event:', event.event_type);
    }
    
    res.json({ received: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

const handlePaymentCompleted = async (event) => {
  try {
    const { resource } = event;
    const { id: saleId, parent_payment: paymentId, amount } = resource;
    
    console.log(`Payment completed: Sale ID ${saleId}, Payment ID ${paymentId}, Amount ${amount.total} ${amount.currency}`);
    
    // Update order status in database
    const order = await orderModel.findByPayPalOrderId(paymentId);
    if (order) {
      order.paymentStatus = 'completed';
      order.paypalTransactionId = saleId;
      await order.save();
      console.log(`Order ${order._id} updated with completed payment`);
    }
    
  } catch (error) {
    console.error('Error handling payment completed:', error);
  }
};

const handlePaymentRefunded = async (event) => {
  try {
    const { resource } = event;
    const { id: refundId, sale_id: saleId, amount } = resource;
    
    console.log(`Payment refunded: Refund ID ${refundId}, Sale ID ${saleId}, Amount ${amount.total} ${amount.currency}`);
    
    // Update order status in database
    const order = await orderModel.findByPayPalCaptureId(saleId);
    if (order) {
      order.paymentStatus = 'refunded';
      await order.save();
      console.log(`Order ${order._id} updated with refund`);
    }
    
  } catch (error) {
    console.error('Error handling payment refunded:', error);
  }
};

const handlePaymentDenied = async (event) => {
  try {
    const { resource } = event;
    const { id: saleId, parent_payment: paymentId } = resource;
    
    console.log(`Payment denied: Sale ID ${saleId}, Payment ID ${paymentId}`);
    
    // Update order status in database
    const order = await orderModel.findByPayPalOrderId(paymentId);
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
      console.log(`Order ${order._id} updated with denied payment`);
    }
    
  } catch (error) {
    console.error('Error handling payment denied:', error);
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const { page = 1, limit = 10, status } = req.body;
    
    const orders = await orderModel.findByUser(userId, { page, limit, status });
    const totalOrders = await orderModel.countDocuments({ userId, isActive: true });
    
    res.json({
      success: true,
      orders: orders.map(order => order.toJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const allOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.body;
    
    const orders = await orderModel.findAllOrders({ page, limit, status, paymentStatus });
    const totalOrders = await orderModel.countDocuments({ isActive: true });
    
    res.json({
      success: true,
      orders: orders.map(order => order.toJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page * limit < totalOrders,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status, paymentStatus } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) {
      await order.updateStatus(status);
    }
    
    if (paymentStatus) {
      await order.updatePaymentStatus(paymentStatus);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: order.toJSON()
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const placeOrderRazorpay = async (req, res) => {
  // Existing Razorpay logic
  res.status(501).json({
    success: false,
    message: 'Razorpay integration not implemented yet'
  });
};

const placeOrderStripe = async (req, res) => {
  // Existing Stripe logic
  res.status(501).json({
    success: false,
    message: 'Stripe integration not implemented yet'
  });
};

const placeOrderGPay = async (req, res) => {
  // Existing GPay logic
  res.status(501).json({
    success: false,
    message: 'GPay integration not implemented yet'
  });
};

const placeOrderPatym = async (req, res) => {
  // Existing Paytm logic
  res.status(501).json({
    success: false,
    message: 'Paytm integration not implemented yet'
  });
};

export { 
  placeOrder, 
  placeOrderPayPal,
  capturePayPalPayment,
  handlePayPalWebhook,
  placeOrderRazorpay, 
  placeOrderStripe,
  placeOrderGPay,
  placeOrderPatym, 
  updateStatus, 
  userOrders, 
  allOrders 
};