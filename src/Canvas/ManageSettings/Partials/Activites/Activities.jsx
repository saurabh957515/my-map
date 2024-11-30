import AddListButton from '@/Components/AddListButton';
import DragandMove from '@/Icons/DragandMove';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { router, usePage } from '@inertiajs/react';
import ActivityCreate from './ActivityCreate';
import ActivityEdit from './ActivityEdit';
import LockIcon from '@/Icons/LockIcon';
import { route } from '@/Providers/helpers';

function Activities() {
  const { canvasActivities } = usePage().props;

  const getCanvasActivitiesData = () => {
    return canvasActivities.map(activity => ({
      id: activity.id,
      name: activity.name,
      type: activity.type,
      category: activity.category,
      default_duration: activity.default_duration,
      order: activity.order,
      is_default: activity.is_default,
      is_suspendible: activity.is_suspendible,
      is_suspended: activity.is_suspended,
      results:
        activity.results.length > 0
          ? activity.results.map(result => ({
              id: result.id,
              title: result.title,
              is_active: result.is_active,
              order: result.order,
              color: result.color,
              is_default: result.is_default,
            }))
          : [],
    }));
  };
  useEffect(() => {
    setActivities(getCanvasActivitiesData());
  }, [canvasActivities]);

  const [activities, setActivities] = useState(getCanvasActivitiesData());
  const [open, setOpen] = useState(false);

  const handleOnDragEnd = result => {
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return;
    }

    const reorderedActivities = Array.from(activities);
    const [reorderedItem] = reorderedActivities.splice(result.source.index, 1);

    reorderedActivities.splice(result.destination.index, 0, reorderedItem);
    const updatedActivities = reorderedActivities.map((activity, index) => ({
      ...activity,
      order: index + 1,
    }));

    const reorderedData = updatedActivities.map(activity => ({
      id: activity.id,
      order: activity.order,
    }));

    router.post(route('tenant.canvas.activities.reorder'), {
      activities: reorderedData,
    });
  };

  return (
    <div className="col-span-12 h-[84vh] w-full rounded-lg border bg-white p-4 sm:col-span-4">
      <div className="relative col-span-4 flex w-full items-center justify-between space-x-2.5">
        <div className="w-full space-x-2.5 text-base font-medium text-black">
          Activities
        </div>
        <AddListButton onClick={() => setOpen(true)} />
        <ActivityCreate setOpen={setOpen} open={open} />
      </div>

      <div className="scrollbar-hide col-span-12 mt-6 space-y-2 overflow-auto sm:col-span-4">
        {activities.length > 0 ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="activities">
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="scrollbar-hide max-h-[72vh] space-y-2 overflow-y-auto"
                >
                  {activities.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                      isDragDisabled={item.is_suspended}
                    >
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex w-full items-center justify-between gap-x-2 rounded-lg border bg-white p-4 ${
                            item.is_suspended ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {item.is_suspended ? (
                              <LockIcon className="inline h-5 w-5 text-latisGray-800" />
                            ) : (
                              <DragandMove className="inline h-5 w-5 text-latisGray-800" />
                            )}
                            <span>
                              <p
                                className={`text-sm font-medium text-latisGray-900 ${
                                  item.is_suspended ? 'text-gray-400' : ''
                                }`}
                              >
                                {item.name}
                              </p>
                              <p className="text-xs font-normal text-latisGray-800">
                                {item.type}, {item.default_duration},{' '}
                                {item.category}
                              </p>
                            </span>
                          </div>
                          <ActivityEdit activity={item} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="rounded-lg bg-gray-100 p-3 text-center text-gray-600">
            There are no activities
          </div>
        )}
      </div>
    </div>
  );
}

export default Activities;
