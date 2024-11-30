import CustomColorPicker from '@/Components/CustomColorPicker';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import RadioGroup from '@/Components/RadioGroup';
import ReactSelect from '@/Components/ReactSelect';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

const TerritoryForm = ({
  selectedTerritory,
  isTerritoryMethod,
  onCancelTerritory,
  handleSubmit,
  handleRedraw,
  addTerritory,
  errors,
  setErrors,
  drawPolygon,
  handleEditPolygon,
}) => {
  const { territories, canvaserUsers, canvaserTeams } = usePage().props;
  const [territory, setTerritory] = useState(selectedTerritory);
  const predefinedColors = ['#EB5757', '#F2994A', '#F2C94C', '#6FCF97'];
  const handleTerritory = (name, value) => {
    const newTerritory = _.cloneDeep(territory);
    newTerritory[name] = value;
    if (name === 'boundary_color') {
      addTerritory(newTerritory);
    }
    setTerritory(newTerritory);
  };

  useEffect(() => {
    setTerritory(pre => ({ ...pre, ...selectedTerritory }));
  }, [selectedTerritory]);

  const resetBoundary = e => {
    e.preventDefault();
    if (isTerritoryMethod === 'edit') {
      const editTerritory = territories?.find(
        curTerr => territory?.id === curTerr?.id
      );
      addTerritory({
        ...territory,
        geometry: editTerritory?.geometry,
      });
    } else {
      addTerritory({
        ...territory,
        geometry: selectedTerritory?.geometry,
      });
    }
  };
  return (
    <div className="scrollbar-hide h-60 w-full grow overflow-auto">
      <div className="grow overflow-auto">
        <div className="flex flex-col gap-4 border-b px-4 pb-4">
          <div className="space-y-2.5">
            <InputLabel
              required
              className="text-sm font-normal leading-5"
              value={'Territory Name'}
            ></InputLabel>
            <TextInput
              handleChange={e => handleTerritory('name', e.target.value)}
              value={territory?.name}
            />
            <InputError message={errors['name']} />
          </div>
          <div className="space-y-2.5">
            <InputLabel
              className="text-sm font-normal leading-5"
              value={'Belongs to'}
            ></InputLabel>
            <ReactSelect
              options={canvaserTeams?.map(team => ({
                label: team?.name,
                value: team?.id,
              }))}
              value={territory?.team_id}
              onChange={team => handleTerritory('team_id', team?.value)}
            />
            <InputError message={errors['team_id']} />
          </div>
          <div className="space-y-2.5">
            <InputLabel
              className="text-sm font-normal leading-5"
              value={'Boundary'}
            ></InputLabel>
            <RadioGroup
              onChange={value => handleTerritory('boundary_type', 'draw')}
              value={territory?.boundary_type}
              options={[
                { label: 'Draw', value: 'draw' },
                { label: 'Select', value: 'select' },
                { label: 'Zip/Postal', value: 'zip' },
              ]}
            />
            <InputError message={errors['boundary_type']} />
          </div>
          <div
            onClick={() => {
              if (!territory?.name) {
                setErrors({
                  name: 'Name is required to draw territory',
                });
              } else if (!territory?.team_id) {
                setErrors({
                  team_id: 'Belongs to is required to draw territory',
                });
              } else if (!territory?.boundary_type) {
                setErrors({
                  boundary_type: 'Boundary Type is required to draw territory',
                });
              } else {
                setErrors({});
                handleRedraw();
                drawPolygon(true);
              }
            }}
            className="w-full cursor-pointer bg-latisGray-300 p-2 text-center text-xs text-latisGray-800"
          >
            Draw the area on map
          </div>
          <div className="flex w-full flex-wrap gap-4">
            <PrimaryButton
              className="flex-auto"
              onClick={() => handleEditPolygon()}
            >
              Adjust Boundary
            </PrimaryButton>

            <SecondaryButton className="flex-auto" onClick={resetBoundary}>
              Reset Boundary
            </SecondaryButton>
          </div>

          <div className="space-y-2.5">
            <InputLabel
              className="text-sm font-normal leading-5"
              value={'Color'}
            ></InputLabel>
            <CustomColorPicker
              color={territory?.boundary_color}
              onChange={color => handleTerritory('boundary_color', color)}
              predefinedColors={predefinedColors}
            />
            <InputError message={errors['boundary_color']} />
          </div>
        </div>
        <div className="space-y-2.5 p-4">
          <InputLabel value={'Assigned user'} />
          <ReactSelect
            isMulti={true}
            value={canvaserUsers
              ?.map(user => ({
                label: user?.name,
                value: user?.id,
              }))
              ?.filter(user =>
                territory?.assigned_users?.includes(user?.value)
              )}
            onChange={options => {
              handleTerritory(
                'assigned_users',
                options?.map(option => option?.value)
              );
            }}
            options={canvaserUsers?.map(user => ({
              label: user?.name,
              value: user?.id,
            }))}
          />
          <InputError message={errors['assigned_users']} />
          <p className="text-xs font-normal">
            Users with limited access can be assigned to territories. Users with
            global access have access to all territories therefore can't be
            assigned to a specific one. You can go to Settings {'>'} Users to
            change from global access to limited access.
          </p>
        </div>
        <div></div>
      </div>
      <div className="flex w-full flex-wrap gap-4 border-t p-4">
        <SecondaryButton onClick={onCancelTerritory} className="flex-auto">
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            handleSubmit(territory);
          }}
          className="flex-auto"
        >
          {isTerritoryMethod === 'edit' ? 'Save' : 'Create'}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default TerritoryForm;
