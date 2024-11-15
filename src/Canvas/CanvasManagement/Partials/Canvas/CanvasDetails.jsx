import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { classNames } from '@/Providers/helpers';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const CanvasDetailsModal = ({
  isCanvasOpen,
  setIsCanvasOpen,
  view,
  setLeadData,
  className,
  title,
  userData,
}) => {
  return (
    <Transition appear show={isCanvasOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 "
        onClose={() => setIsCanvasOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 w-0"
          enterTo="opacity-100 w-[100%]"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 w-[100%]"
          leaveTo="opacity-0 w-[0%]"
        >
          <div className="fixed inset-0 bg-black bg-opacity-35 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 w-0 duration-300"
              enterTo="opacity-100 w-[20%]"
              leave="ease-in w-0 duration-200"
              leaveFrom="opacity-100 w-[20%]"
              leaveTo="opacity-0 w-0 duration-300"
            >
              <Dialog.Panel
                className={classNames(
                  'duration-400 fixed right-0 top-0 z-10 h-[100vh]  w-full max-w-xs items-start overflow-y-auto border-l bg-white transition-all'
                )}
              >
                <div className="flex w-full justify-between border-b bg-white p-4">
                  <Dialog.Title
                    as="h1"
                    className="text-base font-semibold text-latisGray-900"
                  >
                    {title ? title : 'Lead'}
                  </Dialog.Title>
                  <span
                    className="cursor-pointer"
                    onClick={e => {
                      e.preventDefault();
                      setIsCanvasOpen(false);
                      view.popup.close();
                      setLeadData({});
                    }}
                  >
                    <XMarkIcon className="h-6 w-6 text-latisGray-800" />
                  </span>
                </div>

                <div className="w-full pt-4">
                  <div className="sticky top-0 z-50 flex w-full flex-col gap-4 bg-white pb-4 ">
                    {userData && userData.length > 0 ? (
                      userData.map(user => (
                        <div className="w-full px-5 " key={user.id}>
                          <div className="space-y-2 border-b border-latisGray-400 pb-6">
                            <h2 className="flex w-full justify-between text-base font-semibold">
                              <div>
                                <span className="mr-1 inline-block h-9 w-9 place-items-center rounded-full bg-latisSecondary-700 text-center leading-9 text-white">
                                  {`${user.name?.charAt(0) || ''}${
                                    user.name?.split(' ')[1]?.charAt(0) || ''
                                  }`.toUpperCase()}
                                </span>
                                <span> {user.name}</span>
                              </div>
                              <span
                                className={`rounded-full px-2  text-sm capitalize leading-9 ${
                                  user.status === 'active'
                                    ? 'bg-latisGreen-50 text-latisGreen-800'
                                    : 'bg-latisRed-100 text-latisRed-900'
                                }`}
                              >
                                {user.status}
                              </span>{' '}
                            </h2>
                            <span className="flex items-center space-x-1 pt-1 text-xs font-normal text-latisGray-800">
                              <EnvelopeIcon className="mr-1.5 h-5 w-5 text-latisGray-800" />
                              {user?.email}
                            </span>
                            <span className="flex items-center space-x-1 pt-1 text-xs font-normal text-latisGray-800">
                              <PhoneIcon className="mr-1.5 h-5 w-5 text-latisGray-800" />
                              {'+1-212-456-7890'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No user selected.</p>
                    )}
                  </div>
                  <div className="mx-5 ">
                    <h3 className="font-semibold text-gray-800">
                      Leads Information
                    </h3>
                    <div className="mt-3">
                      <p className="mb-2 text-sm text-latisSecondary-700">
                        Total Leads
                      </p>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          110
                        </span>
                        <span className="ml-5 mr-3 flex items-center rounded-md bg-latisRed-100 px-1 py-0.5 text-sm text-latisRed-900">
                          <ArrowDownIcon className="mr-1.5 h-3.5 w-3.5" />
                          3.58%
                        </span>
                        <span className="text-xs text-latisGray-800">
                          Compared to last month
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="mb-2 text-sm text-latisSecondary-700">
                        Contacted Leads
                      </p>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          80
                        </span>
                        <span className="ml-5 mr-3 flex items-center rounded-md bg-latisGreen-50 px-1 py-0.5 text-sm text-latisGreen-800">
                          <ArrowUpIcon className="mr-1.5 h-3.5 w-3.5" />
                          1.58%
                        </span>
                        <span className="text-xs text-latisGray-800">
                          Compared to last month
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="mb-2 text-sm text-latisSecondary-700">
                        Won Leads
                      </p>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          20
                        </span>
                        <span className="ml-5 mr-3 flex items-center rounded-md bg-latisGreen-50 px-1 py-0.5 text-sm text-latisGreen-800">
                          <ArrowUpIcon className="mr-1.5 h-3.5 w-3.5" />
                          2.58%
                        </span>
                        <span className="text-xs text-latisGray-800">
                          Compared to last month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CanvasDetailsModal;
