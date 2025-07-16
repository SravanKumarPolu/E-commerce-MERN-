import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    validate: {
      validator: function(value) {
        return /^[a-zA-Z\s]+$/.test(value);
      },
      message: 'Name can only contain letters and spaces'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  cartData: {
    type: Object,
    default: {}
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order'
  }],
  addresses: [
    {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipcode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      deliveryInstructions: { type: String, trim: true },
      default: { type: Boolean, default: false },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  minimize: false
});

// Create indexes for better performance (removed duplicate email index)
userSchema.index({ createdAt: 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to validate password strength
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  if (!passwordRegex.test(this.password)) {
    return next(new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'));
  }
  next();
});

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find active users
userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

// Transform output to remove sensitive fields
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;