import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { usePage } from '@inertiajs/react';
import classNames from 'classnames';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import NoDataListWarning from '@/Pages/Tenant/Call/Partials/NoDataListWarning';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ListActions from '@/Components/ListActions';
import Popup from '@/Components/Popup';
import axios from 'axios';
import Checkbox from '@/Components/Checkbox';
import CreateTeam from './CreateTeam';
import DeleteTeam from './DeleteTeam';
import MoveCanvaser from './MoveCanvaser';
import AssignJobLocation from './AssignJobLocation';
import SortIcon from '@/Icons/SortIcon';
import { router } from '@inertiajs/react';

function TeamsDetails({
  submit,
  data,
  setData,
  errors,
  onClose,
  roles,
  applications,
  divisions,
  offices,
  trades,
  officeOptions,
  selectedOfficeId,
  users,
  teams,
  setIsTeamModalOpen,
  isLeadBarOpen,
  setSelectedUser,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteTeam, setDeleteTeam] = useState(false);
  const [editTeam, setEditTeam] = useState(false);
  const [moveCanvaser, setMoveCanvaser] = useState(false);
  const [assignJobLocation, setAssignJobLocation] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  function onTeam(e) {
    e.preventDefault();
    setEditTeam(null);
    setIsModalOpen(true);
  }

  function onEditTeam(team) {
    setEditTeam(team);
    setIsModalOpen(true);
  }
  function onMoveCanvaser(user) {
    setMoveCanvaser(true);
  }
  function onAssignJobLoaction(user) {
    setAssignJobLocation(true);
  }
  const handleUserUpdate = async updatedData => {
    await post(`/users/update/${editTeam.id}`, updatedData, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const handleDeleteUser = () => {
    router.delete(route('tenant.canvas.teams.destroy', userToDelete.id));
    setDeleteTeam(false);
  };

  const confirmDeleteUser = user => {
    setUserToDelete(user);
    setDeleteTeam(true);
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await axios.patch(`/users/update-Upcomingstatus/${userId}`, { status });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelectedUsers(teams.map(team => team.id));
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
    selectedUsers?.length === teams?.length && teams?.length > 0;

  useEffect(() => {
    return () => {
      setIsTeamModalOpen(false);
    };
  }, [setIsTeamModalOpen]);

  const handleRowClick = team => {
    setIsTeamModalOpen(prev => !prev);
    setSelectedUser(team);
  };
  return (
    <>
      {!_.isEmpty(data) || !_.isEmpty(errors) ? (
        <>
          <CreateTeam
            isEdit={editTeam}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setIsEdit={setEditTeam}
            offices={offices}
            users={users}
            onSubmit={handleUserUpdate}
            setData={setData}
          />
          <DeleteTeam
            deleteTeam={deleteTeam}
            setDeleteTeam={setDeleteTeam}
            handleDeleteUser={handleDeleteUser}
            userToDelete={userToDelete?.id}
          />
          <MoveCanvaser
            moveCanvaser={moveCanvaser}
            setMoveCanvaser={setMoveCanvaser}
            divisions={divisions}
            officeOptions={officeOptions}
            trades={trades}
            user={editTeam}
          />
          <AssignJobLocation
            assignJobLocation={assignJobLocation}
            setAssignJobLocation={setAssignJobLocation}
          />
          <div className={'w-full rounded-lg border p-4 pt-1'}>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-base font-medium text-black">Teams</div>
              <div className="flex items-center space-x-4">
                <div className="relative mr-10">
                  <TextInput
                    type="text"
                    className="bg-latisGray-300 py-2 pl-8 text-sm font-normal text-latisGray-700 placeholder-latisGray-700"
                    placeholder="Search by name"
                  />
                  <MagnifyingGlassIcon
                    className="absolute left-0 top-0 my-2.5  ml-3 h-5  w-5 text-latisGray-700"
                    aria-hidden="true"
                  />
                </div>
                <PrimaryButton onClick={onTeam}>Create Team</PrimaryButton>
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
                      />
                    </th>
                    <th className="w-4/12 py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Team <SortIcon className="ml-2 inline-block" />
                    </th>
                    <th className="py-2 text-left text-sm font-medium text-latisSecondary-700">
                      Team Members
                      <SortIcon className="ml-2 inline-block" />
                    </th>

                    <th className="text-latisSecondery-700 py-2 text-left text-sm font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {teams?.map((team, index) => (
                    <tr key={index}>
                      <td
                        className="border-b py-2 pl-3 text-sm font-normal text-latisGray-900"
                        onClick={() => handleRowClick(team)}
                      >
                        <Checkbox
                          value={selectedUsers?.includes(team.id)}
                          handleChange={() => handleCheckboxChange(team.id)}
                        />
                      </td>
                      <td
                        className="w-4/12 border-b py-2 text-sm font-normal text-latisGray-900"
                        onClick={() => handleRowClick(team)}
                      >
                        {team.name}
                      </td>
                      <td
                        className="border-b py-2 text-sm font-normal text-latisGray-900"
                        onClick={() => handleRowClick(team)}
                      >
                        {team.users_count}
                      </td>

                      <td className="border-b py-2 text-sm font-normal text-latisGray-900">
                        <ListActions
                          title={'More Links'}
                          moreLinks={[
                            {
                              type: 'Edit Team',
                              action: () => onEditTeam(team),
                            },
                            {
                              type: 'Move Canvaser',
                              action: () => onMoveCanvaser(team),
                            },
                            {
                              type: 'Assign Job location',
                              action: () => onAssignJobLoaction(team),
                            },
                            {
                              type: 'Delete Team',
                              action: () => confirmDeleteUser(team),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default TeamsDetails;
