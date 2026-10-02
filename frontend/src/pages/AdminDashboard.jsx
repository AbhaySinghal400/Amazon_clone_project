import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaTools, FaUsers, FaStore, FaChartLine, FaCheck, FaTimes, FaUserShield } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, onboarding, users
  
  // Data states
  const [reports, setReports] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingSellers = async () => {
    try {
      const { data } = await api.get('/api/admin/sellers/pending');
      setPendingSellers(data.sellers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/admin/users');
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isActive = true;
    const loadTab = async () => {
      try {
        if (activeTab === 'overview') {
          const { data } = await api.get('/api/admin/reports');
          if (isActive) setReports(data.reports);
        } else if (activeTab === 'onboarding') {
          const { data } = await api.get('/api/admin/sellers/pending');
          if (isActive) setPendingSellers(data.sellers);
        } else if (activeTab === 'users') {
          const { data } = await api.get('/api/admin/users');
          if (isActive) setUsers(data.users);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard data', err);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadTab();
    return () => {
      isActive = false;
    };
  }, [activeTab]);

  const selectTab = (tab) => {
    if (tab === activeTab) return;
    setLoading(true);
    setActiveTab(tab);
  };

  // Approve/Reject Seller
  const handleApproveSeller = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this seller application as ${status}?`)) {
      setActionLoading(true);
      try {
        await api.put(`/api/admin/sellers/${id}/approve`, { status });
        alert(`Application successfully ${status}`);
        fetchPendingSellers();
      } catch (err) {
        alert(err.response?.data?.message || 'Error processing request');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Change User Role
  const handleRoleChange = async (userId, role) => {
    setActionLoading(true);
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role });
      alert(`User role updated to ${role}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user role');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaTools /> Admin Hub</h2>
        <p style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '0.2rem' }}>Platform Moderation</p>
        
        <ul className="sidebar-menu">
          <li>
            <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => selectTab('overview')}>
              <FaChartLine /> Overview Reports
            </button>
          </li>
          <li>
            <button className={`sidebar-link ${activeTab === 'onboarding' ? 'active' : ''}`} onClick={() => selectTab('onboarding')}>
              <FaStore /> Seller Approvals {pendingSellers.length > 0 && <span className="pending-indicator">{pendingSellers.length}</span>}
            </button>
          </li>
          <li>
            <button className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => selectTab('users')}>
              <FaUsers /> User Governance
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {loading ? (
          <div className="flex-center" style={{ height: '50vh' }}>Loading dashboard data...</div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && reports && (
              <div className="tab-pane animate-fade-in">
                <h2>System Overview</h2>
                <hr style={{ margin: '1rem 0 2rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                {/* Metrics boxes */}
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-info">
                      <h3>Total Sales Revenue</h3>
                      <p>₹{reports.totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                    <FaChartLine className="metric-icon" />
                  </div>
                  <div className="metric-card">
                    <div className="metric-info">
                      <h3>Registered Accounts</h3>
                      <p>{reports.totalUsers}</p>
                    </div>
                    <FaUsers className="metric-icon" />
                  </div>
                  <div className="metric-card">
                    <div className="metric-info">
                      <h3>Approved Sellers</h3>
                      <p>{reports.totalSellers}</p>
                    </div>
                    <FaStore className="metric-icon" />
                  </div>
                  <div className="metric-card">
                    <div className="metric-info">
                      <h3>Listed Products</h3>
                      <p>{reports.totalProducts}</p>
                    </div>
                    <FaTools className="metric-icon" />
                  </div>
                </div>

                {/* Category stats */}
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.25rem' }}>Products Inventory distribution</h3>
                  {reports.categoryStats?.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No products listed yet.</p>
                  ) : (
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Category Name</th>
                          <th>Listed Products Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.categoryStats?.map((cat) => (
                          <tr key={cat._id}>
                            <td><strong>{cat.name}</strong></td>
                            <td>{cat.count} products</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SELLER ONBOARDING MODERATION */}
            {activeTab === 'onboarding' && (
              <div className="tab-pane animate-fade-in">
                <h2>Pending Seller Applications</h2>
                <hr style={{ margin: '1rem 0 2rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                {pendingSellers.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No seller onboarding requests pending moderation.</p>
                ) : (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Business Name</th>
                        <th>GSTIN</th>
                        <th>IFSC / Account No</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingSellers.map((seller) => (
                        <tr key={seller._id}>
                          <td>
                            <strong>{seller.user?.name}</strong>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{seller.user?.email}</p>
                          </td>
                          <td>{seller.businessName}</td>
                          <td><code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '2px' }}>{seller.gstin}</code></td>
                          <td>
                            <span style={{ fontSize: '0.85rem' }}>{seller.bankDetails?.bankName}</span>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{seller.bankDetails?.accountNumber}</p>
                          </td>
                          <td>
                            <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
                              <button 
                                className="table-action-btn flex-center"
                                style={{ backgroundColor: 'var(--success-color)', color: '#fff', border: 'none' }}
                                onClick={() => handleApproveSeller(seller._id, 'approved')}
                                title="Approve Onboarding"
                              >
                                <FaCheck />
                              </button>
                              <button 
                                className="table-action-btn flex-center"
                                style={{ backgroundColor: 'var(--error-color)', color: '#fff', border: 'none' }}
                                onClick={() => handleApproveSeller(seller._id, 'rejected')}
                                title="Reject Onboarding"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB 3: USER GOVERNANCE */}
            {activeTab === 'users' && (
              <div className="tab-pane animate-fade-in">
                <h2>User Governance Control</h2>
                <hr style={{ margin: '1rem 0 2rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Account Name</th>
                      <th>Email Address</th>
                      <th>Created Date</th>
                      <th>Verification Status</th>
                      <th>System Permission Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item) => (
                      <tr key={item._id}>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.email}</td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${item.isVerified ? 'badge-success' : 'badge-pending'}`}>
                            {item.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td>
                          <div className="flex-center" style={{ gap: '0.4rem', justifyContent: 'flex-start' }}>
                            <FaUserShield style={{ color: item.role === 'admin' ? 'var(--error-color)' : (item.role === 'seller' ? 'var(--accent-color)' : 'var(--text-muted)') }} />
                            <select 
                              id={`admin-role-select-${item._id}`}
                              name={`userRole_${item._id}`}
                              aria-label="Change User Role"
                              className="form-control"
                              style={{ width: '130px', padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                              value={item.role}
                              onChange={(e) => handleRoleChange(item._id, e.target.value)}
                              disabled={actionLoading}
                            >
                              <option value="customer">Customer</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        .sidebar-menu button {
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
          position: relative;
        }

        .pending-indicator {
          background-color: var(--error-color);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 20px;
          position: absolute;
          right: 1rem;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #ffffff;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .dashboard-table th, .dashboard-table td {
          padding: 1rem;
          text-align: left;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--border-color);
        }

        .dashboard-table th {
          background-color: #f7f9fa;
          font-weight: 700;
          color: var(--secondary-color);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
