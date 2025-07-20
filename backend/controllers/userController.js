import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import validator from 'validator';
import emailService from '../services/emailService.js';
import crypto from 'crypto';

// JWT token creation with expiration
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Route for user login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password field
    const user = await userModel.findOne({ email, isActive: true }).select('+password +loginAttempts +lockUntil');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: "Account is temporarily locked due to too many failed login attempts. Please try again later or reset your password."
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    await user.updateLastLogin();

    // Create token
    const token = createToken(user._id);
    
    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Route for user registration
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Additional server-side validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12); // Increased salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // Update last login
    await savedUser.updateLastLogin();

    // Send welcome email (non-blocking)
    emailService.sendWelcomeEmail(email, name).catch(error => {
      console.error('Error sending welcome email:', error);
    });

    // Create token
    const token = createToken(savedUser._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// Route for password recovery request
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email, isActive: true }).select('+passwordResetToken +passwordResetExpires');
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // Create password reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // Generate reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`;

    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail(email, resetToken, resetUrl);

    if (emailSent) {
      res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    } else {
      // Clear the token if email failed to send
      await user.clearPasswordResetToken();
      
      res.status(500).json({
        success: false,
        message: "Failed to send password reset email. Please try again later."
      });
    }

  } catch (error) {
    console.error('Password reset request error:', error);
    next(error);
  }
};

// Route for password reset
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token"
      });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    await user.clearPasswordResetToken();

    // Reset login attempts
    await user.resetLoginAttempts();

    res.json({
      success: true,
      message: "Password has been reset successfully"
    });

  } catch (error) {
    console.error('Password reset error:', error);
    next(error);
  }
};

// Route for admin login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "Admin configuration error"
      });
    }

    // Check credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { 
          email: email, 
          role: 'admin',
          type: 'admin' 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Shorter expiration for admin
      );
      
      res.json({ 
        success: true, 
        token,
        user: {
          email: email,
          role: 'admin'
        }
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin credentials" 
      });
    }

  } catch (error) {
    console.error('Admin login error:', error);
    next(error);
  }
};

// Route to get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

// Route to update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await userModel.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken by another user"
        });
      }
    }

    // Update user fields
    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase();

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

// Route to add user address
const addUserAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressData = req.body;

    const user = await userModel.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Set default address if it's the first one or if requested
    if (user.addresses.length === 0 || addressData.default) {
      user.addresses.forEach(addr => addr.default = false);
    }

    user.addresses.push(addressData);
    await user.save();

    res.json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses
    });

  } catch (error) {
    console.error('Add address error:', error);
    next(error);
  }
};

// Route to get user addresses
const getUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      addresses: user.addresses
    });

  } catch (error) {
    console.error('Get addresses error:', error);
    next(error);
  }
};

// Route to set default address
const setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    const user = await userModel.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Reset all addresses to non-default
    user.addresses.forEach(addr => addr.default = false);

    // Set the specified address as default
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    address.default = true;
    await user.save();

    res.json({
      success: true,
      message: "Default address updated successfully",
      addresses: user.addresses
    });

  } catch (error) {
    console.error('Set default address error:', error);
    next(error);
  }
};

// Route to edit user address
const editUserAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const addressData = req.body;

    const user = await userModel.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // Update address fields
    Object.assign(address, addressData);
    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses
    });

  } catch (error) {
    console.error('Edit address error:', error);
    next(error);
  }
};

// Route to delete user address
const deleteUserAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await userModel.findById(userId);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    address.deleteOne();
    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses
    });

  } catch (error) {
    console.error('Delete address error:', error);
    next(error);
  }
};

// Debug route to list all users (admin only)
const debugUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({}).select('-password -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil -twoFactorSecret -biometricCredentials');
    
    res.json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {
    console.error('Debug users error:', error);
    next(error);
  }
};

export {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  getUserAddresses,
  setDefaultAddress,
  editUserAddress,
  deleteUserAddress,
  debugUsers
};