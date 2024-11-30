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
  data,
  setData,
  errors,
  offices,
  users,
  teams,
  setIsTeamModalOpen,
  setSelectedUser,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteTeam, setDeleteTeam] = useState(false);
  const [editTeam, setEditTeam] = useState(false);
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
          <div
            className={
              'flex max-h-full w-full flex-col rounded-lg border p-5 pt-1'
            }
          >
            <div className="mt-3 flex flex-wrap items-center justify-between space-y-3 md:space-y-0">
              <div className="text-base font-medium text-black">Teams</div>
              <div className="flex w-full flex-wrap items-center justify-between space-y-3 md:w-auto md:space-x-4 md:space-y-0">
                <div className="relative w-full md:w-auto">
                  <TextInput
                    type="text"
                    className="w-full bg-latisGray-300 py-2 pl-8 text-sm font-normal text-latisGray-700 placeholder-latisGray-700 md:w-auto"
                    placeholder="Search by name"
                  />
                  <MagnifyingGlassIcon
                    className="absolute left-0 top-0 my-2.5 ml-3 h-5 w-5 text-latisGray-700"
                    aria-hidden="true"
                  />
                </div>
                <PrimaryButton onClick={onTeam} className="w-full md:w-auto">
                  Create Team
                </PrimaryButton>
              </div>
            </div>
            {teams?.length > 0 ? (
              <div className="scrollbar-hide mt-5 max-h-full gap-5 overflow-y-auto rounded-md border px-4 max-xl:grid-cols-6 sm:grid">
                <table className="min-w-full divide-y divide-latisGray-400 bg-white">
                  <thead className="sticky top-0 z-50 bg-white">
                    <tr>
                      <th className="py-4 pl-3 text-left text-sm font-medium text-latisSecondary-700 sm:w-1/12">
                        <Checkbox
                          value={allSelected}
                          handleChange={handleSelectAll}
                        />
                      </th>
                      <th className="w-1/12 whitespace-nowrap px-3 py-2 text-left text-sm font-medium text-latisSecondary-700 sm:w-3/12">
                        Team <SortIcon className="ml-2 inline-block" />
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 text-left text-sm font-medium text-latisSecondary-700">
                        Team Members
                        <SortIcon className="ml-2 inline-block" />
                      </th>

                      <th className="text-latisSecondery-700 py-2 text-left text-sm font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-latisGray-400">
                    {teams?.map((team, index) => (
                      <tr key={index}>
                        <td
                          className="py-2 pl-3 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(team)}
                        >
                          <Checkbox
                            value={selectedUsers?.includes(team.id)}
                            handleChange={() => handleCheckboxChange(team.id)}
                          />
                        </td>
                        <td
                          className="whitespace-nowrap px-3 py-2 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(team)}
                        >
                          {team.name}
                        </td>
                        <td
                          className="whitespace-nowrap px-3 py-2 text-sm font-normal text-latisGray-900"
                          onClick={() => handleRowClick(team)}
                        >
                          {team.users_count}
                        </td>

                        <td className="px-3 py-2 text-sm font-normal text-latisGray-900">
                          <ListActions
                            title={'More Links'}
                            moreLinks={[
                              {
                                type: 'Edit Team',
                                action: () => onEditTeam(team),
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
            ) : (
              <div className="mt-4 w-full rounded-lg border p-5">
                <NoDataListWarning
                  title="No Team Data found "
                  message="Please click on add button to add new Team  "
                />
              </div>
            )}
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
