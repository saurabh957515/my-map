import { classNames } from '@/Providers/helpers';
import React from 'react';

export default function Checkbox({ name, value, handleChange, id, className }) {
  return (
    <input
      type="checkbox"
      id={id}
      name={name}
      value={value}
      className={classNames(
        'rounded border-gray-300 text-sky-700 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50',
        className
      )}
      onChange={e => handleChange(e)}
      checked={value}
    />
  );
}
