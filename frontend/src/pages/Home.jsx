import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FaChevronLeft, FaChevronRight, FaShippingFast, FaCheckCircle, FaLock, FaSync } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = [
    { 
      title: "Up to 60% off | Best Deals on Electronics", 
      subtitle: "Top brands | Great prices | No Cost EMI available", 
      bgGradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      link: "/search?category=Electronics",
      tag: "Deals of the Day"
    },
    { 
      title: "Upgrade Your Home & Kitchen", 
      subtitle: "Smart appliances & premium decor starting ₹499", 
      bgGradient: "linear-gradient(135deg, #134e5e, #71b280)",
      link: "/search?category=Home%20%26%20Kitchen",
      tag: "Limited Time Offer"
    },
    { 
      title: "Latest Fashion Trends for Everyone", 
      subtitle: "Clothing, footwear, watches & luxury accessories", 
      bgGradient: "linear-gradient(135deg, #3a7bd5, #3a6073)",
      link: "/search?category=Fashion",
      tag: "New Arrivals"
    }
  ];

  const categoryImages = {
    'Electronics': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
    'Fashion': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    'Home & Kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80',
    'Beauty & Personal Care': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/api/products?limit=50');
        const prodData = prodRes.data;
        setProducts(Array.isArray(prodData) ? prodData : (prodData?.products || [])); 
        
        const catRes = await api.get('/api/categories');
        const catData = catRes.data;
        setCategories(Array.isArray(catData) ? catData : (catData?.categories || []));
      } catch (err) {
        console.error('Error fetching home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="amz-loading-screen flex-center">
        <div className="amz-spinner"></div>
        <p style={{ marginTop: '1rem', fontWeight: 600, color: '#555' }}>Loading amazing deals...</p>
      </div>
    );
  }

  // Filter products by category for shelves
  const electronicsProducts = products.filter(p => p.category?.toLowerCase().includes('electronic')).slice(0, 4);
  const fashionProducts = products.filter(p => p.category?.toLowerCase().includes('fashion')).slice(0, 4);
  const homeProducts = products.filter(p => p.category?.toLowerCase().includes('home') || p.category?.toLowerCase().includes('kitchen')).slice(0, 4);
  const beautyProducts = products.filter(p => p.category?.toLowerCase().includes('beauty')).slice(0, 4);
  const featuredDeals = products.slice(0, 8);

  return (
    <div className="amz-home-container">
      {/* Hero Banner Slider */}
      <div 
        className="amz-hero-banner" 
        style={{ background: banners[bannerIndex].bgGradient }}
      >
        <button 
          className="amz-banner-nav left" 
          onClick={() => setBannerIndex(prev => (prev - 1 + banners.length) % banners.length)}
          aria-label="Previous Banner"
        >
          <FaChevronLeft />
        </button>

        <div className="container amz-banner-content-wrapper">
          <div className="amz-banner-text animate-fade-in" key={bannerIndex}>
            <span className="amz-banner-tag">{banners[bannerIndex].tag}</span>
            <h1>{banners[bannerIndex].title}</h1>
            <p>{banners[bannerIndex].subtitle}</p>
            <Link to={banners[bannerIndex].link} className="amz-banner-cta">
              Shop Now
            </Link>
          </div>
        </div>

        <button 
          className="amz-banner-nav right" 
          onClick={() => setBannerIndex(prev => (prev + 1) % banners.length)}
          aria-label="Next Banner"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Main Home Content (Overlapping Hero Banner like real Amazon) */}
      <div className="container amz-home-body">
        
        {/* Value Proposition Row */}
        <div className="amz-value-props">
          <div className="prop-card">
            <FaShippingFast className="prop-icon" />
            <div>
              <h4>Free Delivery</h4>
              <p>On orders above ₹499</p>
            </div>
          </div>

          <div className="prop-card">
            <FaCheckCircle className="prop-icon" />
            <div>
              <h4>100% Genuine</h4>
              <p>Verified seller marketplace</p>
            </div>
          </div>

          <div className="prop-card">
            <FaSync className="prop-icon" />
            <div>
              <h4>Easy Returns</h4>
              <p>7 days replacement policy</p>
            </div>
          </div>

          <div className="prop-card">
            <FaLock className="prop-icon" />
            <div>
              <h4>Secure Checkout</h4>
              <p>SSL & UPI Enabled</p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <section className="amz-section">
          <div className="amz-section-header">
            <h2>Shop by Category</h2>
            <Link to="/search" className="see-all-link">See all categories</Link>
          </div>

          <div className="amz-category-grid">
            {categories?.map((cat) => {
              const catImg = categoryImages[cat.name] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80';
              return (
                <Link 
                  to={`/search?category=${encodeURIComponent(cat.name)}`} 
                  key={cat._id} 
                  className="amz-category-card"
                >
                  <div className="cat-card-img-wrapper">
                    <img src={catImg} alt={cat.name} loading="lazy" />
                  </div>
                  <div className="cat-card-body">
                    <div>
                      <h3>{cat.name}</h3>
                      <p>{cat.description || 'Explore top deals & curated selections'}</p>
                    </div>
                    <div className="cat-card-footer">
                      <span>Explore now →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Deals Section */}
        <section className="amz-section">
          <div className="amz-section-header">
            <h2>Today's Featured Deals</h2>
            <Link to="/search" className="see-all-link">Explore all products</Link>
          </div>

          <div className="amz-product-grid">
            {featuredDeals?.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>

        {/* Electronics Shelf */}
        {electronicsProducts.length > 0 && (
          <section className="amz-section">
            <div className="amz-section-header">
              <h2>Top Deals in Electronics & Gadgets</h2>
              <Link to="/search?category=Electronics" className="see-all-link">See all Electronics ({electronicsProducts.length > 0 ? '10+ items' : ''}) →</Link>
            </div>
            <div className="amz-product-grid">
              {electronicsProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Fashion Shelf */}
        {fashionProducts.length > 0 && (
          <section className="amz-section">
            <div className="amz-section-header">
              <h2>Trending in Fashion & Lifestyle</h2>
              <Link to="/search?category=Fashion" className="see-all-link">See all Fashion →</Link>
            </div>
            <div className="amz-product-grid">
              {fashionProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Home & Kitchen Shelf */}
        {homeProducts.length > 0 && (
          <section className="amz-section">
            <div className="amz-section-header">
              <h2>Home & Kitchen Essentials</h2>
              <Link to="/search?category=Home%20%26%20Kitchen" className="see-all-link">See all Home & Kitchen →</Link>
            </div>
            <div className="amz-product-grid">
              {homeProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Beauty & Personal Care Shelf */}
        {beautyProducts.length > 0 && (
          <section className="amz-section">
            <div className="amz-section-header">
              <h2>Beauty & Personal Care Bestsellers</h2>
              <Link to="/search?category=Beauty" className="see-all-link">See all Beauty & Grooming →</Link>
            </div>
            <div className="amz-product-grid">
              {beautyProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}

      </div>

      <style>{`
        .amz-home-container {
          background-color: #eaeded;
          min-height: 100vh;
          padding-bottom: 3rem;
          font-family: 'Inter', sans-serif;
        }

        .amz-loading-screen {
          min-height: 70vh;
          flex-direction: column;
        }

        .amz-spinner {
          width: 45px;
          height: 45px;
          border: 4px solid #dddddd;
          border-top-color: #febd69;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Hero Banner */
        .amz-hero-banner {
          position: relative;
          min-height: 380px;
          color: white;
          display: flex;
          align-items: center;
          transition: background 0.6s ease-in-out;
        }

        .amz-banner-nav {
          position: absolute;
          top: 40%;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: white;
          width: 44px;
          height: 60px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          transition: background 0.2s;
        }

        .amz-banner-nav:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        .amz-banner-nav.left { left: 10px; }
        .amz-banner-nav.right { right: 10px; }

        .amz-banner-content-wrapper {
          position: relative;
          z-index: 10;
          padding: 2rem 4rem;
        }

        .amz-banner-text {
          max-width: 650px;
        }

        .amz-banner-tag {
          background-color: #cc0c39;
          color: white;
          padding: 4px 12px;
          font-size: 0.8rem;
          font-weight: 700;
          border-radius: 2px;
          display: inline-block;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .amz-banner-text h1 {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .amz-banner-text p {
          font-size: 1.1rem;
          color: #f0f0f0;
          margin-bottom: 20px;
        }

        .amz-banner-cta {
          display: inline-block;
          background: #ffd814;
          color: #111;
          font-weight: 700;
          padding: 10px 28px;
          border-radius: 20px;
          text-decoration: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          transition: background 0.2s, transform 0.1s;
        }

        .amz-banner-cta:hover {
          background: #f7ca00;
          transform: translateY(-1px);
        }

        /* Amazon Overlapping Body */
        .amz-home-body {
          margin-top: -60px;
          position: relative;
          z-index: 30;
        }

        /* Value Props Row */
        .amz-value-props {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          background: white;
          padding: 18px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 2rem;
        }

        .prop-card {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .prop-icon {
          font-size: 2rem;
          color: #f08804;
        }

        .prop-card h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 2px;
        }

        .prop-card p {
          font-size: 0.8rem;
          color: #565959;
        }

        /* Section Styling */
        .amz-section {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          margin-bottom: 2rem;
        }

        .amz-section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          border-bottom: 1px solid #e7e7e7;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .amz-section-header h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f1111;
        }

        .see-all-link {
          color: #007185;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
        }

        .see-all-link:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        /* Category Grid */
        .amz-category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .amz-category-card {
          background: #ffffff;
          border: 1px solid #e7e7e7;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: #111;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .amz-category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .cat-card-img-wrapper {
          width: 100%;
          height: 180px;
          background: #f7f7f7;
          overflow: hidden;
        }

        .cat-card-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .amz-category-card:hover .cat-card-img-wrapper img {
          transform: scale(1.06);
        }

        .cat-card-body {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cat-card-body h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 6px;
        }

        .cat-card-body p {
          font-size: 0.85rem;
          color: #565959;
          margin-bottom: 14px;
          line-height: 1.4;
        }

        .cat-card-footer span {
          color: #007185;
          font-size: 0.88rem;
          font-weight: 600;
        }

        .amz-category-card:hover .cat-card-footer span {
          color: #c7511f;
          text-decoration: underline;
        }

        /* Product Grid */
        .amz-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 20px;
        }
      `}</style>
    </div>
  );
};

export default Home;
