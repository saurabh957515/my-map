import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import NoDataListWarning from '@/Pages/Tenant/Call/Partials/NoDataListWarning';
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import UserModel from './UserModel';
import ListActions from '@/Components/ListActions';
import axios from 'axios';
import Export from './Export';
import Checkbox from '@/Components/Checkbox';
import AssignTeam from './AssignTeam';
import MoveCanvaser from './MoveCanvaser';
import DeleteCanvas from './DeleteCanvas';
import ImportModal from './ImportModal';
import SortIcon from '@/Icons/SortIcon';

function UserDetails({
  submit,
  data,
  setData,
  errors,
  roles,
  applications,
  divisions,
  trades,
  officeOptions,
  userData,
  setIsCanvasOpen,
  isCanvasOpen,
  setSelectedUser,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [officeDeleteDialogOpen, setOfficeDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isExportModal, setIsExportModal] = useState(false);
  const [openAssignTeam, setOpenAssignTeam] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userList, setUserList] = useState(userData);
  const [openMoveCanvaser, setOpenMoveCanvaser] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  useEffect(() => {
    setUserList(userData);
  }, [userData]);

  useEffect(() => {
    return () => {
      setIsCanvasOpen(false);
    };
  }, [setIsCanvasOpen]);

  function onUser(e) {
    e.preventDefault();
    setEditingUser(null);
    setIsModalOpen(true);
  }

  function onEditUser(user) {
    setEditingUser(user);
    setIsModalOpen(true);
  }
  function onMoveCanvaser(user) {
    setOpenMoveCanvaser(true);
  }
  function onAssignTeam(user) {
    setOpenAssignTeam(true);
  }

  const handleUserUpdate = async updatedData => {
    await post(`/users/update/${editingUser.id}`, updatedData, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const handleDeleteUser = async userId => {
    try {
      await axios.get(`/canvas/users/delete/${userId}`);
      setUserList(prevUsers => prevUsers.filter(user => user.id !== userId));
      setUserToDelete(null);
      setOfficeDeleteDialogOpen(false);
    } catch (error) {
      console.error('There was an error deleting the user!', error);
    }
  };

  const confirmDeleteUser = user => {
    setUserToDelete(user);
    setOfficeDeleteDialogOpen(true);
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await axios.post(`/users/update-status/${userId}`, { status });
      setUserList(prevUsers =>
        prevUsers.map(user => (user.id === userId ? { ...user, status } : user))
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelectedUsers(userList.map(user => user.id));
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
    selectedUsers?.length === userList?.length && userList?.length > 0;
  const hasSelectedUsers = selectedUsers.length > 0;
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedUsers.map(userId => axios.get(`/canvas/users/delete/${userId}`))
      );
      setUserList(prevUsers =>
        prevUsers.filter(user => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error deleting users!', error);
    }
  };
  const handleBulkInactive = async () => {
    try {
      await Promise.all(
        selectedUsers.map(userId => updateUserStatus(userId, 'inactive'))
      );
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error marking users as inactive!', error);
    }
  };
  const handleBulkMove = () => {
    setOpenMoveCanvaser(true);
  };

  const handleBulkAssignTeam = () => {
    setOpenAssignTeam(true);
  };
  const handleRowClick = user => {
    setIsCanvasOpen(prev => !prev);
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
          <ImportModal
            isImportModalOpen={isImportModalOpen}
            setIsImportModalOpen={setIsImportModalOpen}
            closeImportModal={closeImportModal}
            downloadSampleFile={downloadSampleFile}
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
          />
          <AssignTeam
            openAssignTeam={openAssignTeam}
            setOpenAssignTeam={setOpenAssignTeam}
          />
          <MoveCanvaser
            openMoveCanvaser={openMoveCanvaser}
            setOpenMoveCanvaser={setOpenMoveCanvaser}
          />
          <UserModel
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            divisions={divisions}
            officeOptions={officeOptions}
            trades={trades}
            setData={setData}
            applications={applications}
            roles={roles}
            errors={errors}
            user={editingUser}
            onSubmit={handleUserUpdate}
          />
          <DeleteCanvas
            userToDelete={userToDelete?.id}
            handleDeleteUser={handleDeleteUser}
            officeDeleteDialogOpen={officeDeleteDialogOpen}
            setOfficeDeleteDialogOpen={setOfficeDeleteDialogOpen}
          />
          <div className={'w-full rounded-lg border p-4 pt-1'}>
            <div className="mt-3 flex items-center justify-between">
              <div>Canvaser</div>
              <div className="flex items-center space-x-4">
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
                {hasSelectedUsers ? (
                  <>
                    <button
                      className="item flex cursor-pointer space-x-2 border-r-2 border-latisGray-500 pr-2 text-latisSecondary-800 "
                      onClick={handleBulkDelete}
                    >
                      Delete
                    </button>
                    <div
                      className="item flex cursor-pointer space-x-2 border-r-2 border-latisGray-500 pr-2 text-latisSecondary-800"
                      onClick={handleBulkInactive}
                    >
                      Inactive
                    </div>

                    <div
                      className="item flex cursor-pointer space-x-2 border-r-2 border-latisGray-500 pr-2 text-latisSecondary-800"
                      onClick={handleBulkMove}
                    >
                      Move
                    </div>
                    <div
                      className="item flex cursor-pointer space-x-2 border-r-2 border-latisGray-500 pr-2 text-latisSecondary-800"
                      onClick={handleBulkAssignTeam}
                    >
                      Assign to Team
                    </div>
                  </>
                ) : (
                  <>
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
                    <div
                      className="item flex cursor-pointer space-x-2 border-r-2 border-latisGray-500 pr-2 text-latisSecondary-800"
                      onClick={() => setIsImportModalOpen(true)}
                    >
                      <ArrowUpTrayIcon className="h-5 w-5" />
                      <span className="text-sm font-normal">Import Data</span>
                    </div>
                    <PrimaryButton
                      onClick={onUser}
                      className="px-[18px] py-[9px]"
                    >
                      <PlusCircleIcon className="inline h-5 w-5 " /> Add User
                    </PrimaryButton>
                  </>
                )}
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
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      <Checkbox
                        value={allSelected}
                        handleChange={handleSelectAll}
                      />{' '}
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Name <SortIcon className="ml-2 inline-block" />
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Division <SortIcon className="ml-2 inline-block" />
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Trade <SortIcon className="ml-2 inline-block" />
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Team <SortIcon className="ml-2 inline-block" />
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Status <SortIcon className="ml-2 inline-block" />
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Role <SortIcon className="ml-2 inline-block" />
                    </th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-latisSecondary-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {userList?.length > 0 ? (
                    userList?.map((user, index) => (
                      <tr key={index}>
                        <td className="border-b px-4 py-2 text-sm font-normal text-latisGray-900">
                          <Checkbox
                            value={selectedUsers?.includes(user.id)}
                            handleChange={() => handleCheckboxChange(user.id)}
                          />
                        </td>
                        <td
                          className="border-b px-4 py-2 text-sm font-normal text-latisGray-900 "
                          onClick={() => handleRowClick(user)}
                        >
                          <span className="mr-1 inline-block h-9 w-9 place-items-center rounded-full bg-latisSecondary-700 text-center leading-9 text-white">
                            {`${user.name?.charAt(0) || ''}${
                              user.name?.split(' ')[1]?.charAt(0) || ''
                            }`.toUpperCase()}
                          </span>
                          {user.name}
                        </td>
                        <td
                          className="border-b px-4 py-2 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(user)}
                        >
                          {user.divisions
                            .map(division => division.name)
                            .join(', ')}
                        </td>
                        <td
                          className="border-b px-4 py-2 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(user)}
                        >
                          {user.trades.map(trade => trade.name).join(', ')}
                        </td>
                        <td className="border-b px-4 py-2 text-sm font-normal text-latisGray-900">
                          {user?.teams[0]?.name}
                        </td>
                        <td
                          className="border-b px-4 py-2 text-sm font-normal capitalize text-latisGray-900 "
                          onClick={() => handleRowClick(user)}
                        >
                          <span
                            className={`rounded-full px-2 py-1  ${
                              user.status === 'active'
                                ? 'bg-latisGreen-50 text-latisGreen-800'
                                : 'bg-latisRed-100 text-latisRed-900'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td
                          className="border-b px-4 py-2 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(user)}
                        >
                          {user.roles.map(role => role.name).join(', ')}
                        </td>
                        <td className="border-b px-4 py-2 text-sm font-normal text-latisGray-900 ">
                          <ListActions
                            title={'More Links'}
                            moreLinks={[
                              {
                                type: 'Edit Canvaser',
                                action: () => onEditUser(user),
                              },
                              {
                                type: 'Activate Canvaser',
                                action: () =>
                                  updateUserStatus(user.id, 'active'),
                                color:
                                  user.status === 'active'
                                    ? 'text-[#B6B6B6] cursor-not-allowed hover:text-latisGray-700'
                                    : 'text-latisGray-800',
                                disabled: user.status === 'active',
                              },
                              {
                                type: 'Inactive Canvaser',
                                action: () =>
                                  updateUserStatus(user.id, 'inactive'),
                                color:
                                  user.status === 'inactive'
                                    ? 'text-[#B6B6B6] cursor-not-allowed hover:text-latisGray-700'
                                    : 'text-latisGray-800',
                                disabled: user.status === 'inactive',
                              },
                              {
                                type: 'Move Canvaser',
                                action: () => onMoveCanvaser(user),
                              },
                              {
                                type: 'Assign to Team',
                                action: () => onAssignTeam(user),
                              },
                              {
                                type: 'Delete Canvaser',
                                action: () => confirmDeleteUser(user),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="border-b px-4 py-2 text-center text-sm font-normal text-latisGray-900"
                      >
                        No canvaser found for the selected office.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className={classNames('mt-4 w-full rounded-lg border p-5')}>
          <NoDataListWarning
            title="No office selected"
            message="Please click on a particular office to view details."
          />
        </div>
      )}
    </>
  );
}

export default UserDetails;
