import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaCheckCircle, FaLock, FaShippingFast, FaSync } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const FALLBACK_CATEGORIES = [
  { _id: 'electronics', name: 'Electronics', description: 'Phones, audio and more' },
  { _id: 'fashion', name: 'Fashion', description: 'Styles for every day' },
  { _id: 'home', name: 'Home & Kitchen', description: 'Make home feel better' },
  { _id: 'beauty', name: 'Beauty', description: 'Everyday essentials' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorefront = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          api.get('/api/products?limit=8'),
          api.get('/api/categories'),
        ]);

        const nextProducts = Array.isArray(productResponse.data)
          ? productResponse.data
          : productResponse.data?.products || [];
        const nextCategories = Array.isArray(categoryResponse.data)
          ? categoryResponse.data
          : categoryResponse.data?.categories || [];

        setProducts(nextProducts);
        if (nextCategories.length) setCategories(nextCategories);
      } catch (error) {
        console.error('Unable to load storefront data', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorefront();
  }, []);

  return (
    <main className="storefront">
      <section className="storefront-hero">
        <div className="storefront-hero__content">
          <p className="storefront-eyebrow">Amazon marketplace</p>
          <h1>Everything you need, delivered to your door.</h1>
          <p>Discover everyday essentials, technology and standout deals in one easy place.</p>
          <Link to="/search" className="storefront-cta">Shop today</Link>
        </div>
        <div className="storefront-hero__deals">
          <span>Today’s deal</span>
          <strong>Up to 60% off</strong>
          <small>Selected electronics</small>
        </div>
      </section>

      <section className="storefront-benefits" aria-label="Shopping benefits">
        <div><FaShippingFast /><span><strong>Fast delivery</strong>Free shipping on eligible orders</span></div>
        <div><FaSync /><span><strong>Easy returns</strong>Simple returns within 7 days</span></div>
        <div><FaCheckCircle /><span><strong>Trusted products</strong>Quality checked selections</span></div>
        <div><FaLock /><span><strong>Secure payments</strong>Protected checkout experience</span></div>
      </section>

      <section className="storefront-section">
        <div className="storefront-section__heading">
          <div>
            <p className="storefront-eyebrow">Shop by department</p>
            <h2>Find your next favourite</h2>
          </div>
          <Link to="/search">View all</Link>
        </div>
        <div className="department-grid">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category._id || category.slug || category.name}
              to={`/search?category=${encodeURIComponent(category.slug || category.name)}`}
              className="department-card"
            >
              <span>{category.name.slice(0, 1)}</span>
              <strong>{category.name}</strong>
              <small>{category.description || 'Explore deals'}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="storefront-section storefront-products">
        <div className="storefront-section__heading">
          <div>
            <p className="storefront-eyebrow">Fresh picks</p>
            <h2>Popular products</h2>
          </div>
          <Link to="/search">See more</Link>
        </div>

        {loading ? (
          <div className="storefront-empty">Loading products…</div>
        ) : products.length ? (
          <div className="storefront-product-grid">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div className="storefront-empty">
            <FaBoxOpen />
            <h3>Products are on their way</h3>
            <p>Add seed products in the backend to populate this storefront.</p>
          </div>
        )}
      </section>

      <style>{`
        .storefront { background: #eaeded; min-height: 100vh; padding-bottom: 3rem; }
        .storefront-hero { min-height: 420px; padding: clamp(2.5rem, 7vw, 6rem) max(1.25rem, calc((100% - 1200px) / 2)); display: flex; align-items: center; justify-content: space-between; gap: 2rem; color: #fff; background: radial-gradient(circle at 85% 25%, rgba(255, 216, 20, .35), transparent 27%), linear-gradient(115deg, #131921, #243a55); }
        .storefront-hero__content { max-width: 650px; }
        .storefront-eyebrow { color: #c7d9ec; font-size: .76rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; margin-bottom: .65rem; }
        .storefront-hero h1 { font-size: clamp(2.3rem, 5vw, 4.4rem); line-height: 1.05; max-width: 740px; }
        .storefront-hero p:not(.storefront-eyebrow) { max-width: 540px; font-size: 1.1rem; margin: 1.25rem 0 2rem; color: #e7edf3; }
        .storefront-cta { display: inline-block; padding: .9rem 1.5rem; border-radius: 999px; background: #ffd814; color: #131921; font-weight: 800; }
        .storefront-hero__deals { width: 220px; min-height: 220px; padding: 1.75rem; display: flex; flex-direction: column; justify-content: center; border-radius: 1.25rem; background: #fff; color: #131921; box-shadow: 0 24px 70px rgba(0,0,0,.22); transform: rotate(3deg); }
        .storefront-hero__deals span { color: #c45500; font-weight: 800; text-transform: uppercase; font-size: .75rem; letter-spacing: .08em; }
        .storefront-hero__deals strong { font-size: 2.2rem; line-height: 1; margin: .6rem 0; }
        .storefront-benefits, .storefront-section { max-width: 1200px; margin-inline: auto; }
        .storefront-benefits { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: -1.6rem; position: relative; box-shadow: 0 3px 12px rgba(0,0,0,.08); background: #e5e7eb; }
        .storefront-benefits > div { display: flex; gap: .7rem; align-items: center; padding: 1.05rem; background: #fff; }
        .storefront-benefits svg { color: #c45500; font-size: 1.35rem; flex: none; }
        .storefront-benefits span { display: grid; font-size: .76rem; color: #5f6670; } .storefront-benefits strong { color: #131921; font-size: .85rem; }
        .storefront-section { padding: 3.25rem 1.25rem 0; }
        .storefront-section__heading { display: flex; align-items: end; justify-content: space-between; margin-bottom: 1.35rem; }
        .storefront-section__heading h2 { font-size: clamp(1.55rem, 3vw, 2.2rem); color: #131921; }
        .storefront-section__heading > a { color: #007185; font-weight: 700; }
        .department-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .department-card { min-height: 170px; padding: 1.15rem; display: grid; align-content: end; border-radius: .75rem; overflow: hidden; background: linear-gradient(145deg, #fdfdfd, #e6eef5); transition: transform .2s ease, box-shadow .2s ease; }
        .department-card:hover { transform: translateY(-4px); box-shadow: 0 9px 20px rgba(0,0,0,.12); }
        .department-card span { width: 3rem; height: 3rem; display: grid; place-items: center; margin-bottom: auto; border-radius: 50%; background: #ffd814; color: #131921; font-size: 1.3rem; font-weight: 800; }
        .department-card strong { color: #131921; font-size: 1.05rem; } .department-card small { margin-top: .25rem; color: #5f6670; }
        .storefront-product-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
        .storefront-empty { min-height: 260px; display: grid; place-content: center; justify-items: center; gap: .6rem; text-align: center; background: #fff; border-radius: .75rem; color: #5f6670; }
        .storefront-empty svg { font-size: 2.5rem; color: #c45500; } .storefront-empty h3 { color: #131921; }
        @media (max-width: 760px) { .storefront-hero { min-height: auto; } .storefront-hero__deals { display: none; } .storefront-benefits { margin: 0; grid-template-columns: repeat(2, 1fr); } .department-grid, .storefront-product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .storefront-section { padding-top: 2.25rem; } }
      `}</style>
    </main>
  );
};

export default Home;
