const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const sampleCategories = [
  { name: 'Electronics', description: 'Gadgets, smartphones, laptops & audio' },
  { name: 'Fashion', description: 'Apparel, footwear, watches & accessories' },
  { name: 'Home & Kitchen', description: 'Smart appliances, furniture & decor' },
  { name: 'Beauty & Personal Care', description: 'Skincare, grooming & fragrance' }
];

const sampleProducts = [
  // ==================== ELECTRONICS ====================
  {
    name: 'Apple iPhone 15 Pro Max (256 GB) - Natural Titanium',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Forged in titanium with A17 Pro chip, customizable Action button, Super Retina XDR display with ProMotion, and the most powerful iPhone camera system ever.',
    brand: 'Apple',
    category: 'Electronics',
    price: 149900,
    countInStock: 15,
    stock: 15,
    rating: 4.8,
    numReviews: 342,
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Industry-leading noise canceling with two processors, 8 microphones, Auto NC Optimizer, and up to 30-hour battery life with quick charging.',
    brand: 'Sony',
    category: 'Electronics',
    price: 29990,
    countInStock: 20,
    stock: 20,
    rating: 4.7,
    numReviews: 215,
  },
  {
    name: 'Apple MacBook Air M2 13.6" Laptop (8GB RAM, 256GB SSD)',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Strikingly thin design with M2 chip, 13.6-inch Liquid Retina display, 1080p FaceTime HD camera, MagSafe 3 charging port, and up to 18 hours of battery life.',
    brand: 'Apple',
    category: 'Electronics',
    price: 99900,
    countInStock: 10,
    stock: 10,
    rating: 4.9,
    numReviews: 518,
  },
  {
    name: 'Sony PlayStation 5 Console (Slim Edition)',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio on the all-new slim design.',
    brand: 'Sony',
    category: 'Electronics',
    price: 54990,
    countInStock: 8,
    stock: 8,
    rating: 4.8,
    numReviews: 890,
  },
  {
    name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB Storage)',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Welcome to the era of mobile AI with Galaxy AI. 200MP camera with ProVisual engine, titanium exterior, flat 6.8-inch display, and built-in S Pen.',
    brand: 'Samsung',
    category: 'Electronics',
    price: 139999,
    countInStock: 12,
    stock: 12,
    rating: 4.6,
    numReviews: 184,
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm Smartwatch',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'S9 SiP chip, double tap gesture control, brighter Always-On Retina display, advanced health, safety, and activity tracking with ECG and blood oxygen apps.',
    brand: 'Apple',
    category: 'Electronics',
    price: 44900,
    countInStock: 14,
    stock: 14,
    rating: 4.7,
    numReviews: 295,
  },
  {
    name: 'OnePlus 12 5G (Flowy Emerald, 16GB RAM, 512GB Storage)',
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Powered by Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System for Mobile, 2K 120 Hz ProXDR display, and 100W SUPERVOOC fast charging.',
    brand: 'OnePlus',
    category: 'Electronics',
    price: 69999,
    countInStock: 16,
    stock: 16,
    rating: 4.6,
    numReviews: 320,
  },
  {
    name: 'Bose QuietComfort Ultra Wireless Noise Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Spatial audio breakthrough with CustomTune sound calibration, world-class active noise cancellation, and ultra-comfortable plush ear cushions.',
    brand: 'Bose',
    category: 'Electronics',
    price: 35900,
    countInStock: 10,
    stock: 10,
    rating: 4.8,
    numReviews: 164,
  },
  {
    name: 'Dell XPS 15 9530 Laptop (13th Gen i9, 32GB RAM, 1TB SSD)',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Stunning 15.6" 3.5K OLED InfinityEdge touch display, NVIDIA GeForce RTX 4070 graphics, machined aluminum chassis, and Waves MaxxAudio studio sound.',
    brand: 'Dell',
    category: 'Electronics',
    price: 249990,
    countInStock: 5,
    stock: 5,
    rating: 4.9,
    numReviews: 88,
  },
  {
    name: 'Canon EOS R6 Mark II Mirrorless Camera with 24-105mm Lens',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80'
    ],
    description: '24.2 MP Full-Frame CMOS Sensor, 4K 60p 10-Bit Internal Video, up to 40 fps electronic shutter shooting, and Dual Pixel CMOS AF II deep-learning tracking.',
    brand: 'Canon',
    category: 'Electronics',
    price: 239995,
    countInStock: 6,
    stock: 6,
    rating: 4.9,
    numReviews: 112,
  },

  // ==================== FASHION ====================
  {
    name: "Nike Air Max 270 Men's Running Shoes (Black/White)",
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Nike's first lifestyle Air unit delivers unbeatable style and all-day cushioning. Engineered mesh upper provides breathability and structured support.",
    brand: 'Nike',
    category: 'Fashion',
    price: 12995,
    countInStock: 25,
    stock: 25,
    rating: 4.6,
    numReviews: 142,
  },
  {
    name: 'Fossil Gen 6 Touchscreen Smartwatch (Smoke Stainless Steel)',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Faster performance with Snapdragon Wear 4100+, continuous heart rate tracking, SpO2 sensor, and customizable analog & digital watch faces.',
    brand: 'Fossil',
    category: 'Fashion',
    price: 18495,
    countInStock: 18,
    stock: 18,
    rating: 4.4,
    numReviews: 96,
  },
  {
    name: 'Ray-Ban Aviator Classic Sunglasses (Gold/Green G-15)',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Timeless tear-drop shape that originated with aviator pilots. Classic gold metal frame with high-clarity G-15 polarized crystal lenses.',
    brand: 'Ray-Ban',
    category: 'Fashion',
    price: 8590,
    countInStock: 30,
    stock: 30,
    rating: 4.7,
    numReviews: 310,
  },
  {
    name: "Levi's Men's 511 Slim Fit Stretch Denim Jeans (Dark Indigo)",
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A modern slim with room to move. Added stretch for all-day comfort and mobility, cut close to the body with authentic 5-pocket styling.',
    brand: "Levi's",
    category: 'Fashion',
    price: 3299,
    countInStock: 40,
    stock: 40,
    rating: 4.5,
    numReviews: 480,
  },
  {
    name: "Adidas Originals Superstar Men's Sneakers (Cloud White / Core Black)",
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The iconic shell-toe shoe that transitioned from the basketball court to streetwear royalty. Smooth leather upper with serrated 3-Stripes.',
    brand: 'Adidas',
    category: 'Fashion',
    price: 8999,
    countInStock: 22,
    stock: 22,
    rating: 4.6,
    numReviews: 615,
  },
  {
    name: "Tommy Hilfiger Men's Chronograph Stainless Steel Watch",
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Sophisticated multi-function dial with day, date, and 24-hour sub-eyes. Water resistant up to 50 meters with signature Hilfiger tricolor detailing.',
    brand: 'Tommy Hilfiger',
    category: 'Fashion',
    price: 13500,
    countInStock: 15,
    stock: 15,
    rating: 4.5,
    numReviews: 150,
  },
  {
    name: "Puma Men's T7 Track Jacket & Sweatpants Training Set",
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Retro heritage design with 7cm signature stripe inserts down the sleeves and sides. Breathable cotton-blend knit with ribbed collar and cuffs.',
    brand: 'Puma',
    category: 'Fashion',
    price: 4999,
    countInStock: 28,
    stock: 28,
    rating: 4.4,
    numReviews: 210,
  },
  {
    name: "Woodland Men's Camel Leather Heavy Duty Trekking Boots",
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Genuine nubuck leather with grooved rubber lug soles for supreme outdoor traction, padded ankle collars, and corrosion-resistant metal eyelets.',
    brand: 'Woodland',
    category: 'Fashion',
    price: 4495,
    countInStock: 19,
    stock: 19,
    rating: 4.5,
    numReviews: 330,
  },
  {
    name: 'Zara Premium Floral Print Casual Summer Midi Dress',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Lightweight flowy viscose fabric with sweetheart neckline, puff short sleeves, side slit, and vibrant floral botanical motifs.',
    brand: 'Zara',
    category: 'Fashion',
    price: 3590,
    countInStock: 25,
    stock: 25,
    rating: 4.6,
    numReviews: 175,
  },
  {
    name: 'Casio G-Shock Digital-Analog Matte Black Tough Watch (GA-2100)',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Carbon Core Guard structure with octagonal bezel, 200m water resistance, double LED light, world time in 48 cities, and 3-year battery life.',
    brand: 'Casio',
    category: 'Fashion',
    price: 7995,
    countInStock: 35,
    stock: 35,
    rating: 4.8,
    numReviews: 540,
  },

  // ==================== HOME & KITCHEN ====================
  {
    name: 'Nespresso Vertuo Pop Automatic Espresso Machine (Pacific Blue)',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Centrifusion technology reads capsule barcodes to brew five cup sizes at the touch of a button with rich, thick signature crema.',
    brand: 'Nespresso',
    category: 'Home & Kitchen',
    price: 16900,
    countInStock: 14,
    stock: 14,
    rating: 4.6,
    numReviews: 75,
  },
  {
    name: 'Dyson V12 Detect Slim Cordless Vacuum Cleaner',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Dyson's lightest intelligent cordless vacuum. Fluffy Optic cleaner head reveals invisible dust on hard floors with scientific proof of deep clean.",
    brand: 'Dyson',
    category: 'Home & Kitchen',
    price: 49900,
    countInStock: 9,
    stock: 9,
    rating: 4.8,
    numReviews: 128,
  },
  {
    name: 'Philips Digital Air Fryer HD9252/90 with Rapid Air Technology (4.1 L)',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Fry with up to 90% less fat. Touchscreen with 7 preset cooking programs, Keep Warm function, and NutriU recipe app integration.',
    brand: 'Philips',
    category: 'Home & Kitchen',
    price: 8999,
    countInStock: 25,
    stock: 25,
    rating: 4.7,
    numReviews: 450,
  },
  {
    name: 'Instant Pot Duo 7-in-1 Smart Electric Pressure Cooker (6 Litre)',
    image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Replaces 7 kitchen appliances: Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and food warmer.',
    brand: 'Instant Pot',
    category: 'Home & Kitchen',
    price: 10499,
    countInStock: 18,
    stock: 18,
    rating: 4.8,
    numReviews: 620,
  },
  {
    name: 'Morphy Richards 30L Convection Microwave Oven (Motorised Rotisserie)',
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Stainless steel cavity, 200 auto cook menus, multistage cooking, child lock safety, and motorised rotisserie for restaurant-style grilling.',
    brand: 'Morphy Richards',
    category: 'Home & Kitchen',
    price: 13999,
    countInStock: 12,
    stock: 12,
    rating: 4.5,
    numReviews: 180,
  },
  {
    name: 'SleepyCat Original Orthopedic Memory Foam Mattress (King Size, 78x72x6)',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Thermoregulating gel memory foam, high-density base support foam, removable smart zipper cover, and zero partner disturbance technology.',
    brand: 'SleepyCat',
    category: 'Home & Kitchen',
    price: 15499,
    countInStock: 10,
    stock: 10,
    rating: 4.7,
    numReviews: 390,
  },
  {
    name: 'Pigeon by Stovekraft Cruise 1800-Watt Induction Cooktop with LED Display',
    image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Microcrystalline plate with 7 Indian preset cooking menus, dual heat sensors, auto shut-off, and energy-saving high electrical efficiency.',
    brand: 'Pigeon',
    category: 'Home & Kitchen',
    price: 1699,
    countInStock: 45,
    stock: 45,
    rating: 4.3,
    numReviews: 820,
  },
  {
    name: 'Kent Grand Plus RO + UV + UF Mineral Water Purifier (9 Litres Tank)',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'In-tank UV disinfection, Mineral RO Technology retains essential minerals, 20 L/hr purification capacity with zero water wastage technology.',
    brand: 'Kent',
    category: 'Home & Kitchen',
    price: 16499,
    countInStock: 15,
    stock: 15,
    rating: 4.6,
    numReviews: 530,
  },
  {
    name: 'Prestige Deluxe Total Solutions Hard Anodized Cookware Set (5 Pieces)',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Includes Omni Tawa, Fry Pan, Kadai with Glass Lid, and Sauce Pan. Scratch-resistant hard anodized body compatible with induction and gas stoves.',
    brand: 'Prestige',
    category: 'Home & Kitchen',
    price: 3899,
    countInStock: 25,
    stock: 25,
    rating: 4.5,
    numReviews: 290,
  },
  {
    name: 'Bajaj New Shakti Neo 15L Vertical Storage Water Heater Geyser (2000W)',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Titanium Armour Technology for corrosion resistance, 8 bar pressure rating suitable for high-rise buildings, and swirl flow tech for 20% more hot water.',
    brand: 'Bajaj',
    category: 'Home & Kitchen',
    price: 6499,
    countInStock: 20,
    stock: 20,
    rating: 4.4,
    numReviews: 410,
  },

  // ==================== BEAUTY & PERSONAL CARE ====================
  {
    name: 'Dyson Airwrap Multi-Styler Complete Long (Nickel/Copper)',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Styles hair using Coanda airflow without extreme heat damage. Includes barrels to curl and wave in both directions, brushes to shape and smooth.',
    brand: 'Dyson',
    category: 'Beauty & Personal Care',
    price: 49900,
    countInStock: 8,
    stock: 8,
    rating: 4.8,
    numReviews: 230,
  },
  {
    name: 'Philips Multigroom Series 7000 14-in-1 Face, Hair and Body Trimmer',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'DualCut self-sharpening blades, 120-minute lithium-ion run time, 100% waterproof for in-shower use, and reinforced guards to prevent bending.',
    brand: 'Philips',
    category: 'Beauty & Personal Care',
    price: 4295,
    countInStock: 30,
    stock: 30,
    rating: 4.7,
    numReviews: 580,
  },
  {
    name: 'Forest Essentials Soundarya Radiance 24K Gold Face Serum (30ml)',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Traditional Ayurvedic formulation enriched with 24 Karat Gold Bhasma and pure cold-pressed oils. Restores firmness and natural luminous glow.',
    brand: 'Forest Essentials',
    category: 'Beauty & Personal Care',
    price: 6475,
    countInStock: 15,
    stock: 15,
    rating: 4.9,
    numReviews: 190,
  },
  {
    name: 'Minimalist 10% Niacinamide Face Serum with Zinc for Acne Marks (30ml)',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Pure Grade Niacinamide with Zinc PCA, Aloe Vera base, and Hyaluronic Acid. Clinically tested to reduce blemishes, dark spots, and excess sebum.',
    brand: 'Minimalist',
    category: 'Beauty & Personal Care',
    price: 599,
    countInStock: 60,
    stock: 60,
    rating: 4.6,
    numReviews: 940,
  },
  {
    name: 'The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++ (50g)',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Ultra-lightweight aqua gel with Hyaluronic Acid and Vitamin E. Broad spectrum UVA/UVB and blue light protection with zero white cast.',
    brand: 'The Derma Co',
    category: 'Beauty & Personal Care',
    price: 499,
    countInStock: 50,
    stock: 50,
    rating: 4.5,
    numReviews: 780,
  },
  {
    name: "L'Oréal Professionnel Absolut Repair Hair Mask for Dry & Damaged Hair (250ml)",
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Infused with Gold Quinoa and Wheat Protein to deeply resurface damaged hair fibers without weighing them down. Up to 77% less fiber surface damage.',
    brand: "L'Oréal",
    category: 'Beauty & Personal Care',
    price: 920,
    countInStock: 35,
    stock: 35,
    rating: 4.7,
    numReviews: 490,
  },
  {
    name: 'Bath & Body Works Japanese Cherry Blossom Fine Fragrance Mist (236ml)',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A graceful blend of Japanese Cherry Blossom, Asian pear, fresh mimosa petals, white jasmine and blushing sandalwood with conditioning aloe.',
    brand: 'Bath & Body Works',
    category: 'Beauty & Personal Care',
    price: 1899,
    countInStock: 25,
    stock: 25,
    rating: 4.7,
    numReviews: 360,
  },
  {
    name: 'Bombay Shaving Company Precision Safety Razor & Premium Shaving Kit',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Precision engineered metal double-edge razor, imitation badger shaving brush, tea tree shaving cream, and soothing post-shave balm.',
    brand: 'Bombay Shaving Company',
    category: 'Beauty & Personal Care',
    price: 2499,
    countInStock: 20,
    stock: 20,
    rating: 4.5,
    numReviews: 240,
  },
  {
    name: 'Cetaphil Gentle Skin Cleanser for All Skin Types with Niacinamide (500ml)',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Dermatologist recommended non-foaming hydrating face wash with Vitamin B3, Provitamin B5 and Glycerin. Defends against 5 signs of skin sensitivity.',
    brand: 'Cetaphil',
    category: 'Beauty & Personal Care',
    price: 1145,
    countInStock: 40,
    stock: 40,
    rating: 4.8,
    numReviews: 1200,
  },
  {
    name: 'Maybelline New York Superstay Vinyl Ink Longwear Liquid Lipstick (Wicked Red)',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Up to 16HR wear instant-shine vinyl liquid lip color. Transfer-proof, smudge-proof formula enriched with Vitamin E and Aloe.',
    brand: 'Maybelline',
    category: 'Beauty & Personal Care',
    price: 849,
    countInStock: 50,
    stock: 50,
    rating: 4.6,
    numReviews: 670,
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amazon-clone');
    
    await Product.deleteMany();
    await Category.deleteMany();
    
    await Product.insertMany(sampleProducts);
    await Category.insertMany(sampleCategories);
    
    console.log(`Successfully seeded ${sampleCategories.length} categories and ${sampleProducts.length} categorized products!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();