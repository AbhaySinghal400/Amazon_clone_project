import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContextValue';
import { useWishlist } from '../context/WishlistContextValue';
import { useAuth } from '../context/AuthContextValue';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, hasItem } = useWishlist();
  const { user } = useAuth();
  
  const isWishlisted = hasItem(product._id);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} style={{ color: '#ffa41c', fontSize: '0.85rem' }} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} style={{ color: '#ffa41c', fontSize: '0.85rem' }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: '#ffa41c', fontSize: '0.85rem' }} />);
      }
    }
    return stars;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setAdding(true);
    const result = await addToCart(product, 1);
    if (result && !result.success) {
      alert(result.message);
    }
    setAdding(false);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const result = await toggleWishlist(product._id);
    if (!result.success) {
      alert(result.message);
    }
  };

  const imageUrl = product.image || (product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60');

  return (
    <div className="amz-product-card">
      <Link to={`/product/${product._id}`} className="amz-card-link">
        {/* Wishlist Heart Button */}
        <button 
          className="amz-wishlist-btn" 
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <FaHeart style={{ color: isWishlisted ? '#ff4f4f' : '#cbd5e1' }} />
        </button>

        {/* Product Image */}
        <div className="amz-card-image-box">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="amz-card-image" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="amz-card-details">
          <span className="amz-card-brand">{product.brand || 'Amazon Choice'}</span>
          <h3 className="amz-card-title" title={product.name}>{product.name}</h3>
          
          {/* Star Ratings */}
          <div className="amz-card-ratings">
            <div className="stars flex-center">{renderStars(product.rating || product.ratings || 4.5)}</div>
            <span className="amz-reviews-count">({product.numReviews || 18})</span>
          </div>

          {/* Pricing */}
          <div className="amz-card-price-row">
            <span className="amz-currency">₹</span>
            <span className="amz-price-integer">{Math.floor(product.price).toLocaleString('en-IN')}</span>
            <span className="amz-price-fraction">{product.price % 1 === 0 ? '00' : Math.round((product.price % 1) * 100)}</span>
          </div>

          <div className="amz-delivery-info">
            <span className="amz-prime-tag">prime</span> FREE Delivery by <strong>{(() => {
              const d = new Date();
              d.setDate(d.getDate() + 2);
              return `${d.toLocaleDateString('en-IN', { weekday: 'short' })}, ${d.getDate()} ${d.toLocaleDateString('en-IN', { month: 'short' })}`;
            })()}</strong>
          </div>

          {/* Add to Cart Button */}
          <button 
            className="amz-add-cart-btn" 
            onClick={handleAddToCart}
            disabled={adding || product.countInStock <= 0}
          >
            {product.countInStock <= 0 ? 'Out of Stock' : (
              adding ? 'Adding...' : <><FaShoppingCart /> Add to Cart</>
            )}
          </button>
        </div>
      </Link>

      <style>{`
        .amz-product-card {
          background: #ffffff;
          border: 1px solid #e7e7e7;
          border-radius: 8px;
          padding: 16px;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .amz-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: #d5d9d9;
        }

        .amz-card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .amz-wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 5px rgba(0,0,0,0.08);
          transition: transform 0.15s ease;
        }

        .amz-wishlist-btn:hover {
          transform: scale(1.15);
        }

        .amz-card-image-box {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          margin-bottom: 12px;
        }

        .amz-card-image {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .amz-product-card:hover .amz-card-image {
          transform: scale(1.04);
        }

        .amz-card-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .amz-card-brand {
          font-size: 0.72rem;
          color: #565959;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .amz-card-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: #0f1111;
          margin: 4px 0 8px 0;
          line-height: 1.35;
          height: 2.6rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .amz-card-title:hover {
          color: #c7511f;
        }

        .amz-card-ratings {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .amz-reviews-count {
          font-size: 0.78rem;
          color: #007185;
        }

        .amz-card-price-row {
          display: flex;
          align-items: flex-start;
          color: #0f1111;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .amz-currency {
          font-size: 0.75rem;
          margin-top: 2px;
          margin-right: 1px;
        }

        .amz-price-integer {
          font-size: 1.35rem;
          line-height: 1;
        }

        .amz-price-fraction {
          font-size: 0.75rem;
          margin-top: 2px;
        }

        .amz-delivery-info {
          font-size: 0.78rem;
          color: #565959;
          margin-bottom: 14px;
        }

        .amz-prime-tag {
          color: #00a8e1;
          font-weight: 800;
          font-style: italic;
          margin-right: 4px;
        }

        .amz-add-cart-btn {
          margin-top: auto;
          background: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f1111;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 2px 5px rgba(213,217,217,0.5);
          transition: background 0.15s;
        }

        .amz-add-cart-btn:hover {
          background: #f7ca00;
          border-color: #f2c200;
        }

        .amz-add-cart-btn:disabled {
          background: #e7e7e7;
          border-color: #ddd;
          color: #888;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
