import { classNames } from '@/Providers/helpers.js';

export default function CheckBoxGroup({
  onChange,
  name = '',
  options = [],
  value = [],
  className = '',
  disabled = false,
}) {
  const isSelected = optionValue => value.includes(optionValue);
  return (
    <div
      className={classNames(
        'space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0',
        className
      )}
    >
      {options?.map(option => (
        <div key={option.value} className="flex items-center">
          <input
            id={option.value}
            name={name}
            type="checkbox"
            checked={isSelected(option.value)}
            value={option.value}
            className={
              'rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-500 disabled:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800'
            }
            onChange={e => {
              let newValues = [...value];
              if (e.target.checked) {
                newValues.push(e.target.value);
              } else {
                newValues = newValues.filter(val => val !== e.target.value);
              }
              onChange(newValues);
            }}
            disabled={disabled}
          />
          <label
            htmlFor={option.value}
            className="ml-3 block text-sm font-medium leading-6 text-gray-900"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}
