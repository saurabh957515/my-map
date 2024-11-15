import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import React from 'react';
import TextInput from './TextInput';
import AddListButton from './AddListButton';

function Panel({
  className = '',
  header = '',
  children = '',
  childrenClass = '',
  manageProperties = '',
  addList,
  isChecked = true,
  lists,
  listTitle,
}) {
  return (
    <div
      className={`flex h-full flex-col border-r bg-latisGray-300 px-5 py-6 ${className}`}
    >
      <div className="grid grid-cols-4 justify-between gap-y-5 text-xl font-bold leading-6">
        <div className="col-span-2 flex justify-between font-semibold">
          {header}
        </div>
        {manageProperties}

        <div className="relative col-span-4 flex w-full items-center justify-between space-x-2.5">
          <div className="w-full space-x-2.5">
            <TextInput
              className="bg-latisGray-300 py-2 pl-8 text-sm font-normal text-latisGray-700 placeholder-latisGray-700"
              value={''}
              placeholder="Search by name"
              handleChange={() => {}}
            />
            <MagnifyingGlassIcon
              className="absolute left-0 top-0 my-2.5 ml-3 h-5 w-5 text-latisGray-700"
              aria-hidden="true"
            />
          </div>
          {isChecked && <AddListButton onClick={addList} />}
        </div>
      </div>
      {lists && (
        <div className="mb-2.5 mt-6 text-xs capitalize text-latisSecondary-700">
          {lists?.length} {listTitle || header} Total
        </div>
      )}
      <div
        className={` scrollbar-hide flex grow flex-col space-y-2.5 overflow-auto ${childrenClass}`}
      >
        {children}
      </div>
    </div>
  );
}

Panel.propTypes = {
  header: PropTypes.any,
  children: PropTypes.any,
};

export default Panel;
