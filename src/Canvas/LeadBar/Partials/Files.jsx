import React, { useEffect, useMemo, useState } from 'react';
import { memo } from 'react';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import { DocumentIcon, TrashIcon } from '@heroicons/react/20/solid';
import { classNames } from '@/Providers/helpers';
import PrimaryButton from '@/Components/PrimaryButton';
import ListActions from '@/Components/ListActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { PencilIcon } from '@heroicons/react/24/outline';
import LeadOwner from './LeadOwner';
import FileUploadIcon from '@/Icons/FileUploadIcon';
import useApi from '@/hooks/useApi';
import { router } from '@inertiajs/react';
import { route } from '@/Providers/helpers';
const acceptValue = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    'docx',
  ],
  'application/pdf': ['pdf'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    'ppt',
  ],
  'application/vnd.oasis.opendocument.text': ['odt'],
  'application/vnd.oasis.opendocument.presentation': ['odp'],
};

function Files({ isSingle = true, accept, checkFiles, leadData }) {
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: accept ? accept : acceptValue,
    onDrop: acceptedFiles => {
      const newFiles = _.cloneDeep(files);
      const isTrue = newFiles?.find(
        file => file?.name === acceptedFiles[0]?.name
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
        // setFiles(prev => [...prev, addedFile]);
        setNewFile([addedFile]);
      }
    },
  });

  useEffect(() => {
    return () => files?.forEach(file => URL.revokeObjectURL(file?.preview));
  }, []);

  const getIcon = type => {
    return <DocumentIcon className="h-full w-full text-gray-400" />;
  };

  const { getRoute, postRoute } = useApi();
  const getLeadFiles = async () => {
    const { data, errors } = await postRoute(
      'canvas/web-get-canvas-lead/upload',
      {
        canvas_lead_id: leadData?.lead?.id,
      }
    );
    if (!errors) {
      setFiles(data);
      setNewFile(null);
    }
  };

  useEffect(() => {
    getLeadFiles();
  }, [leadData]);

  const uploadFile = leadId => {
    if (newFile) {
      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('canvas_lead_id', leadId);
      router.post(route('tenant.canvas.web-upload-file'), formData, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          getLeadFiles();
          setNewFile(null);
        },
        onError: errors => {
          console.error('Upload failed:', errors);
        },
      });
    }
  };

  const deleteFile = id => {
    router.post(
      route('tenant.canvas.delete-uploaded-file'),
      {
        canvas_lead_id: leadData?.lead?.id,
        media_id: id,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          getLeadFiles();
          setNewFile(null);
        },
        onError: errors => {
          console.error('Delete failed:', errors);
        },
      }
    );
  };
  return (
    <div className="flex h-full grow flex-col overflow-auto px-4 pb-4">
      <div
        className={classNames(
          'item-center  flex  cursor-pointer justify-center rounded-lg border border-dashed border-latisSecondary-700 bg-latisSecondary-500 px-5 py-8 text-center text-gray-400'
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className=" text-latisGray-900">
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
            <div className="flex flex-col items-center space-y-2">
              <FileUploadIcon className={'h-6 w-6 text-latisSecondary-800'} />
              <h1 className="text-sm leading-5 text-latisGray-900">
                Attach Files or Photos
              </h1>
              <div className="text-xs font-normal text-latisGray-700">
                Drag and drop file or click to browser
              </div>
              <PrimaryButton type="div">Browse</PrimaryButton>
            </div>
          )}
        </div>
      </div>

      {newFile && (
        <div className="flex w-full items-center gap-x-4">
          {
            <PrimaryButton
              onClick={() => {
                uploadFile(leadData?.lead?.id);
              }}
              processing={!newFile}
            >
              Upload
            </PrimaryButton>
          }
        </div>
      )}
      <div className="mt-4 text-xs text-latisGray-700">
        PNG, JPG, JPEG, GIF, PDF, DOCX and TXT files only. Max size 1 GB each.
      </div>
      <div className="scrollbar-hide grow overflow-y-auto py-2">
        <div className="my-2 mt-4 space-y-2">
          {files?.map((file, index) => (
            <div
              key={file.id}
              className={classNames(
                'flex w-full items-center justify-between rounded border  border-latisGray-400 px-4 py-2'
              )}
            >
              <div className="flex items-center text-xs text-latisGray-800">
                {file?.file_name}
              </div>
              <ListActions
                title={'More Actions'}
                moreLinks={[
                  {
                    type: 'Delete File',
                    action: () => {
                      deleteFile(file?.id);
                    },
                  },
                  {
                    type: 'Link',
                    action: () => {
                      if (file?.media_url) {
                        window.open(file.media_url, '_blank');
                      } else {
                        console.error('File URL not available.');
                      }
                    },
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(Files);
