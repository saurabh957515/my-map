import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import CrossIcon from '@/Icons/CrossIcon';
import DragandMove from '@/Icons/DragandMove';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

function StageReasonsList({ data, setData }) {
  const [newReason, setNewReason] = useState({
    title: '',
    order: data.reasons.length + 1,
  });

  const [showNewReasonInput, setShowNewReasonInput] = useState(false);

  const addNewReason = () => {
    if (newReason.title.trim() === '') return;

    setData(prev => ({
      ...prev,
      reasons: [...prev.reasons, newReason],
    }));

    resetNewReason();
    setShowNewReasonInput(false);
  };

  const deleteReason = index => {
    setData(prev => {
      const updatedReasons = prev.reasons
        .filter((_, i) => i !== index)
        .map((option, i) => ({
          ...option,
          order: i + 1,
        }));

      return {
        ...prev,
        reasons: updatedReasons,
      };
    });
  };

  const resetNewReason = () => {
    setNewReason({
      title: '',
      order: data.reasons.length + 2,
    });
  };

  const onDragEnd = result => {
    if (!result.destination) return;

    const reorderedReasons = Array.from(data.reasons);
    const [movedReason] = reorderedReasons.splice(result.source.index, 1);
    reorderedReasons.splice(result.destination.index, 0, movedReason);

    const updatedReasons = reorderedReasons.map((option, index) => ({
      ...option,
      order: index + 1,
    }));

    setData(prev => ({
      ...prev,
      reasons: updatedReasons,
    }));
  };

  return (
    <>
      <div className="col-span-6 space-y-2">
        <InputLabel className="mb-2" value={`Loss Reasons`} />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="reasons-list">
            {provided => (
              <div
                className="space-y-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {data.reasons?.length > 0 ? (
                  data.reasons.map((option, index) => (
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
                              onClick={() => {
                                deleteReason(index);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="rounded-lg bg-gray-100 p-3 text-center text-gray-600">
                    There are no reasons
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!showNewReasonInput && (
          <PrimaryButton
            type="button"
            className="w-full max-w-none"
            onClick={() => setShowNewReasonInput(true)}
          >
            Add Reason
          </PrimaryButton>
        )}
      </div>

      {showNewReasonInput && (
        <>
          <div className="col-span-6 ">
            <InputLabel className="mb-2" value="Reason Title" required />
            <div className="flex space-x-3">
              <TextInput
                name="title"
                value={newReason.title}
                placeholder="New Reason Title"
                handleChange={e =>
                  setNewReason(prev => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="col-span-6 mt-4 flex space-x-4">
            <PrimaryButton
              type="button"
              onClick={addNewReason}
              className="w-24"
            >
              Save
            </PrimaryButton>
            <SecondaryButton
              type="button"
              onClick={() => {
                setShowNewReasonInput(false);
                resetNewReason();
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

export default StageReasonsList;
