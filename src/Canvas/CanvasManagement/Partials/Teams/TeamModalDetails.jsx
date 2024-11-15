import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { classNames } from '@/Providers/helpers';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const TeamModalDetails = ({
  isTeamModalOpen,
  setIsTeamModalOpen,
  view,
  setLeadData,
  className,
  title,
  userData,
}) => {
  return (
    <Transition appear show={isTeamModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 "
        onClose={() => setIsTeamModalOpen(false)}
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
          <div className="min-h-full p-4 ">
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
                  'fixed right-0 top-0 z-10 h-[100vh] overflow-y-auto border-l bg-white transition-all duration-300  '
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
                      setIsTeamModalOpen(false);
                      setSelected(0);
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
                            <h2 className="flex w-full text-base font-semibold">
                              <span>{user.name}</span>
                            </h2>
                            <span className="flex items-center space-x-1 text-sm font-normal text-latisGray-800">
                              Created date :{' '}
                              <span className="ml-1 text-sm font-medium text-latisPrimary-900">
                                {' '}
                                {moment(user?.created_at).format(
                                  'DD-MM-YYYY / hh:mm A'
                                )}
                              </span>
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

export default TeamModalDetails;
