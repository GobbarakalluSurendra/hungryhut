const express = require('express');
const { createOrder, getOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, authorize('ADMIN'), getOrders)
    .post(createOrder);

router.route('/:orderId')
    .get(getOrder); // Note: public access for tracking

router.route('/:id/status')
    .put(protect, authorize('ADMIN'), updateOrderStatus);

module.exports = router;
