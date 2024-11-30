import Checkbox from '@/Components/Checkbox';
import CustomColorPicker from '@/Components/CustomColorPicker';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import DragandMove from '@/Icons/DragandMove';
import {
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ActivityResults({ data, setData, reset }) {
  const [newResult, setNewResult] = useState({
    title: '',
    is_active: true,
    color: '',
    order: data?.results?.length + 1,
  });

  const [editIndex, setEditIndex] = useState(null);
  const [showNewResultInput, setShowNewResultInput] = useState(false);
  const saveNewResult = () => {
    if (!newResult.title || !newResult.color) return;

    if (editIndex !== null) {
      setData(prev => {
        const updatedResults = [...prev.results];
        updatedResults[editIndex] = newResult;
        return {
          ...prev,
          results: updatedResults,
        };
      });
      setEditIndex(null);
    } else {
      setData(prev => ({
        ...prev,
        results: [...prev.results, newResult],
      }));
    }
    resetNewResult();
    setShowNewResultInput(false);
  };

  const editResult = index => {
    const resultToEdit = data.results[index];
    setNewResult(resultToEdit);
    setEditIndex(index);
    setShowNewResultInput(false);
  };

  const deleteResult = index => {
    setData(prev => {
      const updatedResults = prev.results
        .filter((_, i) => i !== index)
        .map((result, i) => ({
          ...result,
          order: i + 1,
        }));

      return {
        ...prev,
        results: updatedResults,
      };
    });
  };

  const cancelEditResult = () => {
    setEditIndex(null);
    resetNewResult();
  };

  const resetNewResult = () => {
    setNewResult({
      title: '',
      is_active: true,
      color: '',
      order: data.results.length + 1,
    });
  };

  const addNewResult = () => {
    setShowNewResultInput(true);
    setEditIndex(null);
    resetNewResult();
  };

  const onDragEnd = result => {
    if (!result.destination) return;

    const reorderedResults = Array.from(data.results);
    const [movedResult] = reorderedResults.splice(result.source.index, 1);
    reorderedResults.splice(result.destination.index, 0, movedResult);

    const updatedResults = reorderedResults.map((result, index) => ({
      ...result,
      order: index + 1,
    }));

    setData(prev => ({
      ...prev,
      results: updatedResults,
    }));
  };

  return (
    <>
      <div className="col-span-6 space-y-2 ">
        <InputLabel className="mb-2" value="Custom Results" />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="results-list">
            {provided => (
              <div
                className="scrollbar-hide max-h-[200px] space-y-2 overflow-y-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {data.results?.length > 0 ? (
                  data.results
                    .sort((a, b) => a.order - b.order)
                    .map((result, index) => (
                      <Draggable
                        key={result.order}
                        draggableId={result.order.toString()}
                        index={index}
                        isDragDisabled={!result.is_active}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`flex w-full items-center gap-x-2 rounded-lg border p-4 ${
                              result.is_active
                                ? 'border-gray-300'
                                : 'border-gray-200 opacity-60'
                            } ${snapshot.isDragging ? 'bg-gray-100' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {editIndex === index ? (
                              <div className="w-full items-center gap-x-2 space-y-3">
                                <div className="flex space-x-2">
                                  {!newResult.is_default ? (
                                    <TextInput
                                      name="title"
                                      value={newResult.title}
                                      placeholder="Result Title"
                                      handleChange={e =>
                                        setNewResult(prev => ({
                                          ...prev,
                                          title: e.target.value,
                                        }))
                                      }
                                    />
                                  ) : (
                                    <p className="mt-2 flex w-full flex-col items-start">
                                      {newResult.title}
                                    </p>
                                  )}

                                  <CustomColorPicker
                                    color={newResult.color}
                                    onChange={color =>
                                      setNewResult(prev => ({ ...prev, color }))
                                    }
                                  />
                                </div>
                                {!newResult.is_default && (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      value={newResult.is_active}
                                      handleChange={e =>
                                        setNewResult(prev => ({
                                          ...prev,
                                          is_active: e.target.checked,
                                        }))
                                      }
                                    />
                                    <InputLabel
                                      forInput="active"
                                      value="Active"
                                    />
                                  </div>
                                )}
                                <div className="ml-auto flex justify-end space-x-2">
                                  <SecondaryButton onClick={cancelEditResult}>
                                    Cancel
                                  </SecondaryButton>
                                  <PrimaryButton
                                    type="button"
                                    onClick={saveNewResult}
                                  >
                                    Add Result
                                  </PrimaryButton>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center space-x-2">
                                  {result.is_active ? (
                                    <DragandMove className="h-5 w-5 text-latisGray-800" />
                                  ) : (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <span
                                      className="h-2 w-2 rounded-full "
                                      style={{ backgroundColor: result.color }}
                                    ></span>
                                    <p className="text-sm font-normal text-latisGray-900">
                                      {result.title}
                                    </p>
                                  </div>
                                </div>
                                <div className="ml-auto flex justify-end space-x-1.5">
                                  {!(result.is_default || result.is_active) && (
                                    <TrashIcon
                                      className="h-4 w-4 text-latisGray-800"
                                      onClick={() => deleteResult(index)}
                                    />
                                  )}
                                  <PencilIcon
                                    className="h-4 w-4 text-latisGray-800"
                                    onClick={() => editResult(index)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                ) : (
                  <div className="mb-4 mt-2.5 rounded-md bg-latisGray-300 p-4 text-center text-sm font-normal text-latisGray-700">
                    There are no custom results
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!showNewResultInput && editIndex === null && (
          <PrimaryButton
            type="button"
            className="mt-4 w-full max-w-none rounded px-4 py-2.5"
            onClick={addNewResult}
          >
            Add Result
          </PrimaryButton>
        )}
      </div>
      {showNewResultInput && (
        <>
          <div className="col-span-6 ">
            <InputLabel className="mb-2" value="Result Title" />
            <div className="flex space-x-3">
              <TextInput
                name="title"
                value={newResult.title}
                placeholder="Result Title"
                handleChange={e =>
                  setNewResult(prev => ({ ...prev, title: e.target.value }))
                }
              />
              <CustomColorPicker
                color={newResult.color}
                onChange={color => setNewResult(prev => ({ ...prev, color }))}
              />
            </div>
          </div>

          <div className="col-span-6 mt-5 flex space-x-4">
            <SecondaryButton
              onClick={() => {
                setShowNewResultInput(false);
                resetNewResult();
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton type="button" onClick={saveNewResult}>
              Add Result
            </PrimaryButton>
          </div>
        </>
      )}
    </>
  );
}

export default ActivityResults;
