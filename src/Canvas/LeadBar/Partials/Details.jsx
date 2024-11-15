import React from 'react';
import LeadOwner from './LeadOwner';
import InputLabel from '@/Components/InputLabel';

const Details = ({ leadData }) => {
  const allDetails = leadData?.lead?.canvas_lead_metas;
  return (
    <div className="scrollbar-hide flex grow flex-col space-y-4 overflow-auto pb-4">
      <h1 className="px-4 text-sm font-medium leading-5 ">Info</h1>
      <div className="scrollbar-hide grow space-y-4 overflow-auto px-4">
        {allDetails?.map(lead => (
          <div key={lead?.id}>
            <InputLabel
              className="text-xs font-normal text-latisSecondary-700"
              value={lead?.key}
            />
            <p className="text-xs text-latisGray-900"> {lead?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
