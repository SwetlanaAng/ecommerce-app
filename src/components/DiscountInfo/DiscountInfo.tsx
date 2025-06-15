import React from 'react';
import './DiscountInfo.css';

interface DiscountInfoProps {
  appliedDiscounts?: Array<{
    discountType: 'product' | 'cart';
    discountAmount: number;
    discountId?: string;
  }>;
  className?: string;
}

const DiscountInfo: React.FC<DiscountInfoProps> = ({ appliedDiscounts, className = '' }) => {
  if (!appliedDiscounts || appliedDiscounts.length === 0) {
    return null;
  }

  return (
    <div className={`discount-info ${className}`}>
      {appliedDiscounts.map((discount, index) => (
        <div key={index} className={`discount-badge ${discount.discountType}`}>
          <span className="discount-type">
            {discount.discountType === 'product' ? 'Sale' : 'HOLIDAY15'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DiscountInfo;
