import React, { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Popup from '@/Components/Popup';
import { router, useForm, usePage } from '@inertiajs/react';
import ReactSelect from '@/Components/ReactSelect';
import { route } from '@/Providers/helpers';
import PrimaryButton from '@/Components/PrimaryButton';

function MoveCanvaser({
  isEdit,
  openMoveCanvaser,
  setOpenMoveCanvaser,
  divisions,
  officeOptions,
  trades,
  user,
}) {
  const { data, setData, post, errors } = useForm({
    choose_canvaser: [],
    divisions: [],
    offices: [],
    trades: [],
  });

  const canvaser = [
    { label: 'Active', value: 'Active' },
    { label: 'Pause', value: 'Pause' },
    { label: 'InActive', value: 'InActive' },
    { label: 'Live', value: 'Live' },
  ];

  function onClose() {
    setOpenMoveCanvaser(false);
  }

  return (
    <Popup
      open={openMoveCanvaser}
      setOpen={onClose}
      header={'Move Canvaser'}
      size="xs"
    >
      <div className="grid space-y-5 max-xl:grid-cols-3 sm:grid">
        <div className="col-span-4 max-sm:mb-3">
          <InputLabel forInput="offices" value="Offices" className="mb-2" />
          <ReactSelect
            name="offices"
            value={data?.offices}
            placeholder="Select Offices"
            options={canvaser}
            onChange={(val, action) => {
              setData('offices', val);
            }}
          />
          <InputError message={errors?.offices} className="mt-2" />
        </div>
        <div className="col-span-4 max-sm:mb-3">
          <InputLabel forInput="divisions" value="Divisions" />
          <ReactSelect
            name="divisions"
            value={data?.divisions}
            options={canvaser}
            onChange={(val, action) => {
              setData('divisions', val);
            }}
            placeholder="Select Divisions"
          />
          <InputError message={errors.divisions} className="mt-2" />
        </div>
        <div className="col-span-4 max-sm:mb-3">
          <InputLabel forInput="trades" value="Trades" />
          <ReactSelect
            name="trades"
            value={data?.trades}
            options={canvaser}
            onChange={(val, action) => {
              setData('trades', val);
            }}
            placeholder="Select Trades"
          />
          <InputError message={errors?.trades} className="mt-2" />
        </div>
      </div>
      <div className="mt-5 flex justify-end space-x-4 border-t pt-5">
        <SecondaryButton onClick={() => onClose()}>
          <span className="px-3.5 ">Cancel</span>
        </SecondaryButton>

        <PrimaryButton>
          <span className="px-8 "> Save </span>
        </PrimaryButton>
      </div>
    </Popup>
  );
}

export default MoveCanvaser;
