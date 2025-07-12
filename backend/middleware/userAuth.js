import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../utils/tokenUtils.js";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
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
    
    // Verify the token
    const decoded = verifyAccessToken(token);
    
    // Check if user exists and is active
    const user = await userModel.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. User not found or inactive." 
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
    console.error('Auth middleware error:', error);
    
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

// Middleware to check if user's email is verified
export const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email address to access this resource.",
      errorCode: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
};

// Middleware to check user role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions to access this resource."
      });
    }
    
    next();
  };
};

export default userAuth; 