import React, { useEffect, useRef } from 'react';

export default function SelectInput({
  name,
  value,
  options,
  className,
  autoComplete,
  required,
  isFocused,
  handleChange,
  placeholder,
}) {
  const input = useRef();

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-start">
      <select
        name={name}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        ref={input}
        className={`mt-1 block w-full rounded-md border-0 bg-mlmgray-200 py-1.5 focus:border-mlmblue-400 focus:ring-mlmblue-400 sm:text-sm ${className}`}
        onChange={e => handleChange(e)}
        value={value}
      >
        {placeholder ? <option value="">{placeholder}</option> : ''}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
