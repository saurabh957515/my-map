import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';
import ElipseCircle from './ElipseCircle';
import { classNames } from '@/Providers/helpers';
// title={More Links}
function ListActions({ moreLinks, title, growWidth, className, icon }) {
  return (
    <Menu as="div" className="dropdown relative">
      <Menu.Button className="dropdown-btn">
        <span className="sr-only">Open options</span>
        {icon ? (
          icon
        ) : (
          <EllipsisHorizontalIcon className="h-6 w-6" aria-hidden="true" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            'dropdown-body l-0 absolute space-y-4 p-4',
            growWidth ? 'w-64' : 'w-52',
            className
          )}
        >
          <Menu.Item>
            <div className="text-sm font-bold text-latisGray-900">{title}</div>
          </Menu.Item>
          {moreLinks?.map(link => (
            <Menu.Item
              key={link?.type}
              className="cursor-pointer px-3 text-latisGray-800 hover:text-latisSecondary-800"
            >
              <div className="flex text-latisGray-800">
                <div
                  className={classNames(
                    'whitespace-nowrap text-sm font-normal text-latisGray-800 hover:text-latisSecondary-800',
                    link.color
                  )}
                  onClick={() => link?.action()}
                >
                  <ElipseCircle className="text mr-4 inline" />
                  <span>{link?.type}</span>
                </div>
              </div>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default ListActions;
