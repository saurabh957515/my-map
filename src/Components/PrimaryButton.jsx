import React from 'react';

export default function PrimaryButton({
  type = 'submit',
  className = '',
  processing,
  children,
  onClick,
}) {
  return (
    <button
      type={type}
      className={
        `min-w-36  rounded border border-latisGray-400  px-4 py-2 text-sm leading-6  duration-300   focus:outline-none focus:ring-2 focus:ring-latisSecondary-900 focus:ring-offset-2  ${
          processing
            ? 'bg-latisGray-400 text-latisGray-700 opacity-80'
            : 'bg-latisSecondary-800 text-white  hover:bg-latisSecondary-900 '
        } ` + className
      }
      disabled={processing}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
