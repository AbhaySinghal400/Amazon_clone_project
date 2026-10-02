import React from 'react';
import { Link } from 'react-router-dom';

const AmazonLogo = ({ variant = 'light', size = 'medium', showMarketplace = true, linkTo = '/' }) => {
  // Color presets
  const isLight = variant === 'light'; // Used on dark backgrounds like #131921
  const textColor = isLight ? '#ffffff' : '#111827';
  const domainColor = '#febd69';
  const arrowColor = '#ff9900';

  const fontSizes = {
    small: '1.2rem',
    medium: '1.5rem',
    large: '2.2rem'
  };

  const currentSize = fontSizes[size] || fontSizes.medium;

  const logoContent = (
    <div className={`amazon-logo-brand ${variant}`} style={{ fontSize: currentSize }}>
      <div className="logo-main-text">
        <span className="logo-name" style={{ color: textColor }}>amazon</span>
        <span className="logo-domain" style={{ color: domainColor }}>.in</span>
        {showMarketplace && <span className="logo-tag">marketplace</span>}
      </div>

      {/* Iconic Amazon Smile Arrow Curve */}
      <svg 
        className="amazon-smile-svg" 
        viewBox="0 0 165 35" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curved smile path from a to z */}
        <path 
          d="M 12 10 C 45 28, 115 28, 142 12" 
          stroke={arrowColor} 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />
        {/* Smile arrow tip at the right */}
        <path 
          d="M 136 7 L 146 12 L 138 20 C 141 15, 144 14, 136 7 Z" 
          fill={arrowColor}
        />
      </svg>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="amazon-logo-link" style={{ textDecoration: 'none' }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default AmazonLogo;
