const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Product' 
      },
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  totalPrice: { type: Number, required: true, default: 0.0 },
  paymentMethod: { type: String, required: true, default: 'Paytm UPI' },
  paymentStatus: { type: String, required: true, default: 'Paid' },
  orderStatus: { 
    type: String, 
    required: true, 
    enum: ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed' 
  },
  isPaid: { type: Boolean, required: true, default: true },
  isDelivered: { type: Boolean, required: true, default: false },
  estimatedDeliveryDate: { type: Date },
  trackingNumber: { type: String },
  carrier: { type: String, default: 'Amazon Shipping' },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);