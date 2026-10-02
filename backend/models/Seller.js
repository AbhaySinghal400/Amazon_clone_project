const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      required: true
    },
    gstin: {
      type: String,
      required: true
    },
    businessAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true }
    },
    bankDetails: {
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankName: { type: String, required: true },
      accountHolderName: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ['not_applied', 'pending', 'approved', 'rejected'],
      default: 'approved' // Instant approval so seller can access dashboard immediately
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Seller', sellerSchema);
