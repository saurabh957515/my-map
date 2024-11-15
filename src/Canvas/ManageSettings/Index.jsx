import React from 'react';
import { Head } from '@inertiajs/react';
import TenantAuthenticated from '@/Layouts/TenantAuthenticatedLayout';
import Header from '@/Components/Header';
import Activities from './Partials/Activites/Activities';
import Stages from './Partials/Stages/Stages';
import Fields from './Partials/Fields/Fields';

export default function Index({ auth, errors, request }) {
  return (
    <TenantAuthenticated auth={auth} errors={errors} title="Manage Settings">
      <div className="h-full w-full space-y-5 py-5 ">
        <div className="flex w-full items-center justify-between space-y-1.5  px-7 pt-4 text-left ">
          <div className="text-xl font-semibold">Manage Settings</div>
          {/* <PrimaryButton
            processing={_.isEmpty(selectedOffice)}
            onClick={updateConnections}
          >
            Save Changes
          </PrimaryButton> */}
        </div>
        <div className="grid w-full grid-cols-12 gap-4 px-5">
          <Activities />
          <Fields />
          <Stages />
        </div>
      </div>
    </TenantAuthenticated>
  );
}
