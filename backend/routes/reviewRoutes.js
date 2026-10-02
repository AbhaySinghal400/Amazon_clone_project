const express = require('express');
const router = express.Router();
const { getProductReviews, createProductReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get product reviews
router.get('/product/:productId', getProductReviews);
router.get('/:productId', getProductReviews);

// Add or update review (protected)
router.post('/product/:productId', protect, createProductReview);
router.post('/:productId', protect, createProductReview);

module.exports = router;
