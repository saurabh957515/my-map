import LayersIcon from '@/Icons/LayersIcon';
import { classNames } from '@/Providers/helpers';
import { Popover } from '@headlessui/react';
import React, { useState } from 'react';
import SearchWidget from './SearchWidget';
import ToggleSwitch from '@/Components/ToggleSwitch';
import {
  GlobeAltIcon,
  GlobeAmericasIcon,
  MinusIcon,
  PlusIcon,
  UserIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import TargetPinIcon from '../CanvasIcons/TargetPinIcon';
import PolygonIcon from '../CanvasIcons/PolygonIcon';
import TerritoryIcon from '@/Icons/TerritoryIcon';
import KmlIcon from '../CanvasIcons/KmlIcon';
import SateliteIcon from '../CanvasIcons/SateliteIcon';
import GpsTrailIcon from '../CanvasIcons/GpsTrailIcon';
import FullScreenIcon from '../CanvasIcons/FullScreenIcon';
import ElipseCircle from '@/Components/ElipseCircle';
import { duration } from 'moment';
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
    TerritoryIcon,
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
            <SolidMap className="z-50 h-8 w-6 text-red-500" />
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
    <div className="absolute left-3 flex h-fit flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="z-50 col-span-4 mt-2 flex  w-[300px] items-center justify-between space-x-2.5">
          <SearchWidget handlePointClick={handlePointClick} view={view} />
        </div>
        <div className="z-30 w-fit cursor-pointer rounded-full border border-latisGray-400 bg-white px-2 pt-2 shadow-lg">
          <Popover className={'relative grow rounded-md'}>
            {({ open }) => (
              <>
                <Popover.Button className="h-6 w-6 text-latisGray-800">
                  <LayersIcon
                    className={classNames(
                      'h-6 w-6 ',
                      open ? 'text-latisGreen-800' : 'text-latisGray-800'
                    )}
                  />
                  {activeCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-latisGreen-800 text-xs text-white">
                      {activeCount}
                    </span>
                  )}
                </Popover.Button>
                <Popover.Panel className="absolute -top-3 left-10 z-50 w-fit min-w-60 rounded-md border-0 bg-white text-gray-700 shadow">
                  <div className="">
                    <div className="cursor-pointer space-y-5 p-4 text-sm">
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
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <div className="flex w-full justify-between pl-2 text-sm font-normal ">
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
          className="z-30 w-fit cursor-pointer rounded-full border border-latisGray-400 bg-white p-2 shadow-lg"
        >
          <PlusIcon className="h-6 w-6 text-latisGray-800" />
        </div>
        <div
          onClick={() => {
            view.goTo({ zoom: view.zoom - 1 }, { duration: 500 });
          }}
          className="z-30 w-fit cursor-pointer rounded-full border border-latisGray-400 bg-white p-2 shadow-lg"
        >
          <MinusIcon className="h-6 w-6 text-latisGray-800" />
        </div>
        <div className="flex ">
          <div
            onClick={handleCurrentLocation}
            className="z-30 flex w-fit cursor-pointer rounded-full border border-latisGray-400 bg-white p-2 shadow-lg"
          >
            <TargetPinIcon
              className={classNames(
                'h-6 w-6 ',
                navigatorLoading ? 'text-latisGreen-800' : 'text-latisGray-800'
              )}
            />
          </div>
          {navigatorLoading && (
            <div className="z-30 ml-2 flex items-center justify-center py-2 ">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
            </div>
          )}
        </div>
        <div
          onClick={drawPolygon}
          className="z-30 w-fit cursor-pointer rounded-full border border-latisGray-400 bg-white p-2 shadow-lg"
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
