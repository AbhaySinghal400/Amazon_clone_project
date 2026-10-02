const Seller = require('../models/Seller');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get seller onboarding status
// @route   GET /api/sellers/status
const getSellerStatus = async (req, res) => {
  try {
    let seller = await Seller.findOne({ user: req.user._id });

    if (seller) {
      return res.json({
        status: seller.status,
        seller
      });
    }

    // If user already has role 'seller' but no profile yet, create a default one
    if (req.user.role === 'seller') {
      seller = await Seller.create({
        user: req.user._id,
        businessName: `${req.user.name}'s Amazon Store`,
        gstin: '07AAAPA1234A1Z5',
        businessAddress: {
          street: 'Amazon Fulfillment Center',
          city: 'New Delhi',
          state: 'Delhi',
          zipCode: '110001'
        },
        bankDetails: {
          accountNumber: '987654321012',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank',
          accountHolderName: req.user.name
        },
        status: 'approved'
      });

      return res.json({
        status: 'approved',
        seller
      });
    }

    res.json({
      status: 'not_applied',
      seller: null
    });
  } catch (error) {
    console.error('Error fetching seller status:', error);
    res.status(500).json({ message: 'Error checking seller status', error: error.message });
  }
};

// @desc    Apply for seller onboarding
// @route   POST /api/sellers/apply
const applySeller = async (req, res) => {
  try {
    const { businessName, gstin, businessAddress, bankDetails } = req.body;

    if (!businessName || !gstin || !businessAddress || !bankDetails) {
      return res.status(400).json({ message: 'Please provide all business and bank details' });
    }

    let seller = await Seller.findOne({ user: req.user._id });

    if (seller) {
      seller.businessName = businessName;
      seller.gstin = gstin;
      seller.businessAddress = businessAddress;
      seller.bankDetails = bankDetails;
      seller.status = 'approved';
      await seller.save();
    } else {
      seller = await Seller.create({
        user: req.user._id,
        businessName,
        gstin,
        businessAddress,
        bankDetails,
        status: 'approved' // Instant approval
      });
    }

    // Update user role to seller in User collection
    await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

    res.status(201).json({
      success: true,
      message: 'Application approved! Welcome to Amazon Seller Central.',
      status: 'approved',
      seller
    });
  } catch (error) {
    console.error('Error applying for seller:', error);
    res.status(500).json({ message: 'Error submitting seller application', error: error.message });
  }
};

// @desc    Get seller analytics
// @route   GET /api/sellers/analytics
const getSellerAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalPrice || 0), 0);
    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      analytics: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        totalProducts
      }
    });
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

module.exports = {
  getSellerStatus,
  applySeller,
  getSellerAnalytics
};
