import express from 'express';
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  removeSubCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Get all categories (public endpoint)
router.get('/list', getCategories);

// Category CRUD operations (admin only)
router.post('/add', addCategory);
router.put('/update', updateCategory);
router.delete('/delete', deleteCategory);

// Subcategory operations (admin only)
router.post('/subcategory/add', addSubCategory);
router.put('/subcategory/update', updateSubCategory);
router.delete('/subcategory/remove', removeSubCategory);

export default router; 