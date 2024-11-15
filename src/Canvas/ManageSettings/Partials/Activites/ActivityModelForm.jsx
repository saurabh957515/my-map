import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { usePage } from '@inertiajs/react';
import React from 'react';
import ActivityResults from './ActivityResults';
import ReactSelect from '@/Components/ReactSelect';
import ToggleSwitch from '@/Components/ToggleSwitch';

function ActivityModelForm({ data, setData, errors, isEdit, reset }) {
  const { activityTypes, activityCategories } = usePage().props;

  const makeReactOptions = obj =>
    Object.entries(obj).map(([label, value]) => ({
      label: label.replace(/_/g, ' '),
      value: value,
    }));

  const handleChange = (name, value) => {
    setData(pre => ({
      ...pre,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="col-span-3">
        <InputLabel className="mb-2 " forInput="name" value="Name" required />
        <TextInput
          name="name"
          value={data?.name}
          placeholder="Name"
          handleChange={e => handleChange('name', e.target.value)}
          disabled={isEdit && data.is_default}
          className={`${isEdit && data.is_default ? 'text-latisGray-700' : ''}`}
        />
        {errors.name && <InputError message={errors.name} className="mt-2" />}
      </div>
      <div className="col-span-3">
        <InputLabel className="mb-2" forInput="type" value="Type" required />
        <ReactSelect
          name="type"
          options={makeReactOptions(activityTypes)}
          onChange={e => handleChange('type', e.value)}
          value={data?.type}
          disabled={isEdit && data.is_default}
        />
        <InputError message={errors?.type} className="mt-2" />
      </div>
      <div className="col-span-3">
        <InputLabel
          className="mb-2"
          forInput="category"
          value="Category"
          required
        />
        <ReactSelect
          required
          name="category"
          options={makeReactOptions(activityCategories)}
          onChange={e => handleChange('category', e.value)}
          value={data?.category}
          className="mt-2.5"
        />
        <InputError message={errors.category} className="mt-2" />
      </div>
      <div className="col-span-3">
        <InputLabel
          className="mb-2"
          forInput="default_duration"
          value="Default Duration"
          required
        />
        <TextInput
          name="default_duration"
          value={data?.default_duration}
          required="required"
          placeholder="Set Default Duration"
          handleChange={e => handleChange('default_duration', e.target.value)}
        />
        <InputError message={errors.default_duration} className="mt-2" />
      </div>
      {isEdit && data?.is_suspendible ? (
        <div className="col-span-6">
          <InputLabel className="mb-2" forInput="Suspended" value="Suspended" />
          <ToggleSwitch
            className="ml-1 h-4 w-4 cursor-pointer"
            enabled={data.is_suspended}
            onChange={value => handleChange('is_suspended', value)}
          />
        </div>
      ) : (
        ''
      )}
      <ActivityResults data={data} setData={setData} reset={reset} />
    </>
  );
}

export default ActivityModelForm;
