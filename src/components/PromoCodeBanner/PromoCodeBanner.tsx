import React from 'react';
import { toast } from 'react-toastify';
import { usePromoCode } from '../../hooks/usePromoCode';
import './PromoCodeBanner.css';

const PromoCodeBanner: React.FC = () => {
  const { availablePromoCodes, isLoadingAvailable, availableError } = usePromoCode();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`Promo code ${code} copied to clipboard!`);
    });
  };

  const formatValidUntil = (validUntil?: string) => {
    if (!validUntil) return null;
    try {
      const date = new Date(validUntil);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return validUntil;
    }
  };

  if (isLoadingAvailable) {
    return (
      <div className="promo-banner">
        <div className="promo-banner-header">
          <h2>Active Promo Codes</h2>
          <p>Loading available discounts...</p>
        </div>
        <div className="promo-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (availableError && availablePromoCodes.length === 0) {
    return (
      <div className="promo-banner">
        <div className="promo-banner-header">
          <h2>Promo Codes</h2>
          <p>Unable to load promo codes at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promo-banner">
      <div className="promo-banner-header">
        <h2>Active Promo Codes</h2>
      </div>

      <div className="promo-codes-flex">
        {availablePromoCodes.map(promo => (
          <div key={promo.code} className="promo-code-card">
            <div className="promo-code-badge">
              <div className="label">Discount up to</div>
              <span className="promo-discount">{promo.discount}</span>
            </div>

            <div className="promo-code-content">
              <div className="promo-code-text">
                <h3>{promo.code}</h3>
              </div>
              <p className="promo-description">{promo.description}</p>
              {promo.validUntil && (
                <span className="promo-valid">
                  Valid until {formatValidUntil(promo.validUntil)}
                </span>
              )}
              <button
                className="copy-code-btn"
                onClick={() => copyToClipboard(promo.code)}
                title="Copy code"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5.6 15.2C4.72 15.2 4 14.48 4 13.6V5.6C4 4.72 4.72 4 5.6 4H13.6C14.48 4 15.2 4.72 15.2 5.6M10.4 8.8H18.4C19.2837 8.8 20 9.51634 20 10.4V18.4C20 19.2837 19.2837 20 18.4 20H10.4C9.51634 20 8.8 19.2837 8.8 18.4V10.4C8.8 9.51634 9.51634 8.8 10.4 8.8Z"
                    stroke="#FFFFFF"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoCodeBanner;
