import React from 'react';
import NavLink from '@/Components/NavLink';
import {
  isCurrentRoute,
  isParentOfCurrentRoute,
  route,
} from '@/Providers/helpers';
import Separator from '@/Components/Separator';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';

let sidebarRoutes;
let menuTitle = 'LATIS Home';

function Menu({ isLandlordArea, className, setSecondarySidebarOpen }) {
  return (
    <nav className={className}>
      <button
        className={`${
          isLandlordArea ? 'hidden' : 'flex'
        } mx-2 mb-5 w-full items-center text-sm sm:hidden`}
        onClick={e => setSecondarySidebarOpen(false)}
      >
        <ChevronLeftIcon className="w-5" /> Back
      </button>
      <h3 className="mx-3 py-[5px] font-bold">{menuTitle}</h3>
      <span className="block pb-2">
        <span className="w-100 mx-3 block h-px bg-mlmgray-600 bg-white" />
      </span>
      {sidebarRoutes.map((item, i) =>
        item.name === 'Separator' ? (
          <Separator key={i} className="mx-3 bg-mlmgray-900" />
        ) : (
          <div key={i}>
            <NavLink
              href={route(item.link)}
              active={
                isCurrentRoute(item.route) ||
                isParentOfCurrentRoute(sidebarRoutes, item)
              }
            >
              {item.title}
            </NavLink>
          </div>
        )
      )}
    </nav>
  );
}

export default function SidebarNav({
  isLandlordArea = false,
  sidebarOpen,
  setSecondarySidebarOpen,
  className,
  openSection,
  navigations,
  sections,
}) {
  sidebarRoutes = isLandlordArea ? navigations : navigations[openSection];

  menuTitle = isLandlordArea ? menuTitle : sections[openSection];

  return (
    <div
      className={`ml-0 h-full overflow-hidden bg-mlmgray-400 transition-all duration-200 sm:ml-[70px]
      ${sidebarOpen ? 'w-[300px] sm:w-[230px]' : 'w-0'}
      ${className}`}
    >
      <Menu
        className="w-[300px] space-y-2 p-4 sm:w-[230px]"
        isLandlordArea={isLandlordArea}
        setSecondarySidebarOpen={setSecondarySidebarOpen}
      />
    </div>
  );
}

export { Menu };
