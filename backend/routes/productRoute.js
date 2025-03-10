import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/productController';

import express from 'express'

const productRouter=express.Router();
productRouter.post('/add',addProduct)
productRouter.post('/single',singleProduct)
productRouter.post('/remove',removeProduct)
productRouter.post('/list',listProduct)
export default productRouter;
