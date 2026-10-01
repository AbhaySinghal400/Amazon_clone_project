const express = require('express');
const router = express.Router();
const { addOrderItems } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Route to create an order (protected by the middleware)
router.post('/', protect, addOrderItems);

module.exports = router;