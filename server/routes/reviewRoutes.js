const express = require('express');
const router = express.Router();
const { 
    createReview, 
    getApprovedReviews, 
    getAllReviews, 
    toggleApproval, 
    deleteReview 
} = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');

router.route('/')
    .get(getApprovedReviews)
    .post(createReview);

router.route('/all')
    .get(protect, getAllReviews);

router.route('/:id/approve')
    .put(protect, toggleApproval);

router.route('/:id')
    .delete(protect, deleteReview);

module.exports = router;
