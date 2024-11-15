import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';

function Popup({
  header,
  children,
  open,
  setOpen,
  size = 'sm',
  className = '',
}) {
  let sizeClass = '';

  if (size === 'xs') {
    sizeClass = 'sm:max-w-xl';
  } else if (size === 'sm') {
    sizeClass = 'sm:max-w-2xl';
  } else if (size === 'md') {
    sizeClass = 'sm:max-w-4xl';
  } else if (size === 'lg') {
    sizeClass = 'sm:max-w-6xl';
  } else if (size === 'xl') {
    sizeClass = 'sm:max-w-7xl';
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`w-full rounded-lg bg-white px-7 py-6 ${sizeClass} ${className}`}
              >
                <h2 className="mb-7 flex  justify-between border-mlmgray-400 text-xl font-semibold leading-6 text-mlmgray-900">
                  {header}
                  {/* try the setOpen(false) */}
                  <span onClick={setOpen}>
                    <XMarkIcon className="h-6 w-6 cursor-pointer" />
                  </span>
                </h2>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

Popup.propTypes = {
  children: PropTypes.any,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default Popup;
