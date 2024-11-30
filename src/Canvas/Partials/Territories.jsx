import PrimaryButton from '@/Components/PrimaryButton';
import { route } from '@/Providers/helpers';
import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import TerritoryForm from './Territories/TerritoryForm';
import TerritoriesList from './Territories/TerritoriesList';
import Graphic from '@arcgis/core/Graphic';

const Territories = ({
  territory,
  setTerritory,
  drawPolygon,
  setCreatedPolyGon,
  handleRedraw,
  setIsTerritoryMethod,
  isTerritoryMethod,
  sketchLayer,
  territoryObject,
  sketchView,
}) => {
  const { territories } = usePage().props;
  const [totalTerritories, setTotalTerritories] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentPolygon, setCurrentPolygGon] = useState({});
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
  const addTerritory = territory => {
    sketchLayer.removeAll();
    setTerritory(territory);
    const newPolyGon = {
      ...territory,
      geometry: territory?.geometry,
      symbol: {
        type: 'simple-fill',
        color: hexToRGBA(territory?.boundary_color, 0.2),
        outline: {
          color: territory?.boundary_color,
          width: 1,
        },
      },
    };
    const polygonGraphic = new Graphic(newPolyGon);
    setCurrentPolygGon(polygonGraphic);
    sketchLayer.add(polygonGraphic);
  };
  const handleEditPolygon = () => {
    if (!sketchView || !sketchLayer) return;
    const graphicToEdit = sketchLayer.graphics.items[0];
    if (graphicToEdit) {
      sketchView.update([graphicToEdit], {
        tool: 'transform',
        enableRotation: true,
        enableScaling: true,
        enableZ: true,
        enableMoveAllGraphics: true,
        reshapeOptions: {
          edgeOperation: 'split',
          shapeOperation: 'move',
          vertexOperation: 'move',
        },
        snappingOptions: {
          enabled: true,
        },
        highlightOptions: {
          enabled: true,
        },
        toggleToolOnClick: true,
      });
    }
  };
  useEffect(() => {
    if (currentPolygon?.geometry) {
      const polygon = currentPolygon?.geometry;
      view
        .goTo(
          {
            target: polygon?.extent,
          },
          {
            duration: 500,
            easing: 'ease-in-out',
          }
        )
        .catch(err => {
          console.error('Error during zoom:', err);
        });
    }
  }, [currentPolygon]);
  return (
    <div className="flex flex-col w-full h-full gap-2 grow">
      {!isAddTerritory && totalTerritories?.length === 0 && (
        <div className="w-full px-4 space-y-2">
          <h2 className="flex items-center w-full p-2 text-xs font-normal rounded-md bg-latisGray-300 text-latisGray-800">
            No Territory available. Click on Below button to add Territories
          </h2>
        </div>
      )}

      {!isAddTerritory && (
        <div className="flex flex-col items-center w-full px-4 py-2 grow">
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
