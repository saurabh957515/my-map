import { classNames } from '@/Providers/helpers';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { useStats } from 'react-instantsearch';

const Insights = ({ legendDetails }) => {
  const [newDetails, setNewDetails] = useState([]);
  const [totalCount, setTotalCount] = useState(Number);
  const { nbHits } = useStats();
  useEffect(() => {
    const totalCount = legendDetails.reduce(
      (total, item) => total + item.count,
      0
    );
    const updatedDetails = legendDetails?.map(item => ({
      ...item,
      percentage: parseFloat(
        totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(4) : 0
      ),
    }));
    setTotalCount(totalCount);
    setNewDetails(updatedDetails);
  }, [legendDetails]);
  const { canvasStages } = usePage().props;
  const result = canvasStages.reduce((acc, item) => {
    acc[item.name] = item.color;
    return acc;
  }, {});
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <div className="max-w-full space-y-2 px-4 ">
        <h2 className="w-full whitespace-normal text-wrap rounded-md bg-latisGray-300 p-2 text-xs font-normal text-latisGray-800">
          Only the records with addresses are included in the Insights
        </h2>
      </div>

      <div className="space-y-4 border-b px-4 pb-4">
        <div className="text-sm font-medium text-latisGray-900">Tasks</div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y">
            <div className="text-xs font-normal text-latisSecondary-700">
              Created
              <div className="text-base font-semibold text-latisGray-900">
                {nbHits >= 1000 ? totalCount : nbHits}
              </div>
            </div>
          </div>
          <div className="space-y">
            <div className="text-xs font-normal text-latisSecondary-700">
              Won
              <div className="text-base font-semibold text-latisGray-900">
                23725
              </div>
            </div>
          </div>
          <div className="space-y">
            <div className="text-xs font-normal text-latisSecondary-700">
              Win Rate
              <div className="text-base font-semibold text-latisGray-900">
                3%
              </div>
            </div>
          </div>
          <div className="space-y">
            <div className="text-xs font-normal text-latisSecondary-700">
              Estimated revenue
              <div className="text-base font-semibold text-latisGray-900">
                $680,089
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 px-4">
        <div className="text-sm font-medium text-latisGray-900">
          Lead records by stages
        </div>
        <div className="flex flex-col gap-2">
          {newDetails?.map(detail => (
            <div key={detail?.label} className="space-y-2">
              <div className="flex justify-between text-xs font-normal leading-6 text-latisGray-900">
                <h1>{detail?.label}</h1>
                <span className="flex gap-4">
                  <span>{detail?.count}</span>
                  <p>{detail?.percentage}%</p>
                </span>
              </div>
              <div className="h-1.5 w-full rounded-2xl bg-latisGray-300">
                <div
                  style={{
                    width: `${detail?.percentage}%`,
                    backgroundColor: `${result[detail?.label]}`,
                  }}
                  className={classNames(
                    'h-full  rounded-2xl bg-latisSecondary-800'
                  )}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;
