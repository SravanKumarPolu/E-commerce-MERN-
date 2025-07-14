import express from 'express';
import { adminLogin, loginUser, registerUser, getUserProfile, updateUserProfile, addUserAddress, getUserAddresses, setDefaultAddress, editUserAddress, deleteUserAddress } from '../controllers/userController.js';
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
userRouter.get('/address', authUser, getUserAddresses);
userRouter.post('/address', authUser, addUserAddress);
userRouter.post('/address/default', authUser, setDefaultAddress);
userRouter.put('/address', authUser, editUserAddress);
userRouter.delete('/address', authUser, deleteUserAddress);

export default userRouter;