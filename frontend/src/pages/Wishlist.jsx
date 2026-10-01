import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContextValue';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';

const Wishlist = () => {
  const { wishlist, loading, toggleWishlist, moveWishlistToCart } = useWishlist();
  const [actingId, setActingId] = useState(null);

  const handleRemove = async (productId) => {
    setActingId(productId);
    const result = await toggleWishlist(productId);
    if (!result.success) {
      alert(result.message);
    }
    setActingId(null);
  };

  const handleMoveToCart = async (productId) => {
    setActingId(productId);
    const result = await moveWishlistToCart(productId);
    if (!result.success) {
      alert(result.message);
    }
    setActingId(null);
  };

  if (loading && !wishlist) {
    return <div className="flex-center" style={{ height: '70vh' }}>Loading wishlist...</div>;
  }

  const products = wishlist?.products || [];

  return (
    <div className="container wishlist-page animate-fade-in">
      <h1>Your Wishlist</h1>

      {products.length === 0 ? (
        <div className="card empty-wishlist text-center">
          <FaHeart className="empty-icon" />
          <h2>Your Wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Save items you want to buy later. Click the heart icon on any product to save it here.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Find products to add</Link>
        </div>
      ) : (
        <div className="wishlist-grid grid-responsive">
          {products.map((prod) => {
            const imageUrl = prod.images && prod.images.length > 0
              ? prod.images[0]
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';

            return (
              <div key={prod._id} className="card wishlist-item-card">
                {/* Image */}
                <Link to={`/product/${prod._id}`} className="wishlist-image flex-center">
                  <img src={imageUrl} alt={prod.name} />
                </Link>

                {/* Details */}
                <div className="wishlist-info">
                  <span className="brand">{prod.brand}</span>
                  <Link to={`/product/${prod._id}`} className="name">{prod.name}</Link>
                  <div className="price">₹{prod.price.toLocaleString('en-IN')}</div>
                  <div className={`stock ${prod.stock > 0 ? 'in' : 'out'}`}>
                    {prod.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="wishlist-actions flex-center" style={{ gap: '0.75rem', marginTop: '1rem', width: '100%' }}>
                  <button 
                    className="btn btn-primary add-cart-btn flex-center" 
                    onClick={() => handleMoveToCart(prod._id)}
                    disabled={actingId === prod._id || prod.stock <= 0}
                  >
                    <FaShoppingCart /> Move to Cart
                  </button>
                  <button 
                    className="btn btn-outline remove-wishlist-btn flex-center" 
                    onClick={() => handleRemove(prod._id)}
                    disabled={actingId === prod._id}
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .wishlist-page {
          padding-top: 2rem;
        }

        .wishlist-page h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 2rem;
        }

        .empty-wishlist {
          padding: 4rem 2rem !important;
        }

        .empty-icon {
          font-size: 4rem;
          color: #ffb4b4;
          margin-bottom: 1.5rem;
        }

        .wishlist-item-card {
          padding: 1.25rem !important;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .wishlist-image {
          background-color: #f7f7f7;
          height: 160px;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          padding: 0.5rem;
          margin-bottom: 1rem;
        }

        .wishlist-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .wishlist-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .wishlist-info .brand {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .wishlist-info .name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 0.25rem 0;
          height: 2.8rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .wishlist-info .price {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-top: auto;
        }

        .wishlist-info .stock {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .wishlist-info .stock.in { color: var(--success-color); }
        .wishlist-info .stock.out { color: var(--error-color); }

        .add-cart-btn {
          flex-grow: 1;
          font-size: 0.85rem;
          padding: 0.5rem !important;
          border-radius: 50px !important;
        }

        .remove-wishlist-btn {
          border-radius: 50% !important;
          width: 34px;
          height: 34px;
          padding: 0 !important;
          border-color: var(--border-color);
        }

        .remove-wishlist-btn:hover {
          background-color: rgba(186, 9, 51, 0.1) !important;
          color: var(--error-color) !important;
          border-color: var(--error-color) !important;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;
