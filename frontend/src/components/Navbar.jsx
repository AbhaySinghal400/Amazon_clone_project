import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContextValue';
import { useCart } from '../context/CartContextValue';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
    }
  };

  const cartItemCount = cartItems.reduce((count, item) => count + item.qty, 0);

  return (
    <header className="navbar">
      <div className="container nav-container">
        
        {/* Mobile Hamburger & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="nav-logo">
            amazon<span>marketplace</span>
          </Link>
        </div>

        {/* Search Bar (Full width on mobile, inline on desktop) */}
        <form onSubmit={handleSearch} className="nav-search">
          <input 
            type="text" 
            placeholder="Search products, brands and categories..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit"><FaSearch style={{ color: 'var(--primary-color)' }} /></button>
        </form>

        {/* Navigation Links */}
        <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <div className="nav-item">
                <span className="line-1">Hello, {user.name}</span>
                <span className="line-2" onClick={logout} style={{ cursor: 'pointer' }}>Sign out</span>
              </div>
              <Link to="/orders" className="nav-item">
                <span className="line-1">Returns</span>
                <span className="line-2">& Orders</span>
              </Link>
              {user.role === 'seller' && (
                <Link to="/seller" className="nav-item">
                  <span className="line-1">Seller</span>
                  <span className="line-2">Dashboard</span>
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className="nav-item">
              <span className="line-1">Hello, sign in</span>
              <span className="line-2">Account & Lists</span>
            </Link>
          )}

          <Link to="/cart" className="nav-cart">
            <FaShoppingCart style={{ fontSize: '1.8rem' }} />
            <span className="cart-count">{cartItemCount}</span>
            <span className="line-2" style={{ alignSelf: 'flex-end', marginLeft: '2px' }}>Cart</span>
          </Link>
        </nav>
      </div>

      <style>{`
        .navbar { background-color: var(--primary-color); padding: var(--space-xs) 0; position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-md); }
        .nav-container { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-sm); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: var(--text-xl); font-weight: 700; color: #ffffff; }
        .nav-logo span { color: var(--accent-color); }
        .mobile-menu-btn { display: block; background: none; border: none; color: white; font-size: var(--text-xl); cursor: pointer; }
        .nav-search { width: 100%; order: 3; display: flex; border-radius: var(--border-radius-sm); overflow: hidden; }
        .nav-search input { flex-grow: 1; border: none; padding: 0 var(--space-sm); outline: none; }
        .nav-search button { background-color: var(--accent-color); border: none; padding: 0 var(--space-md); cursor: pointer; }
        
        .nav-menu { display: none; width: 100%; flex-direction: column; gap: var(--space-md); order: 4; padding-top: var(--space-sm); }
        .nav-menu.open { display: flex; }
        .nav-item { display: flex; flex-direction: column; color: white; }
        .nav-item .line-1 { font-size: var(--text-xs); color: #cccccc; }
        .nav-item .line-2 { font-size: var(--text-sm); font-weight: 700; }
        .nav-cart { display: flex; align-items: center; position: relative; color: white; }
        .nav-cart .cart-count { position: absolute; top: -8px; left: 10px; background-color: var(--accent-color); color: var(--primary-color); border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }

        @media (min-width: 1025px) {
          .nav-container { flex-wrap: nowrap; gap: var(--space-lg); }
          .mobile-menu-btn { display: none; }
          .nav-menu { display: flex; width: auto; flex-direction: row; align-items: center; gap: var(--space-lg); order: unset; padding-top: 0; }
          .nav-search { width: auto; flex-grow: 1; max-width: 700px; order: unset; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
