import AddListButton from '@/Components/AddListButton';
import DragandMove from '@/Icons/DragandMove';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { router, usePage } from '@inertiajs/react';
import DeleteStage from './DeleteStage';
import StageCreate from './StageCreate';
import StageEdit from './StageEdit';
import ToggleSwitch from '@/Components/ToggleSwitch';

function Stages() {
  const { canvasStageTypes } = usePage().props;
  const getCanvasStagesTypesData = () => {
    return canvasStageTypes.map(stage => ({
      id: stage.id,
      title: stage.name,
      is_active: stage.is_active,
      sub_stages: stage.canvas_stages.map(subStage => ({
        id: subStage.id,
        title: subStage.name,
        color: subStage.color,
        canvas_stage_type_id: subStage.canvas_stage_type_id,
        order: subStage.order,
        reasons: subStage.canvas_stage_reasons
          ? subStage.canvas_stage_reasons?.map(reason => ({
              id: reason.id,
              title: reason.title,
              order: reason.order,
            }))
          : [],
      })),
    }));
  };

  useEffect(() => {
    setStages(getCanvasStagesTypesData());
  }, [canvasStageTypes]);

  const [stages, setStages] = useState(getCanvasStagesTypesData());

  const [isShowStageCreateForm, setIsShowStageCreateForm] = useState(false);

  const handleOnDragEnd = result => {
    const { source, destination } = result;
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return;
    }
    const sourceStageIndex = stages.findIndex(
      stage => String(stage.id) === source.droppableId
    );
    const destinationStageIndex = stages.findIndex(
      stage => String(stage.id) === destination.droppableId
    );

    const newStages = [...stages];

    if (sourceStageIndex === destinationStageIndex) {
      const [movedItem] = newStages[sourceStageIndex].sub_stages.splice(
        source.index,
        1
      );
      newStages[sourceStageIndex].sub_stages.splice(
        destination.index,
        0,
        movedItem
      );
    } else {
      const [movedItem] = newStages[sourceStageIndex].sub_stages.splice(
        source.index,
        1
      );
      newStages[destinationStageIndex].sub_stages.splice(
        destination.index,
        0,
        movedItem
      );
    }

    newStages[sourceStageIndex].sub_stages = newStages[
      sourceStageIndex
    ].sub_stages.map((sub, index) => ({
      ...sub,
      order: index + 1,
    }));

    newStages[destinationStageIndex].sub_stages = newStages[
      destinationStageIndex
    ].sub_stages.map((sub, index) => ({
      ...sub,
      order: index + 1,
    }));

    const reorderedData = newStages.flatMap(stage =>
      stage.sub_stages.map(sub => ({
        id: sub.id,
        order: sub.order,
        canvas_stage_type_id: stage.id,
      }))
    );

    router.post(route('tenant.canvas.stages.reorder'), {
      stages: reorderedData,
    });

    setStages(newStages);
  };

  return (
    <div className=" col-span-12 h-[84vh] w-full rounded-lg border bg-white p-4 sm:col-span-4">
      <div className=" relative col-span-4 flex w-full items-center justify-between space-x-2.5">
        <div className="w-full space-x-2.5 text-base font-medium text-black">
          Stages
        </div>
        <AddListButton onClick={() => setIsShowStageCreateForm(true)} />
        <StageCreate
          setOpen={setIsShowStageCreateForm}
          open={isShowStageCreateForm}
        />
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="scrollbar-hide col-span-12 mt-6 max-h-[72vh] overflow-y-auto sm:col-span-4">
          {stages.map(stage => (
            <div key={stage.id} className="mt-4">
              <div className="flex w-full items-center gap-x-2 ">
                <h2 className="mb-4 text-sm font-medium text-latisGray-900">
                  {stage.title}
                </h2>
                <div className="mb-4 ml-auto flex justify-end space-x-1.5">
                  <ToggleSwitch
                    className="mr-0.5 h-4 w-4 cursor-pointer"
                    enabled={stage.is_active}
                    onChange={value => {
                      router.patch(
                        route('tenant.canvas.stages.update-status', stage.id),
                        { is_active: value }
                      );
                    }}
                  />
                </div>
              </div>

              <Droppable droppableId={String(stage.id)}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="scrollbar-hide max-h-[600px] space-y-2 overflow-y-auto"
                  >
                    {stage.sub_stages.length > 0 ? (
                      stage.sub_stages
                        .sort((a, b) => a.order - b.order)
                        .map((sub, index) => (
                          <Draggable
                            key={sub.id}
                            draggableId={String(sub.id)}
                            index={index}
                          >
                            {provided => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex w-full items-center justify-between gap-x-2 rounded-lg border p-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <DragandMove className="h-5 w-5 text-latisGray-800" />
                                  <span
                                    className="mr-2 h-3 w-3 rounded-full "
                                    style={{ backgroundColor: sub.color }}
                                  ></span>
                                  <p className="text-sm font-normal text-latisGray-800">
                                    {sub.title}
                                  </p>
                                </div>
                                <div className="flex cursor-pointer space-x-2">
                                  <DeleteStage stage={sub} />
                                  <StageEdit stage={sub} />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                    ) : (
                      <div className="rounded-lg bg-gray-100 p-3 text-center text-gray-600">
                        There are no stages
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Stages;
