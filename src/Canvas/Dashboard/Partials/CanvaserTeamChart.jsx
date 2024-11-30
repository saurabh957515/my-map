import React from 'react';
import { Chart } from 'react-google-charts';

const CanvaserTeamChart = ({ dailyDataForCanvaserTeam }) => {
  const options = {
    curveType: 'function',
    legend: 'none',
    chartArea: { width: '80%', height: '80%' },
    series: {
      0: { color: '#5B8EDC' },
      1: { color: '#FFCF45' },
    },
    vAxis: {
      format: '0%',
    },
  };

  return (
    <div className="w-full rounded-lg border border-latisGray-400 p-4 sm:w-2/5">
      <h2 className="mb-4 w-full text-lg font-semibold sm:w-auto">
        Canvasser & Team Performance
      </h2>

      <div className="mx-5 inline-flex flex-wrap items-center justify-start space-x-4">
        <div className="flex items-center justify-start gap-2">
          <div className="h-2 w-2 rounded-full bg-latisSecondary-800" />
          <div className="text-xs font-normal text-latisGray-800">Canvaser</div>
        </div>
        <div className="flex items-center justify-start gap-2">
          <div className="h-2 w-2 rounded-full bg-latisYellow-900" />
          <div className="text-xs font-normal text-latisGray-800">Teams</div>
        </div>
      </div>
      <Chart
        chartType="LineChart"
        width="100%"
        height="auto"
        data={dailyDataForCanvaserTeam}
        options={options}
      />
    </div>
  );
};

export default CanvaserTeamChart;
