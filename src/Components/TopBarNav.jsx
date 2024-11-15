import { classNames, isCurrentRoute, route } from '@/Providers/helpers';
import React from 'react';
import { Link } from '@inertiajs/react';
import { Disclosure } from '@headlessui/react';
import { Bars4Icon } from '@heroicons/react/24/outline';

export default function TopBarNav({ navigations, children }) {
  return (
    <>
      <div className="flex border-b border-mlmgray-400 px-8 py-4 max-lg:hidden max-md:space-y-2">
        <nav className="mr-4 flex flex-grow items-center justify-start space-x-4 overflow-x-auto whitespace-nowrap">
          {navigations.map((item, i) => (
            <Link
              href={route(item.link)}
              className={classNames(
                isCurrentRoute(item.route)
                  ? 'text-mlmblue-400'
                  : 'text-mlmgray-900 hover:text-mlmblue-400',
                'group flex items-center py-1.5 text-xs font-medium uppercase'
              )}
              key={i}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-shrink flex-wrap items-center justify-end space-x-4">
          {children}
        </div>
      </div>
      <div>
        <div className="hidden  max-lg:block max-md:space-y-2">
          <Disclosure>
            <div className="flex border-b border-mlmgray-400 px-8 py-4 ">
              <Disclosure.Button className="hidden items-center py-1 pr-1 max-lg:block">
                <Bars4Icon className="h-6" />
              </Disclosure.Button>
              <div className="ml-auto flex flex-shrink flex-wrap items-center space-x-4">
                {children}
              </div>
            </div>
            <Disclosure.Panel
              className="z-50 m-3 mt-2 hidden rounded-xl bg-white px-3 py-2 shadow-[0px_0px_10px_rgba(0,0,0,0.3)] max-lg:block"
              vertical="bottom"
            >
              <div className="hidden max-lg:block ">
                {navigations.map((item, i) => (
                  <Link
                    href={route(item.link)}
                    className={classNames(
                      isCurrentRoute(item.route)
                        ? 'text-mlmblue-400'
                        : 'text-mlmgray-900 hover:text-mlmblue-400',
                      'block py-1.5  text-xs font-medium uppercase'
                    )}
                    key={i}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </div>
    </>
  );
}
