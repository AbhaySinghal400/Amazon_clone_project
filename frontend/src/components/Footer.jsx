import AmazonLogo from './AmazonLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="amz-footer">
      {/* Back to top button */}
      <div 
        className="amz-back-to-top" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>
      
      {/* Footer Nav Links */}
      <div className="amz-footer-main">
        <div className="container amz-footer-links-grid">
          
          <div className="amz-footer-col">
            <h3>Get to Know Us</h3>
            <ul>
              <li><a href="#">About Amazon Marketplace</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press Releases</a></li>
              <li><a href="#">Amazon Science</a></li>
            </ul>
          </div>

          <div className="amz-footer-col">
            <h3>Connect with Us</h3>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>

          <div className="amz-footer-col">
            <h3>Make Money with Us</h3>
            <ul>
              <li><a href="/seller">Sell on Amazon</a></li>
              <li><a href="/seller">Sell under Amazon Accelerator</a></li>
              <li><a href="#">Protect and Build Your Brand</a></li>
              <li><a href="#">Amazon Global Selling</a></li>
              <li><a href="#">Become an Affiliate</a></li>
              <li><a href="#">Fulfillment by Amazon</a></li>
            </ul>
          </div>

          <div className="amz-footer-col">
            <h3>Let Us Help You</h3>
            <ul>
              <li><a href="#">Your Account</a></li>
              <li><a href="/orders">Returns Centre</a></li>
              <li><a href="#">100% Purchase Protection</a></li>
              <li><a href="#">Amazon App Download</a></li>
              <li><a href="#">Help & Support</a></li>
            </ul>
          </div>

        </div>
      </div>
      
      {/* Bottom Legal Section */}
      <div className="amz-footer-bottom">
        <div className="container amz-bottom-content">
          <AmazonLogo variant="light" size="medium" />
          <p>© 1996-{currentYear}, Amazon.in, Inc. or its affiliates. Amazon Marketplace Clone built with React & Node.js</p>
        </div>
      </div>

      <style>{`
        .amz-footer {
          background-color: #232f3e;
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .amz-back-to-top {
          background-color: #37475a;
          text-align: center;
          padding: 15px 0;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          color: white;
          transition: background-color 0.2s;
        }

        .amz-back-to-top:hover {
          background-color: #485769;
        }

        .amz-footer-main {
          padding: 40px 0;
          border-bottom: 1px solid #3a4553;
        }

        .amz-footer-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 30px;
        }

        .amz-footer-col h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 14px;
        }

        .amz-footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .amz-footer-col ul li {
          margin-bottom: 8px;
        }

        .amz-footer-col ul li a {
          color: #dddddd;
          text-decoration: none;
          font-size: 0.82rem;
          transition: color 0.15s;
        }

        .amz-footer-col ul li a:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .amz-footer-bottom {
          background-color: #131921;
          padding: 30px 0;
          text-align: center;
        }

        .amz-bottom-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .amz-footer-brand {
          display: flex;
          align-items: baseline;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          color: white;
        }

        .amz-brand-sub {
          color: #febd69;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .amz-bottom-content p {
          font-size: 0.75rem;
          color: #999999;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
