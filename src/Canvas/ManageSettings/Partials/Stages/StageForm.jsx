import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { usePage } from '@inertiajs/react';
import React from 'react';
import ReactSelect from 'react-select';
import CustomColorPicker from '@/Components/CustomColorPicker';
import StageReasonsList from './StageReasonsList';

function StageForm({ data, setData, errors, open }) {
  const { canvasStageTypes } = usePage().props;

  const predefinedColors = [
    '#EB5757', // Red
    '#F2994A', // Orange
    '#F2C94C', // Yellow
    '#6FCF97', // Green
    '#56CCF2', // Light Blue
    '#2F80ED', // Blue
    '#9B51E0', // Purple
    '#828282', // Gray
    '#4F4F4F', // Dark Gray
  ];

  const makeReactOptions = obj =>
    obj.map(item => ({
      label: item.name,
      value: item.id,
    }));

  const handleChange = (name, value) => {
    setData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSelectedStageType = () => {
    return canvasStageTypes.find(
      stage => stage.id === data.canvas_stage_type_id
    );
  };

  function getValueObj(options, val) {
    const obj = options?.find(({ label, value }) => {
      return value === val;
    });

    return typeof data?.canvas_stage_type_id === 'object'
      ? data?.canvas_stage_type_id
      : obj;
  }

  return (
    <>
      {open && (
        <div className="col-span-6">
          <InputLabel
            className="mb-2"
            forInput="canvas_stage_type_id"
            value="Stage Type"
            required
          />
          <ReactSelect
            name="canvas_stage_type_id"
            options={makeReactOptions(canvasStageTypes)}
            onChange={e => handleChange('canvas_stage_type_id', e.value)}
            value={getValueObj(
              makeReactOptions(canvasStageTypes),
              data?.canvas_stage_type_id
            )}
            className="mt-2.5"
          />
          <InputError message={errors.canvas_stage_type_id} className="mt-2" />
        </div>
      )}

      <div className="col-span-6">
        <InputLabel className="mb-2" forInput="name" value="Name" required />
        <TextInput
          name="name"
          value={data?.name}
          required="required"
          placeholder="Name"
          handleChange={e => handleChange('name', e.target.value)}
        />
        <InputError message={errors.name} className="mt-2" />
      </div>

      <div className="col-span-3 mt-4">
        <InputLabel className="mb-2" forInput="color" value="Color" required />
        <CustomColorPicker
          color={data.color}
          onChange={color => handleChange('color', color)}
          predefinedColors={predefinedColors}
        />
        <InputError message={errors.color} className="mt-2" />
      </div>
      {getSelectedStageType()?.name === 'Lost Record' && (
        <StageReasonsList data={data} setData={setData} />
      )}
    </>
  );
}

export default StageForm;
