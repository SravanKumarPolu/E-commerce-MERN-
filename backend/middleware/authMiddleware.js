import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Protect middleware - requires authentication
const protect = async (req, res, next) => {
  try {
    // Try to get token from multiple header formats
    let token = req.headers.token;
    
    // If not found in 'token' header, try 'authorization' header
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7); // Remove 'Bearer ' prefix
      } else {
        token = req.headers.authorization;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if it's an admin token
      if (decoded.type === 'admin') {
        req.user = {
          id: null,
          email: decoded.email,
          role: 'admin'
        };
        return next();
      }

      // For regular user tokens
      const user = await userModel.findById(decoded.id);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      req.user = {
        id: user._id,
        email: user.email,
        role: user.role
      };

      next();

    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin middleware - requires admin privileges
const admin = async (req, res, next) => {
  try {
    // Try to get token from multiple header formats
    let token = req.headers.token;
    
    // If not found in 'token' header, try 'authorization' header
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7); // Remove 'Bearer ' prefix
      } else {
        token = req.headers.authorization;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if it's an admin token
      if (decoded.type === 'admin' && decoded.role === 'admin') {
        req.user = {
          id: null,
          email: decoded.email,
          role: 'admin'
        };
        return next();
      }

      // For regular user tokens, check if user has admin role
      if (decoded.id) {
        const user = await userModel.findById(decoded.id);
        
        if (!user || !user.isActive || user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
          });
        }

        req.user = {
          id: user._id,
          email: user.email,
          role: user.role
        };

        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });

    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export { protect, admin }; 