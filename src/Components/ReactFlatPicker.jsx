import React, { useEffect, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { classNames } from '@/Providers/helpers';

function ReactFlatPicker({
  value,
  options = {},
  handleChange,
  className = '',
  timeDuration,
}) {
  return (
    <Flatpickr
      value={value}
      onChange={handleChange}
      className={classNames(
        'mt-2 w-full rounded-md border border-latisGray-600 p-2 text-sm',
        className
      )}
      enableTime={true}
    />
  );
}

export default ReactFlatPicker;
