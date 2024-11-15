import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import CrossIcon from '@/Icons/CrossIcon';
import DragandMove from '@/Icons/DragandMove';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';

function FieldOptionsList({ data, setData, errors }) {
  const [newOption, setNewOption] = useState({
    title: '',
    order: data.options.length + 1,
  });

  const [showNewOptionInput, setShowNewOptionInput] = useState(false);

  const addNewOption = () => {
    if (newOption.title.trim() === '') return;

    setData(prev => ({
      ...prev,
      options: [...prev.options, newOption],
    }));

    resetNewOption();
    setShowNewOptionInput(false);
  };

  const deleteOption = index => {
    setData(prev => {
      const updatedOptions = prev.options
        .filter((_, i) => i !== index)
        .map((option, i) => ({
          ...option,
          order: i + 1,
        }));
      return {
        ...prev,
        options: updatedOptions,
      };
    });
  };

  const resetNewOption = () => {
    setNewOption({
      title: '',
      order: data.options.length + 2,
    });
  };

  const onDragEnd = result => {
    if (!result.destination) return;

    const reorderedOptions = Array.from(data.options);
    const [movedOption] = reorderedOptions.splice(result.source.index, 1);
    reorderedOptions.splice(result.destination.index, 0, movedOption);

    const updatedOptions = reorderedOptions.map((option, index) => ({
      ...option,
      order: index + 1,
    }));

    setData(prev => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  return (
    <>
      <div className="col-span-6 space-y-2">
        <InputLabel className="mb-2" value="Options" required />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="options-list">
            {provided => (
              <div
                className="scrollbar-hide max-h-40 space-y-2 overflow-y-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {data.options?.length > 0 ? (
                  data.options.map((option, index) => (
                    <Draggable
                      key={option.order}
                      draggableId={option.order.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`flex w-full items-center gap-x-2 rounded-lg border border-gray-300 px-4 py-2 ${
                            snapshot.isDragging ? 'bg-gray-100' : ''
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DragandMove className="inline h-7 w-7" />

                          <div className="flex items-center px-2">
                            <p className="text-gray-700">{option.title}</p>
                          </div>

                          <div className="ml-auto flex justify-end space-x-1.5">
                            <CrossIcon
                              className="h-4 w-4 cursor-pointer"
                              onClick={() => deleteOption(index)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="rounded-lg bg-gray-100 p-3 text-center text-gray-600">
                    There are no options
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!showNewOptionInput && (
          <PrimaryButton
            type="button"
            className="w-full max-w-none"
            onClick={() => setShowNewOptionInput(true)}
          >
            Add Option
          </PrimaryButton>
        )}
        <InputError message={errors?.options} className="mt-2" />
      </div>

      {showNewOptionInput && (
        <>
          <div className="col-span-6 ">
            <InputLabel className="mb-2" value="Option Title" required />
            <div className="flex space-x-3">
              <TextInput
                name="title"
                value={newOption.title}
                placeholder="New Option Title"
                handleChange={e =>
                  setNewOption(prev => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="col-span-6 mt-4 flex space-x-4">
            <PrimaryButton
              type="button"
              onClick={addNewOption}
              className="w-24"
            >
              Save
            </PrimaryButton>
            <SecondaryButton
              type="button"
              onClick={() => {
                setShowNewOptionInput(false);
                resetNewOption();
              }}
              className="w-24"
            >
              Cancel
            </SecondaryButton>
          </div>
        </>
      )}
    </>
  );
}

export default FieldOptionsList;
