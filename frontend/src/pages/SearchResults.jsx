import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContextValue';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryQuery = searchParams.get('category') || 'All';
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const url = categoryQuery !== 'All' 
          ? `/api/products?category=${categoryQuery}` 
          : `/api/products`;
          
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          setProducts(Array.isArray(data) ? data : []); 
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch {
        setError('Server error while searching');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [categoryQuery]);

  return (
    <div className="amz-search-page">
      {/* Left Sidebar Filters */}
      <div className="amz-search-sidebar">
        <h4>Eligible for Free Delivery</h4>
        <label><input type="checkbox" /> Free Shipping</label>
        
        <h4>Brand</h4>
        <ul className="amz-sidebar-list">
          <li><a href="#">Apple</a></li>
          <li><a href="#">Samsung</a></li>
          <li><a href="#">Sony</a></li>
        </ul>

        <h4>Price</h4>
        <ul className="amz-sidebar-list">
          <li><a href="#">Under $50</a></li>
          <li><a href="#">$50 to $100</a></li>
          <li><a href="#">$100 to $200</a></li>
          <li><a href="#">Over $200</a></li>
        </ul>
      </div>

      {/* Right Content Area */}
      <div className="amz-search-content">
        <h2>Results</h2>
        <p className="amz-search-subtitle">Check each product page for other buying options.</p>

        {loading ? (
          <h2>Loading...</h2>
        ) : error ? (
          <h2 style={{ color: 'red' }}>{error}</h2>
        ) : products?.length === 0 ? (
          <h2>No products found.</h2>
        ) : (
          <div className="amz-search-list">
            {products?.map((product) => (
              <div key={product._id} className="amz-search-item">
                <div className="amz-search-item-img">
                  <Link to={`/product/${product._id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                </div>
                <div className="amz-search-item-details">
                  <Link to={`/product/${product._id}`} className="amz-item-title">
                    {product.name}
                  </Link>
                  <div className="amz-item-rating">
                    ⭐⭐⭐⭐⭐ {product.rating} ({product.numReviews})
                  </div>
                  <div className="amz-item-price">
                    <sup>$</sup>
                    <span className="amz-price-whole">{Math.floor(product.price)}</span>
                    <span className="amz-price-fraction">
                      {(product.price % 1).toFixed(2).substring(2)}
                    </span>
                  </div>
                  <p className="amz-item-shipping">FREE delivery</p>
                  <button 
                    className="amz-add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
