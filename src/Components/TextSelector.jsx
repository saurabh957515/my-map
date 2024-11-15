import React from 'react';

function TextSelector({
  name,
  value,
  className = '',
  autoComplete,
  required,
  isFocused,
  handleChange,
  placeholder,
  altText = false,
  children,
}) {
  return (
    <div className="flex flex-col items-start">
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        autoComplete={autoComplete}
        className={
          `block w-full rounded-md border-0 py-1.5 focus:border-mlmblue-400 focus:ring-mlmblue-400 sm:text-sm ` +
          className +
          (altText ? ' bg-white' : ' bg-mlmgray-200')
        }
        placeholder={placeholder}
        required={required}
        autoFocus={isFocused}
      >
        {children}
      </select>
    </div>
  );
}

export default TextSelector;
