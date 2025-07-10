import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productController.js';
import adminAuth from '../middleware/adminAuth.js';
import express from 'express';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

// Add product with multiple image upload (admin only)
productRouter.post('/add', adminAuth, upload.fields([
  { name: 'image1', maxCount: 1 }, 
  { name: 'image2', maxCount: 1 }, 
  { name: 'image3', maxCount: 1 }, 
  { name: 'image4', maxCount: 1 }
]), addProduct);

// Get single product info
productRouter.post('/single', singleProduct);

// Remove product (admin only)
productRouter.post('/remove', adminAuth, removeProduct);

// List all products
productRouter.get('/list', listProducts);

export default productRouter;
