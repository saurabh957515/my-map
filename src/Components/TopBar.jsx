import React, { Fragment, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  BellIcon,
  ChatBubbleLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { classNames, route } from '@/Providers/helpers';
import default_avatar from '../../images/default_avatar.png';
import Badge from '@/Components/Badge';
import SiteSearch from '@/Components/SiteSearch';
import ExpandIcon from '@/Icons/ExpandIcon';
import {
  landlordUserNavigation,
  tenantUserNavigation,
} from '@/Providers/constants';
import _ from 'lodash';
import PrimaryButton from './PrimaryButton';
import TextInput from './TextInput';
import LeadModel from './LeadModel';
import NotificationModal from './NotificationModal';
export default function TopBar({
  user,
  title = 'Page Title',
  isLandlordArea = false,
  sidebarOpen,
  setSidebarOpen,
  navigations,
  addLead,
  trades,
  openNotificationModal,
  setOpenNotificationModal,
  backGroundJobProcess,
}) {
  const [isAddLead, setIsAddLead] = useState(false);
  let userNavigations = isLandlordArea
    ? landlordUserNavigation
    : tenantUserNavigation;
  let searchRoutes = [];
  if (!isLandlordArea) {
    Object.entries(navigations).forEach(([app, routes]) => {
      searchRoutes = [...searchRoutes, ...routes];
    });
  } else {
    searchRoutes = navigations;
  }

  function findPathByTitle(obj, currentTitle) {
    let path;
    let newObject = Object.entries(obj);

    _.find(newObject, ([key, value]) => {
      path = [];
      path.push({ title: key });

      function getValues(value) {
        const foundItem = _.find(value, newItem => {
          if (newItem?.title?.toLowerCase() === currentTitle?.toLowerCase()) {
            return true;
          } else if (newItem?.children) {
            return getValues(newItem?.children);
          }
          return false;
        });
        foundItem && path.splice(1, 0, foundItem);
        return foundItem;
      }

      return getValues(value);
    });

    return path;
  }

  function onLead(e) {
    e.preventDefault();
    setIsAddLead(true);
  }
  return (
    <div className="z-20 flex min-h-[65px] justify-between border-b bg-white px-5">
      <LeadModel
        isAddLead={isAddLead}
        setIsAddLead={setIsAddLead}
        trades={trades}
      />
      <div className="ml-2 flex max-w-[30%] items-center ">
        <button
          className="mr-5 flex items-center sm:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="sr-only">Collapse Sidebar</span>
          <ExpandIcon
            className={`w-7 text-latisGray-900 ${
              sidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <h2 className="min-w-0 flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-mlmgray-900">
          <div className="flex items-center" aria-label="Breadcrumb">
            {findPathByTitle(navigations, title)?.map((page, index, pages) => (
              <div key={page.title}>
                <div className="flex items-center">
                  {index !== 0 && (
                    <ChevronRightIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    href={page.route}
                    className={classNames(
                      'px-1 text-xs font-normal',
                      index == pages?.length - 1
                        ? 'text-latisGray-700'
                        : 'text-latisGray-900'
                    )}
                    aria-current={page.current ? 'page' : undefined}
                  >
                    {page.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </h2>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        {addLead ? (
          <div className="px-12 ">
            <div className="inline-flex items-center gap-2">
              <div className="flex flex-col items-start gap-2.5 rounded-full border border-latisGray-600 bg-latisGray-300 px-4 py-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-start gap-2.5 p-0">
                    <MagnifyingGlassIcon className="h-5 w-5 text-latisGray-700" />
                  </div>
                  <input className="w-[13.25rem] border-none bg-latisGray-300 text-sm  text-latisGray-700 focus:outline-none focus:ring-0" />

                  {/* <div className="w-[13.25rem] text-latisGray-700 text-sm leading-[normal]">Search</div> */}
                </div>
              </div>
              <div className="flex h-[1.125rem] w-[6.6875rem] items-center justify-center text-xs leading-[normal] text-latisGray-700">
                Advanced Search
              </div>
            </div>
          </div>
        ) : (
          <div className="flex">
            <SiteSearch navigations={searchRoutes} />
          </div>
        )}
        {addLead && (
          <PrimaryButton onClick={onLead}>
            <PlusCircleIcon className="inline h-5 w-5" /> Add Lead
          </PrimaryButton>
        )}
        <span className="h-4 w-px bg-mlmgray-900" aria-hidden="true" />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <a
            href="#"
            className="relative p-2 text-gray-500 hover:text-mlmgray-900"
          >
            <span className="sr-only">Search</span>
            <ChatBubbleLeftIcon className="h-5 w-5" aria-hidden="true" />
            <Badge>13</Badge>
          </a>

          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="relative w-full p-2 text-gray-500 hover:text-mlmgray-900">
                <span className="sr-only">Search</span>
                <BellIcon className="h-5 w-5" aria-hidden="true" />
                <Badge>1</Badge>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items className="right- absolute right-0 mt-7 w-80 rounded-md border border-latisGray-700 bg-white py-1 ring-1 ring-black ring-opacity-5 focus:outline-none ">
                <Menu.Item>
                  <NotificationModal
                    onClose={setOpenNotificationModal}
                    backGroundJobProcess={backGroundJobProcess}
                  />
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <span className="h-4 w-px bg-mlmgray-900" aria-hidden="true" />

        {/* Profile dropdown */}
        {addLead ? (
          <div className="rounded-full bg-pink-500 p-1.5 text-base text-white">
            CR
          </div>
        ) : (
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-mlmblue-700 focus:ring-offset-2">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-auto rounded-full"
                  src={default_avatar}
                  alt=""
                />
                <span className="ml-2 hidden md:block">{user.name}</span>
                <ChevronDownIcon className="ml-2 h-4" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {userNavigations.map((item, i) => (
                  <Menu.Item key={i}>
                    {({ active, close }) => (
                      <Link
                        method={item.method ? item.method : 'get'}
                        href={route(item.link)}
                        as={
                          item.method && item.method === 'post' ? 'button' : 'a'
                        }
                        className={classNames(
                          active
                            ? 'dropdown-item-active'
                            : 'dropdown-item-inactive',
                          'dropdown-item w-full text-left'
                        )}
                      >
                        {item.title}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
}
