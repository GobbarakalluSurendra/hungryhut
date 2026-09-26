const express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(protect, authorize('ADMIN'), createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, authorize('ADMIN'), updateCategory)
    .delete(protect, authorize('ADMIN'), deleteCategory);

module.exports = router;
