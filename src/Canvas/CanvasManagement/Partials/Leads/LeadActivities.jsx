import {
  ChatBubbleLeftIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import { Tab } from '@headlessui/react';
import { classNames } from '@/Providers/helpers';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import LogActivity from '../../../LeadBar/Partials/LogActivity';
import AddNewActivity from '../../../LeadBar/Partials/AddNewActivity';
import ReactSelect from '@/Components/ReactSelect';

const LeadActivities = () => {
  const [visits, setVisits] = useState([]);
  const [isActivity, setIsActivity] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col gap-4 ">
      <AddNewActivity isActivity={isActivity} setIsActivity={setIsActivity} />
      <LogActivity
        isLogModalOpen={isLogModalOpen}
        setIsLogModalOpen={setIsLogModalOpen}
      />
      <Tab.Group as="div" className={classNames('w-full grow py-4')}>
        <Tab.List
          className="sticky border-0 border-transparent bg-white"
          style={{ top: `${288}px` }}
          defaultChecked={1}
        >
          <div className="z-0 flex space-x-8 border-b px-4">
            <Tab
              key={1}
              className={({ selected }) =>
                classNames(
                  'pb-3 text-left focus:outline-none',
                  selected
                    ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                    : 'text-latisGray-800'
                )
              }
            >
              Upcoming
            </Tab>
            <Tab
              key={2}
              className={({ selected }) =>
                classNames(
                  'pb-3 text-left focus:outline-none',
                  selected
                    ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                    : 'text-latisGray-800'
                )
              }
            >
              History
            </Tab>
          </div>
        </Tab.List>
        <Tab.Panels className="h-full w-full grow flex-row gap-8 pt-4">
          <Tab.Panel
            key={1}
            className="flex h-full w-full flex-col gap-6 rounded-b-lg px-4"
          >
            <div className="flex w-full flex-col divide-y divide-latisGray-600">
              <div className="grid grid-cols-2 gap-4">
                <PrimaryButton onClick={() => setIsActivity(true)}>
                  Schedule
                </PrimaryButton>
                <PrimaryButton onClick={() => setIsLogModalOpen(true)}>
                  Log
                </PrimaryButton>
              </div>
            </div>
            <div className="grow">
              {/* <div className="w-full px-4 pb-4 space-y-2">
                <h2 className="flex items-center w-full p-2 text-xs font-normal rounded-md bg-latisGray-300 text-latisGray-800">
                  Only the records with addresses are included in the Insights
                </h2>
              </div> */}
              <div>
                <h1 className="text-base font-medium leading-6 text-latisGray-900">
                  Visit
                </h1>
                <h2 className="text-xs font-normal leading-5">
                  Visit with Gerald Gantz
                </h2>
                <h1 className="text-sm font-medium leading-6 text-black">
                  Gerald Gantz
                </h1>
                <p className="text-sm text-latisGray-800">
                  Tue, 16-06-2024 / 02:00 PM - 02:30 PM
                </p>
                <p className="text-sm font-medium">
                  <span className="pr-1 text-sm font-normal leading-5">
                    Owner
                  </span>
                  Matthew Ikemeier
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <SecondaryButton className="w-full">
                    Log Visit
                  </SecondaryButton>
                  <PrimaryButton className="w-full">More</PrimaryButton>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel
            key={2}
            className="h-full w-full overflow-auto border-latisGray-400"
          >
            <div className="flex w-full flex-col gap-4 divide-latisGray-600">
              {/* <div className="px-4 ">
                <ReactSelect isMulti placeholder="Filter by Activites" />
              </div> */}
              <div className="grow divide-y divide-latisGray-400 overflow-auto">
                <div className="flex w-full justify-between gap-2 px-4 py-2">
                  <div className="grow">
                    <h1 className="flex items-center justify-between text-sm font-medium text-latisGray-900">
                      <div>Visit</div>
                      <span className="text-xs font-normal text-latisGray-800">
                        13-06-2024 / 10:34 Am
                      </span>
                    </h1>
                    <div>
                      <span className="text-xs font-normal leading-5 text-latisGray-800">
                        Marker
                      </span>
                    </div>
                    <div className="flex justify-between ">
                      <p className="flex flex-col space-y-1">
                        <span className="text-xs font-normal text-latisGray-900">
                          {' Diane Gerson'}
                        </span>
                        <span className="text-xs font-normal text-latisGray-800">
                          Unverified - 10.7 miles from lead
                        </span>
                      </p>
                      <span className="flex flex-col justify-center ">
                        <ChevronRightIcon className="h-5 w-5 text-latisGray-800" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-between gap-2 px-4 py-2">
                  <div className="grow">
                    <h1 className="flex items-center justify-between text-sm font-medium text-latisGray-900">
                      <div>Visit</div>
                      <span className="text-xs font-normal text-latisGray-800">
                        13-06-2024 / 10:34 Am
                      </span>
                    </h1>
                    <div>
                      <span className="text-xs font-normal leading-5 text-latisGray-800">
                        Marker
                      </span>
                    </div>
                    <div className="flex justify-between ">
                      <p className="flex flex-col space-y-1">
                        <span className="text-xs font-normal text-latisGray-900">
                          {' Diane Gerson'}
                        </span>
                        <span className="text-xs font-normal text-latisGray-800">
                          Unverified - 10.7 miles from lead
                        </span>
                      </p>
                      <span className="flex flex-col justify-center ">
                        <ChevronRightIcon className="h-5 w-5 text-latisGray-800" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-between gap-2 px-4 py-2">
                  <div className="grow">
                    <h1 className="flex items-center justify-between text-sm font-medium text-latisGray-900">
                      <div>Visit</div>
                      <span className="text-xs font-normal text-latisGray-800">
                        13-06-2024 / 10:34 Am
                      </span>
                    </h1>
                    <div>
                      <span className="text-xs font-normal leading-5 text-latisGray-800">
                        Marker
                      </span>
                    </div>
                    <div className="flex justify-between ">
                      <p className="flex flex-col space-y-1">
                        <span className="text-xs font-normal text-latisGray-900">
                          {' Diane Gerson'}
                        </span>
                        <span className="text-xs font-normal text-latisGray-800">
                          Unverified - 10.7 miles from lead
                        </span>
                      </p>
                      <span className="flex flex-col justify-center ">
                        <ChevronRightIcon className="h-5 w-5 text-latisGray-800" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default LeadActivities;
