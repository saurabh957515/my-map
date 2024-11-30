import ElipseCircle from '@/Components/ElipseCircle';
import React, { useState } from 'react';
import FullScreenIcon from '../CanvasIcons/FullScreenIcon';
import { classNames } from '@/Providers/helpers';
import { usePage } from '@inertiajs/react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { ArrowsPointingInIcon } from '@heroicons/react/24/solid';
import ScreenMinimizeIcon from '@/Icons/ScreenMinimizeIcon';

const LegendBar = ({ boundingCondition, legendDetails }) => {
  const [toggleHeight, setIsToggleHeight] = useState(false);
  const { canvasStages } = usePage().props;
  const result = canvasStages.reduce((acc, item) => {
    acc[item.name] = item.color;
    return acc;
  }, {});

  return (
    <div
      className={classNames(
        'scrollbar-hide absolute bottom-4 left-3 z-20 w-[300px]  overflow-auto rounded-md  bg-white  transition-all duration-200 ease-in-out',
        toggleHeight ? 'max-h-[500px]' : 'h-14'
      )}
    >
      <div className="sticky top-0 z-20 flex w-full justify-between bg-white p-4 hover:bg-latisGray-400">
        <h1 className="text-sm font-bold">Colorized by Stage</h1>
        <span
          onClick={() => setIsToggleHeight(pre => !pre)}
          className="cursor-pointer"
        >
          {toggleHeight ? (
            <ScreenMinimizeIcon className="h-6 w-6 text-latisGray-800" />
          ) : (
            <FullScreenIcon className="h-6 w-6 text-latisGray-800" />
          )}
        </span>
      </div>
      <div className="z-30 flex w-full flex-col gap-4 bg-white px-4 pb-5 pt-2">
        {legendDetails?.length > 0 ? (
          legendDetails?.map(legend => (
            <div key={legend?.label} className="space-y-2 ">
              <div className="flex justify-between text-sm font-normal leading-6 text-latisGray-900">
                <h1 className="flex items-center gap-2">
                  {' '}
                  <ElipseCircle
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
