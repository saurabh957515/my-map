import { classNames } from '@/Providers/helpers';
import { Popover, Tab } from '@headlessui/react';
import {
  GlobeAsiaAustraliaIcon,
  LightBulbIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useMemo, useState } from 'react';
import DropZone from '../Partials/DropZone';
import useApi from '@/hooks/useApi';
import LeadLists from '../Partials/LeadLists';
import LeadForm from '../Partials/LeadForm';
import ElipseCircle from '@/Components/ElipseCircle';
import PrimaryButton from '@/Components/PrimaryButton';
import Territories from '../Partials/Territories';
import NotesIcon from '../CanvasIcons/NotesIcon';
import Activities from './Partials/Activities';
import Details from './Partials/Details';
import Files from './Partials/Files';
import LeadOwner from './Partials/LeadOwner';

const LeadBar = ({
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
  setMapPointAddress,
  setIsAddLeadFormPopUp,
  setIsLeadEdit,
  handlePointClick,
}) => {
  const { postRoute } = useApi();
  const [isLeadData, setIsLeadData] = useState({});
  const [leadDetail, setIsLeadDetail] = useState({
    name: '',
    address: '',
    id: ' ',
    canvas_lead_id: '',
  });

  useEffect(() => {
    setIsLeadData(leadData);
    const first_name = leadData?.lead?.canvas_lead_metas?.find(
      detail => detail?.key === 'First Name'
    )?.value;
    const last_name = leadData?.lead?.canvas_lead_metas?.find(
      detail => detail?.key === 'Last Name'
    )?.value;
    const fullName =
      first_name || last_name
        ? `${first_name} ${last_name}`.trim()
        : 'Name Not Assigned';
    const canvas_lead_id = leadData?.lead?.canvas_lead_metas[0]?.canvas_lead_id;
    const address = leadData?.lead?.address;
    const addressValues = address ? Object.values(address).join(', ') : '';
    setIsLeadDetail({
      name: fullName,
      address: addressValues,
      canvas_lead_id: canvas_lead_id,
    });
  }, [leadData]);

  const [selected, setSelected] = useState(0);
  return (
    <div
      className={classNames(
        ' right-0 z-50 flex h-full flex-col items-start  bg-white shadow transition-all duration-300',
        isLeadBarOpen ? 'lg:w-3/12' : ' w-0 ',
        className ? className : 'relative'
      )}
    >
      <div className="z-50 flex w-full justify-between border-b bg-white p-4 ">
        <h1 className="text-base font-semibold text-latisGray-900">
          {title ? title : 'Lead'}
        </h1>

        <span
          className="cursor-pointer"
          onClick={e => {
            e.preventDefault();
            setIsLeadBarOpen(false);
            setSelected(0);
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
          'flex w-full flex-1 flex-col overflow-auto  border-0  border-transparent pt-5',
          dataLoading ? 'opacity-25' : ''
        )}
      >
        {!isManage && (
          <Tab.List
            className="scrollbar-hide w-full border-0 border-transparent bg-white "
            defaultChecked={1}
          >
            <div
              onWheel={e => {
                e.currentTarget.scrollLeft += e.deltaY;
              }}
              className="scrollbar-hide z-0 flex space-x-8 overflow-x-auto border-b px-4"
            >
              {['Activities', 'Details', 'Files']?.map((tab, index) => (
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
        )}

        <Tab.Panels
          className={classNames(
            ' w-full  flex-1 overflow-auto',
            !isManage ? 'pt-4' : ''
          )}
        >
          {[
            <Activities setLeadData={setLeadData} leadData={leadData} />,
            <Details leadData={leadData} />,
            <Files leadData={leadData} />,
          ]?.map((TabPanel, index) => (
            <Tab.Panel key={index + 1} className="h-full w-full rounded-b-lg ">
              <div className="flex h-full w-full flex-col gap-4 ">
                {manageComponent ? (
                  manageComponent
                ) : (
                  <LeadOwner
                    handlePointClick={handlePointClick}
                    setIsLeadEdit={setIsLeadEdit}
                    setMapPointAddress={setMapPointAddress}
                    setIsAddLeadFormPopUp={setIsAddLeadFormPopUp}
                    leadData={leadData}
                  />
                )}
                {TabPanel}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default LeadBar;
