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

const userRouter = express.Router();

// Public routes (no authentication required)
userRouter.post("/register", generalRateLimiter(5, 15 * 60 * 1000), registerUser);
userRouter.post("/login", loginRateLimiter, loginUser);
userRouter.post("/admin", loginRateLimiter, adminLogin);
userRouter.post("/refresh-token", refreshToken);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/request-password-reset", generalRateLimiter(3, 15 * 60 * 1000), requestPasswordReset);
userRouter.post("/reset-password", resetPassword);

// Protected routes (authentication required)
userRouter.use(userAuth); // Apply authentication middleware to all routes below

// User profile routes
userRouter.get("/profile", getUserProfile);
userRouter.put("/profile", updateUserProfile);

// Authentication management routes
userRouter.post("/logout", logoutUser);
userRouter.post("/change-password", changePassword);
userRouter.post("/resend-verification", resendVerificationEmail);

// Routes that require email verification
userRouter.get("/verified-profile", requireEmailVerification, getUserProfile);

export default userRouter;