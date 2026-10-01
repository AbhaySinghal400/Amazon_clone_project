const Category = require('../models/Category');

// @desc    Fetch all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error while fetching categories' });
  }
};

module.exports = { getCategories };