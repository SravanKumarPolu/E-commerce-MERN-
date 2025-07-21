import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  recipientEmail: {
    type: String,
    required: true,
    trim: true
  },
  recipientAccountNumber: {
    type: String,
    required: true,
    trim: true
  },
  recipientRoutingNumber: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  note: {
    type: String,
    trim: true,
    maxlength: 500
  },
  adminId: {
    type: String,
    required: true
  },
  adminEmail: {
    type: String,
    required: true,
    trim: true
  },
  transferType: {
    type: String,
    enum: ['PAYOUT', 'MASS_PAYMENT', 'DIRECT_TRANSFER'],
    default: 'PAYOUT'
  },
  // PayPal API response data
  paypalResponse: {
    type: mongoose.Schema.Types.Mixed,
    sparse: true
  },
  paypalError: {
    type: mongoose.Schema.Types.Mixed,
    sparse: true
  },
  // Webhook data
  webhookEvents: [{
    eventType: String,
    eventId: String,
    timestamp: Date,
    data: mongoose.Schema.Types.Mixed
  }],
  // Timestamps
  completedAt: {
    type: Date,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better performance
transferSchema.index({ adminId: 1, createdAt: -1 });
transferSchema.index({ status: 1, createdAt: -1 });
transferSchema.index({ recipientEmail: 1 });
transferSchema.index({ batchId: 1 }, { unique: true });

// Instance method to update transfer status
transferSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'SUCCESS') {
    this.completedAt = new Date();
  }
  return this.save();
};

// Instance method to add webhook event
transferSchema.methods.addWebhookEvent = function(eventType, eventId, data) {
  this.webhookEvents.push({
    eventType,
    eventId,
    timestamp: new Date(),
    data
  });
  return this.save();
};

// Static method to find transfers by admin
transferSchema.statics.findByAdmin = function(adminEmail, options = {}) {
  const { page = 1, limit = 20, status } = options;
  const skip = (page - 1) * limit;
  
  let query = { adminEmail, isActive: true };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to find transfer by batch ID
transferSchema.statics.findByBatchId = function(batchId) {
  return this.findOne({ batchId, isActive: true });
};

// Static method to get transfer statistics
transferSchema.statics.getStatistics = function(adminEmail) {
  return this.aggregate([
    { $match: { adminEmail, isActive: true } },
    {
      $group: {
        _id: null,
        totalTransfers: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        averageAmount: { $avg: '$amount' },
        successCount: {
          $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, 1, 0] }
        },
        pendingCount: {
          $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
        },
        failedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] }
        }
      }
    }
  ]);
};

// Transform output
transferSchema.methods.toJSON = function() {
  const transfer = this.toObject();
  delete transfer.__v;
  return transfer;
};

const Transfer = mongoose.models.transfer || mongoose.model("transfer", transferSchema);
export default Transfer; 