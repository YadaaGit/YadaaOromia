import React from 'react';

export const Button = ({ children, className, size = 'md', variant = 'solid', ...props }) => {
  const sizeStyles = {
    md: 'px-4 py-2 text-sm',
    icon: 'p-2',
  };

  const variantStyles = {
    solid: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'text-gray-600 hover:text-blue-600',
  };

  return (
    <button
      {...props}
      className={`rounded-xl transition font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
