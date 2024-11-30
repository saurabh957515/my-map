import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const LeadDetailPopUp = ({ title, onClose, style, leadData }) => {
  return (
    <div
      className="custom-popup z-20 space-y-6 rounded-md bg-white p-3 shadow-sm"
      style={{ ...style, transform: 'translate(-80%, -113%)' }}
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
              {leadData?.lead?.formatted_address}
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
              (
              {moment(leadData?.lead?.updated_at).format(
                'MMMM Do YYYY, h:mm A'
              )}
              )
            </span>
          </div>
        </div>
      </div>
      <div className="arrow-down" />
    </div>
  );
};

export default LeadDetailPopUp;
