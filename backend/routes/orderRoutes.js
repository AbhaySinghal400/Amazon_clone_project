const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, cancelOrder, getSellerOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Route to create an order
router.post('/', protect, addOrderItems);

// Routes to get logged in user orders
router.get('/my-orders', protect, getMyOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/seller-orders', protect, getSellerOrders);
router.get('/', protect, getMyOrders);

// Route to cancel order
router.put('/:id/cancel', protect, cancelOrder);
// Route to update order fulfillment status
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;