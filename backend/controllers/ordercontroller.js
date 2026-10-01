const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items found' });
    return;
  } else {
    // Create a new order in the database
    const order = new Order({
      orderItems,
      user: req.user._id, // Got this from the authMiddleware!
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

module.exports = { addOrderItems };