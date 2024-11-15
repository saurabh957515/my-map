import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { router, usePage } from '@inertiajs/react';
import classNames from 'classnames';
import TextInput from '@/Components/TextInput';
import NoDataListWarning from '@/Pages/Tenant/Call/Partials/NoDataListWarning';
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import ListActions from '@/Components/ListActions';
import axios from 'axios';
import Checkbox from '@/Components/Checkbox';
import SortIcon from '@/Icons/SortIcon';
import MapIcon from '@/Icons/MapIcon';
import Export from '../Canvas/Export';
import DeleteLead from './DeleteLead';
import ImportModal from './ImportModal';
import EditLead from './EditLead';

function LeadsDetails({
  submit,
  data,
  setData,
  errors,
  onClose,
  roles,
  applications,
  divisions,
  officeData,
  trades,
  officeOptions,
  selectedOfficeId,
  setIsLeadBarOpen,
  isLeadBarOpen,
  setSelectedUser,
  leadData,
}) {
  const { states } = usePage().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteTeam, setDeleteTeam] = useState(false);
  const [isExportModal, setIsExportModal] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    return () => {
      setIsLeadBarOpen(false);
    };
  }, [setIsLeadBarOpen]);

  const closeImportModal = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
  };
  const handleFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };
  const downloadSampleFile = async () => {
    try {
      const response = await axios.get('/download-sample?module=CanvasLead', {
        responseType: 'blob',
      });
      const filename = response.headers['x-filename'] || 'sample.csv';
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  function OnLeadEdit() {
    setIsEditLeadModalOpen(true);
  }

  const handleUserUpdate = async updatedData => {
    await post(`/users/update/${editingUser.id}`, updatedData, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const handleDeleteUser = () => {
    router.delete(route('tenant.canvas.leads.destroy', userToDelete.id));
    setDeleteTeam(false);
  };

  const confirmDeleteUser = lead => {
    setUserToDelete(lead);
    setDeleteTeam(true);
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await axios.patch(`/users/update-status/${userId}`, { status });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getStageColor = canvas_stage => {
    switch (canvas_stage) {
      case 'Marker':
        return 'bg-blue-500';
      case 'Lead':
        return 'bg-green-500';
      case 'Eligible Door':
        return 'bg-[#9f9d9d]';
      case 'Install':
        return 'bg-yellow-500';
      case 'Do not Knock':
        return 'bg-red-500';
      default:
        return 'bg-red-500';
    }
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
  const currentData = Array.isArray(leadData?.data)
    ? leadData.data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = Math.ceil(
    Array.isArray(leadData?.data) ? leadData.data.length / itemsPerPage : 0
  );

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleRowClick = user => {
    setIsLeadBarOpen(prev => !prev);
    setSelectedUser(user);
  };
  return (
    <>
      {!_.isEmpty(data) || !_.isEmpty(errors) ? (
        <>
          <Export
            isExportModal={isExportModal}
            setIsExportModal={setIsExportModal}
          />
          <DeleteLead
            deleteTeam={deleteTeam}
            setDeleteTeam={setDeleteTeam}
            handleDeleteUser={handleDeleteUser}
            userToDelete={userToDelete?.id}
          />
          <ImportModal
            isImportModalOpen={isImportModalOpen}
            setIsImportModalOpen={setIsImportModalOpen}
            closeImportModal={closeImportModal}
            downloadSampleFile={downloadSampleFile}
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
          />
          <EditLead
            isEditLeadModalOpen={isEditLeadModalOpen}
            setIsEditLeadModalOpen={setIsEditLeadModalOpen}
          />
          <div className={'w-full rounded-lg border p-4 pt-1'}>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-base font-medium text-black">Leads</div>
              <div className="flex items-center space-x-5">
                <div className="relative mr-10">
                  <TextInput
                    className="bg-latisGray-300 py-2 pl-8 text-sm font-normal text-latisGray-700 placeholder-latisGray-700"
                    value={''}
                    placeholder="Search by name"
                    handleChange={() => {}}
                  />
                  <MagnifyingGlassIcon
                    className="absolute left-0 top-0 my-2.5 ml-3 h-5 w-5 text-latisGray-700"
                    aria-hidden="true"
                  />
                </div>
                <button className="item flex space-x-2 border-r-2 border-latisGray-500 pr-2 text-latisSecondary-800">
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  <span className="text-sm font-normal">Filter</span>
                </button>
                <div
                  className="item flex cursor-pointer space-x-2 border-r-2 border-latisGray-500 pr-2 text-latisSecondary-800"
                  onClick={() => setIsExportModal(true)}
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span className="cursor-pointer text-sm font-normal">
                    Export List
                  </span>
                </div>
                <div className="item flex cursor-pointer space-x-2 border-r-2 border-latisGray-500 pr-2 text-latisSecondary-800">
                  <MapIcon className="h-5 w-5" />
                  <span className="cursor-pointer text-sm font-normal">
                    Map Geofence
                  </span>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'my-5 gap-5 max-xl:grid-cols-6 sm:grid',
                !submit && 'border p-5',
                'rounded-lg'
              )}
            >
              <table className="min-w-full bg-white">
                <thead className="border-b ">
                  <tr>
                    <th className="py-2 pl-3 text-left text-sm font-medium text-latisSecondary-700">
                      <Checkbox
                        value={allSelected}
                        handleChange={handleSelectAll}
                      />{' '}
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Name <SortIcon className="ml-2 inline-block" />
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Stages
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

                    <th className="text-latisSecondery-700 py-2 text-left text-sm font-medium"></th>
                  </tr>
                </thead>

                <tbody>
                  {leadData?.data?.map((lead, index) => (
                    <tr key={lead?.id}>
                      <td
                        className="border-b py-2 pl-3 text-sm font-normal text-latisGray-900"
                        onClick={() => handleRowClick(lead)}
                      >
                        <Checkbox
                          value={selectedUsers?.includes(lead.id)}
                          handleChange={() => handleCheckboxChange(lead.id)}
                        />
                      </td>
                      <td
                        className="border-b px-3 py-2 text-sm font-normal text-latisGray-900"
                        onClick={() => handleRowClick(lead)}
                      >
                        {lead?.first_name} {lead?.last_name}
                      </td>
                      <td
                        className="space-x-2 border-b px-3 py-2 text-sm font-normal text-latisGray-900"
                        onClick={() => handleRowClick(lead)}
                      >
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${getStageColor(
                            lead?.canvas_stage?.name
                          )}`}
                        ></span>
                        <span> {lead?.canvas_stage?.name}</span>
                      </td>
                      <td
                        className="border-b px-3 py-2 text-sm font-normal text-latisGray-900"
                        onClick={() => handleRowClick(lead)}
                      >
                        {lead?.owner?.name}
                      </td>
                      <td
                        className="border-b px-3 py-2 text-sm font-normal text-latisGray-900"
                        onClick={() => handleRowClick(lead)}
                      >
                        {lead?.address?.street}, {lead?.address?.city},{' '}
                        {lead?.address?.state}, {lead?.address?.country},{' '}
                        {lead?.address?.zip_code}, {lead?.address?.house_number}
                      </td>
                      <td className="border-b py-2 text-sm font-normal text-latisGray-900">
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
              {/* <div className="flex justify-between p-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div> */}
            </div>
          </div>
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
