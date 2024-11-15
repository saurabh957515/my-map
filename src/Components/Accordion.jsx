import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Accordion({ children, title }) {
  return (
    <div className=" px-7 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto divide-y-2 divide-gray-200">
        <Disclosure as="div">
          {({ open }) => (
            <>
              {/* <dt className="text-lg"> */}
              <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-400">
                <h3 className="text-lg font-bold leading-normal  text-mlmgray-900">
                  {title}
                </h3>
                <span className="ml-6 flex h-7 items-center">
                  <ChevronDownIcon
                    className={classNames(
                      open ? '-rotate-180' : 'rotate-0',
                      'h-6 w-6 transform'
                    )}
                    aria-hidden="true"
                  />
                </span>
              </Disclosure.Button>
              {/* </dt> */}
              <Disclosure.Panel as="dd" className="mt-2">
                <span className="font-medium text-gray-900">{children}</span>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
