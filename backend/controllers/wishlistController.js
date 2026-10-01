// @desc    Get user wishlist
// @route   GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    // For now, just returning an empty array to fix the 404 error
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getWishlist };