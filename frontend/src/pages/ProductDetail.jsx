import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContextValue';
import { useWishlist } from '../context/WishlistContextValue';
import { useAuth } from '../context/AuthContextValue';
import { useLocationContext } from '../context/LocationContextValue';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { 
  FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaShoppingCart, 
  FaBolt, FaShieldAlt, FaTruck, FaUndo, FaAward, FaLock, 
  FaChevronRight, FaPercent, FaRegCreditCard, FaTag, FaMapMarkerAlt 
} from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Review submission state
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const { addToCart } = useCart();
  const { toggleWishlist, hasItem } = useWishlist();
  const { user } = useAuth();
  const { location: deliveryLocation, isLiveDetected, openLocationModal } = useLocationContext();
  const isWishlisted = product ? hasItem(product._id) : false;

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/api/products/${id}`);
        const data = response.data;
        
        if (data) {
          setProduct(data);
          const initialImg = data.image || (data.images && data.images.length > 0 ? data.images[0] : '');
          setSelectedImage(initialImg);

          // Fetch related products
          const relatedRes = await api.get('/api/products?limit=5');
          const relData = Array.isArray(relatedRes.data) ? relatedRes.data : (relatedRes.data?.products || []);
          setRelatedProducts(relData.filter(p => p._id !== id));

          // Fetch reviews
          try {
            const revRes = await api.get(`/api/reviews/product/${id}`);
            if (revRes.data && revRes.data.reviews) {
              setReviews(revRes.data.reviews);
            }
          } catch {
            // Reviews fallback
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error(err);
        setError('Server error loading product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const result = await addToCart(product, qty);
    if (result && !result.success) {
      alert(result.message);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(product, qty);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Please write your review comment');
      return;
    }
    setReviewError('');
    setReviewSuccess('');
    setSubmittingReview(true);

    try {
      await api.post(`/api/reviews/${id}`, { 
        rating: reviewRating, 
        comment: reviewComment,
        title: reviewTitle 
      });
      setReviewSuccess('Thank you! Your review has been submitted.');
      setReviewComment('');
      setReviewTitle('');
      setReviewRating(5);
      
      // Refresh reviews
      const revRes = await api.get(`/api/reviews/product/${id}`);
      if (revRes.data && revRes.data.reviews) {
        setReviews(revRes.data.reviews);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review. You may have already reviewed this product.');
    } finally {
      setSubmittingReview(false);
    }
  };

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

  if (loading) {
    return (
      <div className="amz-detail-loading flex-center">
        <div className="amz-spinner"></div>
        <p style={{ marginTop: '1rem', fontWeight: 600, color: '#555' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textCenter: 'center' }}>
        <h2>{error || 'Product not found'}</h2>
        <Link to="/" className="amz-cta-yellow" style={{ marginTop: '1rem', display: 'inline-block' }}>Return to Homepage</Link>
      </div>
    );
  }

  const listPrice = Math.round(product.price * 1.12);
  const discountPercent = 12;
  const mainImage = selectedImage || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
  
  // Gallery thumbnails
  const galleryImages = [
    mainImage,
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="amz-detail-wrapper">
      
      {/* Top Breadcrumb Bar */}
      <div className="container amz-breadcrumb">
        <Link to="/">Home</Link> <FaChevronRight className="crumb-arrow" />
        <Link to={`/search?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> <FaChevronRight className="crumb-arrow" />
        <span className="crumb-current">{product.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="container amz-detail-hero">
        
        {/* Column 1: Image Gallery */}
        <div className="amz-gallery-col">
          <div className="amz-thumbs-list">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumb-box ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
                onMouseEnter={() => setSelectedImage(img)}
              >
                <img 
                  src={img} 
                  alt="thumbnail" 
                  onError={(e) => { e.target.onerror = null; e.target.src = mainImage; }} 
                />
              </div>
            ))}
          </div>

          <div className="amz-main-image-box flex-center">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="amz-main-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
              }} 
            />
            <span className="amz-image-hover-tag">Roll over image to zoom in</span>
          </div>
        </div>

        {/* Column 2: Product Overview & Specifications */}
        <div className="amz-info-col">
          <h1 className="amz-detail-title">{product.name}</h1>
          
          <div className="amz-brand-store">
            <Link to={`/search?keyword=${encodeURIComponent(product.brand)}`}>Visit the {product.brand} Store</Link>
          </div>

          {/* Ratings & Choice Badge */}
          <div className="amz-ratings-row">
            <div className="stars flex-center">{renderStars(product.rating || 4.5)}</div>
            <span className="rating-score">{product.rating || 4.5}</span>
            <a href="#customer-reviews" className="rating-count">{product.numReviews || 18} ratings</a>
            <span className="amz-badge-choice">Amazon's <span>Choice</span></span>
          </div>

          <hr className="amz-detail-divider" />

          {/* Pricing Block */}
          <div className="amz-price-box">
            <div className="discount-pill">-{discountPercent}%</div>
            <div className="price-main">
              <span className="currency">₹</span>
              <span className="price-integer">{Math.floor(product.price).toLocaleString('en-IN')}</span>
              <span className="price-fraction">{product.price % 1 === 0 ? '00' : Math.round((product.price % 1) * 100)}</span>
            </div>
          </div>

          <div className="amz-mrp-row">
            M.R.P.: <span className="mrp-strikethrough">₹{listPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="amz-tax-inclusive">Inclusive of all taxes</div>

          {/* Offers & Bank Discounts Box */}
          <div className="amz-offers-box">
            <div className="offers-header">
              <FaPercent className="offer-icon" />
              <span>Offers & Bank Discounts</span>
            </div>

            <div className="offers-grid">
              <div className="offer-card">
                <div className="offer-card-title"><FaRegCreditCard /> Bank Offer</div>
                <div className="offer-card-desc">Upto ₹1,500 Discount on HDFC Credit Cards</div>
              </div>

              <div className="offer-card">
                <div className="offer-card-title"><FaTag /> No Cost EMI</div>
                <div className="offer-card-desc">Avail No Cost EMI on select cards</div>
              </div>

              <div className="offer-card">
                <div className="offer-card-title"><FaBolt /> Partner Offer</div>
                <div className="offer-card-desc">Get up to ₹500 cashback with Amazon Pay</div>
              </div>
            </div>
          </div>

          {/* Guarantees Grid */}
          <div className="amz-guarantees-row">
            <div className="guarantee-item">
              <FaUndo className="g-icon" />
              <span>7 days Replacement</span>
            </div>
            <div className="guarantee-item">
              <FaTruck className="g-icon" />
              <span>Free Delivery</span>
            </div>
            <div className="guarantee-item">
              <FaShieldAlt className="g-icon" />
              <span>1 Year Warranty</span>
            </div>
            <div className="guarantee-item">
              <FaAward className="g-icon" />
              <span>Top Brand</span>
            </div>
          </div>

          <hr className="amz-detail-divider" />

          {/* Specifications Table */}
          <div className="amz-specs-table">
            <h3>Product Specifications</h3>
            <div className="spec-row"><span className="spec-label">Brand</span><span className="spec-val">{product.brand}</span></div>
            <div className="spec-row"><span className="spec-label">Category</span><span className="spec-val">{product.category}</span></div>
            <div className="spec-row"><span className="spec-label">Stock Status</span><span className="spec-val">{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span></div>
            <div className="spec-row"><span className="spec-label">Model Year</span><span className="spec-val">2024 Latest Edition</span></div>
          </div>

          <hr className="amz-detail-divider" />

          {/* About this item */}
          <div className="amz-about-section">
            <h3>About this item</h3>
            <ul className="about-bullets">
              <li>{product.description}</li>
              <li>Engineered with premium materials and high durability standards.</li>
              <li>Includes official brand warranty and dedicated customer service support.</li>
              <li>Eligible for Amazon Prime free express delivery.</li>
            </ul>
          </div>

        </div>

        {/* Column 3: Amazon Buy Box */}
        <div className="amz-buybox-col">
          <div className="buybox-price-row">
            <span className="currency">₹</span>
            <span className="price-val">{Math.floor(product.price).toLocaleString('en-IN')}</span>
          </div>

          <div className="buybox-delivery-info">
            <span className="prime-tag">prime</span> 
            <strong> FREE delivery</strong> 
            <div className="del-date" style={{ color: '#007185', fontWeight: 700, fontSize: '0.95rem', margin: '4px 0' }}>
              {(() => {
                const d = new Date();
                d.setDate(d.getDate() + 2);
                return `${d.toLocaleDateString('en-IN', { weekday: 'long' })}, ${d.getDate()} ${d.toLocaleDateString('en-IN', { month: 'long' })}`;
              })()}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#565959', marginBottom: '6px' }}>
              Or fastest delivery <strong>Tomorrow by 8 PM</strong>. Order within <strong>3 hrs 20 mins</strong>.
            </div>
            <div 
              className="del-loc" 
              onClick={openLocationModal}
              style={{ 
                borderTop: '1px solid #e7e7e7', 
                paddingTop: '6px', 
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              title="Click to detect Near Me location or change delivery PIN"
            >
              <div>
                <FaMapMarkerAlt style={{ color: '#007185', marginRight: '4px' }} /> 
                Delivering to <strong>{deliveryLocation}</strong>
                {isLiveDetected && (
                  <span style={{ marginLeft: '6px', background: '#e6f4ea', color: '#137333', fontSize: '0.72rem', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                    GPS Live
                  </span>
                )}
              </div>
              <span style={{ color: '#007185', fontSize: '0.78rem', textDecoration: 'underline' }}>Change</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0f8ff', color: '#005870', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, marginTop: '8px' }}>
              <FaTruck /> Live Order Tracking Included
            </div>
          </div>

          <div className={`buybox-stock ${product.countInStock > 0 ? 'in' : 'out'}`}>
            {product.countInStock > 0 ? 'In Stock' : 'Currently Unavailable'}
          </div>

          {product.countInStock > 0 && (
            <div className="buybox-actions">
              
              {/* Quantity Selector */}
              <div className="qty-row">
                <label htmlFor="product-detail-qty">Quantity:</label>
                <select 
                  id="product-detail-qty" 
                  name="quantity" 
                  aria-label="Quantity" 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Add to Cart Button */}
              <button 
                className="amz-cta-yellow block-btn"
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Add to Cart
              </button>

              {/* Buy Now Button */}
              <button 
                className="amz-cta-orange block-btn"
                onClick={handleBuyNow}
              >
                <FaBolt /> Buy Now
              </button>

            </div>
          )}

          {/* Merchant Info */}
          <div className="buybox-merchant">
            <div className="m-row"><span>Ships from</span><strong>Amazon</strong></div>
            <div className="m-row"><span>Sold by</span><strong>{product.brand} Authorized Retail</strong></div>
          </div>

          {/* Wishlist Button */}
          <button 
            className="buybox-wishlist-btn"
            onClick={(e) => {
              e.preventDefault();
              if (!user) navigate('/login');
              else toggleWishlist(product._id);
            }}
          >
            <FaHeart style={{ color: isWishlisted ? '#ff4f4f' : '#767676', marginRight: '6px' }} />
            {isWishlisted ? 'Added to Wish List' : 'Add to Wish List'}
          </button>

          <div className="buybox-secure">
            <FaLock /> <span>Secure transaction</span>
          </div>
        </div>

      </div>

      {/* Related Products Carousel Section */}
      {relatedProducts.length > 0 && (
        <div className="container amz-related-section">
          <h2>Customers who viewed this item also viewed</h2>
          <div className="related-grid">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews & Ratings Section */}
      <div className="container amz-reviews-section" id="customer-reviews">
        <h2>Customer Reviews</h2>

        <div className="reviews-layout-grid">
          
          {/* Rating Summary Breakdown */}
          <div className="reviews-summary-card">
            <div className="avg-rating-big">
              <span>{product.rating || 4.5}</span>
              <div className="stars flex-center">{renderStars(product.rating || 4.5)}</div>
            </div>
            <p className="summary-count">{product.numReviews || 18} global ratings</p>

            <div className="rating-bars">
              <div className="bar-row"><span>5 star</span><div className="bar-track"><div className="bar-fill" style={{ width: '82%' }}></div></div><span>82%</span></div>
              <div className="bar-row"><span>4 star</span><div className="bar-track"><div className="bar-fill" style={{ width: '12%' }}></div></div><span>12%</span></div>
              <div className="bar-row"><span>3 star</span><div className="bar-track"><div className="bar-fill" style={{ width: '4%' }}></div></div><span>4%</span></div>
              <div className="bar-row"><span>2 star</span><div className="bar-track"><div className="bar-fill" style={{ width: '1%' }}></div></div><span>1%</span></div>
              <div className="bar-row"><span>1 star</span><div className="bar-track"><div className="bar-fill" style={{ width: '1%' }}></div></div><span>1%</span></div>
            </div>

            <hr style={{ margin: '1.5rem 0', borderColor: '#e7e7e7' }} />

            {/* Submit Review Section */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="write-review-form">
                <h4>Write a customer review</h4>
                {reviewError && <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>{reviewError}</div>}
                {reviewSuccess && <div className="alert alert-success" style={{ fontSize: '0.85rem' }}>{reviewSuccess}</div>}

                <div className="form-group">
                  <label>Overall rating</label>
                  <div className="stars-input">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} onClick={() => setReviewRating(s)} style={{ cursor: 'pointer', fontSize: '1.4rem', marginRight: '4px' }}>
                        {s <= reviewRating ? <FaStar style={{ color: '#ffa41c' }} /> : <FaRegStar style={{ color: '#ffa41c' }} />}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-headline">Add a headline</label>
                  <input 
                    id="review-headline"
                    name="headline"
                    type="text" 
                    placeholder="What's most important to know?"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="review-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review-text">Add a written review</label>
                  <textarea 
                    id="review-text"
                    name="comment"
                    rows="3" 
                    placeholder="What did you like or dislike? What did you use this product for?"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="review-input"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="amz-cta-yellow block-btn" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="review-login-prompt">
                <p>Have you used this product?</p>
                <Link to="/login" className="amz-cta-yellow block-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Sign in to write a review</Link>
              </div>
            )}
          </div>

          {/* Customer Reviews List */}
          <div className="reviews-list-card">
            <h3>Top reviews from India</h3>

            {reviews.length === 0 ? (
              <div className="review-card">
                <div className="user-name">Rohan Sharma <span className="verified-badge">Verified Purchase</span></div>
                <div className="rev-stars">{renderStars(5)} <strong>Exceptional quality & performance!</strong></div>
                <div className="rev-date">Reviewed in India on 28 September 2024</div>
                <p className="rev-text">
                  Absolutely worth every rupee! The build quality and speed exceed expectations. Battery life is fantastic and delivery was super fast. Highly recommended.
                </p>
              </div>
            ) : (
              reviews.map((rev, i) => (
                <div key={rev._id || i} className="review-card">
                  <div className="user-name">{rev.name || 'Verified Customer'} <span className="verified-badge">Verified Purchase</span></div>
                  <div className="rev-stars">{renderStars(rev.rating)} <strong>{rev.title || 'Great product'}</strong></div>
                  <div className="rev-date">Reviewed in India on {new Date(rev.createdAt || Date.now()).toLocaleDateString()}</div>
                  <p className="rev-text">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      <style>{`
        .amz-detail-wrapper {
          background-color: #ffffff;
          min-height: 100vh;
          padding-bottom: 4rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .amz-detail-loading {
          min-height: 70vh;
          flex-direction: column;
        }

        .amz-breadcrumb {
          padding: 12px 1rem;
          font-size: 0.8rem;
          color: #565959;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .amz-breadcrumb a { color: #565959; text-decoration: none; }
        .amz-breadcrumb a:hover { color: #c7511f; text-decoration: underline; }
        .crumb-arrow { font-size: 0.65rem; color: #888; }
        .crumb-current { color: #111; font-weight: 600; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 400px; }

        /* Main Hero Grid */
        .amz-detail-hero {
          display: grid;
          grid-template-columns: 420px 1fr 280px;
          gap: 28px;
          padding-top: 1rem;
        }

        /* Column 1: Image Gallery */
        .amz-gallery-col {
          display: flex;
          gap: 16px;
        }

        .amz-thumbs-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .thumb-box {
          width: 50px;
          height: 50px;
          border: 1px solid #d5d9d9;
          border-radius: 4px;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s;
        }

        .thumb-box.active, .thumb-box:hover {
          border-color: #e77600;
          box-shadow: 0 0 3px 2px rgba(228,121,17,.3);
        }

        .thumb-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .amz-main-image-box {
          flex-grow: 1;
          height: 420px;
          border: 1px solid #e7e7e7;
          border-radius: 8px;
          position: relative;
          padding: 16px;
          overflow: hidden;
        }

        .amz-main-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .amz-main-image-box:hover .amz-main-image {
          transform: scale(1.15);
        }

        .amz-image-hover-tag {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          color: #767676;
          background: rgba(255,255,255,0.9);
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* Column 2: Overview & Specs */
        .amz-detail-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0f1111;
          line-height: 1.35;
          margin-bottom: 6px;
        }

        .amz-brand-store a {
          color: #007185;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
        }

        .amz-brand-store a:hover {
          color: #c7511f;
          text-decoration: underline;
        }

        .amz-ratings-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 10px 0;
          font-size: 0.85rem;
        }

        .rating-score { font-weight: 700; color: #0f1111; }
        .rating-count { color: #007185; text-decoration: none; }
        .rating-count:hover { color: #c7511f; text-decoration: underline; }

        .amz-badge-choice {
          background-color: #232f3e;
          color: #ffffff;
          padding: 3px 8px;
          font-size: 0.72rem;
          font-weight: 700;
          border-radius: 2px;
          margin-left: 8px;
        }

        .amz-badge-choice span { color: #febd69; }

        .amz-detail-divider {
          border: none;
          border-top: 1px solid #e7e7e7;
          margin: 14px 0;
        }

        /* Pricing */
        .amz-price-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .discount-pill {
          color: #cc0c39;
          font-size: 1.5rem;
          font-weight: 400;
        }

        .price-main {
          display: flex;
          align-items: flex-start;
          color: #0f1111;
          font-weight: 700;
          line-height: 1;
        }

        .price-main .currency { font-size: 0.85rem; margin-top: 4px; }
        .price-main .price-integer { font-size: 2rem; }
        .price-main .price-fraction { font-size: 0.85rem; margin-top: 4px; }

        .amz-mrp-row {
          font-size: 0.82rem;
          color: #565959;
          margin-top: 4px;
        }

        .mrp-strikethrough { text-decoration: line-through; }
        .amz-tax-inclusive { font-size: 0.8rem; color: #0f1111; margin-top: 2px; }

        /* Offers Box */
        .amz-offers-box {
          border: 1px solid #d5d9d9;
          border-radius: 8px;
          padding: 12px 16px;
          margin: 16px 0;
          background: #fafafa;
        }

        .offers-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 10px;
        }

        .offer-icon { color: #cc0c39; }

        .offers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .offer-card {
          background: #ffffff;
          border: 1px solid #e7e7e7;
          border-radius: 6px;
          padding: 10px;
          font-size: 0.78rem;
        }

        .offer-card-title {
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .offer-card-desc { color: #565959; }

        /* Guarantees Row */
        .amz-guarantees-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          text-align: center;
          padding: 10px 0;
        }

        .guarantee-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #007185;
          font-weight: 600;
        }

        .g-icon { font-size: 1.4rem; color: #007185; }

        /* Specs Table */
        .amz-specs-table h3, .amz-about-section h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 10px;
        }

        .spec-row {
          display: flex;
          padding: 6px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 0.85rem;
        }

        .spec-label { width: 140px; font-weight: 600; color: #565959; }
        .spec-val { color: #0f1111; font-weight: 500; }

        .about-bullets {
          padding-left: 20px;
          font-size: 0.88rem;
          color: #0f1111;
          line-height: 1.6;
        }

        .about-bullets li { margin-bottom: 6px; }

        /* Column 3: Buy Box */
        .amz-buybox-col {
          border: 1px solid #d5d9d9;
          border-radius: 8px;
          padding: 20px;
          height: fit-content;
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .buybox-price-row {
          display: flex;
          align-items: flex-start;
          color: #b12704;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .buybox-price-row .currency { font-size: 0.9rem; margin-top: 2px; }
        .buybox-price-row .price-val { font-size: 1.6rem; line-height: 1; }

        .buybox-delivery-info {
          font-size: 0.85rem;
          color: #0f1111;
          margin-bottom: 16px;
        }

        .prime-tag { color: #00a8e1; font-weight: 800; font-style: italic; }
        .del-date { color: #007600; font-weight: 700; margin-top: 4px; }
        .del-loc { font-size: 0.8rem; color: #565959; margin-top: 4px; }

        .buybox-stock {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .buybox-stock.in { color: #007600; }
        .buybox-stock.out { color: #b12704; }

        .qty-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          margin-bottom: 14px;
        }

        .qty-row select {
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid #d5d9d9;
          background: #f0f2f2;
          font-weight: 600;
          cursor: pointer;
        }

        .block-btn {
          width: 100%;
          padding: 10px 0;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.88rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .amz-cta-yellow {
          background: #ffd814;
          border: 1px solid #fcd200;
          color: #0f1111;
        }
        .amz-cta-yellow:hover { background: #f7ca00; }

        .amz-cta-orange {
          background: #ffa41c;
          border: 1px solid #ff8f00;
          color: #0f1111;
        }
        .amz-cta-orange:hover { background: #fa8900; }

        .buybox-merchant {
          font-size: 0.8rem;
          color: #565959;
          border-top: 1px solid #f0f0f0;
          padding-top: 12px;
          margin-top: 12px;
        }

        .m-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .m-row strong { color: #0f1111; }

        .buybox-wishlist-btn {
          width: 100%;
          background: #f7f8f8;
          border: 1px solid #d5d9d9;
          border-radius: 4px;
          padding: 8px 0;
          font-size: 0.82rem;
          font-weight: 600;
          color: #0f1111;
          cursor: pointer;
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .buybox-wishlist-btn:hover { background: #e7e7e7; }

        .buybox-secure {
          font-size: 0.8rem;
          color: #007185;
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Related Section */
        .amz-related-section {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid #e7e7e7;
        }

        .amz-related-section h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 20px;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        /* Reviews Section */
        .amz-reviews-section {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid #e7e7e7;
        }

        .amz-reviews-section h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 24px;
        }

        .reviews-layout-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
        }

        .avg-rating-big {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f1111;
          line-height: 1;
        }

        .summary-count {
          font-size: 0.85rem;
          color: #565959;
          margin: 6px 0 16px 0;
        }

        .rating-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: #007185;
        }

        .bar-track {
          flex-grow: 1;
          height: 16px;
          background: #f0f2f2;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #d5d9d9;
        }

        .bar-fill {
          height: 100%;
          background: #ffa41c;
        }

        .write-review-form h4, .reviews-list-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 14px;
        }

        .form-group { margin-bottom: 14px; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; }

        .review-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #888C8C;
          border-radius: 4px;
          font-size: 0.9rem;
          outline: none;
        }

        .review-input:focus {
          border-color: #e77600;
          box-shadow: 0 0 3px 2px rgba(228,121,17,.3);
        }

        .review-card {
          border-bottom: 1px solid #e7e7e7;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .verified-badge {
          color: #c45500;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .rev-stars {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .rev-date {
          font-size: 0.78rem;
          color: #565959;
          margin-bottom: 10px;
        }

        .rev-text {
          font-size: 0.9rem;
          color: #0f1111;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .amz-detail-hero {
            grid-template-columns: 1fr;
          }
          .reviews-layout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
