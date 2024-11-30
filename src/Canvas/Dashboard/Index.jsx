import React from 'react';
import TenantAuthenticated from '@/Layouts/TenantAuthenticatedLayout';
import DailyActivityChart from './Partials/DailyActivityChart';
import CanvaserTeamChart from './Partials/CanvaserTeamChart';
import JobSummaryChart from './Partials/JobSummaryChart';
import LeadsDetails from './Partials/LeadsDetails';
import CanvasInfo from './Partials/CanvasInfo';

const Index = ({
  summaryData,
  dailyData,
  dailyDataForCanvaserTeam,
  totalLeads,
  getCurrentMonthWonLeadCount,
  canvasLeadsData,
  getCurrentMonthActiveLeadCount,
  getCurrentMonthLostLeadCount,
}) => {
  return (
    <TenantAuthenticated title="Dashboard">
      <div className="scrollbar-hide h-full w-full space-y-4 overflow-auto bg-white p-5">
        <h1 className="text-xl font-semibold text-black">Canvas</h1>
        <CanvasInfo summaryData={summaryData} />
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-7 lg:gap-7">
          <DailyActivityChart dailyData={dailyData} />
          <CanvaserTeamChart
            dailyDataForCanvaserTeam={dailyDataForCanvaserTeam}
          />
          <JobSummaryChart
            totalLeads={totalLeads}
            leadsWon={getCurrentMonthWonLeadCount}
            leadsCreated={getCurrentMonthActiveLeadCount}
            leadsContracted={getCurrentMonthLostLeadCount}
          />
        </div>
        <div className="max-h-full w-full">
          <LeadsDetails canvasLeadsData={canvasLeadsData} />
        </div>
      </div>
    </TenantAuthenticated>
  );
};

export default Index;
