import React, { useState } from 'react';
import FullScreenIcon from '../CanvasIcons/FullScreenIcon';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { ArrowsPointingInIcon } from '@heroicons/react/24/solid';

const LegendBar = ({ boundingCondition, legendDetails }) => {
  const [toggleHeight, setIsToggleHeight] = useState(false);
  const [canvasStages,setCavnvs]=useState([])
  const result = canvasStages.reduce((acc, item) => {
    acc[item.name] = item.color;
    return acc;
  }, {});

  return (
    <div
      className={'scrollbar-hide absolute bottom-4 left-3 z-20 w-[300px]  overflow-auto rounded-md  bg-white  transition-all duration-200 ease-in-out'}
    >
      <div className="sticky top-0 z-20 flex justify-between w-full p-4 bg-white hover:bg-latisGray-400">
        <h1 className="text-sm font-bold">Colorized by Stage</h1>
        <span
          onClick={() => setIsToggleHeight(pre => !pre)}
          className="cursor-pointer"
        >
          {toggleHeight ? (
            <ArrowsPointingInIcon className="w-6 h-6 text-latisGray-800" />
          ) : (
            <FullScreenIcon className="w-6 h-6 text-latisGray-800" />
          )}
        </span>
      </div>
      <div className="z-30 flex flex-col w-full gap-4 px-4 pt-2 pb-5 bg-white">
        {legendDetails?.length > 0 ? (
          legendDetails?.map(legend => (
            <div key={legend?.label} className="space-y-2 ">
              <div className="flex justify-between text-sm font-normal leading-6 text-latisGray-900">
                <h1 className="flex items-center gap-2">
                  {' '}
                  <CloudArrowUpIcon
                    className={'h-2 w-2'}
                    style={{
                      color: `${result[legend?.label]}`,
                    }}
                  />{' '}
                  {legend?.label}
                </h1>
                <span className="flex gap-4 text-xs leading-5">
                  <span>({legend?.count})</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm font-medium text-latisGray-900">
            No Details in this area
          </p>
        )}
      </div>
    </div>
  );
};

export default LegendBar;
