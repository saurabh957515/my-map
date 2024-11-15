import PrimaryButton from '@/Components/PrimaryButton';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

const AddLeadPopUp = ({
  title,
  content,
  onClose,
  style,
  setIsAddLeadFormPopUp,
  leadData,
}) => {
  return (
    <div
      className="custom-popup z-20 max-w-52 space-y-6 rounded-md bg-white p-3 shadow-sm"
      style={{ ...style, transform: 'translate(-80%, -105%)' }}
    >
      <div className="w-full">
        <div className="flex w-full justify-between">
          <h3 className="text-base font-medium leading-6 text-black">
            New Records
          </h3>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-latisGray-800" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div className="gap-4 border-b pb-3">
            <div className="text-sm leading-5 text-latisGray-800">
              {leadData?.address}
            </div>
          </div>
        </div>

        <div className="w-full">
          <PrimaryButton
            onClick={e => {
              e.preventDefault();
              onClose();
              setIsAddLeadFormPopUp(true);
            }}
            className="w-full"
          >
            Add Lead
          </PrimaryButton>
        </div>
      </div>
      <div className="arrow-down" />
    </div>
  );
};

export default AddLeadPopUp;
