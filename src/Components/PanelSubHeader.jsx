import PropTypes from 'prop-types';
import React from 'react';

function PanelSubHeader({ className = '', children = '' }) {
  return (
    <div className={`bg-mlmgray-400 px-6 py-3 text-mlmgray-900 ${className}`}>
      {children}
    </div>
  );
}

PanelSubHeader.propTypes = {
  children: PropTypes.any,
};

export default PanelSubHeader;
