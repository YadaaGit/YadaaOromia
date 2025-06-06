import React from 'react';

export const Input = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={`px-4 py-2 w-full border border-gray-300 rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
    />
  );
};
