import PrimaryButton from '@/Components/PrimaryButton';
import { route } from '@/Providers/helpers';
import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import TerritoryForm from './Territories/TerritoryForm';
import TerritoriesList from './Territories/TerritoriesList';

const Territories = ({
  territory,
  setTerritory,
  drawPolygon,
  setCreatedPolyGon,
  handleRedraw,
  setIsTerritoryMethod,
  isTerritoryMethod,
  sketchLayer,
  addTerritory,
  territoryObject,
  handleEditPolygon,
}) => {
  const { territories } = usePage().props;
  const [totalTerritories, setTotalTerritories] = useState([]);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setTotalTerritories(territories);
  }, [territories]);
  const [isAddTerritory, setIsAddTerritory] = useState(false);
  const handleSubmit = territoryData => {
    if (isTerritoryMethod === 'edit') {
      router.post(
        route('tenant.canvas.territories.update', territoryData?.id),
        territoryData,
        {
          onSuccess: mess => {
            setCreatedPolyGon(null);
            setIsAddTerritory(false);
            setIsTerritoryMethod(null);
            handleRedraw(e);
            setErrors({});
            setTerritory({});
          },
          onError: error => {
            setErrors(error);
          },
        }
      );
    } else {
      router.post(route('tenant.canvas.territories.store'), territoryData, {
        onSuccess: mess => {
          setCreatedPolyGon(null);
          setIsAddTerritory(false);
          setIsTerritoryMethod(null);
          handleRedraw();
          setTerritory({});
          setErrors({});
        },
        onError: error => {
          setErrors(error);
        },
      });
    }
  };
  const handleDelete = id => {
    router.delete(route('tenant.canvas.territories.destroy', id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsTerritoryMethod(null);
        sketchLayer.removeAll();
      },
      onError: error => {
        console.error(error);
      },
    });
  };

  const onCancelTerritory = e => {
    e.preventDefault();
    setIsAddTerritory(false);
    setIsTerritoryMethod(null);
    sketchLayer.removeAll();
    setErrors({});
  };
  return (
    <div className="flex h-full w-full grow flex-col gap-2">
      {!isAddTerritory && totalTerritories?.length === 0 && (
        <div className="w-full space-y-2 px-4">
          <h2 className="flex w-full items-center rounded-md bg-latisGray-300 p-2 text-xs font-normal text-latisGray-800">
            No Territory available. Click on Below button to add Territories
          </h2>
        </div>
      )}

      {!isAddTerritory && (
        <div className="flex w-full grow flex-col items-center px-4 py-2">
          <PrimaryButton
            onClick={e => {
              e.preventDefault();
              setIsAddTerritory(true);
              setTerritory(territoryObject);
              setIsTerritoryMethod('create');
              sketchLayer.removeAll();
            }}
            className="w-full"
          >
            Add Territories
          </PrimaryButton>
        </div>
      )}

      {isAddTerritory && (
        <TerritoryForm
          handleEditPolygon={handleEditPolygon}
          drawPolygon={drawPolygon}
          setErrors={setErrors}
          errors={errors}
          addTerritory={addTerritory}
          isTerritoryMethod={isTerritoryMethod}
          onCancelTerritory={onCancelTerritory}
          handleSubmit={handleSubmit}
          selectedTerritory={territory}
          setSelectedTerritory={setTerritory}
          handleRedraw={handleRedraw}
        />
      )}

      {!isAddTerritory && totalTerritories?.length > 0 && (
        <TerritoriesList
          totalTerritories={totalTerritories}
          territory={territory}
          addTerritory={addTerritory}
          setTerritory={setTerritory}
          handleDelete={handleDelete}
          setIsAddTerritory={setIsAddTerritory}
          setIsTerritoryMethod={setIsTerritoryMethod}
        />
      )}
    </div>
  );
};

export default Territories;
