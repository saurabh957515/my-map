import React, { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Popup from '@/Components/Popup';
import { router, useForm, usePage } from '@inertiajs/react';
import ReactSelect from '@/Components/ReactSelect';
import { route } from '@/Providers/helpers';
import PrimaryButton from '@/Components/PrimaryButton';

function CreateTeam({ isEdit, isModalOpen, setIsModalOpen, offices, users }) {
  const { roles } = usePage().props;

  const officeOptions = offices?.map(office => ({
    value: office.id,
    label: office.name,
  }));

  const userOptions = users?.map(users => ({
    value: users.id,
    label: users.name,
  }));

  const { data, setData, errors, post, processing, reset } = useForm({
    id: '',
    team_name: '',
    choose_canvaser: [],
  });

  useEffect(() => {
    if (isEdit) {
      setData({
        id: isEdit.id,
        team_name: isEdit.team_name,
        choose_canvaser: isEdit.choose_canvaser || [],
      });
    } else {
    }
  }, [isEdit]);

  function onClose() {
    setIsModalOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isEdit) {
      post(route('tenant.canvas.teams.update', data.id), {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    } else {
      post(route('tenant.canvas.teams.store'), {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
      reset();
    }
  }

  return (
    <Popup
      open={isModalOpen}
      setOpen={onClose}
      header={isEdit ? 'Edit Team' : 'Create New Team'}
      size="xs"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid space-y-5 max-xl:grid-cols-3 sm:grid">
          <div className="col-span-4 max-sm:mb-3">
            <InputLabel forInput="name" value="Team Name" className="mb-2" />
            <TextInput
              type="text"
              name="name"
              value={data?.team_name}
              handleChange={e => {
                setData('team_name', e.target.value);
              }}
              placeholder="Team Name"
            />
            <InputError message={errors?.team_name} className="mt-2" />
          </div>
          <div className="col-span-4 max-sm:mb-3">
            <InputLabel forInput="office" value="office" className="mb-2" />
            <ReactSelect
              name="office"
              value={data?.office}
              placeholder="office"
              options={officeOptions}
              onChange={(val, action) => {
                setData('office', val);
              }}
            />
            <InputError message={errors?.office} className="mt-2" />
          </div>
          <div className="col-span-4 max-sm:mb-3">
            <InputLabel forInput="canvaser" value="canvaser" className="mb-2" />
            <ReactSelect
              name="canvaser"
              value={data?.canvaser}
              isMulti
              placeholder="Canvaser"
              options={userOptions}
              onChange={(val, action) => {
                setData('canvaser', val);
              }}
            />
            <InputError message={errors?.canvaser} className="mt-2" />
          </div>
        </div>
        <div className="mt-5 flex justify-end space-x-4 border-t pt-5">
          <SecondaryButton onClick={onClose}>
            <span className="px-3.5 ">Cancel</span>
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={processing}>
            <span className="px-8 ">{isEdit ? 'Update' : 'Save'}</span>
          </PrimaryButton>
        </div>
      </form>
    </Popup>
  );
}

export default CreateTeam;
