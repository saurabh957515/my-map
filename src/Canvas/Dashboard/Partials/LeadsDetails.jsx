import Checkbox from '@/Components/Checkbox';
import SortIcon from '@/Icons/SortIcon';
import { Link } from '@inertiajs/react';
import React from 'react';

const LeadsDetails = ({ canvasLeadsData }) => {
  return (
    <div className="flex max-h-full w-full flex-col rounded-lg border p-5">
      <div className="flex flex-wrap items-center justify-between">
        <div className="text-base font-medium text-black">Leads</div>
        <div className="cursor-pointer text-sm text-latisSecondary-800">
          <Link href={route('tenant.canvas.canvaser') + '?from=dashboard'}>
            View all Leads
          </Link>
        </div>
      </div>

      <div className="scrollbar-hide mt-5 gap-5 overflow-y-auto rounded-md border px-4 max-xl:grid-cols-6 sm:grid">
        <table className="min-w-full divide-y divide-latisGray-400 bg-white">
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-latisSecondary-700">
                <Checkbox />
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                Name <SortIcon className="ml-2 inline-block" />
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                Stage
                <SortIcon className="ml-2 inline-block" />
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                Owner
                <SortIcon className="ml-2 inline-block" />
              </th>
              <th className="px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                Address
                <SortIcon className="ml-2 inline-block" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-latisGray-400">
            {canvasLeadsData.data?.map(lead => (
              <tr key={lead?.id}>
                <td className="px-4 py-2 text-left text-sm font-normal text-latisGray-900">
                  <Checkbox />
                </td>
                <td className="px-3 py-4 text-sm font-normal text-latisGray-900">
                  {lead?.formatted_name}
                </td>
                <td className="space-x-2 px-3 py-2 text-sm font-normal text-latisGray-900">
                  <span
                    className={`inline-block h-2 w-2 rounded-full `}
                    style={{
                      backgroundColor: lead?.canvas_stage?.color,
                    }}
                  ></span>
                  <span> {lead?.canvas_stage?.name}</span>
                </td>
                <td className="px-3 py-2 text-sm font-normal text-latisGray-900">
                  {lead?.owner?.name}
                </td>
                <td className="px-3 py-2 text-sm font-normal text-latisGray-900">
                  {lead?.formatted_address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsDetails;
