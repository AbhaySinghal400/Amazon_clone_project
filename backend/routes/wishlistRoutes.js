const express = require('express');
const router = express.Router();
const { getWishlist } = require('../controllers/wishlistController');

router.get('/', getWishlist);

module.exports = router;