import { addToCart, updateCart } from "../controllers/cartController";

import express from 'express'

const cartRouter = express.Router();
 cartRouter.post('/add',addToCart)
 cartRouter.post('/get',getUserCart)
 cartRouter.post('/update',updateCart)
 export default cartRouter;