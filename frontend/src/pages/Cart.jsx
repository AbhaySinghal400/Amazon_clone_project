import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContextValue';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const getCartTotal = () => {
    return cartItems.reduce((price, item) => price + item.price * item.qty, 0).toFixed(2);
  };

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(qty) + Number(item.qty), 0);
  };

  return (
    <div className="amz-cart-page">
      <div className="amz-cart-container">
        
        {/* Left Side: Cart Items */}
        <div className="amz-cart-left">
          <h2>Shopping Cart</h2>
          <div className="amz-cart-divider"></div>

          {cartItems.length === 0 ? (
            <p>Your Amazon Cart is empty. <Link to="/">Go shopping</Link></p>
          ) : (
            cartItems.map((item) => (
              <div key={item.product} className="amz-cart-item">
                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                
                <div className="amz-cart-item-details">
                  <Link to={`/product/${item.product}`} className="amz-cart-title">
                    {item.name}
                  </Link>
                  <p className="amz-cart-instock">In stock</p>
                  <p className="amz-cart-shipping">Eligible for FREE Shipping</p>
                  
                  <div className="amz-cart-actions">
                    <select 
                      value={item.qty} 
                      onChange={(e) => updateQuantity(item.product, e.target.value)}
                      className="amz-qty-dropdown"
                    >
                      {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          Qty: {x + 1}
                        </option>
                      ))}
                    </select>
                    <span className="amz-action-divider">|</span>
                    <button 
                      className="amz-delete-btn"
                      onClick={() => removeFromCart(item.product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="amz-cart-item-price">
                  <strong>${item.price}</strong>
                </div>
              </div>
            ))
          )}
          {cartItems.length > 0 && (
             <div className="amz-cart-subtotal-bottom">
               Subtotal ({getCartCount()} items): <strong>${getCartTotal()}</strong>
             </div>
          )}
        </div>
        
        {/* Right Side: Checkout Box */}
        {cartItems.length > 0 && (
          <div className="amz-cart-right">
            <div className="amz-checkout-box">
              <p className="amz-free-shipping-text">
                ✅ Your order is eligible for FREE Delivery.
              </p>
              <h3>
                Subtotal ({getCartCount()} items): <strong>${getCartTotal()}</strong>
              </h3>
              <button 
                className="amz-proceed-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Buy
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Cart;
