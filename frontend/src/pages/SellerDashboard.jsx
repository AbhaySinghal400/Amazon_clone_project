import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaStore, FaFileInvoiceDollar, FaChartLine, FaBox, FaClock, FaPlus, FaTrash, FaEdit, FaImage, FaUpload, FaCheck, FaTimes, FaTruck, FaRoute } from 'react-icons/fa';

const SellerDashboard = () => {
  const { user, refreshProfile } = useAuth();
  
  // Application/Onboarding state
  const [onboardingStatus, setOnboardingStatus] = useState('not_applied'); // not_applied, pending, approved, rejected
  const [sellerProfile, setSellerProfile] = useState(null);
  
  // Application form states
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  
  const [appError, setAppError] = useState('');
  const [appSuccess, setAppSuccess] = useState('');
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders
  
  // Dashboard data states
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal states for Product Add/Edit
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding new
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState('');
  
  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProductId, setUploadProductId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch onboarding status
  const checkOnboardingStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/api/sellers/status');
      setOnboardingStatus(data.status);
      setSellerProfile(data.seller);
      if (data.status === 'approved') {
        // If approved, fetch dashboard modules
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [analRes, prodRes, ordRes, catRes] = await Promise.all([
        api.get('/api/sellers/analytics'),
        api.get(`/api/products?limit=50`), // Fetch products
        api.get('/api/orders/seller-orders'),
        api.get('/api/categories')
      ]);
      setAnalytics(analRes.data.analytics);
      
      // Handle products, orders, and categories safely
      const rawProducts = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.products || []);
      setProducts(rawProducts);

      const rawOrders = Array.isArray(ordRes.data) ? ordRes.data : (ordRes.data?.orders || []);
      setOrders(rawOrders);

      const rawCategories = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.categories || []);
      setCategories(rawCategories);
    } catch (err) {
      console.error('Error fetching dashboard metrics', err);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, [user]);

  // Handle Application Submit
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!businessName || !gstin || !street || !city || !state || !zipCode || !accountNumber || !ifscCode || !bankName || !accountHolderName) {
      setAppError('Please fill in all onboarding fields');
      return;
    }
    setAppError('');
    setAppSuccess('');
    setActionLoading(true);

    try {
      const payload = {
        businessName,
        gstin,
        businessAddress: { street, city, state, zipCode },
        bankDetails: { accountNumber, ifscCode, bankName, accountHolderName }
      };

      await api.post('/api/sellers/apply', payload);
      setAppSuccess('Application submitted successfully! Please wait for administrator approval.');
      checkOnboardingStatus();
    } catch (err) {
      setAppError(err.response?.data?.message || 'Error submitting application.');
    } finally {
      setActionLoading(false);
    }
  };

  // Product Add/Edit
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdDesc(product.description);
      setProdPrice(product.price);
      setProdBrand(product.brand);
      setProdCategory(product.category?._id || '');
      setProdStock(product.stock);
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdDesc('');
      setProdPrice('');
      setProdBrand('');
      setProdCategory(categories[0]?._id || '');
      setProdStock('');
    }
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      name: prodName,
      description: prodDesc,
      price: Number(prodPrice),
      brand: prodBrand,
      category: prodCategory,
      stock: Number(prodStock)
    };

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      setProductModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  // Image Upload
  const openUploadModal = (productId) => {
    setUploadProductId(productId);
    setSelectedFiles([]);
    setUploadModalOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    setActionLoading(true);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    try {
      await api.post(`/api/products/${uploadProductId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading files');
    } finally {
      setActionLoading(false);
    }
  };

  // Order Fulfillment
  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      fetchDashboardData();
      alert(`Order status updated to ${status}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order status');
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '70vh' }}>Loading seller profile...</div>;
  }

  // --- RENDERING GUEST SELLER LANDING PAGE (WHEN NOT LOGGED IN) ---
  if (!user) {
    return (
      <div className="container animate-fade-in" style={{ padding: '3rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="card text-center" style={{ padding: '3.5rem 2rem', borderRadius: '8px', background: 'linear-gradient(135deg, #131921 0%, #232f3e 100%)', color: '#fff', marginBottom: '2.5rem' }}>
          <FaStore style={{ fontSize: '4rem', color: '#febd69', marginBottom: '1.25rem' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Sell on Amazon.in</h1>
          <p style={{ fontSize: '1.15rem', color: '#eaeded', maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
            Become an Amazon seller and reach hundreds of millions of customers across India. Low selling fees, fast doorstep shipping, and 24/7 seller assistance.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/login" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '24px' }}>
              Sign In to Start Selling
            </a>
            <a href="/register" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '24px', borderColor: '#febd69', color: '#febd69' }}>
              Create Seller Account
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <FaChartLine style={{ fontSize: '2.5rem', color: '#007185', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Crores of Customers</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Reach genuine buyers from across India searching for your products on Amazon.</p>
          </div>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <FaBox style={{ fontSize: '2.5rem', color: '#007600', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Easy Fulfillment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Deliver to 100% of serviceable pincodes in India with automated tracking.</p>
          </div>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <FaFileInvoiceDollar style={{ fontSize: '2.5rem', color: '#febd69', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Timely Direct Payouts</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Receive earnings directly into your bank account on scheduled disbursement cycles.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING ONBOARDING APPLICATION PORTALS ---
  if (onboardingStatus === 'not_applied' || onboardingStatus === 'rejected') {
    return (
      <div className="container onboarding-page animate-fade-in">
        <div className="card onboarding-card" style={{ maxWidth: '750px', margin: '3rem auto' }}>
          <h2><FaStore style={{ color: 'var(--accent-color)' }} /> Sell on Amazon Marketplace</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Register your business, provide bank details, and start listing products to millions of customers.
          </p>

          {onboardingStatus === 'rejected' && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <strong>Application Rejected:</strong> Your previous application was declined. Please verify your GSTIN/Bank details and re-submit.
            </div>
          )}

          {appError && <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>{appError}</div>}
          {appSuccess && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{appSuccess}</div>}

          <form onSubmit={handleApplySubmit}>
            <div className="form-grid">
              {/* Business details */}
              <div className="form-column">
                <h4>Business Details</h4>
                <div className="form-group">
                  <label className="form-label" htmlFor="bus-name">Business Name</label>
                  <input
                    id="bus-name"
                    type="text"
                    className="form-control"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bus-gst">GSTIN Number (Indian GST)</label>
                  <input
                    id="bus-gst"
                    type="text"
                    className="form-control"
                    placeholder="e.g. 07AAAAA1111A1Z1"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    required
                  />
                </div>
                
                {/* Address details */}
                <div className="form-group">
                  <label className="form-label" htmlFor="bus-street">Street Address</label>
                  <input id="bus-street" type="text" className="form-control" value={street} onChange={(e) => setStreet(e.target.value)} required />
                </div>
                <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="bus-city">City</label>
                    <input id="bus-city" type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="bus-state">State</label>
                    <input id="bus-state" type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="bus-zip">Zip</label>
                    <input id="bus-zip" type="text" className="form-control" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="form-column">
                <h4>Disbursement Bank Account</h4>
                <div className="form-group">
                  <label className="form-label" htmlFor="bank-holder">Account Holder Name</label>
                  <input
                    id="bank-holder"
                    type="text"
                    className="form-control"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bank-acc">Account Number</label>
                  <input
                    id="bank-acc"
                    type="text"
                    className="form-control"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bank-ifsc">IFSC Code</label>
                  <input
                    id="bank-ifsc"
                    type="text"
                    className="form-control"
                    placeholder="e.g. SBIN0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bank-name-input">Bank Name</label>
                  <input
                    id="bank-name-input"
                    type="text"
                    className="form-control"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={actionLoading}>
              {actionLoading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>

        <style>{`
          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          @media (max-width: 700px) {
            .form-grid { grid-template-columns: 1fr; }
          }
          .form-column h4 {
            font-size: 1.05rem;
            font-weight: 700;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            color: var(--secondary-color);
          }
        `}</style>
      </div>
    );
  }

  if (onboardingStatus === 'pending') {
    return (
      <div className="container flex-center animate-fade-in" style={{ height: '70vh', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
        <FaClock style={{ fontSize: '4rem', color: 'var(--pending-color)' }} />
        <h2>Seller Onboarding Pending Review</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px' }}>
          Your application for <strong>{sellerProfile?.businessName}</strong> is currently being reviewed by the platform administrator. You will gain dashboard access once approved.
        </p>
        <a href="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Home</a>
      </div>
    );
  }

  // --- RENDERING APPROVED SELLER DASHBOARD ---
  const totalRevenue = analytics?.totalRevenue || 0;
  const totalOrders = analytics?.totalOrders || 0;

  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaStore /> Seller Hub</h2>
        <p style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '0.2rem' }}>{sellerProfile?.businessName}</p>
        
        <ul className="sidebar-menu">
          <li>
            <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <FaChartLine /> Performance
            </button>
          </li>
          <li>
            <button className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
              <FaBox /> Products Inventory
            </button>
          </li>
          <li>
            <button className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <FaFileInvoiceDollar /> Orders Fulfillment
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-content">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="tab-pane animate-fade-in">
            <h2>Performance Metrics</h2>
            <hr style={{ margin: '1rem 0 2rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

            {/* Metrics cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Total Revenue</h3>
                  <p>₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <FaFileInvoiceDollar className="metric-icon" />
              </div>
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Fulfillments</h3>
                  <p>{totalOrders}</p>
                </div>
                <FaBox className="metric-icon" />
              </div>
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Products Listed</h3>
                  <p>{products.length}</p>
                </div>
                <FaStore className="metric-icon" />
              </div>
            </div>

            {/* Top Products */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>Top Selling Products</h3>
              {(!analytics?.topProducts || analytics.topProducts.length === 0) ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No sales data available yet.</p>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Units Sold</th>
                      <th>Total Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProducts.map((item) => (
                      <tr key={item._id}>
                        <td><strong>{item.name}</strong></td>
                        <td>₹{(item.price || 0).toLocaleString('en-IN')}</td>
                        <td>{item.unitsSold || 0}</td>
                        <td>₹{(item.revenue || 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="tab-pane animate-fade-in">
            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2>Products Inventory</h2>
              <button className="btn btn-primary flex-center" onClick={() => openProductModal()}><FaPlus /> Add Product</button>
            </div>
            <hr style={{ margin: '1rem 0 2rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

            {products.length === 0 ? (
              <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                <h3>No products listed</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Start listing items to sell on the marketplace clone.</p>
                <button className="btn btn-primary" onClick={() => openProductModal()} style={{ marginTop: '1.5rem' }}>Add Product</button>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Ratings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => {
                    const prodImg = (prod.images && prod.images.length > 0) ? prod.images[0] : (prod.image || '');
                    const prodStock = prod.stock !== undefined ? prod.stock : (prod.countInStock !== undefined ? prod.countInStock : 0);
                    return (
                      <tr key={prod._id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {prodImg ? (
                            <img src={prodImg} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
                          ) : <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>}
                          <strong>{prod.name}</strong>
                        </td>
                        <td>{prod.brand || 'Amazon Brand'}</td>
                        <td>₹{Number(prod.price || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`badge ${prodStock > 0 ? 'badge-success' : 'badge-danger'}`}>
                            {prodStock} left
                          </span>
                        </td>
                        <td>★ {prod.rating || prod.ratings || 4.5} ({prod.numReviews || 0})</td>
                        <td>
                          <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
                            <button className="table-action-btn edit" onClick={() => openProductModal(prod)} title="Edit"><FaEdit /></button>
                            <button className="table-action-btn upload" onClick={() => openUploadModal(prod._id)} title="Upload Images"><FaImage /></button>
                            <button className="table-action-btn delete" onClick={() => handleDeleteProduct(prod._id)} title="Delete"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="tab-pane animate-fade-in">
            <h2>Incoming Orders</h2>
            <hr style={{ margin: '1rem 0 2rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No customer orders placed for your items yet.</p>
            ) : (
              orders.map((ord) => {
                const orderItemsList = ord.orderItems || ord.items || [];
                const shipping = ord.shippingAddress || {};
                const shipAddressText = shipping.address 
                  ? `${shipping.address}, ${shipping.city || ''} - ${shipping.postalCode || ''}`
                  : `${shipping.street || ''}, ${shipping.city || ''} - ${shipping.zipCode || ''}`;

                const getOrdDeliveryDate = (orderItem) => {
                  if (orderItem.estimatedDeliveryDate) {
                    const d = new Date(orderItem.estimatedDeliveryDate);
                    return `${d.toLocaleDateString('en-IN', { weekday: 'short' })}, ${d.getDate()} ${d.toLocaleDateString('en-IN', { month: 'short' })}`;
                  }
                  const created = new Date(orderItem.createdAt || Date.now());
                  created.setDate(created.getDate() + 3);
                  return `${created.toLocaleDateString('en-IN', { weekday: 'short' })}, ${created.getDate()} ${created.toLocaleDateString('en-IN', { month: 'short' })}`;
                };

                return (
                  <div key={ord._id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700 }}>Order #{ord._id}</span>
                          <span style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FaTruck /> Delivery by: {getOrdDeliveryDate(ord)}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                          Buyer: <strong>{shipping.fullName || ord.user?.name || 'Amazon Customer'}</strong> {ord.user?.email ? `(${ord.user.email})` : ''} • Tracking: <strong>{ord.trackingNumber || `AMZ-IN-${ord._id.slice(-8).toUpperCase()}`}</strong> ({ord.carrier || 'Amazon Logistics'})
                        </p>
                      </div>

                      <div className="flex-center" style={{ gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Total: ₹{Number(ord.totalPrice || 0).toLocaleString('en-IN')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600 }}>Tracking Status:</label>
                          <select 
                            id={`order-status-${ord._id}`}
                            name={`orderStatus_${ord._id}`}
                            aria-label="Tracking Status"
                            className="form-control" 
                            value={ord.orderStatus || 'Placed'}
                            onChange={(e) => handleOrderStatusUpdate(ord._id, e.target.value)}
                            style={{ width: '160px', fontWeight: 600 }}
                            disabled={ord.orderStatus === 'Cancelled' || ord.isDelivered}
                          >
                            <option value="Placed">● Placed</option>
                            <option value="Packed">● Packed</option>
                            <option value="Shipped">● Shipped</option>
                            <option value="Out for Delivery">● Out for Delivery</option>
                            <option value="Delivered">● Delivered</option>
                            {ord.orderStatus === 'Cancelled' && <option value="Cancelled">Cancelled</option>}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid-responsive" style={{ gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                      {/* Items */}
                      <div>
                        {orderItemsList.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No item details found for this order.</p>
                        ) : (
                          orderItemsList.map((item, idx) => {
                            const itemName = item.name || item.product?.name || 'Amazon Product';
                            const itemQty = item.qty || item.quantity || 1;
                            const itemPrice = item.price || 0;
                            const itemImg = item.image || item.product?.image;

                            return (
                              <div key={item._id || idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                                {itemImg && <img src={itemImg} alt="" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#f5f5f5' }} />}
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{itemName}</div>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {itemQty} x ₹{Number(itemPrice).toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      {/* Shipping Address */}
                      <div style={{ fontSize: '0.85rem' }}>
                        <strong>Shipping Address:</strong>
                        <p style={{ marginTop: '0.25rem', color: '#444' }}>
                          {shipping.fullName ? <span>{shipping.fullName}<br /></span> : null}
                          {shipAddressText.trim() ? shipAddressText : 'Standard Delivery, India'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* PRODUCT ADD/EDIT MODAL */}
      {productModalOpen && (
        <div className="dashboard-modal-overlay flex-center">
          <div className="card dashboard-modal animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <hr style={{ margin: '0.75rem 0 1.25rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
            
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-name">Product Name</label>
                <input id="prod-name" type="text" className="form-control" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-desc">Description</label>
                <textarea id="prod-desc" className="form-control" rows="3" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} required></textarea>
              </div>

              <div className="grid-responsive" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-price">Price (₹)</label>
                  <input id="prod-price" type="number" className="form-control" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-brand">Brand</label>
                  <input id="prod-brand" type="text" className="form-control" value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} required />
                </div>
              </div>

              <div className="grid-responsive" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-cat">Category</label>
                  <select id="prod-cat" className="form-control" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} required>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-stock">Stock Inventory</label>
                  <input id="prod-stock" type="number" className="form-control" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required />
                </div>
              </div>

              <div className="modal-actions flex-center" style={{ gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="dashboard-modal-overlay flex-center">
          <div className="card dashboard-modal animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
            <h3>Upload Product Images</h3>
            <hr style={{ margin: '0.75rem 0 1.25rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
            
            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label htmlFor="product-images-upload" className="form-label">Select Image Files (Max 5)</label>
                <input
                  id="product-images-upload"
                  name="productImages"
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  required
                />
              </div>

              <div className="modal-actions flex-center" style={{ gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setUploadModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading || selectedFiles.length === 0}>
                  {actionLoading ? 'Uploading...' : <><FaUpload /> Upload</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .sidebar-menu button {
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
        }

        .dashboard-table th, .dashboard-table td {
          border-bottom: 1px solid var(--border-color);
          padding: 1rem;
          text-align: left;
          font-size: 0.9rem;
        }

        .dashboard-table th {
          background-color: #f7f9fa;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .table-action-btn {
          border: 1px solid var(--border-color);
          background: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .table-action-btn:hover {
          transform: scale(1.05);
        }
        .table-action-btn.edit:hover { color: var(--accent-hover); border-color: var(--accent-hover); }
        .table-action-btn.upload:hover { color: #3399cc; border-color: #3399cc; }
        .table-action-btn.delete:hover { color: var(--error-color); border-color: var(--error-color); }

        .dashboard-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0,0,0,0.5);
          z-index: 200;
        }
        .dashboard-modal {
          padding: 2rem !important;
          box-shadow: var(--shadow-lg);
        }
      `}</style>

    </div>
  );
};

export default SellerDashboard;
