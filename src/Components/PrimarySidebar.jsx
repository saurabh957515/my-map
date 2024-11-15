import React, { memo, useState } from 'react';
import MarketingIcon from '@/Icons/MarketingIcon';
import SalesIcon from '@/Icons/SalesIcon';
import ProductionIcon from '@/Icons/ProductionIcon';
import LatisIcon from '@/Icons/LatisIcon';
import LayersIcon from '@/Icons/LayersIcon';
import { router } from '@inertiajs/react';
import { classNames, route } from '@/Providers/helpers';
import HomeIcon from '@/Icons/HomeIcon';
import PopupMenu from './PopupMenu';
import { Popover } from '@headlessui/react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import CallQueIcon from '@/Icons/CallQueIcon';

function PrimarySidebar({
  sections,
  setSecondarySidebarOpen,
  setOpenSection,
  className,
  navigations,
  isLandlordArea,
  openSection,
  sidebarOpen,
}) {
  const [selectedType, setSelectedType] = useState('');
  function selectSection(section) {
    setOpenSection(section);
    setSecondarySidebarOpen(true);
    if (
      navigations[section]?.length > 1 ||
      navigations[section][0]?.childreen
    ) {
      setSelectedType(section);
      return;
    } else {
      setSelectedType('');
      router.visit(route(navigations[section][0]?.link));
    }
  }
  function getSectionIcon(section) {
    switch (section) {
      case 'Sales':
        return <SalesIcon className="h-6 w-7" aria-hidden="true" />;
      case 'Marketing':
        return <MarketingIcon className="h-6 w-7" aria-hidden="true" />;
      case 'Canvas':
        return <MapPinIcon className="h-6 w-7" aria-hidden="true" />;
      case 'Production':
        return <ProductionIcon className="h-6 w-7" aria-hidden="true" />;
      case 'Layers':
        return <LayersIcon className="h-6 w-7" aria-hidden="true" />;
      case 'Latis':
        return <HomeIcon className="h-6 w-7" aria-hidden="true" />;
      case 'Call Queue':
        return <CallQueIcon className="h-6 w-7" aria-hidden="true" />;
      default:
        return <LatisIcon className="h-6 w-7" aria-hidden="true" />;
    }
  }
  return (
    <div
      className={classNames(
        'w-[100px] bg-latisPrimary-900 pt-5 text-white transition-all duration-300 ease-in-out',
        sidebarOpen ? ' w-[100px]' : 'max-sm:w-2 max-sm:px-0',
        className
      )}
    >
      <div
        aria-label="Sidebar"
        className={classNames(
          'flex flex-col space-y-11 bg-latisPrimary-900',
          sidebarOpen ? ' ' : 'max-sm:hidden'
        )}
      >
        <button
          type="button"
          className="realtive flex w-full flex-col items-center space-y-1.5 py-1.5 text-center"
          onClick={() => router.visit(route('tenant.dashboard'))}
        >
          <span className="py-1.5">
            <LatisIcon />
          </span>
        </button>
        <div className="scrollbar-hide space-y-4 bg-latisPrimary-900">
          {sections &&
            Object.entries(sections).map(([section, sectionTitle]) => (
              <Popover className="relative" key={section}>
                <Popover.Button as="div">
                  <button
                    type="link"
                    className={classNames(
                      'flex w-full flex-col items-center space-y-1.5 py-1.5 text-center'
                    )}
                    onClick={() => selectSection(section)}
                  >
                    <span
                      className={classNames(
                        openSection === section
                          ? 'text-latisSecondary-800 '
                          : 'text-latisGray-800',
                        'px-4'
                      )}
                    >
                      {getSectionIcon(section)}
                    </span>
                    <span
                      className={classNames(
                        ' z-10 text-xs sm:group-hover:flex',
                        openSection === section
                          ? 'text-white '
                          : 'text-latisGray-800'
                      )}
                    >
                      {section}
                    </span>
                  </button>
                </Popover.Button>

                {navigations[section]?.length > 1 && (
                  <Popover.Panel className="absolute left-20 top-0 z-50 rounded-md border-0 bg-white text-gray-700 shadow">
                    <PopupMenu
                      setSelectedType={setSelectedType}
                      navigations={navigations}
                      isLandlordArea={isLandlordArea}
                      section={section}
                      selectedType={selectedType}
                    />
                  </Popover.Panel>
                )}
              </Popover>
            ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PrimarySidebar);
