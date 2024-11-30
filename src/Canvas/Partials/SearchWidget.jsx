import TextInput from '@/Components/TextInput';
import { MapPinIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { loadModules } from 'esri-loader';
import React, { useEffect, useRef, useState } from 'react';
import Graphic from '@arcgis/core/Graphic.js';
import Point from '@arcgis/core/geometry/Point.js';
import ReactDOMServer from 'react-dom/server';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol.js';
const SearchWidget = ({ view, handlePointClick }) => {
  const [suggestions, setSuggestions] = useState([]);
  const searchWidgetRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  useEffect(() => {
    loadModules(['esri/widgets/Search']).then(([Search]) => {
      const searchWidget = new Search({
        view: view,
        popupEnabled: false,
        resultGraphicEnabled: true,
      });
      searchWidgetRef.current = searchWidget;
    });
  }, [view]);

  const handleInputChange = value => {
    setSearchValue(value);
    if (searchWidgetRef.current) {
      setSearchLoading(true);
      searchWidgetRef.current
        .suggest(value)
        .then(response => {
          setSuggestions(response?.results[0]?.results || []);
          setSearchLoading(false);
        })
        .catch(err => {
          console.error('Error fetching suggestions:', err);
        });
    }
  };

  const handleSuggestionClick = async suggestion => {
    if (searchWidgetRef.current) {
      try {
        const response = await searchWidgetRef.current.search(suggestion, {
          include: [],
          popupEnabled: false,
        });
        const results = response?.results[0]?.results;
        if (results && results.length > 0) {
          const { longitude, latitude } = results[0].extent?.center;
          const userLocationPoint = new Point({
            longitude,
            latitude,
            spatialReference: { wkid: 4326 },
          });

          const pinIconSvgString = ReactDOMServer.renderToStaticMarkup(
            <MapPinIcon className="z-50 h-8 w-6 text-red-500" />
          );
          const encodedPinIconSvg = encodeURIComponent(pinIconSvgString);
          const iconDataUri = `data:image/svg+xml,${encodedPinIconSvg}`;

          const pinSymbol = new PictureMarkerSymbol({
            url: iconDataUri,
            width: '24px',
            height: '24px',
          });

          const userLocationGraphic = new Graphic({
            geometry: userLocationPoint,
            symbol: pinSymbol,
          });
          view.graphics.removeAll();
          view.graphics.add(userLocationGraphic);
        } else {
          console.error('No valid results found.');
        }
      } catch (error) {
        console.error('Error fetching suggestion:', error);
      }
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    setSuggestions([]);
    if (searchWidgetRef.current) {
      searchWidgetRef.current.clear();
    }
  };

  return (
    <>
      <div className="relative col-span-4 mt-2 flex w-[300px] items-center justify-between space-x-2.5">
        <div className="relative w-full space-x-2.5">
          <TextInput
            value={searchValue}
            handleChange={e => handleInputChange(e.target.value)}
            className="bg-white py-3 pl-9 text-xs font-normal text-latisGray-900 placeholder-latisGray-700 shadow-lg placeholder:text-xs"
            placeholder="Search by name"
          />
          <MagnifyingGlassIcon
            className="absolute left-0 top-0 my-3 ml-3 h-6 w-6 text-latisGray-700"
            aria-hidden="true"
          />
          {searchValue && (
            <XMarkIcon
              onClick={clearSearch}
              className="absolute right-2 top-0 my-3 mr-4 h-5 w-5 cursor-pointer text-latisGray-700 hover:text-latisGray-900"
              aria-hidden="true"
            />
          )}
        </div>
        {searchValue && (
          <div className="absolute -left-2 top-full z-50 mt-1 max-h-60 w-[300px] overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {searchLoading ? (
              <div className="flex items-center justify-center py-2">
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map(suggestion => (
                <div
                  key={suggestion.key}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="hover:bg-latisGray-100 cursor-pointer px-4 py-2 text-sm"
                >
                  {suggestion.text}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No result found for this address
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchWidget;
