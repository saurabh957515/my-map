// React component
import React from 'react';

export default function ElipseCircle({ className, ...props }) {
  return (
    <svg
      {...props}
      className={className}
      width="5"
      height="5"
      viewBox="0 0 4 4"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_390_178)">
        <circle cx="2" cy="2" r="2" />
      </g>
      <defs>
        <clipPath id="clip0_390_178">
          <rect width="32" height="47" />
        </clipPath>
      </defs>
    </svg>
  );
}
