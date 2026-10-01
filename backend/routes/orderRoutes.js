const express = require('express');
const router = express.Router();
const { addOrderItems } = require('../controllers/ordercontroller');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);

module.exports = router;
