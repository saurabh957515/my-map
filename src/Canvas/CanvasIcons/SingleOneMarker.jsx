import React from 'react';

const SingleOneMarker = ({ className, fillColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className={className}
    >
      <g filter="url(#filter0_d_8083_7507)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 28C26.6274 28 32 22.6274 32 16C32 9.37258 26.6274 4 20 4C13.3726 4 8 9.37258 8 16V28H20Z"
          fill="white"
        />
        <path
          d="M31.5 16C31.5 22.3513 26.3513 27.5 20 27.5H8.5V16C8.5 9.64873 13.6487 4.5 20 4.5C26.3513 4.5 31.5 9.64873 31.5 16Z"
          stroke="#EFEEED"
        />
      </g>

      <svg
        x="12"
        y="7"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="18"
        viewBox="0 0 16 18"
        fill="none"
      >
        <circle cx="8" cy="9" r="8" fill={fillColor} />
        <path d="M6.156 5.56V4.54H8.58V13H7.428V5.56H6.156Z" fill="white" />
      </svg>
    </svg>
  );
};

export default SingleOneMarker;
