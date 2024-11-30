import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const JobSummaryChart = ({
  leadsWon,
  leadsCreated,
  leadsContracted,
  totalLeads,
}) => {
  const data = {
    datasets: [
      {
        data: [leadsWon, leadsCreated, leadsContracted],
        backgroundColor: ['#69D216', '#5B8EDC', '#FFCF45'],
        hoverBackgroundColor: ['#69D216', '#5B8EDC', '#FFCF45'],
        borderRadius: 10,
      },
    ],
    text: totalLeads,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      },
    },
    doughnutlabel: {
      labels: [
        {
          text: '550',
          font: {
            size: 20,
            weight: 'bold',
          },
        },
        {
          text: 'total',
        },
      ],
    },

    cutout: '78%',
    maintainAspectRatio: false,
  };
  const CenterTextPlugin = {
    id: 'centerText',
    beforeDraw: chart => {
      const { width } = chart;
      const { ctx } = chart;

      ctx.save();

      const valueText = chart.config.data.datasets[0].data
        .reduce((a, b) => a + b, 0)
        .toString();

      const titleText = 'Total Leads';

      ctx.font = '600 24px Poppins';
      ctx.fillStyle = '#464646';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const firstTextX = chart.getDatasetMeta(0).data[0].x;
      const firstTextY = chart.getDatasetMeta(0).data[0].y;
      ctx.fillText(valueText, firstTextX, firstTextY);

      ctx.font = '400 12px Poppins';
      ctx.fillStyle = '#8D9EB8';

      const titleTextY = firstTextY + 23;
      ctx.fillText(titleText, firstTextX, titleTextY);

      ctx.restore();
    },
  };

  return (
    <div className="w-full rounded-lg border border-latisGray-400 p-4 sm:w-1/5">
      <h2 className="mb-4 text-lg font-semibold">Job Summary</h2>
      <div className="mx-auto h-[155px] w-[170px]">
        <Doughnut data={data} options={options} plugins={[CenterTextPlugin]} />
      </div>

      <div className="mt-4 space-y-1.5 px-10">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-latisSecondary-800 " />
            <span className="text-xs text-latisGray-800"> Active Leads</span>
          </span>
          <span className="text-xs font-medium text-black">{leadsCreated}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-latisYellow-900 " />
            <span className="text-xs text-latisGray-800"> Lost Leads</span>
          </span>
          <span className="text-xs font-medium text-black">
            {leadsContracted}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-latisGreen-800" />
            <span className="text-xs text-latisGray-800"> Won Leads</span>
          </span>
          <span className="text-xs font-medium text-black">{leadsWon}</span>
        </div>
      </div>
    </div>
  );
};

export default JobSummaryChart;
