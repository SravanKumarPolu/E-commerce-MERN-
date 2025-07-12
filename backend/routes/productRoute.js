import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productController.js';
import adminAuth from '../middleware/adminAuth.js';
import express from 'express';
import upload from '../middleware/multer.js';
import {
  validateProductAdd,
  validateProductRemove,
  validateProductSingle,
  handleValidationErrors,
  sanitizeInput
} from '../middleware/validation.js';

const productRouter = express.Router();

// Apply input sanitization to all routes
productRouter.use(sanitizeInput);

// Add product with multiple image upload (admin only)
productRouter.post('/add', 
  adminAuth, 
  upload.fields([
    { name: 'image1', maxCount: 1 }, 
    { name: 'image2', maxCount: 1 }, 
    { name: 'image3', maxCount: 1 }, 
    { name: 'image4', maxCount: 1 }
  ]),
  validateProductAdd,
  handleValidationErrors,
  addProduct
);

// Get single product info
productRouter.post('/single', 
  validateProductSingle,
  handleValidationErrors,
  singleProduct
);

// Remove product (admin only)
productRouter.post('/remove', 
  adminAuth,
  validateProductRemove,
  handleValidationErrors,
  removeProduct
);

// List all products (no validation needed)
productRouter.get('/list', listProducts);

export default productRouter;
