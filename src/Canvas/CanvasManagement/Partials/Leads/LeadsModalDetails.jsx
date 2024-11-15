import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  PencilIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import React, { Fragment, useState } from 'react';
import LeadActivities from './LeadActivities';
import NotesIcon from '../../../CanvasIcons/NotesIcon';
import InputLabel from '@/Components/InputLabel';
import ReactSelect from '@/Components/ReactSelect';
import { classNames } from '@/Providers/helpers';

const LeadsModalDetails = ({
  isLeadBarOpen,
  setIsLeadBarOpen,
  leadData,
  view,
  dataLoading,
  setLeadData,
  className,
  isManage,
  title,
  manageComponent,
  userData,
}) => {
  const [selected, setSelected] = useState(0);

  return (
    <Transition show={isLeadBarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsLeadBarOpen(false)}
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

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-full p-4 sm:p-0">
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
                  'fixed right-0 top-0 z-10 h-[100vh] overflow-y-auto border-l bg-white transition-all duration-300 '
                )}
              >
                <div className="z-50 flex w-full justify-between border-b bg-white p-4">
                  <h1 className="text-base font-semibold text-latisGray-900">
                    {title ? title : 'Lead'}
                  </h1>
                  <span
                    className="cursor-pointer"
                    onClick={e => {
                      e.preventDefault();
                      setIsLeadBarOpen(false);
                      setSelected(0);
                      view.popup.close();
                      setLeadData({});
                    }}
                  >
                    <XMarkIcon className="h-6 w-6 text-latisGray-800" />
                  </span>
                </div>
                <div className="w-full pt-4">
                  <div className="sticky top-0 z-50 flex w-full flex-col gap-4 border-b border-latisGray-400 bg-white pb-6">
                    {userData && userData.length > 0 ? (
                      userData.map(lead => (
                        <div
                          key={lead.id}
                          className="flex w-full justify-between px-5"
                        >
                          <div className="space-y-2">
                            <h2 className="flex w-full items-center gap-2 text-base font-semibold">
                              {'Diane Gerson'}
                            </h2>
                            <span className="text-sm font-normal text-latisGray-800">
                              {lead?.address?.street}, {lead?.address?.city},{' '}
                              {lead?.address?.state}, {lead?.address?.country},{' '}
                              {lead?.address?.zip_code},{' '}
                              {lead?.address?.house_number}
                            </span>
                          </div>
                          <div>
                            <PencilIcon className="h-6 w-6 text-latisGray-800" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No user selected.</p>
                    )}
                    <div className="mx-auto flex items-center gap-6 px-4">
                      <div className="bg-latisSe w-fit rounded-full border border-latisGray-400 bg-latisSecondary-500 p-2">
                        <PhoneIcon className="h-6 w-6 text-latisSecondary-800" />
                      </div>
                      <div className="w-fit rounded-full border border-latisGray-400 bg-latisSecondary-500 p-2">
                        <ChatBubbleLeftIcon className="h-6 w-6 text-latisSecondary-800" />
                      </div>
                      <div className="w-fit rounded-full border border-latisGray-400 bg-latisSecondary-500 p-2">
                        <EnvelopeIcon className="h-6 w-6 text-latisSecondary-800" />
                      </div>
                      <div className="w-fit rounded-full border border-latisGray-400 bg-latisSecondary-500 p-2">
                        <NotesIcon className="h-5 w-6 text-latisSecondary-800 opacity-70" />
                      </div>
                    </div>

                    <div className="w-full space-y-3 border-t border-latisGray-400 px-4 pt-4">
                      <div>
                        <InputLabel
                          className="text-sm font-normal leading-5 text-latisGray-900"
                          value="Stage"
                        />
                        <ReactSelect />
                      </div>
                      <div>
                        <InputLabel
                          className="text-sm font-normal leading-5 text-latisGray-900"
                          value="Owner"
                        />
                        <ReactSelect />
                      </div>
                    </div>
                  </div>
                  <LeadActivities userData={userData} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LeadsModalDetails;
