import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

const LeadDetailPopUp = ({
  title,
  content,
  onClose,
  style,
  setIsAddLeadFormPopUp,
  leadData,
}) => {
  const leadDetails = leadData?.lead?.address;
  return (
    <div
      className="custom-popup z-20 space-y-6 rounded-md bg-white p-3 shadow-sm"
      style={{ ...style, transform: 'translate(-80%, -113%)' }} // Center horizontally and position above
    >
      <div className="">
        <div className="flex w-full justify-between">
          <h3 className="text-base font-medium leading-6 text-black">
            {title}
          </h3>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-latisGray-800" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div className="gap-4 border-b pb-3">
            <h1 className="text-xs font-normal text-latisSecondary-700">
              Address
            </h1>
            <div className="text-sm leading-5 text-latisGray-800">
              {`${leadDetails?.street ? leadDetails.street + ', ' : ''}${
                leadDetails?.city ? leadDetails.city + ', ' : ''
              }${leadDetails?.state ? leadDetails.state + ', ' : ''}${
                leadDetails?.zip ? leadDetails.zip + ', ' : ''
              }${leadDetails?.country || ''}`}
            </div>
            <span className="text-xs italic leading-4">
              1 record at this address
            </span>
          </div>
          <div className="gap-4 pb-3 ">
            <h1 className="text-xs font-normal text-latisSecondary-700">
              Lead
            </h1>
            <div className="text-sm leading-5 text-latisGray-800">
              {leadData?.properties?.lead_owner}
            </div>
            <span className="text-xs italic leading-4">
              (1 visit - Last: May 11 08:25 PM)
            </span>
          </div>
        </div>
        {/* 
        <div
          onClick={() => {
            setIsAddLeadFormPopUp(true);
          }}
          className="flex items-center justify-center gap-2 py-2 mx-auto mt-4 text-sm cursor-pointer text-latisSecondary-800"
        >
          <div className="rounded-full w-fit bg-latisSecondary-800">
            <PlusIcon className="w-5 h-5 text-white" />
          </div>
          Add
        </div> */}
      </div>
      <div className="arrow-down" />
    </div>
  );
};

export default LeadDetailPopUp;
