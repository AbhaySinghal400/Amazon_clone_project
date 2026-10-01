
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top
      </div>
      
      <div className="container footer-content">
        <div className="footer-column">
          <h3>Get to Know Us</h3>
          <ul>
            <li>Careers</li>
            <li>Blog</li>
            <li>About Amazon</li>
            <li>Investor Relations</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Make Money with Us</h3>
          <ul>
            <li>Sell products on Amazon</li>
            <li>Sell on Amazon Business</li>
            <li>Become an Affiliate</li>
            <li>Advertise Your Products</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Amazon Payment Products</h3>
          <ul>
            <li>Amazon Business Card</li>
            <li>Shop with Points</li>
            <li>Reload Your Balance</li>
            <li>Amazon Currency Converter</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Let Us Help You</h3>
          <ul>
            <li>Amazon and COVID-19</li>
            <li>Your Account</li>
            <li>Your Orders</li>
            <li>Shipping Rates & Policies</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container bottom-container">
          <span className="footer-logo">amazon<span>marketplace</span></span>
          <p>© {currentYear} Amazon Marketplace Clone. All rights reserved. Developed by Antigravity AI.</p>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--secondary-color);
          color: #ffffff;
          margin-top: 5rem;
        }

        .back-to-top {
          background-color: #37475a;
          text-align: center;
          padding: 1rem 0;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .back-to-top:hover {
          background-color: #485769;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
          padding: 4rem 2rem;
        }

        .footer-column h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: #ffffff;
        }

        .footer-column ul {
          list-style: none;
        }

        .footer-column ul li {
          font-size: 0.85rem;
          color: #dddddd;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .footer-column ul li:hover {
          color: var(--accent-color);
          text-decoration: underline;
        }

        .footer-bottom {
          background-color: var(--primary-color);
          border-top: 1px solid #3a4553;
          padding: 2.5rem 0;
          text-align: center;
          font-size: 0.8rem;
          color: #cccccc;
        }

        .bottom-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
        }

        .footer-logo span {
          color: var(--accent-color);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
