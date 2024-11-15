import React, { useState, useEffect, useRef } from 'react';
import './range.css';

const RangeWithTeardrop = ({ onSlide, value }) => {
  const [range, setRange] = useState(value);
  const [isHover, setIsHover] = useState(false);
  const trackStyle = {
    background: `linear-gradient(to right, #4A90E2 0%, #4A90E2 ${range}%, #ccc ${range}%, #ccc 100%)`,
  };
  const teardropRef = useRef(null);
  const rangeRef = useRef(null);

  const updateTeardropPosition = () => {
    if (!rangeRef.current || !teardropRef.current) return;
    const value = range;
    const max = rangeRef.current.max;
    const min = rangeRef.current.min;
    const rangeWidth = rangeRef.current.offsetWidth;
    const thumbWidth = 20;
    const newLeft =
      ((value - min) / (max - min)) * (rangeWidth - thumbWidth) +
      thumbWidth / 2;
    teardropRef.current.style.left = `${newLeft - 18}px`;
  };

  useEffect(() => {
    updateTeardropPosition();
    window.addEventListener('resize', updateTeardropPosition);
    return () => window.removeEventListener('resize', updateTeardropPosition);
  }, [range]);

  return (
    <div id="slider-container" className="relative w-full">
      <input
        id="default-range"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        ref={rangeRef}
        type="range"
        value={range}
        min="0"
        style={trackStyle}
        max="100"
        onChange={e => {
          onSlide(e.target.value);
          setRange(e.target.value);
        }}
        className="relative h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
      />
      {/* {isHover && (
        <div ref={teardropRef} className="teardrop-indicator absolute">
          {range}
        </div>
      )} */}
    </div>
  );
};

export default RangeWithTeardrop;
