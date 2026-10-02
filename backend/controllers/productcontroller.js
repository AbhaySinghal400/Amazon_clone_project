const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const filter = {};

    if (req.query.category && req.query.category !== 'All') {
      filter.category = { $regex: new RegExp(req.query.category, 'i') };
    }

    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).limit(limit).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error while fetching products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error - Invalid ID' });
  }
};

// @desc    Create new product
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, images, brand, category, countInStock, stock } = req.body;

    const defaultImg = image || (images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60');

    const product = new Product({
      name: name || 'Sample Product',
      price: Number(price) || 999,
      description: description || 'High quality product available on Amazon Marketplace.',
      image: defaultImg,
      images: images && images.length > 0 ? images : [defaultImg],
      brand: brand || 'Amazon Brand',
      category: category || 'Electronics',
      countInStock: Number(stock !== undefined ? stock : countInStock) || 10,
      stock: Number(stock !== undefined ? stock : countInStock) || 10,
      rating: 4.5,
      numReviews: 0,
      seller: req.user ? req.user._id : undefined
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, images, brand, category, countInStock, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (stock !== undefined || countInStock !== undefined) {
      const finalStock = Number(stock !== undefined ? stock : countInStock);
      product.stock = finalStock;
      product.countInStock = finalStock;
    }
    if (image !== undefined) product.image = image;
    if (images !== undefined) product.images = images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// @desc    Upload product images (or add image url)
// @route   POST /api/products/:id/upload
const uploadProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Default sample HD product image if mock upload
    const sampleImg = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80';
    if (!product.images) product.images = [];
    product.images.push(sampleImg);
    if (!product.image) product.image = sampleImg;

    await product.save();
    res.json({ success: true, message: 'Image uploaded successfully', product });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};