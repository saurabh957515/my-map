export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
import { Popover } from '@headlessui/react';
import React, { useState } from 'react';
// import SearchWidget from './SearchWidget';
import ToggleSwitch from '../../Components/ToggleSwitch';
import {
  GlobeAltIcon,
  GlobeAmericasIcon,
  MinusIcon,
  PlusIcon,
  UserIcon,
  MapPinIcon,
  GlobeAsiaAustraliaIcon,
} from '@heroicons/react/24/outline';
import TargetPinIcon from '../CanvasIcons/TargetPinIcon';
import PolygonIcon from '../CanvasIcons/PolygonIcon';
// import TerritoryIcon from '@/Icons/TerritoryIcon';
import KmlIcon from '../CanvasIcons/KmlIcon';
import SateliteIcon from '../CanvasIcons/SateliteIcon';
import GpsTrailIcon from '../CanvasIcons/GpsTrailIcon';
import FullScreenIcon from '../CanvasIcons/FullScreenIcon';
// import { duration } from 'moment';
import Graphic from 'https://js.arcgis.com/4.30/@arcgis/core/Graphic.js';
import Point from 'https://js.arcgis.com/4.30/@arcgis/core/geometry/Point.js';
import PictureMarkerSymbol from 'https://js.arcgis.com/4.30/@arcgis/core/symbols/PictureMarkerSymbol.js';
import ReactDOMServer from 'react-dom/server';
import { MapPinIcon as SolidMap } from '@heroicons/react/24/solid';

const CanvasFilters = ({
  view,
  drawPolygon,
  isSketching,
  filters,
  setFilters,
  handlePointClick,
  handleToggle,
  setNavigatorLoading,
  navigatorLoading,
  handleRedraw,
  showOnlyPolygon,
}) => {
  const icons = {
    MapPinIcon,
    UserIcon,
    KmlIcon,
    SateliteIcon,
    GpsTrailIcon,
    GlobeAmericasIcon,
    GlobeAltIcon,
  };

  const activeCount = filters.filter(filter => filter.isActive).length;
  const handleCurrentLocation = e => {
    if (navigator.geolocation) {
      setNavigatorLoading(true);
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          view.goTo({
            center: [longitude, latitude],
            zoom: 14,
            duration: 200,
          });
          const userLocationPoint = new Point({
            longitude,
            latitude,
            spatialReference: { wkid: 4326 },
          });
          const pinIconSvgString = ReactDOMServer.renderToStaticMarkup(
            <SolidMap className="z-50 w-6 h-8 text-red-500" />
          );
          const encodedPinIconSvg = encodeURIComponent(pinIconSvgString);
          const iconDataUri = `data:image/svg+xml,${encodedPinIconSvg}`;
          const pinSymbol = new PictureMarkerSymbol({
            url: iconDataUri,
            width: '24px',
            height: '24px',
            color: 'red',
          });
          const userLocationGraphic = new Graphic({
            geometry: userLocationPoint,
            symbol: pinSymbol,
          });
          view.graphics.removeAll();
          view.graphics.add(userLocationGraphic);
          setNavigatorLoading(false);
        },
        error => {
          console.error('Error getting location: ', error);
          setNavigatorLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  return (
    <div className="absolute flex flex-col justify-between left-3 h-fit">
      <div className="flex flex-col gap-4">
        <div className="z-50 col-span-4 mt-2 flex  w-[300px] items-center justify-between space-x-2.5">
          {/* <SearchWidget handlePointClick={handlePointClick} view={view} /> */}
        </div>
        <div className="z-30 px-2 pt-2 bg-white border rounded-full shadow-lg cursor-pointer w-fit border-latisGray-400">
          <Popover className={'relative grow rounded-md'}>
            {({ open }) => (
              <>
                <Popover.Button className="w-6 h-6 text-latisGray-800">
                  <GlobeAsiaAustraliaIcon
                    className={classNames(
                      'h-6 w-6 ',
                      open ? 'text-latisGreen-800' : 'text-latisGray-800'
                    )}
                  />
                  {activeCount > 0 && (
                    <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white rounded-full -right-2 -top-2 bg-latisGreen-800">
                      {activeCount}
                    </span>
                  )}
                </Popover.Button>
                <Popover.Panel className="absolute z-50 text-gray-700 bg-white border-0 rounded-md shadow -top-3 left-10 w-fit min-w-60">
                  <div className="">
                    <div className="p-4 space-y-5 text-sm cursor-pointer">
                      <div className="space-y-4">
                        {filters?.map((filter, index) => {
                          const IconComponent = icons[filter.icon];
                          return (
                            <div
                              key={filter.label}
                              className={classNames(
                                'flex items-center  hover:text-latisSecondary-800',
                                filter.isActive
                                  ? 'text-latisSecondary-800'
                                  : 'text-latisGray-900'
                              )}
                            >
                              <div>
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div className="flex justify-between w-full pl-2 text-sm font-normal ">
                                {filter.label}
                                <ToggleSwitch
                                  enabled={filter.isActive}
                                  onChange={e => {
                                    handleToggle(index);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </>
            )}
          </Popover>
        </div>
        <div
          onClick={() => {
            view.goTo({ zoom: view.zoom + 1 }, { duration: 500 });
          }}
          className="z-30 p-2 bg-white border rounded-full shadow-lg cursor-pointer w-fit border-latisGray-400"
        >
          <PlusIcon className="w-6 h-6 text-latisGray-800" />
        </div>
        <div
          onClick={() => {
            view.goTo({ zoom: view.zoom - 1 }, { duration: 500 });
          }}
          className="z-30 p-2 bg-white border rounded-full shadow-lg cursor-pointer w-fit border-latisGray-400"
        >
          <MinusIcon className="w-6 h-6 text-latisGray-800" />
        </div>
        <div className="flex ">
          <div
            onClick={handleCurrentLocation}
            className="z-30 flex p-2 bg-white border rounded-full shadow-lg cursor-pointer w-fit border-latisGray-400"
          >
            <TargetPinIcon
              className={classNames(
                'h-6 w-6 ',
                navigatorLoading ? 'text-latisGreen-800' : 'text-latisGray-800'
              )}
            />
          </div>
          {navigatorLoading && (
            <div className="z-30 flex items-center justify-center py-2 ml-2 ">
              <div className="w-6 h-6 border-4 border-blue-400 rounded-full animate-spin border-t-transparent"></div>
            </div>
          )}
        </div>
        <div
          onClick={drawPolygon}
          className="z-30 p-2 bg-white border rounded-full shadow-lg cursor-pointer w-fit border-latisGray-400"
        >
          <PolygonIcon
            className={classNames(
              'h-6 w-6 ',
              showOnlyPolygon ? 'text-latisGreen-800' : 'text-latisGray-800'
            )}
          />
        </div>
        {/* {showOnlyPolygon && (
          <div
            onClick={handleRedraw}
            className="z-50 px-2 bg-white rounded-lg cursor-pointer w-fit text-latisGray-900"
          >
            Redraw
          </div>
        )} */}
      </div>
    </div>
  );
};

export default CanvasFilters;
