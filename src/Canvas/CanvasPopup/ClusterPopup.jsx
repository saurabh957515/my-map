import PrimaryButton from '@/Components/PrimaryButton';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import Point from '@arcgis/core/geometry/Point.js';
import useApi from '@/hooks/useApi';
import ElipseCircle from '@/Components/ElipseCircle';
import moment from 'moment/moment';
import { classNames } from '@/Providers/helpers';

const ClusterPopup = ({
  onClose,
  style,
  setIsClusterPopUp,
  view,
  popupCoordinates,
  clusterSize,
  clusterBox,
}) => {
  let sizeThrottle = (clusterSize !== 30 ? clusterSize / 3 : 2) - 45;
  const [loading, setLoading] = useState(false);
  const [clusterData, setClusterData] = useState([]);
  const { postRoute } = useApi();

  const getClusterData = async boundingBox => {
    const startTime = moment();
    const { data, errors } = await postRoute(
      'canvas/get-canvas-cluster-stage-distribution',
      boundingBox
    );

    const elapsed = moment().diff(startTime);
    const remainingTime = Math.max(500 - elapsed, 0);

    setTimeout(() => {
      setLoading(false);
      if (!errors) {
        setClusterData(data);
      }
    }, remainingTime);
  };

  useEffect(() => {
    if (clusterBox) {
      setLoading(true);
      getClusterData(clusterBox);
    }
  }, [clusterBox]);

  return (
    <div
      className="custom-popup left-[50%] z-10  flex  w-80 flex-col  space-y-6 rounded-md  bg-white p-3 shadow-sm"
      style={{
        ...style,
        position: 'fixed',
        maxHeight: 'auto',
        transform: `translate(-48%, calc(-100% - ${sizeThrottle}px))`,
      }}
    >
      <div className="flex w-full grow flex-col">
        <div className="flex w-full justify-between">
          <h3 className="text-base font-medium leading-6 text-black">
            Cluster Details
          </h3>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-latisGray-800" />
          </button>
        </div>

        <div
          className={classNames(
            'mt-4 flex w-full grow flex-col justify-between space-y-4',
            loading ? 'min-h-36' : clusterData?.length === 0 ? 'min-h-36 ' : ''
          )}
        >
          {loading ? (
            <div className="z-30 ml-2 mt-6 flex items-center justify-center py-2 ">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="flex w-full flex-col gap-2">
                {clusterData?.length > 0 ? (
                  clusterData?.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-xs font-normal leading-6 text-latisGray-900">
                        <h1 className="flex items-center gap-2">
                          <ElipseCircle
                            className="h-2 w-2"
                            style={{ color: `${data?.color}` }}
                          />{' '}
                          {data?.name}
                        </h1>
                        <span className="flex gap-4">
                          <span>({data?.count})</span>
                          <p>{data?.percentage_value}%</p>
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-2xl bg-latisGray-300">
                        <div
                          style={{
                            width: `${data?.percentage_value}%`,
                            backgroundColor: `${data?.color}`,
                          }}
                          className="h-full rounded-2xl bg-latisSecondary-800"
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mx-1 text-center">
                    <ExclamationTriangleIcon
                      className="mx-auto h-12 w-12 text-latisGray-700"
                      aria-hidden="true"
                    />
                    <h3 className="mt-2 text-sm font-medium text-latisGray-700">
                      No Details Found
                    </h3>
                  </div>
                )}
              </div>
              <div className="mt-4 w-full ">
                <PrimaryButton
                  onClick={e => {
                    e.preventDefault();
                    view.goTo(
                      {
                        target: new Point({
                          longitude: popupCoordinates[0],
                          latitude: popupCoordinates[1],
                        }),
                        zoom: view?.zoom >= 18 ? view.zoom + 2 : 18,
                      },
                      { duration: 500 }
                    );
                    onClose();
                  }}
                  className="w-full uppercase"
                >
                  Zoom Here
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="arrow-down" />
    </div>
  );
};

export default ClusterPopup;
