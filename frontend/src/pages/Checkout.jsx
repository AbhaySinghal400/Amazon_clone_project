import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContextValue';
import { useAuth } from '../context/AuthContextValue';
import { useLocationContext } from '../context/LocationContextValue';
import api from '../utils/api';
import { FaCheckCircle, FaMoneyBillWave, FaCreditCard, FaLock, FaTimes, FaQrcode } from 'react-icons/fa';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { location: deliveryLocation } = useLocationContext();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedLoc = localStorage.getItem('amzLocation') || '';
    const pinMatch = savedLoc.match(/\b\d{6}\b/);
    const pin = pinMatch ? pinMatch[0] : '';
    const city = savedLoc.replace(/\b\d{6}\b/, '').trim();
    return {
      fullName: user ? user.name : '',
      address: '',
      city: city || 'New Delhi',
      postalCode: pin || '110001',
      country: 'India'
    };
  });

  const [paymentMethod, setPaymentMethod] = useState('Paytm'); // Paytm, COD, Card
  const [showPaytmModal, setShowPaytmModal] = useState(false);
  const [paytmUpiId, setPaytmUpiId] = useState('');
  const [paytmProcessing, setPaytmProcessing] = useState(false);
  const [paytmSuccess, setPaytmSuccess] = useState(false);

  const getCartTotal = () => {
    return cartItems.reduce((price, item) => price + item.price * item.qty, 0).toFixed(2);
  };

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(qty) + Number(item.qty), 0);
  };

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to place an order!");
      navigate('/login');
      return;
    }

    if (paymentMethod === 'Paytm') {
      setShowPaytmModal(true);
    } else {
      executeOrderPlacement(paymentMethod, false, 'Pending');
    }
  };

  const executeOrderPlacement = async (selectedMethod, isPaid, paymentStatus) => {
    try {
      const response = await api.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        totalPrice: getCartTotal(),
        paymentMethod: selectedMethod,
        isPaid: isPaid,
        paymentStatus: paymentStatus
      });

      if (response.status === 201 || response.data) {
        clearCart();
        navigate('/orders?success=true');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error("Order error", error);
      alert(error.response?.data?.message || 'An error occurred while placing the order.');
    }
  };

  const handlePaytmPayment = async () => {
    setPaytmProcessing(true);

    // Simulate Paytm API verification
    setTimeout(async () => {
      setPaytmProcessing(false);
      setPaytmSuccess(true);

      setTimeout(async () => {
        setShowPaytmModal(false);
        await executeOrderPlacement('Paytm UPI', true, 'Paid');
      }, 1200);
    }, 1800);
  };

  if (cartItems.length === 0) {
    return (
      <div className="amz-checkout-empty flex-center" style={{ minHeight: '60vh', flexDirection: 'column' }}>
        <h2>Your cart is empty! Cannot proceed to checkout.</h2>
        <button className="amz-cta-yellow" onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '10px 24px', borderRadius: '20px', cursor: 'pointer', border: 'none', fontWeight: 700 }}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="amz-checkout-page">
      <div className="container amz-checkout-container">
        
        {/* Left Side: Shipping & Payment Form */}
        <div className="amz-checkout-left">
          
          <form onSubmit={handleCheckoutSubmit} className="amz-shipping-form">
            {/* Step 1: Delivery Address */}
            <div className="checkout-step-card">
              <div className="step-badge">1</div>
              <div className="step-content">
                <h2>Select a delivery address</h2>
                
                <div className="amz-input-group">
                  <label>Full name (First and Last name)</label>
                  <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleChange} required />
                </div>
                
                <div className="amz-input-group">
                  <label>Street Address or P.O. Box</label>
                  <input type="text" name="address" placeholder="Flat, House no., Building, Apartment" value={shippingAddress.address} onChange={handleChange} required />
                </div>
                
                <div className="amz-input-groups-row">
                  <div className="amz-input-group">
                    <label>City</label>
                    <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} required />
                  </div>
                  <div className="amz-input-group">
                    <label>PIN Code</label>
                    <input type="text" name="postalCode" placeholder="6-digit PIN code" value={shippingAddress.postalCode} onChange={handleChange} required />
                  </div>
                </div>

                <div className="amz-input-group">
                  <label>Country / Region</label>
                  <input type="text" name="country" value={shippingAddress.country} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Selection */}
            <div className="checkout-step-card" style={{ marginTop: '1.5rem' }}>
              <div className="step-badge">2</div>
              <div className="step-content">
                <h2>Select a payment method</h2>

                <div className="payment-options-list">
                  {/* Paytm Option (Primary / Recommended) */}
                  <label className={`payment-option-card ${paymentMethod === 'Paytm' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Paytm" 
                      checked={paymentMethod === 'Paytm'} 
                      onChange={() => setPaymentMethod('Paytm')} 
                    />
                    <div className="payment-option-text">
                      <div className="paytm-brand-tag">
                        <span className="paytm-badge">Paytm</span>
                        <strong>Paytm / UPI / QR Code</strong>
                        <span className="rec-tag">Recommended</span>
                      </div>
                      <p>Pay instantly using Paytm Wallet, Paytm UPI, Google Pay, PhonePe, or Scan QR Code.</p>
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label className={`payment-option-card ${paymentMethod === 'COD' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={paymentMethod === 'COD'} 
                      onChange={() => setPaymentMethod('COD')} 
                    />
                    <div className="payment-option-text">
                      <strong><FaMoneyBillWave style={{ color: '#007600', marginRight: '6px' }} /> Cash on Delivery (Pay on Delivery)</strong>
                      <p>Pay with cash or UPI upon delivery at your doorstep.</p>
                    </div>
                  </label>

                  {/* Credit / Debit Card Option */}
                  <label className={`payment-option-card ${paymentMethod === 'Card' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Card" 
                      checked={paymentMethod === 'Card'} 
                      onChange={() => setPaymentMethod('Card')} 
                    />
                    <div className="payment-option-text">
                      <strong><FaCreditCard style={{ color: '#007185', marginRight: '6px' }} /> Credit or Debit Card</strong>
                      <p>Visa, MasterCard, RuPay, Maestro accepted.</p>
                    </div>
                  </label>
                </div>

                <button type="submit" className="amz-use-address-btn">
                  {paymentMethod === 'Paytm' ? 'Continue with Paytm Payment' : 'Use this payment method & Place Order'}
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* Right Side: Order Summary */}
        <div className="amz-checkout-right">
          <div className="amz-order-summary">
            <h3>Order Summary</h3>
            <div className="amz-summary-row">
              <span>Items ({getCartCount()}):</span>
              <span>₹{Number(getCartTotal()).toLocaleString('en-IN')}</span>
            </div>
            <div className="amz-summary-row">
              <span>Shipping & handling:</span>
              <span>₹0.00</span>
            </div>
            <div className="amz-checkout-divider"></div>
            <div className="amz-summary-total">
              <span>Order Total:</span>
              <span>₹{Number(getCartTotal()).toLocaleString('en-IN')}</span>
            </div>
            
            <div className="checkout-guarantee">
              <FaLock /> <span>Safe & Secure 256-bit SSL Encrypted Payment</span>
            </div>
          </div>
        </div>

      </div>

      {/* Paytm Payment Gateway Modal */}
      {showPaytmModal && (
        <div className="paytm-modal-overlay flex-center" onClick={() => !paytmProcessing && setShowPaytmModal(false)}>
          <div className="paytm-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Paytm Header */}
            <div className="paytm-header">
              <div className="paytm-logo">
                <span className="paytm-p">Pay</span><span className="paytm-t">tm</span>
                <span className="paytm-sub">Payments Gateway</span>
              </div>
              {!paytmProcessing && !paytmSuccess && (
                <button className="paytm-close" onClick={() => setShowPaytmModal(false)}><FaTimes /></button>
              )}
            </div>

            {/* Merchant Details */}
            <div className="paytm-merchant-bar">
              <div>
                <span className="paytm-lbl">Merchant</span>
                <strong className="paytm-val">Amazon Marketplace India</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="paytm-lbl">Amount Payable</span>
                <strong className="paytm-amt">₹{Number(getCartTotal()).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Modal Body */}
            <div className="paytm-body">
              {paytmSuccess ? (
                <div className="paytm-success-state flex-center">
                  <FaCheckCircle className="paytm-success-icon" />
                  <h3>Payment Successful!</h3>
                  <p>₹{Number(getCartTotal()).toLocaleString('en-IN')} paid via Paytm UPI.</p>
                  <span className="paytm-redirecting">Confirming your order...</span>
                </div>
              ) : paytmProcessing ? (
                <div className="paytm-processing-state flex-center">
                  <div className="paytm-spinner"></div>
                  <h3>Contacting Paytm Server...</h3>
                  <p>Please do not press back or refresh the page.</p>
                </div>
              ) : (
                <>
                  <div className="paytm-qr-section flex-center">
                    <div className="qr-container">
                      <FaQrcode className="qr-graphic" />
                      <div className="qr-scan-line"></div>
                    </div>
                    <div className="qr-instruction">
                      <strong>Scan QR code to pay</strong>
                      <p>Open Paytm or any UPI app to scan and complete payment.</p>
                    </div>
                  </div>

                  <div className="paytm-divider">or enter Paytm UPI ID</div>

                  <div className="paytm-upi-input-group">
                    <input 
                      id="paytm-upi-id"
                      name="paytmUpiId"
                      type="text" 
                      placeholder="e.g. 9876543210@paytm" 
                      value={paytmUpiId}
                      onChange={(e) => setPaytmUpiId(e.target.value)}
                      aria-label="Paytm UPI ID"
                    />
                    <span className="upi-verified-badge">Verified</span>
                  </div>

                  <button 
                    className="paytm-pay-btn" 
                    onClick={handlePaytmPayment}
                  >
                    Pay ₹{Number(getCartTotal()).toLocaleString('en-IN')} with Paytm
                  </button>

                  <div className="paytm-footer-secure">
                    <FaLock /> 100% Secure Paytm Verified Transaction
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      <style>{`
        .amz-checkout-page {
          background-color: #eaeded;
          min-height: 90vh;
          padding: 2rem 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .amz-checkout-container {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        .checkout-step-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 20px 24px;
          border: 1px solid #d5d9d9;
          display: flex;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .step-badge {
          background: #131921;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .step-content {
          flex-grow: 1;
        }

        .step-content h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 16px;
        }

        .amz-input-group {
          margin-bottom: 14px;
        }

        .amz-input-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 4px;
        }

        .amz-input-group input {
          width: 100%;
          height: 36px;
          border: 1px solid #888C8C;
          border-radius: 4px;
          padding: 0 10px;
          font-size: 0.9rem;
          outline: none;
        }

        .amz-input-group input:focus {
          border-color: #e77600;
          box-shadow: 0 0 3px 2px rgba(228,121,17,.4);
        }

        .amz-input-groups-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Payment Options List */
        .payment-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .payment-option-card {
          border: 1px solid #d5d9d9;
          border-radius: 6px;
          padding: 14px 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .payment-option-card:hover {
          background-color: #f7f8f8;
        }

        .payment-option-card.active {
          border-color: #00baf2;
          background-color: #f0f9ff;
          box-shadow: 0 0 0 1px #00baf2;
        }

        .payment-option-card input[type="radio"] {
          margin-top: 4px;
          cursor: pointer;
        }

        .payment-option-text {
          font-size: 0.88rem;
          color: #0f1111;
        }

        .payment-option-text p {
          font-size: 0.8rem;
          color: #565959;
          margin-top: 2px;
        }

        .paytm-brand-tag {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .paytm-badge {
          background-color: #002970;
          color: #00baf2;
          font-weight: 900;
          font-size: 0.82rem;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: -0.5px;
        }

        .rec-tag {
          background-color: #007600;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 3px;
        }

        .amz-use-address-btn {
          background: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 20px;
          padding: 10px 24px;
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f1111;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(213,217,217,0.5);
          transition: background 0.15s;
        }

        .amz-use-address-btn:hover {
          background: #f7ca00;
        }

        /* Order Summary */
        .amz-order-summary {
          background: #ffffff;
          border: 1px solid #d5d9d9;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .amz-order-summary h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f1111;
          margin-bottom: 14px;
        }

        .amz-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #0f1111;
          margin-bottom: 8px;
        }

        .amz-checkout-divider {
          border-top: 1px solid #e7e7e7;
          margin: 12px 0;
        }

        .amz-summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 1.15rem;
          font-weight: 800;
          color: #b12704;
        }

        .checkout-guarantee {
          font-size: 0.78rem;
          color: #007185;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }

        /* Paytm Modal Styles */
        .paytm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          z-index: 3000;
        }

        .paytm-modal-card {
          background: #ffffff;
          width: 90%;
          max-width: 420px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          font-family: 'Inter', sans-serif;
        }

        .paytm-header {
          background-color: #002970;
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .paytm-logo {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .paytm-p { color: white; }
        .paytm-t { color: #00baf2; }
        .paytm-sub {
          font-size: 0.72rem;
          font-weight: 500;
          color: #a0c9eb;
          margin-left: 8px;
          text-transform: uppercase;
        }

        .paytm-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .paytm-merchant-bar {
          background-color: #f0f9ff;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #d0ecfa;
        }

        .paytm-lbl { display: block; font-size: 0.72rem; color: #565959; }
        .paytm-val { font-size: 0.85rem; color: #002970; }
        .paytm-amt { font-size: 1.25rem; color: #002970; font-weight: 800; }

        .paytm-body {
          padding: 24px 20px;
        }

        .paytm-qr-section {
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }

        .qr-container {
          position: relative;
          background: #f7f8f8;
          border: 2px solid #00baf2;
          border-radius: 8px;
          padding: 12px;
          display: inline-block;
        }

        .qr-graphic {
          font-size: 130px;
          color: #002970;
          display: block;
        }

        .qr-scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #00baf2;
          box-shadow: 0 0 6px #00baf2;
          animation: scanLine 2s infinite ease-in-out;
        }

        @keyframes scanLine {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }

        .qr-instruction strong { font-size: 0.95rem; color: #0f1111; }
        .qr-instruction p { font-size: 0.8rem; color: #565959; margin-top: 2px; }

        .paytm-divider {
          text-align: center;
          font-size: 0.75rem;
          color: #767676;
          margin: 16px 0;
          position: relative;
        }

        .paytm-upi-input-group {
          position: relative;
          margin-bottom: 16px;
        }

        .paytm-upi-input-group input {
          width: 100%;
          height: 40px;
          border: 1px solid #d5d9d9;
          border-radius: 6px;
          padding: 0 70px 0 12px;
          font-size: 0.9rem;
          outline: none;
        }

        .paytm-upi-input-group input:focus {
          border-color: #00baf2;
        }

        .upi-verified-badge {
          position: absolute;
          right: 10px;
          top: 11px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #007600;
        }

        .paytm-pay-btn {
          width: 100%;
          background-color: #00baf2;
          color: white;
          border: none;
          border-radius: 6px;
          height: 42px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }

        .paytm-pay-btn:hover {
          background-color: #0099cc;
        }

        .paytm-footer-secure {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #565959;
          margin-top: 12px;
        }

        /* Loading / Success States */
        .paytm-processing-state, .paytm-success-state {
          flex-direction: column;
          padding: 30px 10px;
          text-align: center;
        }

        .paytm-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f0f0f0;
          border-top-color: #00baf2;
          border-radius: 50%;
          animation: paytmSpin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes paytmSpin {
          to { transform: rotate(360deg); }
        }

        .paytm-success-icon {
          font-size: 55px;
          color: #007600;
          margin-bottom: 14px;
        }

        .paytm-redirecting {
          font-size: 0.8rem;
          color: #007185;
          margin-top: 8px;
        }

        @media (max-width: 800px) {
          .amz-checkout-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
