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

  // Render Star Ratings (Spring Boot analogy: logic block helper)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} style={{ color: '#ffa41c' }} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} style={{ color: '#ffa41c' }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: '#ffa41c' }} />);
      }
    }
    return stars;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Stop navigation to detail page
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setAdding(true);
    const result = await addToCart(product._id, 1);
    if (!result.success) {
      alert(result.message);
    }
    setAdding(false);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault(); // Stop navigation to detail page
    if (!user) {
      window.location.href = '/login';
      return;
    }
    const result = await toggleWishlist(product._id);
    if (!result.success) {
      alert(result.message);
    }
  };

  // Safe fallback for images
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="card product-card">
      <Link to={`/product/${product._id}`} style={{ position: 'relative', display: 'block', overflow: 'hidden' }}>
        {/* Wishlist Heart Button */}
        <button 
          className="wishlist-btn" 
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <FaHeart style={{ color: isWishlisted ? '#ff4f4f' : '#b2b9c0' }} />
        </button>

        {/* Product Image */}
        <div className="product-image-container flex-center">
          <img src={imageUrl} alt={product.name} className="product-image" />
        </div>

        {/* Product Info */}
        <div className="product-info">
          <span className="product-brand">{product.brand}</span>
          <h3 className="product-name" title={product.name}>{product.name}</h3>
          
          {/* Ratings */}
          <div className="product-ratings flex-center" style={{ justifyContent: 'flex-start', gap: '0.4rem' }}>
            <div className="stars flex-center">{renderStars(product.ratings)}</div>
            <span className="reviews-count">({product.numReviews})</span>
          </div>

          {/* Pricing & Cart Button */}
          <div className="product-footer flex-center" style={{ justifyContent: 'space-between', marginTop: '1rem', width: '100%' }}>
            <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
            <button 
              className="btn btn-primary add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={adding || product.stock <= 0}
            >
              {product.stock <= 0 ? 'Out of Stock' : (
                adding ? 'Adding...' : <><FaShoppingCart /> Add</>
              )}
            </button>
          </div>
        </div>
      </Link>

      <style>{`
        .product-card {
          padding: 1rem;
          height: 100%;
        }

        .product-image-container {
          height: 200px;
          margin-bottom: 1rem;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background-color: #f7f7f7;
        }

        .product-image {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: var(--transition-smooth);
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .wishlist-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-smooth);
        }

        .wishlist-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .product-brand {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 500;
          color: var(--primary-color);
          margin: 0.25rem 0 0.5rem 0;
          height: 2.4rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .reviews-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .product-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .add-to-cart-btn {
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem;
          border-radius: 50px !important;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
