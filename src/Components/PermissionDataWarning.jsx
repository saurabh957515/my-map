import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import PropTypes from 'prop-types';

function PermissionDataWarning({ title, message }) {
  return (
    <div className="m-12 text-center">
      <ExclamationTriangleIcon
        className="mx-auto h-12 w-12 text-mlmblue-700"
        aria-hidden="true"
      />
      <h3 className="mt-2 text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

PermissionDataWarning.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default PermissionDataWarning;
