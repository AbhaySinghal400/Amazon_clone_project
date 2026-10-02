const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId or GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId || req.params.id;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error while fetching reviews', error: error.message });
  }
};

// @desc    Create or update product review
// @route   POST /api/reviews/:productId or POST /api/reviews/product/:productId
const createProductReview = async (req, res) => {
  try {
    const productId = req.params.productId || req.params.id;
    const { rating, comment, title } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide both rating and comment' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    let savedReview;
    if (existingReview) {
      // Update existing review
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      if (title !== undefined) existingReview.title = title;
      savedReview = await existingReview.save();
    } else {
      // Create new review
      const review = new Review({
        user: req.user._id,
        name: req.user.name || 'Amazon Customer',
        product: productId,
        rating: Number(rating),
        title: title || 'Verified Purchase Review',
        comment: comment
      });
      savedReview = await review.save();
    }

    // Recalculate average rating and review count on product
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating = Number(
      (allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length).toFixed(1)
    );
    await product.save();

    res.status(201).json({
      success: true,
      message: existingReview ? 'Review updated successfully' : 'Review added successfully',
      review: savedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
};

module.exports = {
  getProductReviews,
  createProductReview
};
