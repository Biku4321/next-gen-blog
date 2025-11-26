import express from 'express';
import { createCategory, getCategories } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createCategory);
router.get('/', getCategories);

export default router;
