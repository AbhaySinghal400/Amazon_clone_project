import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ReviewSection = ({ productId, onReviewAdded }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/api/reviews/product/${productId}`);
      setReviews(data.reviews);
    } catch (err) {
      console.error('Error fetching reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    api.get(`/api/reviews/product/${productId}`)
      .then(({ data }) => {
        if (isActive) setReviews(data.reviews);
      })
      .catch((err) => {
        console.error('Error fetching reviews', err);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please add a comment review');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post(`/api/reviews/${productId}`, { rating, comment });
      setSuccess('Review added successfully!');
      setComment('');
      setRating(5);
      fetchReviews();
      if (onReviewAdded) onReviewAdded(); // Triggers parent reload of product avg ratings
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting review. You may have already reviewed this product.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarsSelector = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} onClick={() => setRating(i)} style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '4px' }}>
          {i <= rating ? <FaStar style={{ color: '#ffa41c' }} /> : <FaRegStar style={{ color: '#ffa41c' }} />}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="reviews-section animate-fade-in">
      <h2>Customer reviews</h2>
      
      <div className="reviews-layout">
        {/* Left Side: Submit form (if logged in & not seller/admin) */}
        <div className="review-form-container">
          {user ? (
            user.role === 'customer' ? (
              <form onSubmit={handleSubmit} className="card review-form">
                <h3>Write a customer review</h3>
                
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-group" style={{ margin: '1rem 0' }}>
                  <label className="form-label">Overall Rating</label>
                  <div className="flex-center" style={{ justifyContent: 'flex-start' }}>{renderStarsSelector()}</div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="review-comment">Add a written review</label>
                  <textarea
                    id="review-comment"
                    className="form-control"
                    rows="4"
                    placeholder="What did you like or dislike? How was the quality?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit review'}
                </button>
              </form>
            ) : (
              <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>
                Sellers and Administrators are not permitted to submit reviews.
              </div>
            )
          ) : (
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Log in to write a product review.</p>
              <a href="/login" className="btn btn-outline" style={{ width: '100%' }}>Sign In</a>
            </div>
          )}
        </div>

        {/* Right Side: Reviews List */}
        <div className="reviews-list">
          <h3>Customer comments</h3>
          
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '1rem' }}>No reviews submitted yet for this product. Be the first to review!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="review-item">
                <div className="reviewer-info flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                  <div className="reviewer-avatar flex-center">{rev.user.name[0]}</div>
                  <span className="reviewer-name">{rev.user.name}</span>
                </div>
                <div className="review-meta flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem', margin: '0.4rem 0' }}>
                  <div className="stars flex-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      s <= rev.rating ? <FaStar key={s} style={{ color: '#ffa41c', fontSize: '0.85rem' }} /> : <FaRegStar key={s} style={{ color: '#ffa41c', fontSize: '0.85rem' }} />
                    ))}
                  </div>
                  <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="review-text">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .reviews-section {
          margin-top: 4rem;
          border-top: 1px solid var(--border-color);
          padding-top: 2rem;
        }

        .reviews-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .reviews-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 3rem;
        }

        @media (max-width: 800px) {
          .reviews-layout {
            grid-template-columns: 1fr;
          }
        }

        .review-form h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: var(--border-radius-sm);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .alert-danger {
          background-color: rgba(186, 9, 51, 0.1);
          color: var(--error-color);
          border: 1px solid rgba(186, 9, 51, 0.2);
        }

        .alert-success {
          background-color: rgba(0, 118, 0, 0.1);
          color: var(--success-color);
          border: 1px solid rgba(0, 118, 0, 0.2);
        }

        .review-item {
          border-bottom: 1px solid var(--border-color);
          padding: 1.5rem 0;
        }

        .review-item:first-of-type {
          padding-top: 0.5rem;
        }

        .reviewer-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--secondary-color);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .reviewer-name {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .review-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .review-text {
          font-size: 0.95rem;
          color: var(--text-color);
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default ReviewSection;
