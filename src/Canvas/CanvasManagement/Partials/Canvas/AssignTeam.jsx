import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Popup from '@/Components/Popup';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import ReactSelect from '@/Components/ReactSelect';
import RadioGroup from '@/Components/RadioGroup';

function AssignTeam({ setOpenAssignTeam, openAssignTeam }) {
  const [selectedRadioValue, setSelectedRadioValue] = useState('existingteam');
  const { data, setData, errors } = useForm({
    id: '',
    radio_option: [],
    team_option: [],
    team_name: '',
    source_option: [],
  });

  function onClose() {
    setOpenAssignTeam(false);
  }

  const divisionOption = [
    { value: 'Window', label: 'Window' },
    { value: 'Trim', label: 'Trim' },
    { value: 'Siding', label: 'Siding' },
  ];

  const defaultRadioOptions = [
    { label: 'Existing Team', value: 'existingteam' },
    { label: 'Create New', value: 'createnew' },
  ];

  return (
    <Popup
      open={openAssignTeam}
      setOpen={onClose}
      header={'Assign Team'}
      size="xs"
    >
      <div className="grid-cols-12 gap-3 max-xl:grid-cols-6 sm:grid">
        <div className="col-span-12 mt-3 max-sm:mb-3">
          <RadioGroup
            name="radioOption"
            options={defaultRadioOptions}
            value={selectedRadioValue}
            onChange={value => setSelectedRadioValue(value)}
          />
        </div>
        {selectedRadioValue === 'existingteam' ? (
          <>
            <div className="col-span-12 mt-4 max-sm:mb-3">
              <InputLabel
                className="mb-2"
                forInput="team_option"
                value="Choose Team"
              />
              <ReactSelect
                name="team_option"
                value={data?.team_option}
                options={divisionOption}
                placeholder="Select Team"
                onChange={val => setData('team_option', val)}
              />
              <InputError message={errors?.team_option} className="mt-2" />
            </div>
          </>
        ) : selectedRadioValue === 'createnew' ? (
          <>
            <div className="col-span-12 mt-4 max-sm:mb-3">
              <InputLabel
                className="mb-2"
                forInput="team_name"
                value="Team Name"
              />
              <TextInput
                type="text"
                name="team_name"
                value={data?.team_name}
                handleChange={e => setData('team_name', e?.target?.value)}
                placeholder="Add Trade Type"
              />
              <InputError message={errors?.team_name} className="mt-2" />
            </div>
            <div className="col-span-12 mt-4 max-sm:mb-3">
              <InputLabel
                className="mb-2"
                forInput="source_option"
                value="Source Name"
              ></InputLabel>
              <ReactSelect
                name="source_option"
                value={data?.source_option}
                options={divisionOption}
                placeholder="Select Trade"
                onChange={val => setData('source_option', val)}
              />
              <InputError message={errors?.source_option} className="mt-2" />
            </div>
          </>
        ) : null}
      </div>

      <div className="flex justify-end pt-5 mt-10 space-x-4 border-t">
        <SecondaryButton onClick={onClose}>
          <span className="px-3.5">Cancel</span>
        </SecondaryButton>

        <PrimaryButton>
          <span className="px-8">Add</span>
        </PrimaryButton>
      </div>
    </Popup>
  );
}

export default AssignTeam;
