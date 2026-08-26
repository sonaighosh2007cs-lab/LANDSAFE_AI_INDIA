import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatCommas?: boolean;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 900,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  formatCommas = true,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const prevValueRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    const startTime = performance.now();

    // Ease-out cubic curve for smooth, natural deceleration
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const updateNumber = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateNumber);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  // Format value with decimals and optional comma grouping
  let formattedNumber = displayValue.toFixed(decimals);
  if (formatCommas) {
    const parts = formattedNumber.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedNumber = parts.join('.');
  }

  return (
    <span className={`inline-block tabular-nums font-mono transition-colors ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
