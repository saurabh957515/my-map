import React from 'react';

export default function InputLabel({
  forInput,
  value,
  className = '',
  children,
  required = false,
}) {
  return (
    <label
      htmlFor={forInput}
      className={`block pb-1 text-sm capitalize text-gray-700  ${className}`}
    >
      {value || children}
      {required && <span className="ml-1 font-medium text-mlmred-700">*</span>}
    </label>
  );
}
