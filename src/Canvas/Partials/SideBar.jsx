import { classNames } from '@/Providers/helpers';
import { Popover, Tab } from '@headlessui/react';
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
  GlobeAsiaAustraliaIcon,
  LightBulbIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { memo, useEffect, useState } from 'react';
import DropZone from './DropZone';
import useApi from '@/hooks/useApi';
import LeadLists from './LeadLists';
import LeadForm from './LeadForm';
import ElipseCircle from '@/Components/ElipseCircle';
import PrimaryButton from '@/Components/PrimaryButton';
import Territories from './Territories';
import Insights from './Insights';
import { useRefinementList, useStats } from 'react-instantsearch';
import { isEqual } from 'lodash';
const territoryObject = {
  name: '',
  assigned_users: '',
  owner: '',
  boundary_type: '',
  boundary_color: '#F2C94C',
  team_id: '',
};
const SideBar = ({
  sketchLayer,
  setIsTerritoryMethod,
  isTerritoryMethod,
  drawPolygon,
  territory,
  setTerritory,
  isPopUpOpen,
  setIsPopUpOpen,
  files,
  setFiles,
  getFiles,
  leadData,
  view,
  dataLoading,
  setLeadData,
  setCheckFiles,
  checkFiles,
  isAddLeadModel,
  setIsAddLeadFormPopUp,
  mapPointAddress,
  mapPointCoordinates,
  boundingCondition,
  handlePointClick,
  createdPolyGon,
  setCreatedPolyGon,
  handleRedraw,
  setLegendDetails,
  legendDetails,
  isSearchOn,
  searchQuery,
  handleEditPolygon,
  sketchView,
  ...props
}) => {
  const { postRoute } = useApi();
  const [file, setFile] = useState('');
  const [selected, setSelected] = useState(0);
  const [boundingBox, setBoundingBox] = useState(boundingCondition);
  const [errors, setErrors] = useState({});
  const handleUpload = file => {
    setFile(file);
  };
  const [searchOption, setSearchOptions] = useState('');
  useEffect(() => {
    if (!dataLoading) {
      setBoundingBox(boundingCondition);
    }
  }, [boundingCondition, dataLoading]);
  const onClick = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    const response = await postRoute('/canvas/upload-file', formData, {});
    const { errors } = response;
    if (!errors) {
      setFile('');
      getFiles();
      setErrors({});
    } else {
      setErrors(errors);
    }
  };

  const getTabIcon = type => {
    switch (type) {
      case 'File':
        return <GlobeAsiaAustraliaIcon className="w-6 h-6" />;
      case 'Activity':
        return <UserGroupIcon className="w-6 h-6" />;
      case 'Insights':
        return <LightBulbIcon className="w-6 h-6" />;
      default:
        break;
    }
  };

  const updatedFiles = async () => {
    const { errors, data } = await postRoute('canvas/update-map-layer', files);
    if (!errors) {
      setCheckFiles(data);
      setFiles(data);
      setErrors({});
    } else {
      setErrors(errors);
    }
  };

  const { items } = useRefinementList({ attribute: 'stage_name' });
  useEffect(() => {
    if (!isEqual(items, legendDetails)) {
      setLegendDetails(items);
    }
  }, [items, legendDetails]);

  const { nbHits } = useStats();

  return (
    <div
      className={classNames(
        ' right-0 z-50 flex h-full flex-col items-start bg-white shadow transition-all duration-300 ',
        isPopUpOpen ? 'min-w-86 w-3/4 sm:w-5/12 lg:w-3/12' : ' w-0 '
      )}
    >
      {isPopUpOpen && dataLoading && (
        <div className="absolute flex justify-center transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          <div className="w-12 h-12 border-4 border-blue-400 rounded-full animate-spin border-t-transparent"></div>
        </div>
      )}
      <div className="flex justify-between w-full p-4 border-b">
        <h1 className="text-base font-semibold text-latisGray-900">
          Other Details
        </h1>
        <span
          className="cursor-pointer"
          onClick={e => {
            e.preventDefault();
            setIsPopUpOpen(false);
            setIsAddLeadFormPopUp(false);
            setSelected(0);
            view.popup.close();
            setIsTerritoryMethod(null);
            setLeadData({});
          }}
        >
          <XMarkIcon className="w-6 h-6 text-latisGray-800" />
        </span>
      </div>
      <Tab.Group
        selectedIndex={selected}
        onChange={e => {
          setTerritory(territoryObject);
          sketchLayer.removeAll();
          setIsTerritoryMethod(null);
          setSelected(e);
        }}
        as="div"
        className={classNames(
          'flex w-full  grow flex-col justify-between  pt-6',
          dataLoading ? 'opacity-25' : ''
        )}
      >
        <Tab.List
          className="w-full bg-white border-0 border-transparent scrollbar-hide "
          defaultChecked={1}
        >
          <div
            onWheel={e => {
              e.currentTarget.scrollLeft += e.deltaY;
            }}
            className="z-0 flex px-4 space-x-8 overflow-x-auto border-b scrollbar-hide"
          >
            {['Records', 'Insights', 'Territories', 'KML']?.map(
              (tab, index) => (
                <Tab
                  key={index + 1}
                  className={({ selected }) =>
                    classNames(
                      'pb-2 text-left focus:outline-none',
                      selected
                        ? 'z-50 border-b-2 border-latisSecondary-800 font-medium  text-latisSecondary-800'
                        : 'text-latisGray-800'
                    )
                  }
                >
                  {tab}
                </Tab>
              )
            )}
          </div>
        </Tab.List>
        <Tab.Panels className="flex-row w-full h-full gap-8 pt-4 grow">
          <Tab.Panel key={1} className="w-full h-full px-4 rounded-b-lg ">
            <div className="flex flex-col w-full h-full">
              <div className="w-full space-y-2">
                <h2 className="flex items-center w-full gap-2 text-base font-semibold">
                  Recently Update
                  <Popover className={'relative grow rounded-md'}>
                    {({ open }) => (
                      <>
                        <Popover.Button>
                          <ChevronDownIcon
                            className={classNames(
                              open ? 'rotate-180 transform' : '',
                              'mt-2 h-5 w-5'
                            )}
                          />
                        </Popover.Button>
                        <Popover.Panel className="absolute z-50 text-gray-700 bg-white border-0 rounded-md shadow w-fit min-w-60">
                          <div className="py-1">
                            <div className="p-4 space-y-5 text-sm cursor-pointer">
                              <h1 className="text-sm font-bold opacity-100 text-latisGray-900">
                                Recent update
                              </h1>
                              <div className="space-y-3.5">
                                {[
                                  'Recently Update',
                                  'Recently Created',
                                  // 'Recently Done Activity',
                                  // 'Next Activity',
                                  // 'Stage: Early to Late',
                                  // 'Stage: Late to Early',
                                  // 'Last Visit Result',
                                  // 'Number of Visits: Low to High',
                                ]?.map(filter => (
                                  <div
                                    key={filter}
                                    onClick={() => {
                                      setSearchOptions(filter);
                                    }}
                                    className="flex items-center text-latisGray-800 hover:text-latisSecondary-800"
                                  >
                                    <ElipseCircle />
                                    <div className="w-full pl-2 font-normal hover:text-latisSecondary-800">
                                      {filter}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Popover.Panel>
                      </>
                    )}
                  </Popover>
                </h2>
                <span className="text-xs font-normal text-latisGray-800">
                  {dataLoading ? (
                    <div className="flex">
                      <span className="text-xl font-semibold">
                        <span className="dot animate-pulse">.</span>
                        <span className="delay-200 dot animate-pulse">.</span>
                        <span className="dot delay-400 animate-pulse">.</span>
                      </span>
                    </div>
                  ) : nbHits >= 1000 ? (
                    `${
                      legendDetails?.length > 0 &&
                      legendDetails?.reduce(
                        (total, item) => total + item.count,
                        0
                      )
                    } records in this area`
                  ) : (
                    `${nbHits} records in this area`
                  )}{' '}
                </span>
              </div>
              <LeadLists
                searchQuery={searchQuery}
                isSearchOn={isSearchOn}
                searchOption={searchOption}
                legendDetails={legendDetails}
                setLegendDetails={setLegendDetails}
                handlePointClick={handlePointClick}
                view={view}
                dataLoading={dataLoading}
                boundingBox={boundingBox}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel key={2} className="w-full h-full border-latisGray-400">
            <Insights legendDetails={legendDetails} />
          </Tab.Panel>
          <Tab.Panel key={3} className="w-full h-full border-latisGray-400">
            <Territories
              sketchView={sketchView}
              territoryObject={territoryObject}
              sketchLayer={sketchLayer}
              setIsTerritoryMethod={setIsTerritoryMethod}
              isTerritoryMethod={isTerritoryMethod}
              createdPolyGon={createdPolyGon}
              drawPolygon={drawPolygon}
              territory={territory}
              setTerritory={setTerritory}
              setCreatedPolyGon={setCreatedPolyGon}
              handleRedraw={handleRedraw}
              view={view}
            />
          </Tab.Panel>
          <Tab.Panel
            key={4}
            className="w-full h-full px-4 border-latisGray-400"
          >
            <div className="flex h-full w-full flex-col gap-2.5">
              <div className="w-full space-y-2">
                <h2 className="flex items-center w-full gap-2 text-sm font-normal text-latisGray-900">
                  Upload KML or KMZ File :-
                </h2>
              </div>
              <DropZone
                checkFiles={checkFiles}
                updatedFiles={updatedFiles}
                errors={errors}
                isSingle={true}
                onClick={onClick}
                onChange={handleUpload}
                files={files}
                setFiles={setFiles}
                newFile={file}
                setNewFile={setFile}
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default memo(SideBar);
