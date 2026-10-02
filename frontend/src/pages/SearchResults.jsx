import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryQuery = searchParams.get('category') || 'All';
  const keywordQuery = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError('');
      try {
        let endpoint = '/api/products';
        const params = new URLSearchParams();

        if (categoryQuery !== 'All') {
          params.append('category', categoryQuery);
        }
        if (keywordQuery) {
          params.append('keyword', keywordQuery);
        }

        if (params.toString()) {
          endpoint += `?${params.toString()}`;
        }
          
        const response = await api.get(endpoint);
        const data = response.data;
        
        const results = Array.isArray(data) ? data : (data.products || []);
        
        // Filter locally by keyword if backend doesn't filter by keyword
        const filtered = keywordQuery
          ? results.filter(p => p.name.toLowerCase().includes(keywordQuery.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(keywordQuery.toLowerCase())))
          : results;

        setProducts(filtered);
      } catch (err) {
        console.error(err);
        setError('Unable to fetch search results.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [categoryQuery, keywordQuery]);

  return (
    <div className="amz-search-page-wrapper">
      <div className="container amz-search-container">
        
        {/* Top Header Result summary */}
        <div className="amz-search-top-bar">
          <p>
            Showing results for {keywordQuery ? <strong>"{keywordQuery}"</strong> : <strong>"{categoryQuery}"</strong>}
          </p>
        </div>

        <div className="amz-search-layout">
          {/* Left Sidebar Filters */}
          <aside className="amz-search-sidebar">
            <h3>Department</h3>
            <ul className="amz-filter-list">
              <li><Link to="/search">All Departments</Link></li>
              <li><Link to="/search?category=Electronics">Electronics</Link></li>
              <li><Link to="/search?category=Fashion">Fashion</Link></li>
              <li><Link to="/search?category=Home%20%26%20Kitchen">Home & Kitchen</Link></li>
              <li><Link to="/search?category=Beauty">Beauty & Personal Care</Link></li>
            </ul>

            <hr />

            <h3>Customer Reviews</h3>
            <ul className="amz-filter-list">
              <li><a href="#">⭐⭐⭐⭐ & Up</a></li>
              <li><a href="#">⭐⭐⭐ & Up</a></li>
            </ul>

            <hr />

            <h3>Delivery Day</h3>
            <label className="amz-checkbox-label" htmlFor="delivery-tomorrow-filter">
              <input 
                id="delivery-tomorrow-filter" 
                name="deliveryTomorrow" 
                type="checkbox" 
                defaultChecked 
              /> Get It by Tomorrow
            </label>
          </aside>

          {/* Right Main Content */}
          <main className="amz-search-main">
            <h2>Results</h2>
            <p className="amz-search-disclaimer">Price and other details may vary based on product size and colour.</p>

            {loading ? (
              <div className="amz-search-loading flex-center">
                <div className="amz-spinner"></div>
                <p>Searching products...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : products?.length === 0 ? (
              <div className="amz-empty-results">
                <h3>No products found</h3>
                <p>Try checking your spelling or use more general terms.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Return to Homepage</Link>
              </div>
            ) : (
              <div className="amz-search-grid">
                {products?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>

      </div>

      <style>{`
        .amz-search-page-wrapper {
          background-color: #eaeded;
          min-height: 90vh;
          padding: 1.5rem 0 3rem 0;
          font-family: 'Inter', sans-serif;
        }

        .amz-search-top-bar {
          background: white;
          padding: 12px 20px;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          border: 1px solid #e7e7e7;
          font-size: 0.95rem;
          color: #333;
        }

        .amz-search-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 24px;
        }

        .amz-search-sidebar {
          background: white;
          padding: 20px;
          border-radius: 6px;
          border: 1px solid #e7e7e7;
          height: fit-content;
        }

        .amz-search-sidebar h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 10px;
        }

        .amz-search-sidebar hr {
          border: none;
          border-top: 1px solid #e7e7e7;
          margin: 16px 0;
        }

        .amz-filter-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .amz-filter-list li {
          margin-bottom: 6px;
        }

        .amz-filter-list a {
          color: #007185;
          text-decoration: none;
          font-size: 0.85rem;
        }

        .amz-filter-list a:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        .amz-checkbox-label {
          font-size: 0.85rem;
          color: #333;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .amz-search-main {
          background: white;
          padding: 24px;
          border-radius: 6px;
          border: 1px solid #e7e7e7;
        }

        .amz-search-main h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 4px;
        }

        .amz-search-disclaimer {
          font-size: 0.8rem;
          color: #565959;
          margin-bottom: 20px;
        }

        .amz-search-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .amz-empty-results {
          text-align: center;
          padding: 3rem 1rem;
        }

        .amz-search-loading {
          flex-direction: column;
          padding: 3rem 0;
        }

        @media (max-width: 768px) {
          .amz-search-layout {
            grid-template-columns: 1fr;
          }

          .amz-search-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
