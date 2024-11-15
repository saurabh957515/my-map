import React from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ComboboxSelector({
  title,
  altCombobox = false,
  className = '',
  placeholder,
  people = [],
  selectedObj,
  selectedValue,
  handelChange,
  query = '',
  name,
  required,
}) {
  const filteredData =
    query === ''
      ? people
      : people.filter(person =>
          person.name.toLowerCase().includes(query?.toLowerCase())
        );

  return (
    <Combobox as="div" value={selectedValue} onChange={selectedObj}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {title || ''}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className={`block w-full rounded-md border-0 py-1.5 focus:border-mlmblue-400 focus:ring-mlmblue-400 sm:text-sm ${className}
            ${altCombobox ? ' bg-white' : ' bg-mlmgray-200'}
          `}
          name={name}
          onChange={e => handelChange(e)}
          displayValue={person => person?.name}
          placeholder={placeholder}
          required={required}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredData.length >= 0 && (
          <Combobox.Options
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md
                     bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredData.map(person => (
              <Combobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-mlmblue-400 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        'block truncate',
                        selected && 'font-semibold'
                      )}
                    >
                      {person.name.replaceAll('_', ' ')}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
