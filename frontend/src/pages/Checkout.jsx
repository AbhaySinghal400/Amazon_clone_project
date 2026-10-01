import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContextValue';
import { useAuth } from '../context/AuthContextValue';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? user.name : '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const getCartTotal = () => {
    return cartItems.reduce((price, item) => price + item.price * item.qty, 0).toFixed(2);
  };

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(qty) + Number(item.qty), 0);
  };

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

const placeOrderHandler = async (e) => {
    e.preventDefault();
    
    if (!user || !user.token) {
      alert("Please log in to place an order!");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` // Sending the token for security!
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          totalPrice: getCartTotal(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order Placed Successfully, ${shippingAddress.fullName}! Your Order ID is: ${data._id}`);
        clearCart(); 
        navigate('/'); 
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error("Order error", error);
      alert('An error occurred while placing the order.');
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="amz-checkout-empty">
        <h2>Your cart is empty! Cannot proceed to checkout.</h2>
        <button onClick={() => navigate('/')}>Go Shopping</button>
      </div>
    );
  }

  return (
    <div className="amz-checkout-page">
      <div className="amz-checkout-container">
        
        {/* Left Side: Shipping Form */}
        <div className="amz-checkout-left">
          <h2>Select a shipping address</h2>
          <div className="amz-checkout-divider"></div>
          
          <form onSubmit={placeOrderHandler} className="amz-shipping-form">
            <div className="amz-input-group">
              <label>Full name (First and Last name)</label>
              <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleChange} required />
            </div>
            <div className="amz-input-group">
              <label>Address</label>
              <input type="text" name="address" placeholder="Street address or P.O. Box" value={shippingAddress.address} onChange={handleChange} required />
            </div>
            <div className="amz-input-groups-row">
              <div className="amz-input-group">
                <label>City</label>
                <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} required />
              </div>
              <div className="amz-input-group">
                <label>ZIP Code</label>
                <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} required />
              </div>
            </div>
            <div className="amz-input-group">
              <label>Country</label>
              <input type="text" name="country" value={shippingAddress.country} onChange={handleChange} required />
            </div>
            <button type="submit" className="amz-use-address-btn">Use this address & Place Order</button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="amz-checkout-right">
          <div className="amz-order-summary">
            <h3>Order Summary</h3>
            <div className="amz-summary-row">
              <span>Items ({getCartCount()}):</span>
              <span>${getCartTotal()}</span>
            </div>
            <div className="amz-summary-row">
              <span>Shipping & handling:</span>
              <span>$0.00</span>
            </div>
            <div className="amz-checkout-divider"></div>
            <div className="amz-summary-total">
              <span>Order Total:</span>
              <span>${getCartTotal()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
