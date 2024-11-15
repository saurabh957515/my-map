import { classNames } from '@/Providers/helpers';
import { Popover, Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useApi from '@/hooks/useApi';
import { useState } from 'react';

const CanvasSideModal = ({
  isLeadBarOpen,
  setIsLeadBarOpen,
  leadData,
  view,
  dataLoading,
  setLeadData,
}) => {
  const { postRoute } = useApi();
  const [selected, setSelected] = useState(0);

  return (
    <div
      className={classNames(
        'relative right-0 z-50 flex h-full flex-col items-start bg-white shadow transition-all duration-300',
        isLeadBarOpen ? 'w-1/4' : ' w-0 '
      )}
    >
      <div className="z-50 flex w-full justify-between border-b bg-white p-4 ">
        <h1 className="text-base font-semibold text-latisGray-900">Lead</h1>

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
      <Tab.Group
        selectedIndex={selected}
        onChange={setSelected}
        as="div"
        className={classNames(
          ' flex w-full  grow flex-col justify-between  overflow-auto  pt-6',
          dataLoading ? 'opacity-25' : ''
        )}
      >
        <Tab.List
          className="border-0 border-transparent bg-white "
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
              Activities
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
              Details
            </Tab>
            <Tab
              key={3}
              className={({ selected }) =>
                classNames(
                  ' pb-3 text-left focus:outline-none',
                  selected
                    ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                    : 'text-latisGray-800 '
                )
              }
            >
              Files
            </Tab>
          </div>
        </Tab.List>

        <Tab.Panels className="scrollbar-hide h-full w-full grow flex-row gap-8 overflow-auto pt-4">
          <Tab.Panel key={1} className="h-full w-full rounded-b-lg ">
            {/* <Activities /> */}
          </Tab.Panel>
          <Tab.Panel key={2} className="h-full w-full border-latisGray-400">
            {/* <Details /> */}
          </Tab.Panel>

          <Tab.Panel key={3} className="h-full w-full border-latisGray-400">
            {/* <Files /> */}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CanvasSideModal;
