import { Disclosure, Menu, Popover, Transition } from '@headlessui/react';
import { ArrowsUpDownIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import {
  classNames,
  filterEmptyObjectValues,
  route,
  submitFilterQuery,
  useIsMount,
} from '@/Providers/helpers';
import FilterIcon from '@/Icons/FilterIcon';
import Datepicker from 'react-tailwindcss-datepicker';
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import LoopIcon from '@/Icons/LoopIcon';
import _ from 'lodash';
import { router } from '@inertiajs/react';

export default function Filter({
  children,
  textFilters = [],
  dateRangeFilters = [],
  filterData,
  setFilterQuery = () => {},
  request,
}) {
  const isMount = useIsMount();
  const [stateFilterData, setFilterData] = useState(filterData);
  const [stateTextFilters, setTextFilters] = useState(textFilters);
  const [stateDateRangeFilters, setDateRangeFilters] =
    useState(dateRangeFilters);
  const [stateSortBy, setSortBy] = useState(request?.sortBy ?? '');

  useEffect(() => {
    isMount === false && handleSubmitFilterQuery(stateFilterData);
  }, [stateSortBy, stateDateRangeFilters, stateFilterData]);

  function handleDateRangeFilterChange(filterName, value) {
    const tempDateRangeFilters = _.cloneDeep(stateDateRangeFilters);

    tempDateRangeFilters.forEach(filter => {
      if (filter.name === filterName) {
        filter.value =
          value.startDate && value.endDate
            ? value.startDate + ' to ' + value.endDate
            : '';
      }
    });

    setDateRangeFilters(tempDateRangeFilters);
  }

  function handleTextFilterChange(filterName, value) {
    const tempTextFilters = _.cloneDeep(stateTextFilters);

    tempTextFilters.forEach(filter => {
      if (filter.name === filterName) {
        filter.value = value;
      }
    });

    setTextFilters(tempTextFilters);
  }

  function handleFilterChange(e, sectionId, optionId) {
    const tempFilterData = _.cloneDeep(stateFilterData);

    tempFilterData.filters.forEach(filter => {
      if (filter.id === sectionId) {
        filter.options[optionId].checked = e.target.checked;
      }
    });

    setFilterData(tempFilterData);
  }

  function handleSubmitFilterQuery(stateFilterData) {
    let query = {};
    stateFilterData.filters.forEach(filter => {
      let values = [];
      filter.options.forEach(option => {
        if (option.checked) {
          values.push(option.value);
        }
      });
      query[filter.name] = values;
    });
    stateTextFilters.forEach(filter => {
      if (filter.value) {
        query[filter.name] = filter.value;
      }
    });
    stateDateRangeFilters.forEach(filter => {
      if (filter.value) {
        query[filter.name] = filter.value;
      }
    });
    if (stateSortBy) {
      query['sortBy'] = stateSortBy;
    }
    setFilterQuery(filterEmptyObjectValues(query));
    submitFilterQuery(query);
  }

  function getActiveOptionCount(section) {
    return section.options.filter(option => option.checked).length;
  }

  function getActiveFilterCount() {
    let count = 0;
    stateFilterData.filters.forEach(filter => {
      filter.options.forEach(option => {
        if (option.checked) {
          count++;
        }
      });
    });
    return count;
  }

  function isAnySearchFilled() {
    let isFilled = false;
    stateTextFilters.forEach(filter => {
      if ('' !== filter.value) {
        isFilled = true;
      }
    });
    return isFilled;
  }

  function isAnyDateRangeFilled() {
    let isFilled = false;
    stateDateRangeFilters.forEach(filter => {
      if ('' !== filter.value) {
        isFilled = true;
      }
    });
    return isFilled;
  }

  function isSortingApplied() {
    return '' !== stateSortBy;
  }

  function isSortingSearchOrFiltersApplied() {
    return (
      getActiveFilterCount() > 0 ||
      isAnySearchFilled() ||
      isAnyDateRangeFilled() ||
      isSortingApplied()
    );
  }

  return (
    <Disclosure>
      <div className="flex border-b border-mlmgray-400 px-8 py-4 max-md:space-y-2">
        <div className="flex flex-grow items-center">
          <Disclosure.Button className="flex hidden items-center py-1 pr-1 max-lg:block">
            <AdjustmentsHorizontalIcon className="h-6" />
          </Disclosure.Button>
          <FilterBar
            className="flex max-lg:hidden"
            stateFilterData={stateFilterData}
            isSortingSearchOrFiltersApplied={isSortingSearchOrFiltersApplied}
            getActiveOptionCount={getActiveOptionCount}
            handleFilterChange={handleFilterChange}
            stateSortBy={stateSortBy}
            setSortBy={setSortBy}
            stateDateRangeFilters={stateDateRangeFilters}
            handleDateRangeFilterChange={handleDateRangeFilterChange}
          />
        </div>
        <div className="flex flex-shrink flex-wrap items-center justify-end space-x-4">
          {stateTextFilters &&
            stateTextFilters.map(filter => (
              <div key={filter.id} className="flex pl-2">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <input
                    type="text"
                    name={filter.name}
                    id={filter.name}
                    className="rounded-l-md border-0 bg-mlmgray-200 py-1.5 pr-10 text-xs focus:border-mlmblue-400 focus:ring-mlmblue-400"
                    placeholder={filter.name + '...'}
                    value={filter.value}
                    onChange={e =>
                      handleTextFilterChange(filter.name, e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border-0 bg-mlmgray-400 px-2 text-xs font-medium text-gray-500 text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-transparent"
                  onClick={e => handleSubmitFilterQuery(stateFilterData)}
                >
                  <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ))}
          {children}
        </div>
      </div>
      <Disclosure.Panel className="hidden border-b border-mlmgray-400 bg-mlmgray-200 px-8 py-4 max-lg:block">
        <FilterBar
          className="hidden max-lg:flex"
          stateFilterData={stateFilterData}
          isSortingSearchOrFiltersApplied={isSortingSearchOrFiltersApplied}
          getActiveOptionCount={getActiveOptionCount}
          handleFilterChange={handleFilterChange}
          stateSortBy={stateSortBy}
          setSortBy={setSortBy}
          stateDateRangeFilters={stateDateRangeFilters}
          handleDateRangeFilterChange={handleDateRangeFilterChange}
        />
      </Disclosure.Panel>
    </Disclosure>
  );
}

export function ClearFilterButton({ onClick, className }) {
  return (
    <button
      onClick={e => onClick(e)}
      className={classNames(className, 'flex items-center py-1 pr-1')}
    >
      <LoopIcon className="h-4 w-4"></LoopIcon>
    </button>
  );
}

export function FilterBar({
  className,
  stateFilterData,
  isSortingSearchOrFiltersApplied,
  getActiveOptionCount,
  handleFilterChange,
  stateSortBy,
  setSortBy,
  stateDateRangeFilters,
  handleDateRangeFilterChange,
}) {
  return (
    <div
      className={classNames(
        className,
        'flex-wrap items-center justify-start space-x-2 max-xl:space-y-2'
      )}
    >
      {stateFilterData.sortOptions && isSortingSearchOrFiltersApplied() && (
        <ClearFilterButton
          className="max-xl:mt-2"
          onClick={e => {
            router.get(route(route().current()));
          }}
        />
      )}
      <Menu
        as="div"
        className={classNames(
          isSortingSearchOrFiltersApplied() ? 'pl-3' : '',
          'relative inline-block py-1 text-left max-xl:mt-2'
        )}
      >
        <div className="flex items-center">
          <Menu.Button className="group inline-flex justify-center text-sm font-medium text-mlmgray-900">
            <ArrowsUpDownIcon className="h-5 w-5" aria-hidden="true" />
            {stateSortBy ? ' : ' + stateSortBy : ''}
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
          <Menu.Items className="absolute left-0 z-10 mt-2 w-24 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {stateFilterData.sortOptions.map(option => (
                <Menu.Item key={option.name}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setSortBy(option.name);
                      }}
                      className={classNames(
                        option.name === stateSortBy ? 'text-mlmblue-400' : '',
                        active ? 'text-mlmblue-400' : 'text-mlmblue-700',
                        'block w-full px-4 py-2 text-left text-xs font-semibold uppercase'
                      )}
                    >
                      {option.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      {stateFilterData.filters.map(section => (
        <Popover.Group key={section.name} className="pl-2 max-xl:mt-2">
          <Popover className="relative text-left">
            <Popover.Button className="group inline-flex items-center justify-center space-x-1 align-middle text-sm font-medium capitalize leading-6 text-gray-700 hover:text-gray-900">
              <FilterIcon className="h-5 w-5 text-mlmgray-900"></FilterIcon>
              <span>{section.name}</span>
              {getActiveOptionCount(section) > 0 ? (
                <span className="rounded bg-mlmgray-400 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                  {getActiveOptionCount(section)}
                </span>
              ) : null}
              <ChevronDownIcon
                className="h-5 w-5 flex-shrink-0 text-mlmgray-800 group-hover:text-mlmgray-900"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="absolute left-0 z-10 mt-2 origin-top-left rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <form className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        defaultChecked={option.checked}
                        onChange={e =>
                          handleFilterChange(e, section.id, optionIdx)
                        }
                        className={classNames(
                          option.checked
                            ? 'border-mlmblue-400'
                            : 'border-mlmblue-700',
                          'h-4 w-4 cursor-pointer rounded text-mlmblue-400 focus:ring-mlmblue-400'
                        )}
                      />
                      <label
                        htmlFor={`filter-${section.id}-${optionIdx}`}
                        className={classNames(
                          option.checked
                            ? 'text-mlmblue-400'
                            : 'text-mlmblue-700',
                          'ml-3 cursor-pointer whitespace-nowrap pr-6 text-xs font-semibold uppercase'
                        )}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </form>
              </Popover.Panel>
            </Transition>
          </Popover>
        </Popover.Group>
      ))}

      {stateDateRangeFilters &&
        stateDateRangeFilters.map(filter => (
          <Datepicker
            key={filter.id}
            placeholder={filter.name}
            separator="to"
            primaryColor="blue"
            value={
              filter.value
                ? {
                    startDate: filter.value.split(' to ')[0],
                    endDate: filter.value.split(' to ')[1],
                  }
                : {
                    startDate: null,
                    endDate: null,
                  }
            }
            onChange={value => handleDateRangeFilterChange(filter.name, value)}
            showShortcuts={true}
            showFooter={true}
            displayFormat="MM/DD/YYYY"
            containerClassName="relative pl-2"
            inputClassName="relative min-w-[220px] py-1.5 pr-10 rounded-md border-0 focus:border-mlmblue-400 focus:ring-mlmblue-400 text-xs bg-mlmgray-200"
          />
        ))}
    </div>
  );
}
