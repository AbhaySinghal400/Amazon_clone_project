import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/Navbar';
import LocationModal from './components/LocationModal';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              
              <div className="app-wrapper flex-center" style={{ flexDirection: 'column', minHeight: '100vh', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                <Navbar />
                <LocationModal />
              
              <div className="main-content" style={{ flexGrow: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Private Customer Routes */}
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  } />

                  {/* Seller Hub & Dashboard Route */}
                  <Route path="/seller" element={<SellerDashboard />} />

                  {/* Private Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Fallback 404 Route */}
                  <Route path="*" element={
                    <div className="container text-center" style={{ padding: '6rem 2rem' }}>
                      <h2>Page Not Found (404)</h2>
                      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>The page you are looking for does not exist.</p>
                      <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Home</a>
                    </div>
                  } />
                </Routes>
              </div>

              <Footer />
            </div>

          </WishlistProvider>
        </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
