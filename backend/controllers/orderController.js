import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

// PayPal configuration
const environment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

const placeOrder = async (req, res) => {
  // Existing COD order logic
  try {
    const { items, address, paymentMethod } = req.body;
    
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
    const order = {
      items,
      address,
      paymentMethod,
      total,
      subtotal,
      shipping,
      status: 'pending',
      createdAt: new Date(),
      userId: req.user?.id || 'guest'
    };

    // Here you would typically save to database
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Order placed successfully',
      order
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
    
    res.json({
      success: true,
      orderId: order.result.id,
      links: order.result.links
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
    
    if (!orderID) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);
    
    // Here you would typically save the order to your database
    const orderData = {
      paypalOrderId: orderID,
      paypalCaptureId: capture.result.purchase_units[0].payments.captures[0].id,
      status: 'completed',
      amount: capture.result.purchase_units[0].amount.value,
      currency: capture.result.purchase_units[0].amount.currency_code,
      createdAt: new Date()
    };

    res.json({
      success: true,
      message: 'Payment captured successfully',
      order: orderData
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
    
    // Update order status in your database
    // await OrderModel.findOneAndUpdate(
    //   { paypalOrderId: paymentId },
    //   { status: 'paid', paymentId: saleId }
    // );
    
  } catch (error) {
    console.error('Error handling payment completed:', error);
  }
};

const handlePaymentRefunded = async (event) => {
  try {
    const { resource } = event;
    const { id: refundId, sale_id: saleId, amount } = resource;
    
    console.log(`Payment refunded: Refund ID ${refundId}, Sale ID ${saleId}, Amount ${amount.total} ${amount.currency}`);
    
    // Update order status in your database
    // await OrderModel.findOneAndUpdate(
    //   { paypalOrderId: saleId },
    //   { status: 'refunded', refundId }
    // );
    
  } catch (error) {
    console.error('Error handling payment refunded:', error);
  }
};

const handlePaymentDenied = async (event) => {
  try {
    const { resource } = event;
    const { id: saleId, parent_payment: paymentId } = resource;
    
    console.log(`Payment denied: Sale ID ${saleId}, Payment ID ${paymentId}`);
    
    // Update order status in your database
    // await OrderModel.findOneAndUpdate(
    //   { paypalOrderId: paymentId },
    //   { status: 'denied' }
    // );
    
  } catch (error) {
    console.error('Error handling payment denied:', error);
  }
};

const placeOrderRazorpay = async (req, res) => {
  // Existing Razorpay logic
};

const placeOrderStripe = async (req, res) => {
  // Existing Stripe logic
};

const placeOrderGPay = async (req, res) => {
  // Existing GPay logic
};

const placeOrderPatym = async (req, res) => {
  // Existing Paytm logic
};

const updateStatus = async (req, res) => {
  // Existing status update logic
};

const userOrders = async (req, res) => {
  // Existing user orders logic
};

const allOrders = async (req, res) => {
  // Existing all orders logic
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