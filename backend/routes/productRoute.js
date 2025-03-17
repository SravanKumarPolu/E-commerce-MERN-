import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/productController';

import express from 'express'
import upload from '../middleware/multer';

const productRouter=express.Router();
productRouter.post('/add',upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct)
productRouter.post('/single',singleProduct)
productRouter.post('/remove',removeProduct)
productRouter.post('/list',listProduct)
export default productRouter;
