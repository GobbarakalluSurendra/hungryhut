const Review = require('../models/Review');

// @desc    Submit a new review (Public)
// @route   POST /api/reviews
exports.createReview = async (req, res, next) => {
    try {
        const { customerName, rating, comment } = req.body;
        const review = await Review.create({ customerName, rating, comment, isApproved: false });
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

// @desc    Get approved reviews (Public)
// @route   GET /api/reviews
exports.getApprovedReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ isApproved: true }).sort('-createdAt');
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        next(err);
    }
};

// @desc    Get ALL reviews (Admin)
// @route   GET /api/reviews/all
exports.getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find().sort('-createdAt');
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle review approval status (Admin)
// @route   PUT /api/reviews/:id/approve
exports.toggleApproval = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        
        review.isApproved = !review.isApproved;
        await review.save();
        
        res.status(200).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        
        await review.deleteOne();
        res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (err) {
        next(err);
    }
};
