import axios from 'axios';
import TenantAuthenticated from '@/Layouts/TenantAuthenticatedLayout';
import React, { useEffect, useRef, useState } from 'react';
import ListOffices from '@/Pages/Tenant/Office/Partials/ListOffices';
import Panel from '@/Components/Panel';
import { Link, router, useForm } from '@inertiajs/react';
import { classNames, route } from '@/Providers/helpers';
import _ from 'lodash';
import { Tab } from '@headlessui/react';
import UserDetails from './Partials/Canvas/UserDetails';
import TeamsDetails from './Partials/Teams/TeamsDetails';
import LeadsDetails from './Partials/Leads/LeadsDetails';
import Notifications from '@/Components/Notifications';
import CanvasDetails from './Partials/Canvas/CanvasDetails';
import TeamModalDetails from './Partials/Teams/TeamModalDetails';
import LeadsModalDetails from './Partials/Leads/LeadsModalDetails';

export default function Index({
  roles,
  applications,
  divisions,
  offices,
  trades,
  officeOptions,
  teams,
}) {
  let emptyOffice = {
    /*...*/
  };

  const [stateOffices, setStateOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState({});
  const [officeDeleteDialogOpen, setOfficeDeleteDialogOpen] = useState(false);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);
  const [isOfficeEdit, setIsOfficeEdit] = useState(false);
  const [nextField, setNextfield] = useState({});
  const [isNavigationModalOpen, setNavigationModalOpen] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [visitUrl, setVisitUrl] = useState('');
  const { data, setData, errors, setError, clearErrors } =
    useForm(selectedOffice);
  const [isLeadBarOpen, setIsLeadBarOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const [stateFlash, setStateFlash] = useState(null);
  const [flash, setFlash] = useState(null);
  const [isJobComplete, setIsJobComplete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const intervalIdRef = useRef(null);

  const fetchLeadData = async () => {
    try {
      const response = await axios.post(
        route('tenant.canvas.get-canvas-leads'),
        {
          office_id: selectedOffice?.id,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setLeadData(response.data);
    } catch (error) {
      console.error('Error fetching lead data:', error);
    }
  };

  useEffect(() => {
    _.isEmpty(errors) && setStateOffices(offices);
    if (!_.isEmpty(selectedOffice)) {
      let newSelectedOffice = _.find(
        offices,
        newOffice => newOffice?.name === selectedOffice?.name
      );
      if (!newSelectedOffice) {
        newSelectedOffice = _.find(
          offices,
          newOffice => newOffice?.id === selectedOffice?.id
        );
      }
      setSelectedOffice(newSelectedOffice);
    }
  }, [offices]);

  useEffect(() => {
    return router.on('before', event => {
      let newOffice =
        _.find(stateOffices, newOffice => newOffice?.id === data?.id) || {};

      if (
        !_.isEqual(
          _.omit(newOffice, 'updated_at', 'divisions'),
          _.omit(data, 'updated_at', 'divisions')
        )
      ) {
        if (
          isOfficeEdit &&
          event.detail.visit.url.href !==
            route('tenant.offices.update', selectedOffice?.id) &&
          !canProceed
        ) {
          setNavigationModalOpen(true);
          event.preventDefault();
          setVisitUrl(event.detail.visit.url.href);
        }
      }
    });
  }, [canProceed, selectedOffice, stateOffices, data]);

  useEffect(() => {
    setData(selectedOffice);
  }, [selectedOffice]);

  function deleteOffice() {
    router.delete(route('tenant.offices.destroy', selectedOffice?.id));
    setSelectedOffice(emptyOffice);
  }

  function updateSelectedOffice(office) {
    setSelectedOffice(office);
    let cloneOffices = _.cloneDeep(stateOffices);
    const updatedOffices = cloneOffices.map(cloneOffice => {
      return cloneOffice.name === office.name ? office : cloneOffice;
    });
    setStateOffices(updatedOffices);
  }

  function onClicked(office) {
    setVisitUrl('');
    if (selectedOffice?.id !== office?.id) {
      let newOffice = _.find(
        stateOffices,
        newOffice => newOffice?.id === data?.id
      );
      if (
        _.isEqual(
          _.omit(newOffice, 'updated_at', 'divisions'),
          _.omit(data, 'updated_at', 'divisions')
        ) ||
        !selectedOffice?.name
      ) {
        setSelectedOffice(office);
      } else {
        setNextfield(office);
        setNavigationModalOpen(true);
      }
    }
  }

  function isOfficeSelected(office) {
    return selectedOffice !== null && office.id === selectedOffice?.id;
  }

  return (
    <TenantAuthenticated title="Teams">
      <div className="h-full w-full flex-row lg:flex">
        <div className="h-full max-xl:mb-6 lg:w-1/4">
          <Panel
            addList={() => {
              setSelectedOffice(emptyOffice);
              setIsOfficeEdit(false);
              setOfficeModalOpen(true);
            }}
            lists={stateOffices}
            isChecked={false}
            header="Offices"
            className="pb-0"
          >
            <ListOffices
              setOfficeDeleteDialogOpen={setOfficeDeleteDialogOpen}
              onClicked={onClicked}
              isOfficeSelected={isOfficeSelected}
              offices={stateOffices}
            />
          </Panel>
        </div>

        <div className="flex h-full w-full flex-col lg:w-3/4">
          <div className="flex w-full items-center justify-between space-y-1.5 border-b px-7 py-4 text-left max-lg:border-t">
            <div className="text-xl font-semibold leading-6 text-black">
              Canvas Details
            </div>
          </div>

          <div className="flex grow flex-col overflow-hidden px-7">
            <Tab.Group onChange={index => index === 2 && fetchLeadData()}>
              {selectedOffice?.name && (
                <div
                  className={classNames(
                    selectedOffice?.name && 'bg-white',
                    'relative z-10 border-0 bg-white py-7 pb-5 text-sm'
                  )}
                >
                  <Tab.List
                    className="border-0 border-transparent bg-white"
                    defaultChecked={2}
                  >
                    <div className="z-0 flex space-x-8 border-b">
                      <Tab
                        key={1}
                        className={({ selected }) =>
                          classNames(
                            'pb-3 text-left focus:outline-none',
                            selected
                              ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                              : 'text-latisGray-800'
                          )
                        }
                      >
                        Canvaser
                      </Tab>
                      <Tab
                        key={2}
                        className={({ selected }) =>
                          classNames(
                            'pb-3 text-left focus:outline-none',
                            selected
                              ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                              : 'text-latisGray-800'
                          )
                        }
                      >
                        Teams
                      </Tab>
                      <Tab
                        key={3}
                        className={({ selected }) =>
                          classNames(
                            ' pb-3 text-left focus:outline-none',
                            selected
                              ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                              : 'text-latisGray-800 '
                          )
                        }
                      >
                        Leads
                      </Tab>
                    </div>
                  </Tab.List>
                </div>
              )}
              <div className="scrollbar-hide mb-5 grow overflow-auto">
                <Tab.Panels className="h-full w-full flex-row gap-8">
                  <Tab.Panel
                    key={1}
                    className="block h-full w-full rounded-b-lg"
                  >
                    <form className="bg-white">
                      <div className="bg-latisPrimary-500 space-y-7">
                        <UserDetails
                          isCreate={true}
                          data={data}
                          setData={setData}
                          errors={errors}
                          roles={roles}
                          applications={applications}
                          divisions={divisions}
                          offices={offices}
                          trades={trades}
                          officeOptions={officeOptions}
                          userData={selectedOffice?.users}
                          selectedOfficeId={selectedOffice.id}
                          isCanvasOpen={isCanvasOpen}
                          setIsCanvasOpen={setIsCanvasOpen}
                          setSelectedUser={setSelectedUser}
                        />
                      </div>
                    </form>
                  </Tab.Panel>
                  <Tab.Panel key={2} className="h-full w-full">
                    <form className="bg-white">
                      <div className="bg-latisPrimary-500 space-y-7">
                        <TeamsDetails
                          isCreate={true}
                          data={data}
                          setData={setData}
                          errors={errors}
                          offices={stateOffices}
                          users={selectedOffice.users}
                          teams={teams}
                          setSelectedUser={setSelectedUser}
                          isTeamModalOpen={isTeamModalOpen}
                          setIsTeamModalOpen={setIsTeamModalOpen}
                        />
                      </div>
                    </form>
                  </Tab.Panel>
                  <Tab.Panel
                    key={3}
                    className="h-full w-full border-latisGray-400"
                  >
                    <form className="bg-white">
                      <div className="bg-latisPrimary-500 space-y-7">
                        <LeadsDetails
                          setIsLeadBarOpen={setIsLeadBarOpen}
                          isCreate={true}
                          data={data}
                          setData={setData}
                          errors={errors}
                          officeData={selectedOffice}
                          leadData={leadData}
                          isLeadBarOpen={isLeadBarOpen}
                          setSelectedUser={setSelectedUser}
                        />
                      </div>
                    </form>
                  </Tab.Panel>
                </Tab.Panels>
              </div>
            </Tab.Group>
          </div>
        </div>
        <CanvasDetails
          isManage={true}
          title="Team Details"
          className={'absolute right-0'}
          isCanvasOpen={isCanvasOpen}
          setIsCanvasOpen={setIsCanvasOpen}
          leadData={leadData}
          userData={selectedUser ? [selectedUser] : []}
        />
        <TeamModalDetails
          isManage={true}
          title="Team Details"
          className={'absolute right-0'}
          isTeamModalOpen={isTeamModalOpen}
          setIsTeamModalOpen={setIsTeamModalOpen}
          leadData={leadData}
          userData={selectedUser ? [selectedUser] : []}
        />
        <LeadsModalDetails
          isManage={true}
          title="Lead Details"
          className={'absolute right-0'}
          isLeadBarOpen={isLeadBarOpen}
          setIsLeadBarOpen={setIsLeadBarOpen}
          userData={selectedUser ? [selectedUser] : []}
        />
      </div>
    </TenantAuthenticated>
  );
}
