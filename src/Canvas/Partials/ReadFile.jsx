import React, { useState } from 'react';
import Papa from 'papaparse';

const ReadFile = ({ setMarkers }) => {
  const [data, setData] = useState([]);

  const handleFileUpload = event => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        complete: results => {
          // Extract the first 10,000 rows
          const first10k = results.data.slice(0, 10000);
          console.log(first10k);
          setData(first10k);
        },
        error: error => {
          console.error('Error parsing file:', error);
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <div></div>
    </div>
  );
};

export default ReadFile;
