import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';
import Checkbox from '@/Components/Checkbox';
import FieldOptionsList from './FieldOptionsList';
import FieldStagesList from './FieldStagesList';
import ReactSelect from '@/Components/ReactSelect';

function FieldsForm({ data, setData, errors }) {
  const { fieldsTypes } = usePage().props;
  const makeReactOptions = obj =>
    Object.entries(obj).map(([label, value]) => ({
      label: value,
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
        <InputLabel className="mb-2 " forInput="name" value=" Name" required />
        <TextInput
          name="name"
          value={data?.name}
          placeholder="Name"
          handleChange={e => handleChange('name', e.target.value)}
          disabled={data.is_default}
        />
        <InputError message={errors?.name} className="mt-2" />
      </div>
      <div className="col-span-3">
        <InputLabel
          className="mb-2"
          forInput="input_type"
          value="Input Type"
          required
        />
        <ReactSelect
          name="input_type"
          options={makeReactOptions(fieldsTypes)}
          onChange={e => handleChange('input_type', e.value)}
          value={data?.input_type}
          className="mt-2.5"
          disabled={data.id}
        />
        <InputError message={errors?.input_type} className="mt-2" />
      </div>
      <div className="col-span-3">
        <InputLabel className="mb-2" value="Additional Options" />
        {['Single Choice', 'Multi Choice'].includes(data?.input_type) && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="use_as_filter"
              value={data.use_as_filter}
              handleChange={e =>
                handleChange('use_as_filter', e.target.checked)
              }
              className="ml-1 cursor-pointer"
            />
            <InputLabel
              className="mt-1 cursor-pointer text-sm font-normal text-latisGray-800"
              forInput="use_as_filter"
            >
              Use as Filter
            </InputLabel>
          </div>
        )}
        <div className="flex cursor-pointer items-center space-x-2">
          <Checkbox
            id="is_read_only"
            value={data?.is_read_only}
            handleChange={e => handleChange('is_read_only', e.target.checked)}
            className="ml-1 cursor-pointer"
          />
          <InputLabel
            forInput="is_read_only"
            className="mt-1 cursor-pointer text-sm font-normal text-latisGray-800"
          >
            Make "read-only"
          </InputLabel>
        </div>
        {data?.input_type === 'Single Choice' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show_in_activity_feed"
              value={data?.show_in_activity_feed}
              handleChange={e =>
                handleChange('show_in_activity_feed', e.target.checked)
              }
              className="ml-1 cursor-pointer"
            />
            <InputLabel
              className="mt-1 cursor-pointer text-sm font-normal text-latisGray-800"
              forInput="show_in_activity_feed"
            >
              Show in Activity Feed
            </InputLabel>
          </div>
        )}
      </div>
      {['Single Choice', 'Multi Choice'].includes(data?.input_type) && (
        <FieldOptionsList data={data} setData={setData} errors={errors} />
      )}
      <FieldStagesList data={data} setData={setData} />
    </>
  );
}

export default FieldsForm;
