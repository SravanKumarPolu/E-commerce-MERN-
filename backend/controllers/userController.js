import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import validator from 'validator';
import { 
  createTokenResponse, 
  generateSecureToken, 
  verifyRefreshToken,
  generateAdminToken
} from '../utils/tokenUtils.js';
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  sendPasswordChangedEmail 
} from '../utils/emailUtils.js';

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields." 
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "User already exists with this email." 
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid email address." 
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters long." 
      });
    }

    // Check for strong password
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number." 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = generateSecureToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false
    });

    const savedUser = await newUser.save();

    // Send verification email
    await sendVerificationEmail(savedUser.email, emailVerificationToken, savedUser.name);

    // Create token response
    const tokenResponse = createTokenResponse(savedUser);

    // Save refresh token to user
    savedUser.refreshTokens.push(tokenResponse.refreshToken);
    await savedUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      data: tokenResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed. Please try again." 
    });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide email and password." 
      });
    }

    // Find user
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials." 
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        success: false, 
        message: "Account is temporarily locked due to multiple failed login attempts." 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Account is deactivated. Please contact support." 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      }
      
      await user.save();
      
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials." 
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    
    // Clean up old refresh tokens (keep only last 5)
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    // Create token response
    const tokenResponse = createTokenResponse(user);

    // Save refresh token to user
    user.refreshTokens.push(tokenResponse.refreshToken);
    await user.save();

    res.json({
      success: true,
      message: "Login successful!",
      data: tokenResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Login failed. Please try again." 
    });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Refresh token required." 
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user and check if refresh token exists
    const user = await userModel.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid refresh token." 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Account is deactivated." 
      });
    }

    // Remove old refresh token
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);

    // Create new token response
    const tokenResponse = createTokenResponse(user);

    // Save new refresh token
    user.refreshTokens.push(tokenResponse.refreshToken);
    await user.save();

    res.json({
      success: true,
      data: tokenResponse
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ 
      success: false, 
      message: "Invalid refresh token." 
    });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user.id;

    if (refreshToken) {
      // Remove specific refresh token
      await userModel.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken }
      });
    } else {
      // Remove all refresh tokens (logout from all devices)
      await userModel.findByIdAndUpdate(userId, {
        $set: { refreshTokens: [] }
      });
    }

    res.json({
      success: true,
      message: "Logout successful!"
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Logout failed." 
    });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "Verification token required." 
      });
    }

    // Find user with verification token
    const user = await userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired verification token." 
      });
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully!"
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Email verification failed." 
    });
  }
};

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required." 
      });
    }

    // Find user
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: "If an account with this email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = generateSecureToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken, user.name);

    res.json({
      success: true,
      message: "If an account with this email exists, a password reset link has been sent."
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Password reset request failed." 
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Token and new password are required." 
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters long." 
      });
    }

    if (!validator.isStrongPassword(newPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number." 
      });
    }

    // Find user with reset token
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token." 
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // Invalidate all refresh tokens
    user.loginAttempts = 0; // Reset login attempts
    user.lockUntil = undefined; // Unlock account
    await user.save();

    // Send confirmation email
    await sendPasswordChangedEmail(user.email, user.name);

    res.json({
      success: true,
      message: "Password reset successful! Please login with your new password."
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Password reset failed." 
    });
  }
};

// Change Password (for logged-in users)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password and new password are required." 
      });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found." 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Current password is incorrect." 
      });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 8 characters long." 
      });
    }

    if (!validator.isStrongPassword(newPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must contain at least one uppercase letter, one lowercase letter, and one number." 
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user
    user.password = hashedPassword;
    user.refreshTokens = []; // Invalidate all refresh tokens
    await user.save();

    // Send confirmation email
    await sendPasswordChangedEmail(user.email, user.name);

    res.json({
      success: true,
      message: "Password changed successfully! Please login again."
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Password change failed." 
    });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select('-password -refreshTokens -passwordResetToken -emailVerificationToken');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found." 
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch profile." 
    });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Name and email are required." 
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid email address." 
      });
    }

    // Check if email is already taken by another user
    const existingUser = await userModel.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: userId } 
    });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "Email is already taken." 
      });
    }

    // Update user
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { 
        name: name.trim(), 
        email: email.toLowerCase(),
        // If email changed, require re-verification
        ...(email.toLowerCase() !== req.user.email ? { 
          isEmailVerified: false,
          emailVerificationToken: generateSecureToken(),
          emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        } : {})
      },
      { new: true }
    ).select('-password -refreshTokens -passwordResetToken -emailVerificationToken');

    // Send verification email if email changed
    if (email.toLowerCase() !== req.user.email) {
      await sendVerificationEmail(updatedUser.email, updatedUser.emailVerificationToken, updatedUser.name);
    }

    res.json({
      success: true,
      message: email.toLowerCase() !== req.user.email ? 
        "Profile updated! Please verify your new email address." : 
        "Profile updated successfully!",
      data: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Profile update failed." 
    });
  }
};

// Admin Login (improved but backward compatible)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's the legacy admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const legacyToken = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ 
        success: true, 
        token: legacyToken,
        message: "Admin login successful (legacy mode)!"
      });
    }

    // Try to find admin user in database
    const admin = await userModel.findOne({ 
      email: email.toLowerCase(), 
      role: 'admin' 
    });

    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin credentials." 
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({ 
        success: false, 
        message: "Admin account is temporarily locked." 
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Admin account is deactivated." 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      // Increment login attempts
      admin.loginAttempts = (admin.loginAttempts || 0) + 1;
      
      // Lock account after 3 failed attempts for admin
      if (admin.loginAttempts >= 3) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      
      await admin.save();
      
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin credentials." 
      });
    }

    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();

    // Create token response
    const tokenResponse = createTokenResponse(admin);

    // Save refresh token
    admin.refreshTokens.push(tokenResponse.refreshToken);
    await admin.save();

    res.json({
      success: true,
      message: "Admin login successful!",
      data: tokenResponse
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Admin login failed." 
    });
  }
};

// Resend Verification Email
export const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found." 
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is already verified." 
      });
    }

    // Generate new verification token
    const emailVerificationToken = generateSecureToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update user
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, emailVerificationToken, user.name);

    res.json({
      success: true,
      message: "Verification email sent successfully!"
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send verification email." 
    });
  }
};