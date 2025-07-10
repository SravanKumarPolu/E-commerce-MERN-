import { addToCart, updateCart, getUserCart } from "../controllers/cartController.js";
import express from 'express';
import userAuth from '../middleware/userAuth.js';

const cartRouter = express.Router();

cartRouter.post('/add', userAuth, addToCart);
cartRouter.post('/get', userAuth, getUserCart);
cartRouter.post('/update', userAuth, updateCart);

export default cartRouter;