import TextInput from '@/Components/TextInput';
import HumanIcon from '@/Icons/humanIcon';
import { classNames } from '@/Providers/helpers';
import { Tab } from '@headlessui/react';
import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import ElipseIcon from '../../CanvasIcons/ElipseIcon';
import TargetPinIcon from '../../CanvasIcons/TargetPinIcon';
import ListActions from '@/Components/ListActions';

const TerritoriesList = ({
  totalTerritories,
  territory,
  addTerritory,
  setTerritory,
  handleDelete,
  setIsAddTerritory,
  setIsTerritoryMethod,
}) => {
  return (
    <Tab.Group
      as="div"
      className={classNames(
        'flex h-full w-full flex-col justify-between overflow-auto   '
      )}
    >
      <Tab.List
        className="border-0 border-transparent bg-white "
        defaultChecked={1}
      >
        <div className="z-0 flex space-x-8 border-b px-4">
          <Tab
            key={1}
            className={({ selected }) =>
              classNames(
                'pb-3 text-left focus:outline-none',
                selected
                  ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                  : 'text-latisGray-800'
              )
            }
          >
            List
          </Tab>
          <Tab
            key={2}
            className={({ selected }) =>
              classNames(
                'pb-3 text-left focus:outline-none',
                selected
                  ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                  : 'text-latisGray-800'
              )
            }
          >
            Hierarchy
          </Tab>
        </div>
      </Tab.List>

      <Tab.Panels className="h-full w-full grow flex-row gap-8 pt-4">
        <Tab.Panel
          key={1}
          className="flex h-full w-full flex-col gap-6 rounded-b-lg px-4"
        >
          <div className=" col-span-4 mt-2 flex w-full items-center justify-between space-x-2.5">
            <div className="relative w-full space-x-2.5">
              <TextInput
                className="bg-latisGray-300 py-3 pl-9 text-xs font-normal text-latisGray-700 placeholder-latisGray-700 placeholder:text-xs"
                placeholder="Search by name"
              />
              <MagnifyingGlassIcon
                className="absolute left-0 top-0 my-3 ml-3 h-6 w-6 text-latisGray-700"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex h-full w-full flex-col divide-y divide-latisGray-600">
            <div className="grid w-full grid-cols-2 space-y-2 pb-4">
              <h2 className="flex w-full items-center text-sm font-medium leading-5 text-latisSecondary-700">
                Territory
              </h2>
              <div className="text-xs font-normal text-latisGray-800">
                <div className=" grid grid-cols-2 gap-2.5">
                  <div className="grid grid-cols-2">
                    <span>
                      <MapPinIcon className="h-6 w-6 text-latisSecondary-700" />
                    </span>
                    <span>
                      <HumanIcon className="h-6 w-6 text-latisSecondary-700" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {totalTerritories?.map(curTerritory => (
              <div
                key={curTerritory?.id}
                className="grid w-full grid-cols-2 space-y-2 py-4"
              >
                <h2 className="flex w-full items-center gap-2 text-sm font-normal leading-5 text-latisGray-900">
                  <ElipseIcon className={'text-latisYellow-200'} />
                  {curTerritory?.name}
                </h2>
                <div className="text-xs font-normal text-latisGray-800">
                  <div className="grid grid-cols-2 items-center">
                    <div className="ml-2 grid grid-cols-2">
                      <span>0</span>
                      <span>0</span>
                    </div>
                    <div className="grid grid-cols-2 ">
                      <span
                        onClick={e => {
                          if (territory?.id === curTerritory?.id) {
                            addTerritory({
                              name: '',
                              assigned_users: '',
                              owner: '',
                              boundary_type: '',
                              boundary_color: '#F2C94C',
                              team_id: '',
                            });
                          } else {
                            addTerritory(curTerritory);
                          }
                        }}
                      >
                        <TargetPinIcon
                          className={classNames(
                            'h-6 w-6 cursor-pointer ',
                            curTerritory?.id === territory?.id
                              ? 'text-latisGreen-900'
                              : 'text-latisSecondary-700'
                          )}
                        />
                      </span>

                      <div className="-ml-2 -mt-2">
                        <ListActions
                          hover={false}
                          title="Actions"
                          moreLinks={[
                            {
                              type: 'Edit',
                              action: function () {
                                setIsTerritoryMethod('edit');
                                setTerritory(curTerritory);
                                setIsAddTerritory(true);
                                addTerritory(curTerritory);
                              },
                            },
                            {
                              type: 'Delete',
                              action: function () {
                                handleDelete(curTerritory?.id);
                              },
                            },
                          ]}
                          icon={
                            <Cog6ToothIcon
                              className={'h-6 w-6 text-latisSecondary-700'}
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tab.Panel>
        <Tab.Panel
          key={2}
          className="h-full w-full border-latisGray-400"
        ></Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default TerritoriesList;
