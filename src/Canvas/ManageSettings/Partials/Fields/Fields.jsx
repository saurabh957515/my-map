import AddListButton from '@/Components/AddListButton';
import DragandMove from '@/Icons/DragandMove';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { router, usePage } from '@inertiajs/react';
import DeleteField from './DeleteField';
import FieldsCreate from './FieldCreate';
import FieldEdit from './FieldEdit';

function Fields() {
  const { canvasFields } = usePage().props;
  const staticFields = [
    { field: 'Address' },
    { field: 'First Name' },
    { field: 'Last Name' },
    { field: 'Email' },
    { field: 'Phone' },
  ];

  const getCanvasFieldsData = () => {
    return canvasFields.map(field => ({
      id: field.id,
      title: field.name,
      input_type: field.input_type,
      is_read_only: field.is_read_only,
      use_as_filter: field.use_as_filter,
      show_in_activity_feed: field.show_in_activity_feed,
      order: field.order,
      is_required: field.stages.length > 0,
      options:
        field.options.length > 0
          ? field.options.map(option => ({
              id: option.id,
              title: option.title,
              order: option.order,
            }))
          : [],
      required_stages:
        field.stages.length > 0 ? field.stages.map(stage => stage.id) : [],
    }));
  };

  useEffect(() => {
    setFields(getCanvasFieldsData());
  }, [canvasFields]);

  const [fields, setFields] = useState(getCanvasFieldsData());
  const [isShowFieldsForm, setIsShowFieldsForm] = useState(false);

  const handleOnDragEnd = result => {
    if (!result.destination) return;

    const reorderedFields = Array.from(fields);
    const [reorderedItem] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, reorderedItem);

    const updatedFields = reorderedFields.map((field, index) => ({
      ...field,
      order: index + 1,
    }));

    const reorderedData = updatedFields.map(field => ({
      id: field.id,
      order: field.order,
    }));

    setFields(updatedFields);

    router.post(route('tenant.canvas.fields.reorder'), {
      fields: reorderedData,
    });
  };

  return (
    <div className="col-span-12 h-[700px] w-full rounded-lg border bg-white p-5 sm:col-span-4">
      <div className="relative col-span-4 flex w-full items-center justify-between space-x-2.5">
        <div className="w-full space-x-2.5 font-semibold">Fields</div>
        <AddListButton onClick={() => setIsShowFieldsForm(true)} />
        <FieldsCreate setOpen={setIsShowFieldsForm} open={isShowFieldsForm} />
      </div>
      <div className="col-span-12 mt-8 space-y-2 sm:col-span-4">
        {fields.length > 0 ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="fields">
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="scrollbar-hide max-h-[600px] space-y-2 overflow-y-auto"
                >
                  {fields.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                    >
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex w-full items-center gap-x-2 rounded-lg border bg-white p-4"
                        >
                          <DragandMove className="inline h-7 w-7" />
                          <div className="px-2">
                            <p className="font-semibold text-gray-700">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Type: {item.input_type},{' '}
                              {item.is_required ? 'Required' : 'Optional'}
                            </p>
                          </div>
                          <div className="ml-auto flex cursor-pointer justify-end space-x-1.5">
                            {staticFields?.some(
                              field => field.field === item.title
                            ) ? null : (
                              <DeleteField field={item} />
                            )}
                            <FieldEdit
                              field={item}
                              staticFields={staticFields}
                            />
                          </div>
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
            There are no custom fields
          </div>
        )}
      </div>
    </div>
  );
}

export default Fields;
