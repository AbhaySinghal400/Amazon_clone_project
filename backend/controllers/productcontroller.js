const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const products = await Product.find({}).limit(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error while fetching products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error - Invalid ID' });
  }
};

module.exports = { getProducts, getProductById };