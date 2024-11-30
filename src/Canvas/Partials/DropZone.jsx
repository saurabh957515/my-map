import React, { useEffect, useMemo, useState } from 'react';
import { memo } from 'react';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import { DocumentIcon, TrashIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/Providers/helpers';
import PrimaryButton from '@/Components/PrimaryButton';
import DragandMove from '@/Icons/DragandMove';
import ListActions from '@/Components/ListActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { PencilIcon } from '@heroicons/react/24/outline';
const acceptValue = {
  'application/json': ['.geojson'],
  'text/csv': ['.csv'],
  'application/vnd.google-earth.kml+xml': ['.kml'],
  'application/vnd.google-earth.kmz': ['.kmz'],
};

function DropZone({
  isSingle = true,
  accept,
  onClick,
  setFiles,
  files,
  errors,
  updatedFiles,
  newFile,
  setNewFile,
  checkFiles,
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: accept ? accept : acceptValue,
    onDrop: acceptedFiles => {
      const newFiles = _.cloneDeep(files);
      const isTrue = newFiles.find(
        file => file.name === acceptedFiles[0]?.name
      );
      if (isTrue) return;

      const addedFile = Object.assign(acceptedFiles[0], {
        preview: acceptedFiles[0].type.startsWith('image/')
          ? URL.createObjectURL(acceptedFiles[0])
          : null,
      });

      if (isSingle) {
        setNewFile(addedFile);
      } else {
        setFiles(prev => [...prev, addedFile]);
        setNewFile([addedFile]);
      }
    },
  });

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  const getIcon = type => {
    return <DocumentIcon className="h-full w-full text-gray-400" />;
  };

  const onDragEnd = result => {
    if (!result.destination) return;
    const reorderedFiles = Array.from(files);
    const [movedFile] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, movedFile);
    const newOrderedFiles = reorderedFiles.map((file, index) => ({
      ...file,
      order: index + 1,
    }));
    setFiles(newOrderedFiles);
  };

  const isFileChanges = useMemo(() => {
    const checkFileChange = _.isEqual(files, checkFiles);
    return checkFileChange;
  }, [files, checkFiles]);
  return (
    <div className="flex h-full w-full flex-col py-2 ">
      <div className="space-y-4 ">
        <div
          className={classNames(
            'item-center  flex h-40 cursor-pointer justify-center rounded-lg border border-dashed border-latisSecondary-700 bg-latisSecondary-500 p-5 text-center text-gray-400'
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="my-auto text-latisGray-900">
            {newFile ? (
              <div className="relative ">
                <TrashIcon
                  onClick={e => {
                    e.preventDefault();
                    setNewFile('');
                  }}
                  className="absolute right-0 h-5 w-5 text-red-500"
                />
                <div className="flex h-full overflow-hidden">
                  <div className="item-center flex h-20 flex-col justify-center">
                    {getIcon('doc')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>Drag and Drop File here or click to</div>
                <PrimaryButton type="div">Browse</PrimaryButton>
              </div>
            )}
          </div>
        </div>
        <InputError className="my-2 px-4" message={errors['file']} />
        <div className="flex w-full flex-wrap items-center gap-4">
          {
            <PrimaryButton
              className="flex-1"
              processing={!newFile}
              onClick={onClick}
            >
              Upload
            </PrimaryButton>
          }
          <PrimaryButton
            className="flex-1"
            processing={isFileChanges}
            onClick={() => {
              updatedFiles();
            }}
          >
            Save Changes
          </PrimaryButton>
        </div>
      </div>
      <div className="grow overflow-auto py-2">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="filesDroppable">
            {provided => (
              <div
                className="my-2 mt-4 space-y-2"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {files.map((file, index) => (
                  <Draggable key={file.id} draggableId={file.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={classNames(
                          'flex w-full items-center justify-between rounded border  border-latisGray-400 px-4 py-2',
                          snapshot?.isDragging ? 'bg-latisGray-500' : ''
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="flex flex-wrap items-center text-xs text-latisGray-800">
                          {file?.file_name}
                        </div>
                        <ListActions
                          title={'More Actions'}
                          moreLinks={[
                            {
                              type: 'Delete Layer',
                              action: () => {
                                const oldData = [...files];
                                const newData = oldData
                                  ?.filter(cur => cur?.id !== file?.id)
                                  ?.map((file, index) => ({
                                    ...file,
                                    order: index + 1,
                                  }));
                                setFiles(newData);
                              },
                            },
                          ]}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default memo(DropZone);
