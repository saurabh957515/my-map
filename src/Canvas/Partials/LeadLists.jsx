import React, { useEffect, useRef, useState } from 'react';
import { SearchBox, useInfiniteHits, useStats } from 'react-instantsearch';
import debounce from 'lodash.debounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const defaultBoundingBox = {
  minLat: 40.082690433772974,
  maxLat: 40.090324193208765,
  minLon: -74.06590930185962,
  maxLon: -74.0371560212192,
};

const LeadLists = ({
  boundingBox,
  dataLoading,
  handlePointClick,
  searchOption,
  isSearchOn,
  searchQuery,
}) => {
  const containerRef = useRef(null);
  const [listRecords, setListRecords] = useState([]);
  const { showMore, results } = useInfiniteHits();
  const [lastSearchOption, setLastSearchOption] = useState(null);
  const previousItemCount = useRef(0);
  const [scrollCount, setScrollCount] = useState(0);
  const [isSearchValue, setIsSearchValue] = useState('');

  useEffect(() => {
    if (dataLoading) {
      setListRecords([]);
      setScrollCount(0);
    } else {
      if (results.hits.length > 0) {
        if (lastSearchOption !== searchOption) {
          setLastSearchOption(searchOption);
          setListRecords(results?.hits);
        } else if (isSearchOn) {
          if (isSearchValue !== results?.query) {
            setListRecords(results?.hits);
            setIsSearchValue(results?.query);
          } else {
            setListRecords(prev => {
              const newIds = new Set(results.hits.map(item => item.id));
              const updatedList = prev
                .filter(item => !newIds.has(item.id))
                .concat(results.hits);
              return updatedList;
            });
          }
        } else {
          setListRecords(prev => {
            const newIds = new Set(results.hits.map(item => item.id));
            const updatedList = prev
              .filter(item => !newIds.has(item.id))
              .concat(results.hits);
            return updatedList;
          });
        }
      } else if (scrollCount === 0) {
        setListRecords([]);
      }
    }
  }, [
    results?.hits,
    scrollCount,
    dataLoading,
    lastSearchOption,
    searchOption,
    isSearchOn,
    isSearchValue,
  ]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const scrollPosition = container.scrollTop + container.clientHeight;
      const threshold = container.scrollHeight - 100;
      if (scrollPosition >= threshold) {
        previousItemCount.current = listRecords.length;
        showMore();
        setScrollCount(pre => pre + 1);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [listRecords?.length]);

  return (
    <div className="relative flex h-[60vh] grow flex-col">
      <div className="absolute top-4 z-50 ml-2 mt-0.5 h-5 w-fit">
        <MagnifyingGlassIcon
          className="h-5 w-5 text-latisGray-700"
          aria-hidden="true"
        />
      </div>
      <SearchBox className="" placeholder="Search by name"></SearchBox>
      <div
        ref={containerRef}
        className="scrollbar-hide mt-4 grow justify-center divide-y overflow-auto "
      >
        {listRecords?.map((item, index, items) => (
          <div
            key={index}
            onClick={() => {
              handlePointClick(item);
            }}
            className="flex-start flex cursor-pointer flex-col gap-2 py-4"
          >
            <h1 className="cursor-text text-sm font-semibold capitalize text-latisGray-800">
              {item?.lead_name}
              <span className="text-xs font-normal italic text-latisGray-800">
                (Visit)
              </span>
            </h1>
            <div className="space-y-1">
              <div className="flex gap-1 text-xs font-normal text-latisGray-800">
                {item.formatted_address}
              </div>
              <div className="flex items-center gap-2 text-xs font-normal text-latisGray-800">
                <span className="">(410) 837-8429</span>
                <span className="h-3 w-[1px] bg-latisGray-800"></span>
                <span>georgea9@hotmail.com</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadLists;
