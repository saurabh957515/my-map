import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export const CarouselItem = ({ children, width }) => {
  return <div className={`snapshot-carousel-item ${width}`}>{children}</div>;
};

export default function Carousel({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextPageLimit, setNextPageLimit] = useState(0);
  const [slideRightOpen, setSlideRightOpen] = useState(false);
  const [slideLeftOpen, setSlideLeftOpen] = useState(false);
  const [length, setLength] = useState(children && children.length);
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    setLength(children && children.length);

    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [children]);

  let snapshotCarouselCountDisplay = 4;
  if (windowSize.innerWidth <= 1279 && windowSize.innerWidth > 730) {
    snapshotCarouselCountDisplay = 2;
  }
  if (windowSize.innerWidth <= 767 && windowSize.innerWidth > 0) {
    snapshotCarouselCountDisplay = 1;
  }

  const updateIndex = newIndex => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = React.Children.count(children) - 1;
    }
    setNextPageLimit(
      Math.floor(React.Children.count(children) / snapshotCarouselCountDisplay)
    );
    setActiveIndex(newIndex);
  };

  return (
    <div className="snapshot-carousel relative mt-0 overflow-hidden">
      <div
        className="inner transform whitespace-nowrap transition duration-500"
        style={{ transform: `translatex(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, child => {
          return React.cloneElement(child, {
            width:
              'w-full md:w-2/4 xl:w-1/4 md:pl-4 inline-flex items-center h-auto',
          });
        })}
      </div>

      <div className="indicators">
        {activeIndex !== 0 ? (
          <ChevronLeftIcon
            onClick={() => {
              updateIndex(activeIndex - 1);
            }}
            onMouseEnter={() => {
              setSlideLeftOpen(true);
              setSlideRightOpen(false);
            }}
            onMouseLeave={() => {
              setSlideLeftOpen(false);
            }}
            className={`${
              slideLeftOpen ? 'left-0' : '-left-8'
            } absolute top-14 h-12 border-r border-mlmblue-700 bg-mlmgray-200 px-2 py-3 transition-all duration-300`}
          >
            Prev
          </ChevronLeftIcon>
        ) : (
          ''
        )}

        {activeIndex !== 0 && activeIndex === nextPageLimit ? (
          ''
        ) : (
          <ChevronRightIcon
            onClick={() => {
              updateIndex(activeIndex + 1);
            }}
            onMouseEnter={() => {
              setSlideRightOpen(true);
              setSlideLeftOpen(false);
            }}
            onMouseLeave={() => {
              setSlideRightOpen(false);
            }}
            className={`${
              slideRightOpen ? 'right-0' : '-right-8'
            } absolute top-14 h-12 border-l border-mlmblue-700 bg-mlmgray-200 px-2 py-3 transition-all duration-300`}
          >
            Next
          </ChevronRightIcon>
        )}
      </div>
    </div>
  );
}

export function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
