import express from 'express';
import { 
  adminLogin, 
  loginUser, 
  registerUser, 
  requestPasswordReset,
  resetPassword,
  getUserProfile, 
  updateUserProfile, 
  addUserAddress, 
  getUserAddresses, 
  setDefaultAddress, 
  editUserAddress, 
  deleteUserAddress, 
  debugUsers 
} from '../controllers/userController.js';
import { validateUserRegistration, validateUserLogin, validateAdminLogin } from '../middleware/validation.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', validateUserRegistration, registerUser);
userRouter.post('/login', validateUserLogin, loginUser);
userRouter.post('/admin', validateAdminLogin, adminLogin);

// Password recovery routes (public)
userRouter.post('/forgot-password', requestPasswordReset);
userRouter.post('/reset-password', resetPassword);

// Protected routes
userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);

// Address management routes
userRouter.post('/addresses', authUser, addUserAddress);
userRouter.get('/addresses', authUser, getUserAddresses);
userRouter.put('/addresses/default', authUser, setDefaultAddress);
userRouter.put('/addresses/:addressId', authUser, editUserAddress);
userRouter.delete('/addresses/:addressId', authUser, deleteUserAddress);

// Debug route (admin only)
userRouter.get('/debug', authUser, debugUsers);

export default userRouter;