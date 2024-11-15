import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { classNames } from '@/Providers/helpers';
import React, { Fragment } from 'react';
import ReactSelect from './ReactSelect';

const CustomizationSettingSidebar = ({ onClose, show, className }) => {
  const fontOptions = [
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
  ];

  const sizeOptions = [
    { value: '24', label: '24' },
    { value: '22', label: '22' },
    { value: '20', label: '20' },
  ];

  return (
    <Transition.Root show={show}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 w-0"
          enterTo="opacity-100 w-[100%]"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 w-[100%]"
          leaveTo="opacity-0 w-[0%]"
        >
          <div className={classNames('fixed inset-0   transition-opacity')} />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 w-0 duration-300"
          enterTo="opacity-100 w-[18%]"
          leave="ease-in w-0 duration-200"
          leaveFrom="opacity-100 w-[18%]"
          leaveTo="opacity-0 w-0 duration-300"
        >
          <div
            className={classNames(
              'duration-400 fixed right-0 top-0 z-10 h-[100vh] overflow-y-auto border-l bg-white transition-all'
            )}
          >
            <Dialog.Panel
              className={classNames('w-full  transition-all', className)}
            >
              <div className="min-h-screen border border-gray-100 bg-white ">
                <div className="flex w-full items-center justify-between border-b p-6 leading-5">
                  <h2 className="text-sm font-semibold text-latisGray-900">
                    Settings
                  </h2>
                  <span onClick={onClose}>
                    <XMarkIcon className="h-6 w-6 cursor-pointer text-latisGray-900" />
                  </span>
                </div>

                <div className="mt-3 space-y-4 p-6">
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-normal text-latisGray-900">
                      Header
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                      <ReactSelect options={fontOptions} placeholder="Robot" />
                      <ReactSelect options={sizeOptions} placeholder="24" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-normal text-latisGray-900">
                      Question
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                      <ReactSelect options={fontOptions} placeholder="Robot" />
                      <ReactSelect options={sizeOptions} placeholder="24" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-normal text-latisGray-900">
                      Text
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                      <ReactSelect options={fontOptions} placeholder="Robot" />
                      <ReactSelect options={sizeOptions} placeholder="24" />
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default CustomizationSettingSidebar;
