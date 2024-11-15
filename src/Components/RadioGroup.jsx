import { classNames } from '@/Providers/helpers.js';

export default function RadioGroup({
  onChange,
  options = [],
  value = '',
  className = '',
  name,
  inputClassName,
  ...props
}) {
  return (
    <div
      className={classNames(
        ' flex w-full flex-wrap items-center gap-4',
        className
      )}
    >
      {options &&
        options.map(option => (
          <div key={option.value} className="flex items-center">
            <input
              //id={option.value.concat(name)} include this as id option.value makes error if multiple radios have same options
              id={option.value.concat(name)}
              name={name}
              type="radio"
              checked={option.value === value}
              value={option.value}
              className={classNames(
                'h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-500 disabled:ring-gray-200',
                inputClassName
              )}
              onChange={e => onChange(e.target.value)}
              {...props}
            />
            <label
              htmlFor={option.value.concat(name)}
              className="block ml-3 text-sm font-normal leading-6 text-latisGray-900"
            >
              {option.label}
            </label>
          </div>
        ))}
    </div>
  );
}
