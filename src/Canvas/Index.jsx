import React, { useState } from 'react';
import SourceMap from './Partials/SourceMap';

const Index = () => {
  const [csvData, setCsvData] = useState([
    { longitude: -118.805, latitude: 34.027 },
    { longitude: -118.806, latitude: 34.026 },
    { longitude: -118.804, latitude: 34.028 },
    { longitude: -118.803, latitude: 34.029 },
  ]);

  const [mapType, setMapType] = useState('streets-navigation-vector');
  const [isAddLeadFormPopUp, setIsAddLeadFormPopUp] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="relative overflow-hidden grow ">
        <SourceMap
          isAddLeadFormPopUp={isAddLeadFormPopUp}
          setIsAddLeadFormPopUp={setIsAddLeadFormPopUp}
          mapType={mapType}
          setCsvData={setCsvData}
          csvData={csvData}
        />
      </div>
    </div>
  );
};

export default Index;
