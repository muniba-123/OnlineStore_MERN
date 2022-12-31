import asyncHandler from 'express-async-handler';
import Category from '../models/category-model.js';

// @description     Fetch all categories
// @route           GET /api/categories
// @access          Public
const getCategories = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;
	const category = req.query.category
	// get item from query string
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {};

	const count = await Category.countDocuments({ ...keyword });
	const obj={ ...keyword }
	if(category) obj.category=category;
	const categories = await Category.find(obj)
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	res.json({
		categories,
		page,
		pages: Math.ceil(count / pageSize),
	});
});

// @description     Fetch single category
// @route           GET /api/categories/:id
// @access          Public
const getCategoryById = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);

	if (category) {
		res.json(category);
	} else {
		res.status(404);
		throw new Error('Category not found');
	}
});

// @description     Delete a category
// @route           DELETE /api/categories/:id
// @access          Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);

	if (category) {
		await category.remove();
		res.json({ message: 'Category removed' });
	} else {
		res.status(404);
		throw new Error('Category not found');
	}
});

// @description     Create a category
// @route           POST /api/categories
// @access          Private/Admin
const createCategory = asyncHandler(async (req, res) => {
	const category={...req.body,user:req.user._id}
	const createdCategory = await Category.create(category);
	res.status(201).json(createdCategory);
});

// @description     Update a category
// @route           PUT /api/categories/:id
// @access          Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
	const {
		name,
	} = req.body;

	const category = await Category.findById(req.params.id);

	if (category) {
		category.name = name;
		const updatedCategory = await category.save();
		res.json(updatedCategory);
	} else {
		res.status(404);
		throw new Error('Category not found');
	}
});


export {
	getCategories,
	getCategoryById,
	deleteCategory,
	createCategory,
	updateCategory,
};
