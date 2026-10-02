import { useState } from 'react';
import { 
  FaTimes, FaCrosshairs, FaMapMarkerAlt, FaSpinner, 
  FaCheckCircle, FaExclamationTriangle, FaShieldAlt 
} from 'react-icons/fa';
import { useLocationContext } from '../context/LocationContextValue';

const POPULAR_CITIES = [
  { name: 'New Delhi', pin: '110001' },
  { name: 'Mumbai', pin: '400001' },
  { name: 'Bengaluru', pin: '560001' },
  { name: 'Hyderabad', pin: '500001' },
  { name: 'Pune', pin: '411001' },
  { name: 'Chennai', pin: '600001' },
  { name: 'Kolkata', pin: '700001' },
  { name: 'Ahmedabad', pin: '380001' },
  { name: 'Jaipur', pin: '302001' },
  { name: 'Indore', pin: '452001' },
  { name: 'Chandigarh', pin: '160017' },
  { name: 'Lucknow', pin: '226001' }
];

const LocationModal = () => {
  const { 
    location, 
    isLiveDetected, 
    isDetecting, 
    detectError, 
    detectSuccess, 
    isLocationModalOpen, 
    closeLocationModal, 
    detectLiveLocation, 
    updateLocation 
  } = useLocationContext();

  const [inputVal, setInputVal] = useState('');

  if (!isLocationModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      updateLocation(inputVal.trim(), null, false);
      setInputVal('');
      closeLocationModal();
    }
  };

  const handleSelectCity = (cityObj) => {
    updateLocation(`${cityObj.name} ${cityObj.pin}`, null, false);
    closeLocationModal();
  };

  return (
    <div className="amz-modal-overlay flex-center" onClick={closeLocationModal}>
      <div className="amz-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="amz-modal-header">
          <h3>Choose your delivery location</h3>
          <button className="amz-modal-close" onClick={closeLocationModal} aria-label="Close modal">
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="amz-modal-body">
          <p className="amz-modal-sub">
            Delivery options and delivery speeds may vary based on your location.
          </p>

          {/* Current Active Location Tag */}
          <div className="amz-current-location-box">
            <FaMapMarkerAlt className="current-loc-icon" />
            <div className="current-loc-info">
              <span className="current-loc-label">Current Delivery Location</span>
              <strong className="current-loc-value">{location}</strong>
              {isLiveDetected && (
                <span className="live-gps-badge">
                  <span className="gps-dot"></span> Live GPS (Near Me)
                </span>
              )}
            </div>
          </div>

          {/* GPS Live Near Me Detect Button */}
          <button 
            type="button" 
            className={`amz-live-gps-btn ${isDetecting ? 'loading' : ''}`}
            onClick={detectLiveLocation}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <FaSpinner className="spin-icon" />
                <span>Detecting your live location...</span>
              </>
            ) : (
              <>
                <FaCrosshairs className="gps-target-icon" />
                <div className="gps-btn-text">
                  <strong>Use my current location (Near Me)</strong>
                  <small>Auto-detect address via device GPS</small>
                </div>
              </>
            )}
          </button>

          {/* Error Message */}
          {detectError && (
            <div className="amz-loc-alert error animate-fade-in">
              <FaExclamationTriangle />
              <span>{detectError}</span>
            </div>
          )}

          {/* Success Message */}
          {detectSuccess && (
            <div className="amz-loc-alert success animate-fade-in">
              <FaCheckCircle />
              <span>{detectSuccess}</span>
            </div>
          )}

          <div className="amz-divider-text">
            <span>or enter an Indian pincode</span>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleSubmit} className="amz-pincode-form">
            <input 
              id="location-pincode-input"
              name="pincodeOrCity"
              type="text" 
              placeholder="Enter PIN code or City (e.g. 560001, Jaipur)" 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="amz-modal-input"
              autoComplete="postal-code"
              aria-label="Enter PIN code or City"
              autoFocus
            />
            <button type="submit" className="amz-modal-apply-btn">
              Apply
            </button>
          </form>

          <div className="amz-divider-text">
            <span>or choose a major city</span>
          </div>

          {/* Popular Cities Grid */}
          <div className="amz-quick-cities-grid">
            {POPULAR_CITIES.map((city) => (
              <button 
                key={city.name} 
                type="button"
                className={`amz-city-chip ${location.includes(city.name) ? 'active' : ''}`}
                onClick={() => handleSelectCity(city)}
              >
                {city.name}
              </button>
            ))}
          </div>

          <div className="amz-loc-footer-note">
            <FaShieldAlt style={{ color: '#007185', marginRight: '6px' }} />
            <span>Your location helps show accurate same-day / next-day delivery speeds.</span>
          </div>

        </div>
      </div>

      <style>{`
        .amz-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(2px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .amz-modal-card {
          background: #ffffff;
          border-radius: 10px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
          overflow: hidden;
          animation: modalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .amz-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0f2f2;
          padding: 14px 20px;
          border-bottom: 1px solid #d5d9d9;
        }

        .amz-modal-header h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f1111;
          margin: 0;
        }

        .amz-modal-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #555;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .amz-modal-close:hover {
          background: #e2e5e5;
          color: #111;
        }

        .amz-modal-body {
          padding: 18px 22px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .amz-modal-sub {
          font-size: 0.85rem;
          color: #565959;
          margin-bottom: 14px;
          line-height: 1.4;
        }

        /* Current Active Location Box */
        .amz-current-location-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafd;
          border: 1px solid #c8e1f5;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 14px;
        }

        .current-loc-icon {
          font-size: 1.4rem;
          color: #c45500;
        }

        .current-loc-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .current-loc-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #565959;
          font-weight: 600;
        }

        .current-loc-value {
          font-size: 0.95rem;
          color: #0f1111;
        }

        .live-gps-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #e6f4ea;
          color: #137333;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          width: fit-content;
          margin-top: 2px;
        }

        .gps-dot {
          width: 7px;
          height: 7px;
          background-color: #137333;
          border-radius: 50%;
          display: inline-block;
          animation: pulseDot 1.5s infinite;
        }

        @keyframes pulseDot {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }

        /* GPS Button */
        .amz-live-gps-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #ffffff;
          border: 1.5px solid #007185;
          color: #007185;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0, 113, 133, 0.08);
          margin-bottom: 12px;
        }

        .amz-live-gps-btn:hover:not(:disabled) {
          background: #f0f9fa;
          border-color: #005a6a;
          color: #005a6a;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0, 113, 133, 0.15);
        }

        .amz-live-gps-btn:disabled {
          cursor: wait;
          opacity: 0.85;
        }

        .gps-target-icon {
          font-size: 1.25rem;
          color: #c45500;
        }

        .gps-btn-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .gps-btn-text strong {
          font-size: 0.92rem;
          color: #0f1111;
        }

        .gps-btn-text small {
          font-size: 0.76rem;
          color: #565959;
        }

        .spin-icon {
          animation: spin 0.9s linear infinite;
          font-size: 1.1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Alerts */
        .amz-loc-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 6px;
          font-size: 0.82rem;
          margin-bottom: 12px;
          line-height: 1.35;
        }

        .amz-loc-alert.error {
          background: #fdf2f2;
          border: 1px solid #f8b4b4;
          color: #9b1c1c;
        }

        .amz-loc-alert.success {
          background: #def7ec;
          border: 1px solid #84e1bc;
          color: #03543f;
        }

        /* Dividers */
        .amz-divider-text {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 14px 0 10px;
          color: #767676;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .amz-divider-text::before,
        .amz-divider-text::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e7e7e7;
        }

        .amz-divider-text span {
          padding: 0 10px;
        }

        /* Input Form */
        .amz-pincode-form {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .amz-modal-input {
          flex: 1;
          padding: 9px 12px;
          border: 1px solid #888c8c;
          border-radius: 4px;
          font-size: 0.9rem;
          outline: none;
          font-family: inherit;
        }

        .amz-modal-input:focus {
          border-color: #e77600;
          box-shadow: 0 0 3px 2px rgba(228, 121, 17, 0.5);
        }

        .amz-modal-apply-btn {
          background: #ffd814;
          border: 1px solid #fcd200;
          border-radius: 6px;
          padding: 0 18px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          color: #0f1111;
          transition: background 0.15s;
        }

        .amz-modal-apply-btn:hover {
          background: #f7ca00;
        }

        /* Cities Grid */
        .amz-quick-cities-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }

        .amz-city-chip {
          background: #ffffff;
          border: 1px solid #d5d9d9;
          border-radius: 6px;
          padding: 7px 10px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          color: #0f1111;
          text-align: center;
          font-family: inherit;
          transition: all 0.15s;
        }

        .amz-city-chip:hover {
          background: #f7fafa;
          border-color: #007185;
          color: #007185;
        }

        .amz-city-chip.active {
          background: #eaf6f7;
          border-color: #007185;
          color: #007185;
          font-weight: 700;
        }

        .amz-loc-footer-note {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #565959;
          background: #f7fafa;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e7e7e7;
        }
      `}</style>
    </div>
  );
};

export default LocationModal;
