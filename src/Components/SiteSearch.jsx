import React, { Fragment, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { classNames, route } from '@/Providers/helpers';

export default function SiteSearch({ navigations }) {
  const [query, setQuery] = useState('');

  const [open, setOpen] = useState(false);

  const filteredRoutes =
    query === ''
      ? []
      : navigations.filter(route => {
          return route.title.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <a
        href="#"
        onClick={() => setOpen(true)}
        className="p-2 text-gray-500 hover:text-mlmgray-900"
      >
        <span className="sr-only">Search</span>
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
      </a>
      <Transition.Root
        show={open}
        as={Fragment}
        afterLeave={() => setQuery('')}
        appear
      >
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <Combobox onChange={route => router.visit(route.link)}>
                  <div className="relative">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      onChange={event => setQuery(event.target.value)}
                    />
                  </div>

                  {filteredRoutes.length > 0 && (
                    <Combobox.Options
                      static
                      className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-mlmgray-900"
                      as="ul"
                    >
                      {filteredRoutes.map(item => (
                        <Combobox.Option
                          key={item.link}
                          value={route(item.link)}
                          href={route(item.link)}
                          className={({ active }) =>
                            classNames(
                              'flex w-full cursor-default select-none px-4 py-2',
                              active && 'bg-mlmblue-400 text-white'
                            )
                          }
                          as="a"
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            router.visit(route(item.link));
                          }}
                        >
                          {item.title}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}

                  {query !== '' && filteredRoutes.length === 0 && (
                    <p className="p-4 text-sm text-gray-500">
                      No routes found.
                    </p>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
