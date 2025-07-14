import express from 'express';
import { adminLogin, loginUser, registerUser, getUserProfile, updateUserProfile, addUserAddress } from '../controllers/userController.js';
import { validateUserRegistration, validateUserLogin, validateAdminLogin } from '../middleware/validation.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', validateUserRegistration, registerUser);
userRouter.post('/login', validateUserLogin, loginUser);
userRouter.post('/admin', validateAdminLogin, adminLogin);

// Protected routes
userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);
userRouter.post('/address', authUser, addUserAddress);

export default userRouter;