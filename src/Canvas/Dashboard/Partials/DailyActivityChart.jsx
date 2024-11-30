import { Chart } from 'react-google-charts';

const DailyActivityChart = ({ dailyData }) => {
  const options = {
    curveType: 'function',
    legend: 'none',
    chartArea: { width: '90%', height: '80%' },
    series: {
      0: { color: '#5B8EDC' },
      1: { color: '#69D216' },
      2: { color: '#B1271C' },
    },
  };

  return (
    <div className="w-full rounded-lg border border-latisGray-400 p-4 sm:w-2/5">
      <h2 className="mb-4 text-lg font-semibold">Daily Activity</h2>
      <div className="mx-5 mb-4 inline-flex items-center justify-start space-x-4">
        <div className="flex items-center justify-start gap-2">
          <div className="h-2 w-2 rounded-full bg-latisSecondary-800" />
          <div className="text-xs font-normal text-latisGray-800">
            Leads Created
          </div>
        </div>
        <div className="flex items-center justify-start gap-2">
          <div className="h-2 w-2 rounded-full bg-latisGreen-800" />
          <div className="text-xs font-normal text-latisGray-800">
            Won Leads
          </div>
        </div>
        <div className="flex items-center justify-start gap-2">
          <div className="h-2 w-2 rounded-full bg-latisRed-900" />
          <div className="text-xs font-normal text-latisGray-800">
            Lost Leads
          </div>
        </div>
      </div>
      <div className="w-full">
        <Chart
          chartType="LineChart"
          width="100%"
          height="100%"
          data={dailyData}
          options={options}
        />
      </div>
    </div>
  );
};

export default DailyActivityChart;
