import React from 'react';
import AnimatedPrice from '../AnimatedPrice/AnimatedPrice';
import './PriceDisplay.css';

interface PriceDisplayProps {
  totalPrice: number;
  discountedAmount?: number;
  currencyCode: string;
  hasPromoCodes: boolean;
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  totalPrice,
  discountedAmount = 0,
  hasPromoCodes,
  className = '',
}) => {
  const showOriginalPrice = hasPromoCodes && discountedAmount > 0;

  return (
    <div className={`price-display ${className}`}>
      <div className={`final-price ${showOriginalPrice ? 'discounted' : ''}`}>
        <AnimatedPrice value={totalPrice} className="final-price-amount" />
      </div>
      {showOriginalPrice && (
        <div className="savings">
          You save: <AnimatedPrice value={discountedAmount} className="savings-amount" />
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
