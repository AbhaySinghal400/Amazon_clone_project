const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Airpods Wireless Bluetooth Headphones',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&q=80',
    description: 'Bluetooth technology lets you connect it with compatible devices wirelessly.',
    brand: 'Apple',
    category: 'Electronics',
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'iPhone 13 Pro 256GB Memory',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80',
    description: 'Introducing the iPhone 13 Pro. A transformative triple-camera system.',
    brand: 'Apple',
    category: 'Electronics',
    price: 999.99,
    countInStock: 7,
    rating: 4.0,
    numReviews: 8,
  },
  {
    name: 'Sony Playstation 5 Controller',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b36cb?w=500&q=80',
    description: 'Discover a deeper, highly immersive gaming experience with the innovative PS5 controller.',
    brand: 'Sony',
    category: 'Electronics',
    price: 69.99,
    countInStock: 11,
    rating: 5,
    numReviews: 12,
  },
  {
    name: 'Logitech G-Series Gaming Mouse',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479bd?w=500&q=80',
    description: 'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse.',
    brand: 'Logitech',
    category: 'Electronics',
    price: 49.99,
    countInStock: 7,
    rating: 3.5,
    numReviews: 10,
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amazon-clone');
    
    // Clear out any old products
    await Product.deleteMany();
    
    // Insert the new sample products
    await Product.insertMany(sampleProducts);
    
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();