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
    { title: "Up to 60% off | Best Deals on Electronics", subtitle: "Top brands | Great prices", bgGradient: "linear-gradient(135deg, #1d2671, #c33764)", link: "/search?category=mobiles" },
    { title: "Elevate Your Style", subtitle: "Men's & Women's Fashion", bgGradient: "linear-gradient(135deg, #3a7bd5, #3a6073)", link: "/search?brand=Nike" },
    { title: "Home & Kitchen Upgrades", subtitle: "Make your living room premium", bgGradient: "linear-gradient(135deg, #134e5e, #71b280)", link: "/search" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/api/products?limit=8');
        // Safely extract products or default to an empty array
        setProducts(prodRes.data?.products || []); 
        
        const catRes = await api.get('/api/categories');
        // Safely extract categories or default to an empty array
        setCategories(catRes.data?.categories || []);
      } catch (err) {
        console.error('Error fetching home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Early return while fetching data to prevent rendering without data
  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', width: '100vw' }}>
        <h2>Loading amazing deals...</h2>
      </div>
    );
  }

  return (
    <div className="home-container animate-fade-in">
      <div className="home-banner flex-center" style={{ background: banners[bannerIndex].bgGradient, transition: 'background 0.5s ease-in-out' }}>
        <button className="banner-nav left" onClick={() => setBannerIndex(prev => (prev - 1 + banners.length) % banners.length)}><FaChevronLeft /></button>
        <div className="banner-content flex-center">
          <div className="banner-text animate-fade-in" key={bannerIndex}>
            <h1>{banners[bannerIndex].title}</h1>
            <p>{banners[bannerIndex].subtitle}</p>
            <Link to={banners[bannerIndex].link} className="btn btn-primary banner-btn">Shop Now</Link>
          </div>
        </div>
        <button className="banner-nav right" onClick={() => setBannerIndex(prev => (prev + 1) % banners.length)}><FaChevronRight /></button>
      </div>

      <div className="container home-content">
        <div className="props-row grid-responsive" style={{ marginBottom: '3rem' }}>
          <div className="prop-item flex-center"><FaShippingFast className="prop-icon" /><div><h4>Free Delivery</h4><p>On orders above ₹499</p></div></div>
          <div className="prop-item flex-center"><FaCheckCircle className="prop-icon" /><div><h4>100% Genuine</h4><p>Direct seller checks</p></div></div>
          <div className="prop-item flex-center"><FaSync className="prop-icon" /><div><h4>Easy Returns</h4><p>7 days replacement policy</p></div></div>
          <div className="prop-item flex-center"><FaLock className="prop-icon" /><div><h4>Secure Checkout</h4><p>SSL & UPI Enabled</p></div></div>
        </div>

        <section className="categories-section">
          <h2>Browse by Category</h2>
          <div className="grid-responsive">
            {/* Added optional chaining (?) just in case */}
            {categories?.map((cat) => (
              <Link to={`/search?category=${cat.slug}`} key={cat._id} className="card category-card flex-center">
                <h3>{cat.name}</h3><p>{cat.description || 'Explore deals'}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="featured-section">
          <h2>Featured Products</h2>
          <div className="grid-responsive">
            {/* Added optional chaining (?) just in case */}
            {products?.map((prod) => (<ProductCard key={prod._id} product={prod} />))}
          </div>
        </section>
      </div>

      <style>{`
        .home-banner { min-height: 50vh; padding: var(--space-lg) var(--space-sm); position: relative; color: #ffffff; overflow: hidden; flex-direction: column; }
        .banner-nav { position: absolute; background: rgba(0, 0, 0, 0.2); border: none; color: #ffffff; width: var(--min-touch-target); height: var(--min-touch-target); border-radius: 50%; cursor: pointer; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; z-index: 10; }
        .banner-nav.left { left: 1rem; } .banner-nav.right { right: 1rem; }
        .banner-content { text-align: center; width: 100%; padding: 0 3rem; }
        .banner-text h1 { font-size: clamp(1.75rem, 5vw, 3rem); font-weight: 800; line-height: 1.2; margin-bottom: 1rem; }
        .banner-text p { font-size: clamp(1rem, 2vw, 1.25rem); color: #f0f0f0; margin-bottom: 2rem; }
        .banner-btn { border-radius: 50px !important; }
        .home-content { margin-top: -40px; position: relative; z-index: 20; }
        .props-row { background-color: #ffffff; padding: var(--space-md); border-radius: var(--border-radius-md); box-shadow: var(--shadow-sm); }
        .prop-item { justify-content: flex-start; gap: 1rem; }
        .prop-icon { font-size: 2.25rem; color: var(--accent-color); }
        .categories-section, .featured-section { margin-top: 4rem; }
        .categories-section h2, .featured-section h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; }
        .category-card { flex-direction: column; text-align: center; }
        @media (min-width: 769px) { .prop-item { border-right: 1px solid var(--border-color); padding-right: 1rem; } .prop-item:last-child { border-right: none; } }
      `}</style>
    </div>
  );
};

export default Home;
