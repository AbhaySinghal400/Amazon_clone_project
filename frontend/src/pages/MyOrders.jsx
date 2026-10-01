import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { FaBoxOpen, FaRegCalendarAlt, FaCreditCard, FaMoneyBillWave, FaTimes } from 'react-icons/fa';

const MyOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(() => (
    new URLSearchParams(window.location.search).has('success')
      ? 'Your order has been placed successfully! 🎉'
      : ''
  ));

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders/my-orders');
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    api.get('/api/orders/my-orders')
      .then(({ data }) => {
        if (isActive) setOrders(data.orders);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('success')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This will restore stock inventory.')) {
      setCancellingId(orderId);
      try {
        await api.put(`/api/orders/${orderId}/cancel`);
        setSuccessMsg('Order cancelled successfully.');
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || 'Error cancelling order');
      } finally {
        setCancellingId(null);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="container orders-page animate-fade-in">
      <h1>Your Orders</h1>

      {successMsg && (
        <div className="alert alert-success flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem', padding: '1rem 1.5rem' }}>
          <span>{successMsg}</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success-color)' }} onClick={() => setSuccessMsg('')}>
            <FaTimes />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex-center" style={{ height: '50vh' }}>Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="card empty-orders text-center" style={{ padding: '4rem 2rem' }}>
          <FaBoxOpen className="empty-icon" />
          <h2>You haven't placed any orders yet</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Check out our catalog to find items and place your first order.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Browse Products</a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="card order-card">
              {/* Order Header bar */}
              <div className="order-card-header flex-center">
                <div className="header-info flex-center">
                  <div>
                    <span className="label">Order Placed</span>
                    <span className="val flex-center" style={{ gap: '0.4rem' }}><FaRegCalendarAlt /> {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="label">Total Price</span>
                    <span className="val">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="label">Ship To</span>
                    <span className="val" title={`${order.shippingAddress.street}, ${order.shippingAddress.city}`}>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </div>
                </div>
                
                <div className="header-meta">
                  <span className="order-id">Order ID: #{order._id}</span>
                </div>
              </div>

              {/* Order Content */}
              <div className="order-card-body">
                {/* Items details */}
                <div className="order-items-wrapper">
                  {order.items.map((item) => {
                    const product = item.product;
                    const imageUrl = product.images && product.images.length > 0
                      ? product.images[0]
                      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';

                    return (
                      <div key={item._id} className="order-item-row">
                        <div className="item-image flex-center">
                          <img src={imageUrl} alt={product.name} />
                        </div>
                        <div className="item-info">
                          <h4>{product.name}</h4>
                          <span className="brand">Brand: {product.brand}</span>
                          <span className="quantity">Quantity ordered: {item.quantity}</span>
                          <span className="price">Price: ₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Logistics status & cancellation side */}
                <div className="order-logistics-wrapper card">
                  <div className="status-row flex-center" style={{ justifyContent: 'space-between' }}>
                    <span>Order Status:</span>
                    <span className={`badge ${getStatusBadgeClass(order.orderStatus)}`}>{order.orderStatus}</span>
                  </div>

                  <div className="status-row flex-center" style={{ justifyContent: 'space-between', marginTop: '0.75rem' }}>
                    <span>Payment Method:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {order.paymentMethod === 'Razorpay' ? <><FaCreditCard /> Razorpay</> : <><FaMoneyBillWave /> COD</>}
                    </span>
                  </div>

                  <div className="status-row flex-center" style={{ justifyContent: 'space-between', marginTop: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <span>Payment Status:</span>
                    <span className={`badge ${getStatusBadgeClass(order.paymentStatus)}`}>{order.paymentStatus}</span>
                  </div>

                  {/* Cancel button if order status is placed/packed */}
                  {['placed', 'packed'].includes(order.orderStatus) && (
                    <button 
                      className="btn btn-outline cancel-btn flex-center"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      style={{ width: '100%', marginTop: '1.25rem', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}
                    >
                      <FaTimes /> {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .orders-page {
          padding-top: 2rem;
        }

        .orders-page h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 2rem;
        }

        .empty-orders {
          padding: 4rem 2rem !important;
        }

        .empty-icon {
          font-size: 4rem;
          color: var(--border-color);
          margin-bottom: 1.5rem;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .order-card {
          padding: 0 !important;
          overflow: hidden;
        }

        .order-card-header {
          background-color: #f6f6f6;
          border-bottom: 1px solid var(--border-color);
          padding: 1rem 1.5rem;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-info {
          gap: 2.5rem;
          flex-wrap: wrap;
        }

        .header-info .label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
        }

        .header-info .val {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-color);
          margin-top: 0.2rem;
        }

        .header-meta {
          text-align: right;
        }

        .order-id {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-family: monospace;
        }

        .order-card-body {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 2rem;
        }

        @media (max-width: 800px) {
          .order-card-body {
            grid-template-columns: 1fr;
          }
        }

        .order-items-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .order-item-row {
          display: flex;
          gap: 1.25rem;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 1.25rem;
        }

        .order-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .item-image {
          width: 80px;
          height: 80px;
          background-color: #f7f7f7;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          padding: 0.25rem;
          flex-shrink: 0;
        }

        .item-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .item-info {
          display: flex;
          flex-direction: column;
        }

        .item-info h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 0.2rem;
        }

        .item-info .brand {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .item-info .quantity {
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .item-info .price {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .order-logistics-wrapper {
          padding: 1.25rem !important;
          box-shadow: none !important;
          background-color: #fafbfc;
          height: fit-content;
        }

        .status-row {
          font-size: 0.85rem;
        }

        .cancel-btn:hover {
          background-color: rgba(186, 9, 51, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
