import React from 'react';
import './DiscountInfo.css';
import { ActivePromoCode } from '../../hooks/usePromoCode';

interface DiscountInfoProps {
  appliedDiscounts?: Array<{
    discountType: 'product' | 'cart';
    discountAmount: number;
    discountId?: string;
  }>;
  className?: string;
  activePromoCodes?: ActivePromoCode[];
}

const DiscountInfo: React.FC<DiscountInfoProps> = ({
  appliedDiscounts,
  className = '',
  activePromoCodes,
}) => {
  if (!appliedDiscounts || appliedDiscounts.length === 0) {
    return null;
  }

  return (
    <div className={`discount-info ${className}`}>
      {appliedDiscounts.map((discount, index) => {
        const promoCode = activePromoCodes?.find(pc => pc.id === discount.discountId);
        const discountName = promoCode?.code || (discount.discountType === 'product' ? 'Sale' : '');

        if (!discountName) {
          return null;
        }

        return (
          <div key={index} className={`discount-badge ${discount.discountType}`}>
            <span className="discount-type">{discountName}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DiscountInfo;
