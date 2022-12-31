import express from 'express';
import {
	getCategories,
	getCategoryById,
	deleteCategory,
	createCategory,
	updateCategory,
} from '../controllers/category-controller.js';
import { protect, isAdmin } from '../middleware/auth-middleware.js';

const router = express.Router();

router.route('/').get(getCategories).post(protect, createCategory);
router
	.route('/:id')
	.get(getCategoryById)
	.delete(protect, isAdmin, deleteCategory)
	.put(protect, isAdmin, updateCategory);

export default router;
