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
import CanvasDetails from './Partials/Canvas/CanvasDetails';
import TeamModalDetails from './Partials/Teams/TeamModalDetails';
import LeadsModalDetails from './Partials/Leads/LeadsModalDetails';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import ImportModal from './Partials/ImportModal';
import Export from './Partials/Export';

export default function Index({
  roles,
  applications,
  divisions,
  offices,
  trades,
  officeOptions,
  teams,
  from,
}) {
  let emptyOffice = {};
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModal, setIsExportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const closeImportModal = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  const fetchLeadData = async (page = 1) => {
    try {
      const response = await axios.post(
        route('tenant.canvas.get-canvas-leads'),
        {
          office_id: selectedOffice?.id,
          page,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setLeadData(response.data.data);

      setPagination({
        currentPage: response?.data.current_page,
        lastPage: response?.data.last_page,
        nextPageUrl: response?.data.next_page_url,
        prevPageUrl: response?.data.prev_page_url,
        total: response?.data.total,
      });
    } catch (error) {
      console.error('Error fetching lead data:', error);
    }
  };

  const handlePageChange = page => {
    fetchLeadData(page);
  };

  useEffect(() => {
    if (selectedOffice?.id) {
      fetchLeadData();
    }
  }, [selectedOffice]);

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
    } else {
      if (from) {
        setSelectedOffice(offices[0]);
        fetchLeadData(offices[0]?.id);
        setSelectedIndex(2);
      }
    }
  }, [offices, from]);

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
    <TenantAuthenticated title="Canvaser">
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
            <Export
              isExportModal={isExportModal}
              setIsExportModal={setIsExportModal}
            />
            <ImportModal
              isImportModalOpen={isImportModalOpen}
              closeImportModal={closeImportModal}
              handleFileChange={handleFileChange}
              selectedFile={selectedFile}
              module={selectedIndex === 0 ? 'User' : 'CanvasLead'}
            />
          </Panel>
        </div>

        <div className="flex h-full w-full flex-col lg:w-3/4">
          <div className="flex min-h-[60px] w-full flex-wrap items-center justify-between space-y-1.5 border-b px-4 py-4 text-left max-lg:border-t sm:space-y-0 sm:px-5 md:px-7 lg:py-4">
            <div className="text-lg font-semibold leading-6 text-black sm:text-xl">
              Canvas Details
            </div>
            {selectedOffice?.name &&
              (selectedIndex === 0 || selectedIndex === 2) && (
                <div className="flex flex-wrap items-center justify-start space-x-1 sm:justify-end sm:space-x-4">
                  <div
                    className="flex cursor-pointer flex-wrap items-center space-x-2 border-latisGray-500 pr-2 text-latisSecondary-800 sm:border-r-2"
                    onClick={() => setIsExportModal(true)}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span className="text-sm font-normal">Export List</span>
                  </div>
                  <div
                    className="flex cursor-pointer flex-wrap items-center space-x-2 pr-2 text-latisSecondary-800"
                    onClick={() => setIsImportModalOpen(true)}
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    <span className="text-sm font-normal">
                      {selectedIndex === 0
                        ? 'Import Canvas Data'
                        : selectedIndex === 2
                        ? 'Import Leads Data'
                        : ''}
                    </span>
                  </div>
                </div>
              )}
          </div>

          <div className="flex grow flex-col overflow-hidden px-7">
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={index => {
                index === 2 && fetchLeadData();
                setSelectedIndex(index);
              }}
            >
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
                      {['Canvaser', 'Teams', 'Leads']?.map((tab, index) => (
                        <Tab
                          key={index + 1}
                          className={({ selected }) =>
                            classNames(
                              'pb-3 text-left focus:outline-none',
                              selected
                                ? '-mb-0.5 border-b-2 border-latisSecondary-800 font-medium text-latisSecondary-800'
                                : 'text-latisGray-800'
                            )
                          }
                        >
                          {tab}
                        </Tab>
                      ))}
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
                  </Tab.Panel>
                  <Tab.Panel key={2} className="h-full w-full">
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
                  </Tab.Panel>
                  <Tab.Panel
                    key={3}
                    className="h-full w-full border-latisGray-400"
                  >
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
                      pagination={pagination}
                      handlePageChange={handlePageChange}
                    />
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
