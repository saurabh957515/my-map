import React from 'react';

const PolygonIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 6.32703C20 7.05993 19.3875 7.65406 18.6319 7.65406C18.6175 7.65406 18.6031 7.65385 18.5888 7.65341L15.5223 16.4653C15.9944 16.6746 16.3225 17.1366 16.3225 17.673C16.3225 18.4059 15.71 19 14.9544 19C14.1988 19 13.5862 18.4059 13.5862 17.673C13.5862 17.3855 13.6804 17.1195 13.8405 16.9022L6.35822 12.3101C6.10906 12.5635 5.7576 12.7213 5.36813 12.7213C4.61253 12.7213 4 12.1272 4 11.3943C4 10.6614 4.61253 10.0673 5.36813 10.0673C5.73866 10.0673 6.07479 10.2101 6.32116 10.4422L17.2712 6.46621C17.2663 6.42047 17.2637 6.37404 17.2637 6.32703C17.2637 5.59413 17.8763 5 18.6319 5C19.3875 5 20 5.59413 20 6.32703ZM14.4108 15.7866L7.2865 11.4142L17.1829 7.82078L14.4108 15.7866Z"
      />
    </svg>
  );
};

export default PolygonIcon;
