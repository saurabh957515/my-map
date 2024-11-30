import {
  ChatBubbleLeftIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import React, { useMemo, useState } from 'react';
import NotesIcon from '../../CanvasIcons/NotesIcon';
import InputLabel from '@/Components/InputLabel';
import ReactSelect from '@/Components/ReactSelect';
import NotesModal from './NotesModal';
const LeadOwner = ({
  leadData,
  setMapPointAddress,
  setIsAddLeadFormPopUp,
  setIsLeadEdit,
  handlePointClick,
  setLeadData,
}) => {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const stageOptions = useMemo(
    () =>
      leadData?.stagesOptions?.map(stage => ({
        label: stage?.name,
        value: stage?.id,
      })),
    [leadData]
  );
  const ownerOptions = useMemo(
    () =>
      leadData?.ownerOptions?.map(owner => ({
        label: owner?.name,
        value: owner?.id,
      })),
    [leadData]
  );

  let leadEmail = '';
  let leadPhone = '';
  if (leadData?.lead?.canvas_lead_metas) {
    Object.values(leadData?.lead?.canvas_lead_metas).forEach(meta => {
      if (meta.key === 'Email') {
        leadEmail = meta.value;
      } else if (meta.key === 'Phone') {
        leadPhone = meta.value;
      }
    });
  }

  return (
    <div className="z-50 flex w-full flex-col gap-4 border-b bg-white pb-4 ">
      <div className="flex w-full justify-between px-4">
        <div className="space-y-2">
          <h2 className="flex w-full items-center gap-2 text-base font-semibold">
            {leadData?.lead?.formatted_name}
          </h2>
          <span
            onClick={() => {
              handlePointClick({
                id: leadData?.lead?.id,
                geometry: {
                  coordinates: [
                    leadData?.lead?.longitude,
                    leadData?.lead?.latitude,
                  ],
                },
              });
            }}
            className="cursor-pointer select-none text-xs font-normal text-latisSecondary-900"
          >
            {leadData?.lead?.formatted_address}
          </span>
        </div>
        <div
          onClick={() => {
            setIsAddLeadFormPopUp(true);
            setMapPointAddress(leadData?.lead?.address);
            setIsLeadEdit(true);
          }}
        >
          <PencilIcon className="h-6 w-6 cursor-pointer text-latisGray-800" />
        </div>
      </div>
      <div className="mx-auto flex items-center gap-6 px-4">
        <div className="w-fit rounded-full border border-latisGray-400 p-2">
          <a href={`tel:${leadPhone}`}>
            <PhoneIcon className="h-6 w-6 text-latisGray-800" />
          </a>
        </div>
        <div className="w-fit rounded-full border border-latisGray-400 p-2">
          <a href={`sms:[${leadPhone}]&body=[default message]`}>
            <ChatBubbleLeftIcon className="h-6 w-6 text-latisGray-800" />
          </a>
        </div>
        <div className="w-fit rounded-full border border-latisGray-400 p-2">
          <a href={`mailto:${leadEmail}`}>
            <EnvelopeIcon className="h-6 w-6 text-latisGray-800" />
          </a>
        </div>
        <div
          className="w-fit cursor-pointer rounded-full border border-latisGray-400 p-2"
          onClick={() => setIsNotesModalOpen(true)}
        >
          <NotesIcon className="h-5 w-6 text-latisGray-800 opacity-70" />
        </div>
        <NotesModal
          setLeadData={setLeadData}
          isNotesModalOpen={isNotesModalOpen}
          leadDetail={leadData?.lead}
          currentNoteId={leadData?.note_activity_id}
          activityOptions={leadData?.activityTypeOptions}
          setIsNotesModalOpen={setIsNotesModalOpen}
        />
      </div>
      <div className="space-y-2 px-4">
        <div>
          <InputLabel
            required
            className="text-sm font-normal leading-5 text-latisGray-900"
            value={'Stage'}
          />
          <ReactSelect
            options={stageOptions}
            value={leadData?.lead?.canvas_stage_id}
          />
        </div>
        <div>
          <InputLabel
            className="text-sm font-normal leading-5 text-latisGray-900"
            value={'Owner'}
          />
          <ReactSelect
            value={leadData?.lead?.owner_id}
            options={ownerOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadOwner;
