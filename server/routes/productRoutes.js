const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, authorize('ADMIN'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, authorize('ADMIN'), updateProduct)
    .delete(protect, authorize('ADMIN'), deleteProduct);

module.exports = router;
