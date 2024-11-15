import React from 'react';

export default function SecondaryButton({
  type = 'submit',
  className = '',
  processing,
  children,
  onClick,
}) {
  return (
    <button
      type={type}
      className={`min-w-36 rounded border border-latisGray-600 bg-white py-1.5 text-sm font-normal leading-6 text-latisGray-900  focus:outline-none focus:ring-2 focus:ring-latisGray-600 focus:ring-offset-2 ${
        processing && 'opacity-25'
      } ${className}`}
      disabled={processing}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
