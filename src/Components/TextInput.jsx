import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

export default function TextInput({
  type = 'text',
  name,
  id = '',
  value = '',
  className = '',
  autoComplete,
  required,
  isFocused,
  handleChange,
  placeholder,
  readOnly,
  altInput = false,
  disabled = false,
}) {
  const input = useRef();
  const [viewType, setViewType] = useState(type === 'password');
  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  return (
    <div className="flex w-full flex-col items-start">
      <input
        id={id}
        type={type === 'password' ? (viewType ? 'password' : 'text') : type}
        name={name}
        value={value}
        className={` z-0  block w-full rounded-md border-latisGray-600 py-2 focus:border-latisSecondary-800 focus:ring-latisSecondary-800 sm:text-sm ${className}
            `}
        readOnly={false}
        ref={input}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        onChange={e => handleChange(e)}
        disabled={disabled}
      />
      {type == 'password' && (
        <div
          className={`w-full ${className} -mt-7 flex flex-row-reverse text-right`}
        >
          <div
            className="z-20 mx-2 cursor-pointer bg-white px-1"
            onClick={() => setViewType(pre => !pre)}
          >
            {viewType ? (
              <EyeSlashIcon className="z-20 h-5 w-5 text-latisGray-800" />
            ) : (
              <EyeIcon className="z-20 h-5 w-5 text-latisGray-800" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
