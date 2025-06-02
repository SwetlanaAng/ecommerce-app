import React from 'react';
import { useAnimatedPrice } from '../../features/cart/hooks/useAnimatedPrice';
import './AnimatedPrice.css';

interface AnimatedPriceProps {
  value: number;
  currency?: string;
  className?: string;
  duration?: number;
  precision?: number;
}

const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  value,
  currency = '$',
  className = '',
  duration = 300,
  precision = 2,
}) => {
  const { formattedValue, isAnimating } = useAnimatedPrice({
    targetValue: value,
    duration,
    precision,
  });

  return (
    <span className={`animated-price ${className} ${isAnimating ? 'animating' : ''}`}>
      {currency}
      {formattedValue}
    </span>
  );
};

export default AnimatedPrice;
