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
        <div className="mx-5 text-xl font-semibold text-black">
          Manage Settings
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
