import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Popover, Tab } from '@headlessui/react';
import { classNames } from '@/Providers/helpers';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import LogActivity from './LogActivity';
import AddNewActivity from './AddNewActivity';
import moment from 'moment';
import useApi from '@/hooks/useApi';
import { router } from '@inertiajs/react';
import { route } from '@/Providers/helpers';
import ConfirmationDialog from '@/Components/ConfirmationDialog';
const Activities = ({ manageComponent, leadData, setLeadData }) => {
  const [isActivity, setIsActivity] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isLogEdit, setIsLogEdit] = useState(false);
  const [isActivityEdit, setIsActivityEdit] = useState(false);
  const [logData, setLogData] = useState({});
  const [selectedActivity, setSelectedActivity] = useState({});
  const { postRoute } = useApi();
  const [isActivityDelete, setIsDeleteActivity] = useState(false);
  const getLeadPropData = async leadId => {
    const { data, errors } = await postRoute('/canvas/get-lead-prop', {
      lead_id: leadId,
    });
    if (!errors) {
      setLeadData(data);
    }
  };

  const deleteActivity = activity => {
    router.delete(route('tenant.canvas-activity-logs.destroy', activity?.id), {
      onSuccess: mes => {
        getLeadPropData(leadData?.lead?.id);
      },
      onError: error => {
        console.error(error);
      },
    });
  };
  return (
    <Tab.Group
      as="div"
      className={classNames(
        'flex  w-full flex-1 flex-col  overflow-hidden  pb-4'
      )}
    >
      <Tab.List
        as="div"
        className="scrollbar-hide w-full border-0 border-transparent "
        defaultChecked={1}
      >
        <div
          onWheel={e => {
            e.currentTarget.scrollLeft += e.deltaY;
          }}
          className="scrollbar-hide z-0 flex space-x-8 overflow-x-auto border-b px-4"
        >
          {['Upcoming', 'History']?.map((tab, index) => (
            <Tab
              key={index + 1}
              className={({ selected }) =>
                classNames(
                  'pb-2 text-left focus:outline-none',
                  selected
                    ? 'border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                    : 'text-latisGray-800'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </div>
      </Tab.List>
      <AddNewActivity
        setIsActivityEdit={setIsActivityEdit}
        selectedActivity={selectedActivity}
        isActivityEdit={isActivityEdit}
        getLeadPropData={getLeadPropData}
        setLeadData={setLeadData}
        leadData={leadData}
        isActivity={isActivity}
        setIsActivity={setIsActivity}
        isLogging={isLogging}
        setIsLogging={setIsLogging}
      />

      <ConfirmationDialog
        title="Delete"
        description="Are you sure you want to delete this Activity?"
        isOpen={isActivityDelete}
        setIsOpen={setIsDeleteActivity}
        onConfirm={() => {
          setIsDeleteActivity(false);
          deleteActivity(selectedActivity);
        }}
        onCancel={() => {
          setIsDeleteActivity(false);
        }}
      />
      <LogActivity
        isLogging={isLogging}
        setIsLogging={setIsLogging}
        setIsLogEdit={setIsLogEdit}
        logData={logData}
        isLogEdit={isLogEdit}
        getLeadPropData={getLeadPropData}
        leadData={leadData}
        isLogModalOpen={isLogModalOpen}
        setIsLogModalOpen={setIsLogModalOpen}
      />

      <Tab.Panels as="div" className="h-full w-full flex-1 gap-8 pb-8 pt-4 ">
        <Tab.Panel
          key={1}
          className="flex h-full w-full flex-col gap-6 overflow-auto rounded-b-lg px-4"
        >
          <div className="flex w-full flex-col divide-y divide-latisGray-600">
            <div className="flex flex-wrap justify-center gap-4 py-1">
              <PrimaryButton
                className="w-[calc(50%-0.5rem)]"
                onClick={() => setIsActivity(true)}
              >
                Schedule
              </PrimaryButton>
              <PrimaryButton
                className="w-[calc(50%-0.5rem)]"
                onClick={() => setIsLogModalOpen(true)}
              >
                Log
              </PrimaryButton>
            </div>
          </div>
          <div className="scrollbar-hide flex-1 grow space-y-4 overflow-auto">
            {leadData?.lead?.upcoming_canvas_activity_log?.map(activity => (
              <div key={activity?.id}>
                <h1 className="text-base font-medium leading-6 text-latisGray-900">
                  {activity?.activity_name}
                </h1>
                <h2 className="text-xs font-normal leading-5">
                  {activity?.title}
                </h2>
                <h1 className="text-sm font-medium leading-6 text-black">
                  {activity?.assigned_to?.name}
                </h1>
                <p className="text-sm text-latisGray-800">
                  {moment(activity?.created_at).format(
                    'ddd, DD-MM-YYYY / hh:mm A - hh:mm A'
                  )}
                </p>
                <p className="text-sm font-medium">
                  <span className="pr-1 text-sm font-normal leading-5">
                    Owner
                  </span>
                  {activity?.created_by?.name}
                </p>
                <div className="flex w-full flex-wrap gap-4 px-1 pt-4 ">
                  <SecondaryButton
                    onClick={() => {
                      setIsLogModalOpen(true);
                      setLogData(activity);
                      setIsLogging(true);
                    }}
                    className="flex-1"
                  >
                    Log {activity?.activity_name}
                  </SecondaryButton>

                  <Popover className="relative flex-1">
                    <Popover.Button as="div" className="w-full">
                      <PrimaryButton className="w-full">More</PrimaryButton>
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 w-full space-y-2 rounded-b border bg-white px-4 py-2">
                      <div className="cursor-pointer text-base hover:text-latisSecondary-800">
                        Reschedule
                      </div>
                      <div
                        onClick={() => {
                          setIsActivityEdit(true);
                          setIsActivity(true);
                          setSelectedActivity(activity);
                        }}
                        className="cursor-pointer text-base hover:text-latisSecondary-800"
                      >
                        Edit
                      </div>
                      <div
                        onClick={() => {
                          setIsDeleteActivity(true),
                            setSelectedActivity(activity);
                        }}
                        className="cursor-pointer text-base hover:text-latisSecondary-800"
                      >
                        Delete
                      </div>
                    </Popover.Panel>
                  </Popover>
                </div>
              </div>
            ))}
          </div>
        </Tab.Panel>
        <Tab.Panel
          key={2}
          className="flex h-full w-full flex-col gap-6 overflow-auto rounded-b-lg px-4"
        >
          <div className="scrollbar-hide flex-1 grow space-y-2 overflow-auto">
            {leadData?.lead?.history_canvas_activity_log?.map(historyLog => (
              <div
                key={historyLog?.id}
                className="flex w-full justify-between gap-2 py-2"
              >
                <div className="grow">
                  <h1 className="flex items-center justify-between text-sm font-medium text-latisGray-900">
                    <div>{historyLog?.title}</div>
                    <span className="text-xs font-normal">
                      {moment(historyLog?.created_at).format(
                        'DD-MM-YYYY / hh:mm A'
                      )}
                    </span>
                  </h1>
                  <div>
                    <span className="text-xs font-normal leading-5">From</span>
                    <span className="text-xs font-medium leading-5">
                      {historyLog?.notes}
                    </span>
                  </div>
                  <div className="text-sm font-normal text-latisGray-800">
                    {historyLog?.created_by?.name}
                  </div>
                </div>
                <span
                  onClick={() => {
                    setIsLogEdit(true);
                    setIsLogModalOpen(true);
                    setLogData(historyLog);
                  }}
                  className="flex flex-col justify-center "
                >
                  <ChevronRightIcon className="h-6 w-6 text-latisGray-800" />
                </span>
              </div>
            ))}
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Activities;
