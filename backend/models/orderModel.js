import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  color: {
    type: String,
    required: true
  }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  items: [orderItemSchema],
  address: addressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'PayPal']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'],
    default: 'Order Placed'
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true,
    default: 10
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  // PayPal specific fields
  paypalOrderId: {
    type: String,
    sparse: true // Allow null/undefined for non-PayPal orders
  },
  paypalCaptureId: {
    type: String,
    sparse: true
  },
  paypalTransactionId: {
    type: String,
    sparse: true
  },
  // Order tracking
  trackingNumber: {
    type: String,
    sparse: true
  },
  estimatedDelivery: {
    type: Date,
    sparse: true
  },
  deliveredAt: {
    type: Date,
    sparse: true
  },
  // Notes and metadata
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paypalOrderId: 1 }, { sparse: true });
orderSchema.index({ paypalCaptureId: 1 }, { sparse: true });
orderSchema.index({ createdAt: -1 });

// Instance method to update order status
orderSchema.methods.updateStatus = function(newStatus) {
  this.orderStatus = newStatus;
  if (newStatus === 'Delivered') {
    this.deliveredAt = new Date();
  }
  return this.save();
};

// Instance method to update payment status
orderSchema.methods.updatePaymentStatus = function(newStatus) {
  this.paymentStatus = newStatus;
  return this.save();
};

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const skip = (page - 1) * limit;
  
  let query = { userId, isActive: true };
  if (status) {
    query.orderStatus = status;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to find all orders (for admin)
orderSchema.statics.findAllOrders = function(options = {}) {
  const { page = 1, limit = 20, status, paymentStatus } = options;
  const skip = (page - 1) * limit;
  
  let query = { isActive: true };
  if (status) {
    query.orderStatus = status;
  }
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }
  
  return this.find(query)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to find order by PayPal order ID
orderSchema.statics.findByPayPalOrderId = function(paypalOrderId) {
  return this.findOne({ paypalOrderId, isActive: true });
};

// Static method to find order by PayPal capture ID
orderSchema.statics.findByPayPalCaptureId = function(paypalCaptureId) {
  return this.findOne({ paypalCaptureId, isActive: true });
};

// Transform output
orderSchema.methods.toJSON = function() {
  const order = this.toObject();
  delete order.__v;
  return order;
};

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel; 