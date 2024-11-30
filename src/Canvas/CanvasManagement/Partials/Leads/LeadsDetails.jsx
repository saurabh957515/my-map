import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Link, router, usePage } from '@inertiajs/react';
import classNames from 'classnames';
import TextInput from '@/Components/TextInput';
import NoDataListWarning from '@/Pages/Tenant/Call/Partials/NoDataListWarning';
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import ListActions from '@/Components/ListActions';
import Checkbox from '@/Components/Checkbox';
import SortIcon from '@/Icons/SortIcon';
import MapIcon from '@/Icons/MapIcon';
import DeleteLead from './DeleteLead';
import EditLead from './EditLead';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

function LeadsDetails({
  data,
  errors,
  setIsLeadBarOpen,
  setSelectedUser,
  leadData,
  pagination,
  handlePageChange,
}) {
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteTeam, setDeleteTeam] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      setIsLeadBarOpen(false);
    };
  }, [setIsLeadBarOpen]);

  const [selectedUsers, setSelectedUsers] = useState([]);

  function OnLeadEdit() {
    setIsEditLeadModalOpen(true);
  }

  const handleDeleteUser = () => {
    router.delete(route('tenant.canvas.leads.destroy', userToDelete.id));
    setDeleteTeam(false);
  };

  const confirmDeleteUser = lead => {
    setUserToDelete(lead);
    setDeleteTeam(true);
  };

  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelectedUsers(leadData.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleCheckboxChange = userId => {
    setSelectedUsers(prevState => {
      if (prevState.includes(userId)) {
        return prevState.filter(id => id !== userId);
      } else {
        return [...prevState, userId];
      }
    });
  };

  const allSelected =
    selectedUsers?.length === leadData?.length && leadData?.length > 0;

  const handleRowClick = user => {
    setIsLeadBarOpen(prev => !prev);
    setSelectedUser(user);
  };
  return (
    <>
      {!_.isEmpty(data) || !_.isEmpty(errors) ? (
        <>
          <DeleteLead
            deleteTeam={deleteTeam}
            setDeleteTeam={setDeleteTeam}
            handleDeleteUser={handleDeleteUser}
            userToDelete={userToDelete?.id}
          />

          <EditLead
            isEditLeadModalOpen={isEditLeadModalOpen}
            setIsEditLeadModalOpen={setIsEditLeadModalOpen}
          />
          {leadData?.length > 0 ? (
            <div
              className={
                'flex max-h-full w-full flex-col rounded-lg border p-5 pt-1'
              }
            >
              <div className="top-5 mt-3 flex flex-wrap items-center justify-between space-y-3 sm:flex-nowrap sm:space-y-0">
                <div className="text-base font-medium text-black">Leads</div>
                <div className="sm:w- flex w-full flex-wrap items-center space-x-2 space-y-3 sm:justify-end sm:space-x-5 sm:space-y-0 md:justify-end">
                  <div className="relative w-full flex-grow flex-wrap sm:mr-10 sm:w-auto sm:flex-grow-0">
                    <TextInput
                      className="w-full bg-latisGray-300 py-2 pl-8 text-sm font-normal text-latisGray-700 placeholder-latisGray-700"
                      value={''}
                      placeholder="Search by name"
                      handleChange={() => {}}
                    />
                    <MagnifyingGlassIcon
                      className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 transform text-latisGray-700"
                      aria-hidden="true"
                    />
                  </div>
                  <button className="flex flex-wrap items-center space-x-2 border-latisGray-500 pr-2 text-latisSecondary-800 sm:border-r-2 sm:pr-2">
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    <span className="text-sm font-normal">Filter</span>
                  </button>
                  <Link
                    className="flex cursor-pointer items-center space-x-2 text-sm text-latisSecondary-800 "
                    href={route('tenant.canvas.map')}
                  >
                    <MapIcon className="h-5 w-5" />
                    <span className="cursor-pointer text-sm font-normal">
                      Map View
                    </span>
                  </Link>
                </div>
              </div>

              <div className="scrollbar-hide mt-5 max-h-full gap-5 overflow-y-auto rounded-md border px-4 max-xl:grid-cols-6 sm:grid">
                <table className="min-w-full divide-y divide-latisGray-400 bg-white">
                  <thead className="sticky top-0 z-10 bg-white ">
                    <tr>
                      <th className="py-4 pl-3 text-left text-sm font-medium text-latisSecondary-700">
                        <Checkbox
                          value={allSelected}
                          handleChange={handleSelectAll}
                        />{' '}
                      </th>
                      <th className="w-2/12 px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                        Name <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="w-2/12 px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                        Stages
                        <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="w-2/12 px-3 py-2 text-left text-sm font-medium text-latisSecondary-700 sm:w-2/12">
                        Owner
                        <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="w-6/12 px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                        Address
                        <SortIcon className="ml-2 inline-block" />
                      </th>

                      <th className="text-latisSecondery-700 py-2 text-left text-sm font-medium"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-latisGray-400 ">
                    {leadData?.map((lead, index) => (
                      <tr key={lead?.id}>
                        <td
                          className="py-2 pl-3 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(lead)}
                        >
                          <Checkbox
                            value={selectedUsers?.includes(lead.id)}
                            handleChange={() => handleCheckboxChange(lead.id)}
                          />
                        </td>
                        <td
                          className="w-2/12 whitespace-nowrap px-3 py-2 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(lead)}
                        >
                          {lead?.formatted_name}
                        </td>
                        <td
                          className="w-2/12 space-x-2 whitespace-nowrap px-3 py-2 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(lead)}
                        >
                          <span
                            className={`inline-block h-2 w-2 rounded-full `}
                            style={{
                              backgroundColor: lead?.canvas_stage?.color,
                            }}
                          ></span>
                          <span> {lead?.canvas_stage?.name}</span>
                        </td>
                        <td
                          className="w-2/12 whitespace-nowrap px-3 py-2 text-sm font-normal text-latisGray-900 sm:w-2/12"
                          onClick={() => handleRowClick(lead)}
                        >
                          {lead?.owner?.name}
                        </td>
                        <td
                          className="w-6/12 whitespace-nowrap px-3 py-2 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(lead)}
                        >
                          {lead?.formatted_address}
                        </td>
                        <td className="py-2 text-sm font-normal text-latisGray-900">
                          <ListActions
                            title="More Links"
                            moreLinks={[
                              {
                                type: 'Edit Lead',
                                action: () => {
                                  OnLeadEdit(lead);
                                },
                              },
                              {
                                type: 'Delete Lead',
                                action: () => {
                                  confirmDeleteUser(lead);
                                },
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {pagination && (
                  <div className="sticky flex w-full flex-wrap items-center justify-end bg-white p-4 sm:bottom-0 sm:space-x-4">
                    <span className="text-center text-xs text-gray-600 sm:text-left">
                      Page {pagination?.currentPage} of {pagination?.lastPage}
                    </span>
                    <SecondaryButton
                      type="button"
                      processing={pagination?.currentPage === 1}
                      onClick={() =>
                        handlePageChange(pagination?.currentPage - 1)
                      }
                      className="flex-1 sm:flex-none"
                    >
                      Previous
                    </SecondaryButton>
                    <PrimaryButton
                      type="button"
                      onClick={() =>
                        handlePageChange(pagination?.currentPage + 1)
                      }
                      className="flex-1 sm:flex-none"
                    >
                      Next
                    </PrimaryButton>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 w-full rounded-lg border p-5">
              <NoDataListWarning title="No Leads Found" />
            </div>
          )}
        </>
      ) : (
        <div className={classNames('w-full rounded-lg border p-5')}>
          <NoDataListWarning
            title="No office selected"
            message="Please click on particular office to view details."
          />
        </div>
      )}
    </>
  );
}

export default LeadsDetails;
