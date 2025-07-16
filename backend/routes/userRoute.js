import express from 'express';
import { adminLogin, loginUser, registerUser, getUserProfile, updateUserProfile, addUserAddress, getUserAddresses, setDefaultAddress, editUserAddress, deleteUserAddress, debugUsers } from '../controllers/userController.js';
import { validateUserRegistration, validateUserLogin, validateAdminLogin } from '../middleware/validation.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', validateUserRegistration, registerUser);
userRouter.post('/login', validateUserLogin, loginUser);
userRouter.post('/admin', validateAdminLogin, adminLogin);

// Debug route (no auth required)
userRouter.get('/debug', debugUsers);

// Protected routes
userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);
userRouter.post('/address', authUser, addUserAddress);
userRouter.get('/address', authUser, getUserAddresses);
userRouter.put('/address/:addressId/default', authUser, setDefaultAddress);
userRouter.put('/address/:addressId', authUser, editUserAddress);
userRouter.delete('/address/:addressId', authUser, deleteUserAddress);

export default userRouter;