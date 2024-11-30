import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import NoDataListWarning from '@/Pages/Tenant/Call/Partials/NoDataListWarning';
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import UserModel from './UserModel';
import ListActions from '@/Components/ListActions';
import axios from 'axios';
import Checkbox from '@/Components/Checkbox';
import AssignTeam from './AssignTeam';
import MoveCanvaser from './MoveCanvaser';
import DeleteCanvas from './DeleteCanvas';
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
  setSelectedUser,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [officeDeleteDialogOpen, setOfficeDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openAssignTeam, setOpenAssignTeam] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userList, setUserList] = useState(userData);
  const [openMoveCanvaser, setOpenMoveCanvaser] = useState(false);
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
          <div className="flex max-h-full w-full flex-col rounded-lg border p-5 pt-1">
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="text-base font-medium">Canvaser</div>
              <div className="flex flex-wrap items-center space-x-4">
                <div className="relative w-full flex-shrink-0 sm:w-auto">
                  <TextInput
                    className="w-full bg-latisGray-300 py-2 pl-8 text-sm font-normal text-latisGray-700 placeholder-latisGray-700 sm:w-auto sm:text-base"
                    value=""
                    placeholder="Search by name"
                    handleChange={() => {}}
                  />
                  <MagnifyingGlassIcon
                    className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 transform text-latisGray-700"
                    aria-hidden="true"
                  />
                </div>
                {hasSelectedUsers ? (
                  <>
                    <button
                      className="flex items-center space-x-2 border-r-2 border-latisGray-500 pr-2 text-sm text-latisSecondary-800 hover:text-latisSecondary-600"
                      onClick={handleBulkDelete}
                    >
                      Delete
                    </button>
                    <div
                      className="flex cursor-pointer items-center space-x-2 border-r-2 border-latisGray-500 pr-2 text-sm text-latisSecondary-800 hover:text-latisSecondary-600"
                      onClick={handleBulkInactive}
                    >
                      Inactive
                    </div>
                    <div
                      className="flex cursor-pointer items-center space-x-2 border-r-2 border-latisGray-500 pr-2 text-sm text-latisSecondary-800 hover:text-latisSecondary-600"
                      onClick={handleBulkMove}
                    >
                      Move
                    </div>
                    <div
                      className="flex cursor-pointer items-center space-x-2 border-r-2 border-latisGray-500 pr-2 text-sm text-latisSecondary-800 hover:text-latisSecondary-600"
                      onClick={handleBulkAssignTeam}
                    >
                      Assign to Team
                    </div>
                  </>
                ) : (
                  <>
                    <button className="flex items-center space-x-2 text-sm text-latisSecondary-800 hover:text-latisSecondary-600">
                      <AdjustmentsHorizontalIcon className="h-5 w-5" />
                      <span className="font-normal">Filter</span>
                    </button>
                    <PrimaryButton
                      onClick={onUser}
                      className="flex items-center px-[18px] py-[9px] text-sm"
                    >
                      <PlusCircleIcon className="mr-2 inline h-5 w-5" />
                      Add User
                    </PrimaryButton>
                  </>
                )}
              </div>
            </div>
            {userList?.length > 0 ? (
              <div className="scrollbar-hide mt-5 max-h-full overflow-auto rounded-lg border px-4 first-line:gap-5 max-xl:grid-cols-6 sm:grid">
                <table className="h-fit min-w-full divide-y divide-latisGray-400 bg-white">
                  <thead className="sticky top-0 z-20 bg-white">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-medium text-latisSecondary-700">
                        <Checkbox
                          value={allSelected}
                          handleChange={handleSelectAll}
                        />{' '}
                      </th>
                      <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-latisSecondary-700">
                        Name <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-latisSecondary-700">
                        Division <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-latisSecondary-700">
                        Trade <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-latisSecondary-700">
                        Team <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-latisSecondary-700">
                        Status <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-latisSecondary-700">
                        Role <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="whitespace-nowrap p-4 text-left text-sm font-medium text-latisSecondary-700"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-latisGray-400">
                    {userList?.length > 0 ? (
                      userList?.map((user, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 text-sm font-normal text-latisGray-900">
                            <Checkbox
                              value={selectedUsers?.includes(user.id)}
                              handleChange={() => handleCheckboxChange(user.id)}
                            />
                          </td>
                          <td
                            className="whitespace-nowrap px-4 py-2 text-sm font-normal text-latisGray-900"
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
                            className="whitespace-nowrap px-4 py-2 text-sm font-normal text-latisGray-900"
                            onClick={() => handleRowClick(user)}
                          >
                            {user.divisions
                              .map(division => division.name)
                              .join(', ')}
                          </td>
                          <td
                            className="whitespace-nowrap px-4 py-2 text-sm font-normal text-latisGray-900"
                            onClick={() => handleRowClick(user)}
                          >
                            {user.trades.map(trade => trade.name).join(', ')}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-sm font-normal text-latisGray-900">
                            {user?.teams[0]?.name}
                          </td>
                          <td
                            className="whitespace-nowrap px-4 py-2 text-sm font-normal capitalize text-latisGray-900"
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
                            className="px-4 py-2 text-sm font-normal text-latisGray-900"
                            onClick={() => handleRowClick(user)}
                          >
                            {user.roles.map(role => role.name).join(', ')}
                          </td>
                          <td className="px-4 py-2 text-sm font-normal text-latisGray-900 ">
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
            ) : (
              <div className="mt-4 w-full rounded-lg border p-5">
                <NoDataListWarning
                  title="No Canvaser found "
                  message="Please click on add button to add new canvaser "
                />
              </div>
            )}
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
