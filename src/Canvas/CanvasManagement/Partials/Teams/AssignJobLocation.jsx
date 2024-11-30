import React, { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Popup from '@/Components/Popup';
import { router, useForm, usePage } from '@inertiajs/react';
import ReactSelect from '@/Components/ReactSelect';
import PrimaryButton from '@/Components/PrimaryButton';
import RadioGroup from '@/Components/RadioGroup';

function AssignJobLocation({ assignJobLocation, setAssignJobLocation }) {
  const { data, setData, post, errors } = useForm({
    address: '',
    state: '',
    city: '',
    zip: '',
    radius: [],
    radioOption: [],
  });
  const radioOption = [
    { label: 'Manually', value: 'Manually' },
    { label: 'Map', value: 'Map' },
  ];
  const states = [
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Rajesthan', value: 'Rajesthan' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'UP', value: 'UP' },
  ];
  const radius = [
    { label: '20 Miles', value: '20 Miles' },
    { label: '10 Miles', value: '10 Miles' },
    { label: '5 Miles', value: '5 Miles' },
    { label: '100 Miles', value: '100 Miles' },
  ];
  function onClose() {
    setAssignJobLocation(false);
  }

  return (
    <Popup
      open={assignJobLocation}
      setOpen={onClose}
      header={'Assign Job Location'}
      size="xs"
    >
      <div>
        <div className="grid-cols-12 gap-5 space-y-5 max-xl:grid-cols-6 sm:grid">
          <div className="col-span-6 max-sm:mb-3">
            <RadioGroup
              name="radioOption"
              options={radioOption}
              value={data?.radioOption}
              onChange={(val, action) => {
                setData('radioOption', val);
              }}
            />
            <InputError
              className="inline-block"
              message={errors?.radioOption}
            />
          </div>

          <div className="col-span-12 max-sm:mb-3">
            <InputLabel
              className="mb-1"
              forInput="address"
              value="Address"
              required={true}
            />
            <TextInput
              id="address"
              value={data?.address}
              required="required"
              placeholder="Address"
              handleChange={e => setData('address', e.target.value)}
            />
            {errors.address && (
              <InputError message={errors.address} className="mt-2" />
            )}
          </div>
          <div className="col-span-4 max-sm:mb-3">
            <InputLabel
              className="mb-1"
              forInput="state"
              value="State"
              required={true}
            />
            <ReactSelect
              id="state"
              placeholder="State"
              value={data?.state}
              options={states}
              onChange={val => setData('state', val.value)}
            ></ReactSelect>

            {errors.state && (
              <InputError message={errors.state} className="mt-2" />
            )}
          </div>
          <div className="col-span-4 max-sm:mb-3">
            <InputLabel
              className="mb-1"
              forInput="city"
              value="City"
              required={true}
            />
            <TextInput
              id="city"
              value={data?.city}
              required="required"
              placeholder="City"
              handleChange={e => setData('city', e.target.value)}
            />

            {errors.city && (
              <InputError message={errors.city} className="mt-2" />
            )}
          </div>

          <div className="col-span-4 max-sm:mb-3">
            <InputLabel
              className="mb-1"
              forInput="zip"
              value="Zip"
              required={true}
            />
            <TextInput
              id="zip"
              value={data?.zip}
              required="required"
              placeholder="Zip"
              handleChange={e => setData('zip', e.target.value)}
            />

            {errors.zip && <InputError message={errors.zip} className="mt-2" />}
          </div>
          <div className="col-span-12 max-sm:mb-3">
            <InputLabel
              className="mb-1"
              forInput="radius"
              value="Radius"
              required={true}
            />
            <ReactSelect
              id="radius"
              placeholder="Radius"
              value={data?.radius}
              options={radius}
              onChange={val => setData('radius', val.value)}
            />
            <InputError message={errors?.radius} className="mt-2" />
          </div>
        </div>
        <div className="mt-5 flex justify-end space-x-4 border-t pt-5">
          <SecondaryButton onClick={onClose}>
            <span className="px-3.5">Cancel</span>
          </SecondaryButton>

          <PrimaryButton>
            <span className="px-8 "> Save </span>
          </PrimaryButton>
        </div>
      </div>
    </Popup>
  );
}

export default AssignJobLocation;
