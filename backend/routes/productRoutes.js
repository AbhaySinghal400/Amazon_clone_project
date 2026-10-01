const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productcontroller');

router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
