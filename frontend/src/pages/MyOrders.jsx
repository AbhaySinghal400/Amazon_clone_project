import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { 
  FaBoxOpen, 
  FaRegCalendarAlt, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaTimes, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaMapMarkerAlt,
  FaBox,
  FaRoute
} from 'react-icons/fa';

const MyOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [successMsg, setSuccessMsg] = useState(() => (
    new URLSearchParams(window.location.search).has('success')
      ? 'Your order has been placed successfully! 🎉'
      : ''
  ));

  const getOrderDeliveryDate = (order) => {
    if (order.estimatedDeliveryDate) {
      const d = new Date(order.estimatedDeliveryDate);
      return `${d.toLocaleDateString('en-IN', { weekday: 'long' })}, ${d.getDate()} ${d.toLocaleDateString('en-IN', { month: 'long' })}`;
    }
    const created = new Date(order.createdAt || Date.now());
    created.setDate(created.getDate() + 3);
    return `${created.toLocaleDateString('en-IN', { weekday: 'long' })}, ${created.getDate()} ${created.toLocaleDateString('en-IN', { month: 'long' })}`;
  };

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
                    <span className="val" title={`${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}`}>
                      {order.shippingAddress?.fullName || 'Customer'} ({order.shippingAddress?.city || 'India'})
                    </span>
                  </div>
                </div>
                
                <div className="header-meta">
                  <span className="order-id">Order ID: #{order._id}</span>
                </div>
              </div>

              {/* Order Content */}
              <div className="order-card-body">
                {/* Delivery Date & Live Tracking Bar */}
                <div className="order-delivery-banner" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafafa' }}>
                  {order.orderStatus?.toLowerCase() === 'cancelled' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cc0c39', fontWeight: 700, fontSize: '1.1rem' }}>
                      <FaTimesCircle /> <span>Order Cancelled</span>
                    </div>
                  ) : order.isDelivered || order.orderStatus === 'Delivered' ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007600', fontWeight: 700, fontSize: '1.15rem' }}>
                        <FaCheckCircle /> <span>Delivered on {getOrderDeliveryDate(order)}</span>
                      </div>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#565959' }}>
                        Package was delivered directly to your address
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#007600', fontWeight: 700, fontSize: '1.15rem' }}>
                        <FaTruck /> <span>Arriving by {getOrderDeliveryDate(order)}</span>
                      </div>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#565959' }}>
                        Tracking ID: <strong>{order.trackingNumber || `AMZ-IN-${order._id.slice(-8).toUpperCase()}`}</strong> • Carrier: {order.carrier || 'Amazon Logistics'}
                      </p>
                    </div>
                  )}

                  {order.orderStatus?.toLowerCase() !== 'cancelled' && (
                    <div className="tracker-timeline-bar" style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>
                      <div style={{ position: 'relative', height: '6px', backgroundColor: '#e7e7e7', borderRadius: '3px', margin: '0 10px' }}>
                        <div 
                          style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            height: '100%', 
                            backgroundColor: '#007600', 
                            borderRadius: '3px',
                            transition: 'width 0.4s ease',
                            width: (order.isDelivered || order.orderStatus === 'Delivered') ? '100%' 
                              : order.orderStatus === 'Out for Delivery' ? '75%' 
                              : order.orderStatus === 'Shipped' ? '50%' 
                              : order.orderStatus === 'Packed' ? '30%' 
                              : '15%' 
                          }}
                        ></div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.78rem', color: '#565959' }}>
                        <span style={{ fontWeight: 600, color: '#007600' }}>● Ordered</span>
                        <span style={{ fontWeight: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 700 : 400, color: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? '#007600' : 'inherit' }}>
                          ● Shipped
                        </span>
                        <span style={{ fontWeight: ['Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 700 : 400, color: ['Out for Delivery', 'Delivered'].includes(order.orderStatus) ? '#007600' : 'inherit' }}>
                          ● Out for Delivery
                        </span>
                        <span style={{ fontWeight: (order.isDelivered || order.orderStatus === 'Delivered') ? 700 : 400, color: (order.isDelivered || order.orderStatus === 'Delivered') ? '#007600' : 'inherit' }}>
                          ● Delivered
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1.5rem' }}>
                  {/* Items details */}
                  <div className="order-items-wrapper" style={{ flex: '1 1 500px' }}>
                    {(order.orderItems || order.items || []).map((item, idx) => {
                      const itemName = item.name || item.product?.name || 'Amazon Product';
                      const imageUrl = item.image || (item.product?.images && item.product?.images.length > 0
                        ? item.product.images[0]
                        : (item.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'));
                      const itemQty = item.qty || item.quantity || 1;
                      const itemPrice = item.price || 0;

                      return (
                        <div key={item._id || idx} className="order-item-row">
                          <div className="item-image flex-center">
                            <img src={imageUrl} alt={itemName} />
                          </div>
                          <div className="item-info">
                            <h4>{itemName}</h4>
                            <span className="quantity">Quantity: {itemQty}</span>
                            <span className="price">Price: ₹{Number(itemPrice).toLocaleString('en-IN')}</span>
                            <div style={{ marginTop: '4px', fontSize: '0.8rem', color: '#007600' }}>
                              <FaTruck style={{ marginRight: '4px' }} /> Estimated Delivery: {getOrderDeliveryDate(order)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Logistics status & cancellation side */}
                  <div className="order-logistics-wrapper card" style={{ flex: '0 0 280px', height: 'fit-content' }}>
                    <div className="status-row flex-center" style={{ justifyContent: 'space-between' }}>
                      <span>Order Status:</span>
                      <span className={`badge ${order.orderStatus?.toLowerCase() === 'cancelled' ? 'badge-danger' : getStatusBadgeClass(order.isDelivered ? 'delivered' : 'placed')}`}>
                        {order.isDelivered ? 'Delivered' : (order.orderStatus || 'Placed')}
                      </span>
                    </div>

                    <div className="status-row flex-center" style={{ justifyContent: 'space-between', marginTop: '0.75rem' }}>
                      <span>Payment Method:</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {(order.paymentMethod || '').toLowerCase().includes('paytm') ? (
                          <span style={{ background: '#002e6e', color: '#00baf2', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                            Paytm UPI
                          </span>
                        ) : (order.paymentMethod || '').toLowerCase().includes('card') ? (
                          <><FaCreditCard style={{ color: '#007185' }} /> Card</>
                        ) : (
                          <><FaMoneyBillWave style={{ color: '#007600' }} /> {order.paymentMethod || 'Cash on Delivery'}</>
                        )}
                      </span>
                    </div>

                    <div className="status-row flex-center" style={{ justifyContent: 'space-between', marginTop: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                      <span>Payment Status:</span>
                      <span className={`badge ${order.isPaid || order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-pending'}`}>
                        {order.paymentStatus || (order.isPaid ? 'Paid' : 'Pending')}
                      </span>
                    </div>

                    {/* Track Package Button */}
                    {order.orderStatus?.toLowerCase() !== 'cancelled' && (
                      <button 
                        className="btn btn-primary track-btn flex-center"
                        onClick={() => setTrackingOrder(order)}
                        style={{ width: '100%', marginTop: '1rem', gap: '0.4rem', fontWeight: 700 }}
                      >
                        <FaRoute /> Track Package
                      </button>
                    )}

                    {/* Cancel button for active orders */}
                    {!order.isDelivered && (order.orderStatus || 'Placed').toLowerCase() !== 'cancelled' && (
                      <button 
                        className="btn btn-outline cancel-btn flex-center"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        style={{ width: '100%', marginTop: '0.75rem', borderColor: '#cc0c39', color: '#cc0c39', fontWeight: 600 }}
                      >
                        <FaTimes /> {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Track Package Modal */}
      {trackingOrder && (
        <div 
          className="tracking-modal-overlay flex-center" 
          onClick={() => setTrackingOrder(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div 
            className="tracking-modal-card animate-fade-in" 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 12px 36px rgba(0,0,0,0.25)'
            }}
          >
            <div className="flex-center" style={{ justifyContent: 'space-between', borderBottom: '1px solid #e7e7e7', padding: '1rem 1.5rem', backgroundColor: '#f6f6f6' }}>
              <div>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#131921', fontSize: '1.2rem' }}>
                  <FaTruck style={{ color: '#007185' }} /> Package Tracking
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#565959' }}>
                  Carrier: <strong>{trackingOrder.carrier || 'Amazon Logistics'}</strong> • ID: <strong>{trackingOrder.trackingNumber || `AMZ-IN-${trackingOrder._id.slice(-8).toUpperCase()}`}</strong>
                </p>
              </div>
              <button 
                onClick={() => setTrackingOrder(null)} 
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#555' }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Delivery ETA Callout */}
              <div style={{ background: '#f0f8ff', border: '1px solid #cce5ff', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#007600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {trackingOrder.isDelivered || trackingOrder.orderStatus === 'Delivered' ? (
                    <><FaCheckCircle /> Package Delivered</>
                  ) : (
                    <><FaTruck /> Estimated Delivery: {getOrderDeliveryDate(trackingOrder)}</>
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#333', marginTop: '6px' }}>
                  Shipping Address: <strong>{trackingOrder.shippingAddress?.fullName}</strong>, {trackingOrder.shippingAddress?.city || 'India'}
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="tracking-milestones-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#007600', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaCheckCircle />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Order Placed & Confirmed</strong>
                    <span style={{ fontSize: '0.83rem', color: '#565959' }}>Payment verified. Transmitted to Amazon Fulfillment Center.</span>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>{new Date(trackingOrder.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(trackingOrder.orderStatus) ? '#007600' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaBoxOpen />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Packed at Amazon Hub</strong>
                    <span style={{ fontSize: '0.83rem', color: '#565959' }}>Items sorted, quality checked, and packaged for courier dispatch.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: ['Shipped', 'Out for Delivery', 'Delivered'].includes(trackingOrder.orderStatus) ? '#007600' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaTruck />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>In Transit ({trackingOrder.carrier || 'Amazon Logistics'})</strong>
                    <span style={{ fontSize: '0.83rem', color: '#565959' }}>Package in transit to local delivery hub near your pincode.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: ['Out for Delivery', 'Delivered'].includes(trackingOrder.orderStatus) ? '#007600' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaRoute />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Out for Delivery</strong>
                    <span style={{ fontSize: '0.83rem', color: '#565959' }}>Delivery associate is out for delivery with your package.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: (trackingOrder.isDelivered || trackingOrder.orderStatus === 'Delivered') ? '#007600' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaCheckCircle />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Delivered</strong>
                    <span style={{ fontSize: '0.83rem', color: '#565959' }}>Package handed directly to resident at shipping address.</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e7e7e7', padding: '1rem 1.5rem', textAlign: 'right', background: '#fafafa' }}>
              <button className="btn btn-primary" onClick={() => setTrackingOrder(null)}>
                Close
              </button>
            </div>
          </div>
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
