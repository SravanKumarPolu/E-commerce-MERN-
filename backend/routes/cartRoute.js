import { addToCart, updateCart, getUserCart } from "../controllers/cartController.js";
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { 
  validateCartOperation, 
  handleValidationErrors,
  sanitizeInput
} from '../middleware/validation.js';

const cartRouter = express.Router();

// Apply input sanitization to all routes
cartRouter.use(sanitizeInput);

// Add product to cart (user only)
cartRouter.post('/add', 
  userAuth,
  validateCartOperation,
  handleValidationErrors,
  addToCart
);

// Get user cart data (user only) - no validation needed as it's just a GET operation
cartRouter.post('/get', userAuth, getUserCart);

// Update cart quantities (user only)
cartRouter.post('/update', 
  userAuth,
  validateCartOperation,
  handleValidationErrors,
  updateCart
);

export default cartRouter;