import { loginAdmin, loginUser, registerUser } from '../controllers/userController.js';

import express from 'express'

const userRouter=express.Router();
 userRouter.post('/login',loginUser)
 userRouter.post('/register',registerUser)
 userRouter.post('/admin',loginAdmin)
 export  default userRouter;