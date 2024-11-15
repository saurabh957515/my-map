import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';

const CustomColorPicker = ({ color, onChange, predefinedColors = [] }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleColorChange = newColor => {
    onChange(newColor.hex);
  };

  const handlePredefinedColorClick = selectedColor => {
    onChange(selectedColor);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex max-w-full space-y-2 ">
      <div className="flex items-center max-w-full space-x-3 "> 
      <div className='flex flex-wrap flex-auto overflow-auto'>
      {predefinedColors.map(predefinedColor => (
          <button
            key={predefinedColor}
            type="button"
            onClick={() => handlePredefinedColorClick(predefinedColor)}
            className="flex items-center p-2 border rounded-3xl"
            style={{
              borderColor:
                color === predefinedColor ? predefinedColor : 'transparent',
            }}
          >
            <span
              className="inline-block w-6 h-6 rounded-full "
              style={{ backgroundColor: predefinedColor }}
            ></span>
          </button>
        ))} 
      </div>
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center p-2 border rounded-3xl"
          style={{ borderColor: color }}
        >
          <span
            className="inline-block w-6 h-6 mr-2 rounded-full"
            style={{ backgroundColor: color }}
          ></span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
      </div>

      {showPicker && (
        <div className="absolute right-0 z-50 top-8" ref={pickerRef}>
          <ChromePicker color={color} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default CustomColorPicker;
