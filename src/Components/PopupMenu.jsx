import { Transition } from '@headlessui/react';
import { classNames } from '@/Providers/helpers';
import { Link } from '@inertiajs/react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import ElipseCircle from './ElipseCircle';

const recursionLinks = (navigation, margin) => {
  return (
    <div key={navigation?.title} className={classNames(`ml-${margin} `)}>
      {navigation?.children ? (
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                as="div"
                className={classNames(
                  'flex w-full items-center justify-between hover:text-latisSecondary-800',
                  open
                    ? 'font-bold text-latisSecondary-800'
                    : 'font-normal text-latisGray-800'
                )}
              >
                <span className="flex min-w-[164px] items-center whitespace-nowrap font-normal">
                  <ElipseCircle className=" mr-2" />
                  {navigation?.title}
                </span>

                <span className=" items-center">
                  <ChevronDownIcon
                    className={classNames(
                      open ? '-rotate-180' : 'rotate-0',
                      'inline h-5 w-5 transform text-latisGray-700'
                    )}
                    aria-hidden="true"
                  />
                </span>
              </Disclosure.Button>
              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-100 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="text-LatisGray-800 scrollbar-hide space-y-2 overflow-scroll pt-2">
                  {navigation?.children?.map(navigat =>
                    recursionLinks(navigat, 4)
                  )}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ) : (
        <div className="flex items-center space-x-2 whitespace-nowrap text-latisGray-800 hover:text-latisSecondary-800">
          <ElipseCircle />
          <Link
            className="inline w-full font-normal hover:text-latisSecondary-800"
            href={route(navigation.link)}
          >
            {navigation.title}
          </Link>
        </div>
      )}
    </div>
  );
};

function PopupMenu({ navigations, isLandlordArea, section }) {
  return (
    <div className="py-1">
      <div className="cursor-pointer space-y-5 p-4 text-sm">
        <h1 className="text-sm font-bold text-latisGray-900 opacity-100">
          Settings
        </h1>
        <div className="space-y-3.5">
          {navigations[section]?.map(navigation =>
            recursionLinks(navigation, 0)
          )}
        </div>
      </div>
    </div>
  );
}

PopupMenu.propTypes = {};

export default PopupMenu;
