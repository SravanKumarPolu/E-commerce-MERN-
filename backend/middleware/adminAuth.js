import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../utils/tokenUtils.js";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : req.headers.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }
    
    // First check if it's the legacy admin token format (for backward compatibility)
    if (token === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      // Legacy admin token - create a temporary admin user object
      req.user = {
        id: 'legacy-admin',
        email: process.env.ADMIN_EMAIL,
        name: 'Admin',
        role: 'admin',
        isEmailVerified: true
      };
      return next();
    }
    
    // Verify the JWT token
    const decoded = verifyAccessToken(token);
    
    // Check if user exists and is active
    const user = await userModel.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. User not found or inactive." 
      });
    }
    
    // Check if user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }
    
    // Check if user account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        success: false, 
        message: "Account is temporarily locked. Please try again later." 
      });
    }
    
    // Attach user info to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };
    
    next();
    
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired. Please login again.",
        errorCode: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token. Please login again.",
        errorCode: 'INVALID_TOKEN'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during authentication." 
    });
  }
};

// Middleware for super admin actions (if needed in the future)
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: "Super admin privileges required."
    });
  }
  next();
};

export default adminAuth;