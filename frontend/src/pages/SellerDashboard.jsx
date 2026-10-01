import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaStore, FaFileInvoiceDollar, FaChartLine, FaBox, FaClock, FaPlus, FaTrash, FaEdit, FaImage, FaUpload, FaCheck, FaTimes } from 'react-icons/fa';

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
      
      // Filter products belonging to this seller profile
      if (prodRes.data.products && sellerProfile) {
        const sellerProducts = prodRes.data.products.filter(
          p => p.seller && p.seller._id === sellerProfile._id
        );
        setProducts(sellerProducts);
      }
      setOrders(ordRes.data.orders);
      setCategories(catRes.data.categories);
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
              {analytics?.topProducts?.length === 0 ? (
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
                    {analytics?.topProducts?.map((item) => (
                      <tr key={item._id}>
                        <td><strong>{item.name}</strong></td>
                        <td>₹{item.price.toLocaleString('en-IN')}</td>
                        <td>{item.unitsSold}</td>
                        <td>₹{item.revenue.toLocaleString('en-IN')}</td>
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
                  {products.map((prod) => (
                    <tr key={prod._id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {prod.images && prod.images.length > 0 ? (
                          <img src={prod.images[0]} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
                        ) : <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>}
                        <strong>{prod.name}</strong>
                      </td>
                      <td>{prod.brand}</td>
                      <td>₹{prod.price.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${prod.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {prod.stock} left
                        </span>
                      </td>
                      <td>★ {prod.ratings} ({prod.numReviews})</td>
                      <td>
                        <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
                          <button className="table-action-btn edit" onClick={() => openProductModal(prod)} title="Edit"><FaEdit /></button>
                          <button className="table-action-btn upload" onClick={() => openUploadModal(prod._id)} title="Upload Images"><FaImage /></button>
                          <button className="table-action-btn delete" onClick={() => handleDeleteProduct(prod._id)} title="Delete"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
              orders.map((ord) => (
                <div key={ord._id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                  <div className="flex-center" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      Order ID: <strong>#{ord._id}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Buyer: {ord.user?.name} ({ord.user?.email})</p>
                    </div>
                    <div>
                      <select 
                        className="form-control" 
                        value={ord.orderStatus}
                        onChange={(e) => handleOrderStatusUpdate(ord._id, e.target.value)}
                        style={{ width: '160px' }}
                        disabled={ord.orderStatus === 'cancelled' || ord.orderStatus === 'delivered'}
                      >
                        <option value="placed">Placed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        {ord.orderStatus === 'cancelled' && <option value="cancelled">Cancelled</option>}
                      </select>
                    </div>
                  </div>

                  <div className="grid-responsive" style={{ gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    {/* Items */}
                    <div>
                      {ord.items.map((item) => (
                        <div key={item._id} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontWeight: 600 }}>{item.product?.name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity} x ₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                    {/* Shipping Address */}
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong>Shipping Address:</strong>
                      <p style={{ marginTop: '0.25rem' }}>
                        {ord.shippingAddress?.street}, {ord.shippingAddress?.city}, {ord.shippingAddress?.state} - {ord.shippingAddress?.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              ))
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
                <label className="form-label">Select Image Files (Max 5)</label>
                <input
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
