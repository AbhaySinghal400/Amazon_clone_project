const express = require('express');
const router = express.Router();
const { getSellerStatus, applySeller, getSellerAnalytics } = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/status', protect, getSellerStatus);
router.post('/apply', protect, applySeller);
router.get('/analytics', protect, getSellerAnalytics);

module.exports = router;
