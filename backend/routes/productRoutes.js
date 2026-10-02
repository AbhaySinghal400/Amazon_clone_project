const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadProductImage
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Route to get all products and create a product
router.get('/', getProducts);
router.post('/', protect, createProduct);

// Single product routes
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/upload', protect, uploadProductImage);

module.exports = router;