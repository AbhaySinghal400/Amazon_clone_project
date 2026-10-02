const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice, paymentMethod, paymentStatus, isPaid } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items found' });
    }

    // Calculate estimated delivery date: 3 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const trackingNum = `AMZ-IN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      totalPrice: Number(totalPrice),
      paymentMethod: paymentMethod || 'Paytm UPI',
      paymentStatus: paymentStatus || (isPaid !== false ? 'Paid' : 'Pending'),
      isPaid: isPaid !== undefined ? Boolean(isPaid) : true,
      orderStatus: 'Placed',
      estimatedDeliveryDate: deliveryDate,
      trackingNumber: trackingNum,
      carrier: 'Amazon Logistics'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders or GET /api/orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch order history' });
  }
};

// @desc    Cancel order by user
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    order.orderStatus = 'Cancelled';
    order.isDelivered = false;
    await order.save();
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};

// @desc    Get all orders for seller fulfillment
// @route   GET /api/orders/seller-orders
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Failed to fetch seller orders', error: error.message });
  }
};

// @desc    Update order fulfillment status (Shipped, Delivered, Processing)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    if (status && status.toLowerCase() === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else {
      order.isDelivered = false;
    }
    await order.save();

    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

module.exports = { 
  addOrderItems, 
  getMyOrders, 
  cancelOrder,
  getSellerOrders,
  updateOrderStatus
};