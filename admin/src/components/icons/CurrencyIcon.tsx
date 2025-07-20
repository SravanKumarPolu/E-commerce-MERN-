import React from 'react';

interface CurrencyIconProps {
  className?: string;
  size?: number;
}

const CurrencyIcon: React.FC<CurrencyIconProps> = ({ 
  className = "w-6 h-6", 
  size 
}) => {
  const iconSize = size ? `${size}px` : undefined;
  
  return (
    <svg 
      className={className}
      style={{ width: iconSize, height: iconSize }}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
      />
    </svg>
  );
};

export default CurrencyIcon; 