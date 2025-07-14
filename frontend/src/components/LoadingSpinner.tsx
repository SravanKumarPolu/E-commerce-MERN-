import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-2 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 