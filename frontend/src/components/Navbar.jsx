import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaMapMarkerAlt, FaCaretDown, FaStore } from 'react-icons/fa';
import { useAuth } from '../context/AuthContextValue';
import { useCart } from '../context/CartContextValue';
import { useLocationContext } from '../context/LocationContextValue';
import AmazonLogo from './AmazonLogo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { location: deliveryLocation, isLiveDetected, openLocationModal } = useLocationContext();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    let query = `/search?`;
    if (keyword.trim()) query += `keyword=${encodeURIComponent(keyword)}&`;
    if (selectedCategory !== 'All') query += `category=${encodeURIComponent(selectedCategory)}`;
    navigate(query);
  };

  const cartItemCount = cartItems.reduce((count, item) => count + (item.qty || 1), 0);

  return (
    <header className="amz-header">
      {/* Top Navbar */}
      <div className="amz-nav-top">
        <div className="container amz-nav-top-container">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="amz-logo-group">
            <button className="amz-mobile-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <AmazonLogo variant="light" size="medium" />
          </div>

          {/* Location Delivery Selector (Interactive Pop-up Trigger) */}
          <div 
            className="amz-deliver-box hide-mobile"
            onClick={openLocationModal}
            title="Click to update delivery location"
          >
            <FaMapMarkerAlt className="amz-location-icon" />
            <div className="amz-deliver-text">
              <span className="line-1">
                Delivering to {deliveryLocation}
                {isLiveDetected && <span className="navbar-live-dot" title="Near Me (Live GPS)"></span>}
              </span>
              <span className="line-2">Update location</span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="amz-search-bar" role="search">
            <select 
              id="nav-search-select"
              name="searchCategory"
              className="amz-search-category" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Select Category"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Beauty & Personal Care">Beauty</option>
            </select>

            <input 
              id="twotabsearchtextbox"
              name="field-keywords"
              type="text" 
              className="amz-search-input"
              placeholder="Search Amazon.in" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoComplete="off"
              aria-label="Search Amazon.in"
            />

            <button type="submit" className="amz-search-btn" title="Search">
              <FaSearch />
            </button>
          </form>

          {/* Right Nav Options */}
          <nav className={`amz-nav-right ${isMenuOpen ? 'open' : ''}`}>
            
            {/* Account & Lists */}
            {user ? (
              <div className="amz-nav-option amz-account-dropdown">
                <span className="line-1">Hello, {user.name}</span>
                <span className="line-2">Account & Lists <FaCaretDown style={{ fontSize: '0.75rem' }} /></span>
                <div className="amz-dropdown-content">
                  <p className="amz-user-greeting">Signed in as <strong>{user.email}</strong></p>
                  <hr />
                  <Link to="/orders">Your Orders</Link>
                  <Link to="/wishlist">Your Wishlist</Link>
                  <Link to="/seller" style={{ color: '#007185', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaStore style={{ color: '#c45500' }} /> {user.role === 'seller' ? 'Seller Central' : 'Sell on Amazon (Seller Hub)'}
                  </Link>
                  <button onClick={logout} className="amz-signout-btn">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="amz-nav-option">
                <span className="line-1">Hello, sign in</span>
                <span className="line-2">Account & Lists <FaCaretDown style={{ fontSize: '0.75rem' }} /></span>
              </Link>
            )}

            {/* Returns & Orders */}
            <Link to="/orders" className="amz-nav-option hide-mobile">
              <span className="line-1">Returns</span>
              <span className="line-2">& Orders</span>
            </Link>

            {/* Shopping Cart */}
            <Link to="/cart" className="amz-cart-box">
              <div className="amz-cart-icon-wrapper">
                <FaShoppingCart className="amz-cart-icon" />
                <span className="amz-cart-count">{cartItemCount}</span>
              </div>
              <span className="line-2 amz-cart-text">Cart</span>
            </Link>
          </nav>

        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="amz-nav-sub">
        <div className="container amz-sub-container">
          <Link to="/" className="sub-link highlight"><FaBars style={{ marginRight: '4px' }} /> All</Link>
          <button 
            className="sub-link location-sub-btn" 
            onClick={openLocationModal}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <FaMapMarkerAlt style={{ color: '#febd69' }} /> {deliveryLocation}
            {isLiveDetected && <span className="navbar-live-dot" title="Near Me (Live GPS)"></span>}
          </button>
          <Link to="/search?category=Electronics" className="sub-link">Electronics</Link>
          <Link to="/search?category=Fashion" className="sub-link">Fashion</Link>
          <Link to="/search?category=Home%20%26%20Kitchen" className="sub-link">Home & Kitchen</Link>
          <Link to="/search?category=Beauty" className="sub-link">Beauty</Link>
          <Link to="/search" className="sub-link">Today's Deals</Link>
          <Link to="/search" className="sub-link hide-mobile">Bestsellers</Link>
          <Link to="/search" className="sub-link hide-mobile">Prime</Link>

          <Link 
            to="/seller" 
            className="sub-link seller-badge"
            style={{ 
              backgroundColor: '#febd69', 
              color: '#111', 
              fontWeight: '700', 
              borderRadius: '3px', 
              padding: '3px 8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FaStore style={{ color: '#131921' }} /> {user?.role === 'seller' ? 'Seller Central' : 'Sell on Amazon'}
          </Link>
        </div>
      </div>

      <style>{`
        .amz-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        
        .amz-nav-top {
          background-color: #131921;
          color: #ffffff;
          padding: 8px 0;
        }
        
        .amz-nav-top-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .amz-logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .amz-mobile-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .amz-deliver-box {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border: 1px solid transparent;
          border-radius: 2px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .amz-deliver-box:hover {
          border-color: white;
        }

        .amz-location-icon {
          font-size: 1.1rem;
          color: #ffffff;
          margin-top: 4px;
        }

        .amz-deliver-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .amz-deliver-text .line-1 {
          font-size: 0.7rem;
          color: #cccccc;
        }

        .amz-deliver-text .line-2 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
        }

        .navbar-live-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          background: #00e676;
          border-radius: 50%;
          margin-left: 5px;
          vertical-align: middle;
          box-shadow: 0 0 6px #00e676;
          animation: navDotPulse 1.8s infinite;
        }

        @keyframes navDotPulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }

        /* Search Bar Styles */
        .amz-search-bar {
          display: flex;
          flex-grow: 1;
          height: 40px;
          max-width: 750px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .amz-search-bar:focus-within {
          box-shadow: 0 0 0 3px #ff9900;
        }

        .amz-search-category {
          background-color: #f3f3f3;
          border: none;
          border-right: 1px solid #cdcdcd;
          padding: 0 10px;
          font-size: 0.8rem;
          color: #555;
          cursor: pointer;
          outline: none;
          max-width: 140px;
        }

        .amz-search-input {
          flex-grow: 1;
          border: none;
          padding: 0 12px;
          font-size: 0.95rem;
          outline: none;
          color: #111;
        }

        .amz-search-btn {
          background-color: #febd69;
          border: none;
          width: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          color: #111;
          cursor: pointer;
          transition: background 0.2s;
        }

        .amz-search-btn:hover {
          background-color: #f3a847;
        }

        /* Right Nav Options */
        .amz-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .amz-nav-option {
          display: flex;
          flex-direction: column;
          color: white;
          text-decoration: none;
          padding: 4px 8px;
          border: 1px solid transparent;
          border-radius: 2px;
          position: relative;
          cursor: pointer;
        }

        .amz-nav-option:hover {
          border-color: white;
        }

        .amz-nav-option .line-1 {
          font-size: 0.72rem;
          color: #cccccc;
        }

        .amz-nav-option .line-2 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        /* Dropdown menu for account */
        .amz-account-dropdown:hover .amz-dropdown-content {
          display: block;
        }

        .amz-dropdown-content {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          min-width: 220px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          border-radius: 4px;
          padding: 12px;
          z-index: 100;
          color: #111;
        }

        .amz-dropdown-content a {
          display: block;
          padding: 8px 0;
          color: #111;
          text-decoration: none;
          font-size: 0.85rem;
        }

        .amz-dropdown-content a:hover {
          color: #c45500;
          text-decoration: underline;
        }

        .amz-user-greeting {
          font-size: 0.85rem;
          color: #555;
          margin-bottom: 6px;
        }

        .amz-signout-btn {
          width: 100%;
          margin-top: 8px;
          background: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 4px;
          padding: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .amz-signout-btn:hover {
          background: #f7ca00;
        }

        /* Cart Box */
        .amz-cart-box {
          display: flex;
          align-items: center;
          color: white;
          text-decoration: none;
          padding: 4px 8px;
          border: 1px solid transparent;
          border-radius: 2px;
          position: relative;
        }

        .amz-cart-box:hover {
          border-color: white;
        }

        .amz-cart-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .amz-cart-icon {
          font-size: 2rem;
          color: #ffffff;
        }

        .amz-cart-count {
          position: absolute;
          top: -4px;
          left: 13px;
          color: #f08804;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .amz-cart-text {
          margin-left: 4px;
          margin-top: 10px;
        }

        /* Sub Nav */
        .amz-nav-sub {
          background-color: #232f3e;
          color: #ffffff;
          padding: 4px 0;
          font-size: 0.85rem;
        }

        .amz-sub-container {
          display: flex;
          align-items: center;
          gap: 16px;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none;
        }

        .amz-sub-container::-webkit-scrollbar {
          display: none;
        }

        .sub-link {
          color: #ffffff;
          text-decoration: none;
          padding: 4px 8px;
          border: 1px solid transparent;
          border-radius: 2px;
          display: flex;
          align-items: center;
        }

        .sub-link:hover {
          border-color: white;
        }

        .sub-link.highlight {
          font-weight: 700;
        }

        .sub-link.seller-badge {
          margin-left: auto;
          background: #febd69;
          color: #111;
          font-weight: 700;
          border-radius: 4px;
          padding: 3px 10px;
        }

        .sub-link.seller-badge:hover {
          background: #f3a847;
          border-color: transparent;
        }

        /* Location Selection Modal Styling */
        .amz-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          z-index: 2000;
        }

        .amz-modal-card {
          background: #ffffff;
          width: 90%;
          max-width: 440px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .amz-modal-header {
          background: #f0f2f2;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #d5d9d9;
        }

        .amz-modal-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f1111;
          margin: 0;
        }

        .amz-modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #555;
          cursor: pointer;
        }

        .amz-modal-body {
          padding: 20px;
        }

        .amz-modal-sub {
          font-size: 0.85rem;
          color: #565959;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .amz-pincode-form {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .amz-modal-input {
          flex-grow: 1;
          padding: 8px 12px;
          border: 1px solid #888C8C;
          border-radius: 4px;
          font-size: 0.9rem;
          outline: none;
        }

        .amz-modal-input:focus {
          border-color: #e77600;
          box-shadow: 0 0 3px 2px rgba(228,121,17,.5);
        }

        .amz-modal-apply-btn {
          background: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 4px;
          padding: 0 18px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .amz-modal-apply-btn:hover {
          background: #f7ca00;
        }

        .amz-quick-cities-divider {
          font-size: 0.78rem;
          color: #767676;
          text-align: center;
          position: relative;
          margin: 16px 0;
        }

        .amz-quick-cities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .amz-city-chip {
          background: #f7f8f8;
          border: 1px solid #d5d9d9;
          border-radius: 4px;
          padding: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #0f1111;
          cursor: pointer;
          transition: all 0.15s;
        }

        .amz-city-chip:hover {
          background: #ffffff;
          border-color: #ff9900;
          color: #c45500;
        }

        @media (max-width: 900px) {
          .hide-mobile { display: none !important; }
          .amz-mobile-btn { display: block; }
          .amz-search-bar { order: 3; width: 100%; max-width: 100%; margin-top: 6px; }
          .amz-search-category { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
