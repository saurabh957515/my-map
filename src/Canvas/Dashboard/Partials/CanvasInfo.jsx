import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const CanvasInfo = ({ summaryData }) => {
  return (
    <div
      className="scrollbar-hide flex space-x-4 overflow-x-auto"
      onWheel={e => (e.currentTarget.scrollLeft += e.deltaY)}
    >
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="min-w-[300px] flex-shrink-0 rounded-lg border border-latisGray-400 bg-white p-4 "
        >
          <h2 className="text-sm font-normal text-latisSecondary-700">
            {item.title}
          </h2>
          <p className="pt-3 text-2xl font-semibold text-latisGray-900">
            {item.value}
          </p>
          <div className="mt-2 flex items-center space-x-3">
            <span
              className={`flex items-center gap-x-2 rounded-md px-2 py-1 text-sm ${
                item.isIncrease
                  ? 'bg-latisGreen-50 text-latisGreen-800'
                  : 'bg-latisRed-100 text-latisRed-900'
              }`}
            >
              {item.isIncrease ? (
                <ArrowUpIcon className="h-4 w-4 text-latisGreen-800" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-latisRed-900" />
              )}
              {item.percentage}
            </span>

            <span className="ml-1 text-xs font-normal text-latisGray-700">
              Compared to last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CanvasInfo;
