import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContextValue';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{padding: '20px'}}>Loading...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>{error}</div>;

  return (
    <div className="amz-product-page">
      
      {/* Column 1: Images */}
      <div className="amz-product-images">
        <div className="amz-thumbnail-list">
          <img src={product.image} alt="thumb" className="amz-thumb active" />
          <img src={product.image} alt="thumb" className="amz-thumb" />
        </div>
        <div className="amz-main-image">
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      {/* Column 2: Product Info */}
      <div className="amz-product-info">
        <h1 className="amz-product-title">{product.name}</h1>
        <a href="#" className="amz-store-link">Visit the {product.brand} Store</a>
        
        <div className="amz-product-rating">
          ⭐⭐⭐⭐⭐ {product.rating} ratings
        </div>
        
        <hr className="amz-divider" />
        
        <div className="amz-product-price-block">
          <div className="amz-price-discount">-12%</div>
          <div className="amz-item-price large">
            <sup>$</sup>
            <span className="amz-price-whole">{Math.floor(product.price)}</span>
            <span className="amz-price-fraction">{(product.price % 1).toFixed(2).substring(2)}</span>
          </div>
        </div>
        <p className="amz-taxes">Inclusive of all taxes</p>

        <hr className="amz-divider" />
        
        <h3>About this item</h3>
        <ul className="amz-about-list">
          <li>{product.description}</li>
          <li>High-quality materials and premium build.</li>
          <li>Eligible for fast and free shipping.</li>
        </ul>
      </div>

      {/* Column 3: Buy Box */}
      <div className="amz-product-buybox">
        <div className="amz-buybox-price">${product.price}</div>
        <p className="amz-buybox-delivery">
          <a href="#">FREE delivery</a>. Order within 10 hrs.
        </p>
        
        <h4 className="amz-stock-status">
          {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
        </h4>

        {product.countInStock > 0 && (
          <div className="amz-buybox-actions">
            <button 
              className="amz-add-to-cart-btn block"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button 
              className="amz-buy-now-btn block"
              onClick={() => {
                addToCart(product);
                navigate('/checkout');
              }}
            >
              Buy Now
            </button>
          </div>
        )}
        
        <div className="amz-secure-transaction">
          🔒 Secure transaction
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
