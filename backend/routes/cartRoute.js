import { addToCart, updateCart, getUserCart } from "../controllers/cartController.js";
import express from 'express';
import userAuth from '../middleware/userAuth.js';

const cartRouter = express.Router();

// Add product to cart (user only)
cartRouter.post('/add', userAuth, addToCart);

// Get user cart data (user only)
cartRouter.post('/get', userAuth, getUserCart);

// Update cart quantities (user only)
cartRouter.post('/update', userAuth, updateCart);

export default cartRouter;