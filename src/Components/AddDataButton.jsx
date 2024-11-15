import PropTypes from 'prop-types';
import { PlusIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { classNames } from '@/Providers/helpers';

function AddDataButton({ className, onClick = () => {}, label, icon }) {
  return (
    <div
      className={classNames(
        'flex items-center space-x-1 text-sm font-normal text-latisSecondary-800',
        className
      )}
      onClick={e => onClick(e)}
    >
      {icon ? icon : <PlusIcon className="h-6 w-7" aria-hidden="true" />}
      <span className="">{label}</span>
    </div>
  );
}

AddDataButton.propTypes = {
  classNames: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.any,
};

export default AddDataButton;
