import React from 'react';

export default function DangerButton({
  type = 'submit',
  className = '',
  processing,
  children,
  onClick,
}) {
  return (
    <button
      type={type}
      className={`inline-flex w-64 items-center justify-center rounded-full border border-mlmred-700 bg-mlmgray-100 py-1.5 text-xs font-bold uppercase text-mlmred-700 hover:bg-mlmred-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-mlmred-700 focus:ring-offset-2 ${
        processing && 'opacity-25'
      } ${className}`}
      disabled={processing}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
