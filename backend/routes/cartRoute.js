import { addToCart, updateCart, getUserCart, syncLocalCart } from "../controllers/cartController.js";

import express from 'express'

const cartRouter = express.Router();
cartRouter.post('/add', addToCart)
cartRouter.post('/get', getUserCart)
cartRouter.post('/update', updateCart)
cartRouter.post('/sync-local', syncLocalCart)
export default cartRouter;