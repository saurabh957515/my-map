import React from 'react';

const NotesIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
    >
      <path d="M13.6 16H2.4C1.07452 16 0 14.9255 0 13.6V0.8C0 0.358176 0.358176 0 0.8 0H12C12.4418 0 12.8 0.358176 12.8 0.8V10.4H16V13.6C16 14.9255 14.9255 16 13.6 16ZM12.8 12V13.6C12.8 14.0418 13.1582 14.4 13.6 14.4C14.0418 14.4 14.4 14.0418 14.4 13.6V12H12.8ZM11.2 14.4V1.6H1.6V13.6C1.6 14.0418 1.95818 14.4 2.4 14.4H11.2ZM3.2 4H9.6V5.6H3.2V4ZM3.2 7.2H9.6V8.8H3.2V7.2ZM3.2 10.4H7.2V12H3.2V10.4Z" />
    </svg>
  );
};

export default NotesIcon;
