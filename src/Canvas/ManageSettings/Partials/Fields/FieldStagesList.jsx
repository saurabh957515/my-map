import InputLabel from '@/Components/InputLabel';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import ToggleSwitch from '@/Components/ToggleSwitch';

function FieldStagesList({ data, setData }) {
  const { canvasStageTypes } = usePage().props;
  const [CanvasStages, setCanvasStages] = useState([]);

  const getAllCanvasStages = () => {
    const stageNamesAndIds = canvasStageTypes.reduce((acc, item) => {
      if (item.canvas_stages && item.canvas_stages.length > 0) {
        const simplifiedStages = item.canvas_stages.map(stage => ({
          id: stage.id,
          name: stage.name,
          is_required: data?.required_stages.includes(stage.id),
        }));
        return acc.concat(simplifiedStages);
      }
      return acc;
    }, []);

    return stageNamesAndIds;
  };

  useEffect(() => {
    const stages = getAllCanvasStages();
    setCanvasStages(stages);
  }, [data?.required_stages]);

  const handleToggleChange = (id, isRequired) => {
    setData(prevData => {
      let updatedStages = [...prevData.required_stages];

      if (isRequired) {
        if (!updatedStages.includes(id)) {
          updatedStages.push(id);
        }
      } else {
        updatedStages = updatedStages.filter(stageId => stageId !== id);
      }

      return { ...prevData, required_stages: updatedStages };
    });
  };
  return (
    <>
      <div className="col-span-6 space-y-2">
        <InputLabel className="mb-3" value="Required on Stages" />
        <div className="scrollbar-hide max-h-40 space-y-2 overflow-y-auto">
          {CanvasStages?.length > 0 &&
            CanvasStages.map((stage, index) => (
              <div className="flex w-full items-center justify-between gap-x-2 rounded-lg border border-gray-300 px-4 py-2">
                <p className="text-sm text-latisGray-900">{stage.name}</p>
                <ToggleSwitch
                  className="h-4 w-4 cursor-pointer"
                  enabled={stage.is_required}
                  onChange={value => handleToggleChange(stage.id, value)}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default FieldStagesList;
