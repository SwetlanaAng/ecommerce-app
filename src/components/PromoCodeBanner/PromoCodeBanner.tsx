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
          <h2>🎁 Active Promo Codes</h2>
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
          <h2>🎁 Promo Codes</h2>
          <p>Unable to load promo codes at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promo-banner">
      <div className="promo-banner-header">
        <h2>🎁 Active Promo Codes</h2>
        <p>Save money on your next purchase!</p>
      </div>

      <div className="promo-codes-grid">
        {availablePromoCodes.map(promo => (
          <div key={promo.code} className="promo-code-card">
            <div className="promo-code-badge">
              <span className="promo-discount">{promo.discount}</span>
            </div>

            <div className="promo-code-content">
              <div className="promo-code-text" onClick={() => copyToClipboard(promo.code)}>
                <h4>{promo.code}</h4>
              </div>
              <p className="promo-description">{promo.description}</p>
              {promo.validUntil && (
                <span className="promo-valid">
                  Valid until {formatValidUntil(promo.validUntil)}
                </span>
              )}
            </div>

            <button
              className="copy-code-btn"
              onClick={() => copyToClipboard(promo.code)}
              title="Copy code"
            >
              📋 Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoCodeBanner;
