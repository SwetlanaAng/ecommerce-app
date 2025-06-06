import { useState, useEffect, useRef } from 'react';

interface UseAnimatedPriceProps {
  targetValue: number;
  duration?: number;
  precision?: number;
}

export const useAnimatedPrice = ({
  targetValue,
  duration = 300,
  precision = 2,
}: UseAnimatedPriceProps) => {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>();

  useEffect(() => {
    if (currentValue === targetValue) return;

    setIsAnimating(true);
    startValueRef.current = currentValue;
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || 0);
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const newValue =
        startValueRef.current! + (targetValue - startValueRef.current!) * easeOutQuart;

      setCurrentValue(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, currentValue]);

  return {
    value: Number(currentValue.toFixed(precision)),
    isAnimating,
    formattedValue: currentValue.toFixed(precision),
  };
};
