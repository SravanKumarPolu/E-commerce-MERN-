import { addToCart, updateCart, getUserCart } from "../controllers/cartController.js";

import express from 'express'

const cartRouter = express.Router();
cartRouter.post('/add', addToCart)
cartRouter.post('/get', getUserCart)
cartRouter.post('/update', updateCart)
export default cartRouter;