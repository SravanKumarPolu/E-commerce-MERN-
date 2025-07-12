import express from "express";
import { 
  adminLogin, 
  loginUser, 
  registerUser, 
  refreshToken, 
  logoutUser, 
  verifyEmail, 
  requestPasswordReset, 
  resetPassword, 
  changePassword, 
  getUserProfile, 
  updateUserProfile, 
  resendVerificationEmail 
} from "../controllers/userController.js";
import userAuth, { requireEmailVerification } from "../middleware/userAuth.js";
import { loginRateLimiter, resetLoginAttempts, generalRateLimiter } from "../middleware/rateLimiter.js";
import {
  validateRegistration,
  validateLogin,
  validateAdminLogin,
  validateRefreshToken,
  validateEmailVerification,
  validatePasswordResetRequest,
  validatePasswordReset,
  validatePasswordChange,
  validateProfileUpdate,
  validateLogout,
  handleValidationErrors,
  sanitizeInput
} from "../middleware/validation.js";

const userRouter = express.Router();

// Apply input sanitization to all routes
userRouter.use(sanitizeInput);

// Public routes (no authentication required)
userRouter.post("/register", 
  generalRateLimiter(5, 15 * 60 * 1000), 
  validateRegistration,
  handleValidationErrors,
  registerUser
);

userRouter.post("/login", 
  loginRateLimiter,
  validateLogin,
  handleValidationErrors,
  loginUser
);

userRouter.post("/admin", 
  loginRateLimiter,
  validateAdminLogin,
  handleValidationErrors,
  adminLogin
);

userRouter.post("/refresh-token", 
  validateRefreshToken,
  handleValidationErrors,
  refreshToken
);

userRouter.post("/verify-email", 
  validateEmailVerification,
  handleValidationErrors,
  verifyEmail
);

userRouter.post("/request-password-reset", 
  generalRateLimiter(3, 15 * 60 * 1000),
  validatePasswordResetRequest,
  handleValidationErrors,
  requestPasswordReset
);

userRouter.post("/reset-password", 
  validatePasswordReset,
  handleValidationErrors,
  resetPassword
);

// Protected routes (authentication required)
userRouter.use(userAuth); // Apply authentication middleware to all routes below

// User profile routes
userRouter.get("/profile", getUserProfile);

userRouter.put("/profile", 
  validateProfileUpdate,
  handleValidationErrors,
  updateUserProfile
);

// Authentication management routes
userRouter.post("/logout", 
  validateLogout,
  handleValidationErrors,
  logoutUser
);

userRouter.post("/change-password", 
  validatePasswordChange,
  handleValidationErrors,
  changePassword
);

userRouter.post("/resend-verification", resendVerificationEmail);

// Routes that require email verification
userRouter.get("/verified-profile", requireEmailVerification, getUserProfile);

export default userRouter;