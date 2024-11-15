import React, { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import Popup from '@/Components/Popup';
import { router, useForm, usePage } from '@inertiajs/react';

import PrimaryButton from '@/Components/PrimaryButton';
import ToggleSwitch from '@/Components/ToggleSwitch';

function NotesModal({
  isNotesModalOpen,
  setIsNotesModalOpen,
  leadDetail,
  activityOptions,
  currentNoteId,
}) {
  const { auth } = usePage().props;
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData, post, setError, clearErrors, errors } = useForm({
    title: 'Note',
    activity_id: '',
    created_by: '',
    assigned_to: '',
    canvas_lead_id: '',
    is_log: true,
    notes: '',
  });
  const default_Log = {
    activity_id: '',
    result_id: '',
    title: 'Note',
    is_log: 1,
    visit_result: [],
    notes: '',
    type: [],
    assign_to: [],
    reminder: false,
    reminder_time: '',
    reminder_unit: 'Minutes',
  };
  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    router.post(route('tenant.canvas-lead-activity-store'), data, {
      onSuccess: mes => {
        setIsLoading(false);
        clearErrors();
        setData(default_Log);
        setIsNotesModalOpen(false);
      },
      onError: error => {
        console.log(error);

        setError(error);
        setIsLoading(false);
      },
    });
  };
  function onClose() {
    setIsNotesModalOpen(false);
  }

  useEffect(() => {
    const noteId = activityOptions?.find(
      activity => activity?.name === 'Note'
    )?.id;
    setData(pre => ({
      ...pre,
      activity_id: noteId || '',
      assigned_to: auth?.user?.id,
      canvas_lead_id: leadDetail?.id,
      created_by: auth?.user?.id,
      title: 'Note',
    }));
  }, [activityOptions, isNotesModalOpen]);

  return (
    <Popup
      open={isNotesModalOpen}
      setOpen={onClose}
      header={'Save Note'}
      size="xs"
    >
      <div className="grid space-y-5 max-xl:grid-cols-3 sm:grid">
        <div className="col-span-4 max-sm:mb-3">
          <InputLabel value="Lead" className="mb-2" />
          {leadDetail?.formatted_name}
        </div>
        <div className="col-span-4 max-sm:mb-3">
          <InputLabel forInput="offices" value="Notes" className="mb-2" />
          <textarea
            placeholder="Enter Call Note ..."
            value={data?.notes}
            style={{ height: '100px' }}
            className={`block w-full rounded-md border-latisGray-400 py-2 sm:text-sm`}
            onChange={e => setData('notes', e.target.value)}
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end space-x-4 border-t pt-5">
        <SecondaryButton processing={isLoading} onClick={() => onClose()}>
          <span className="px-3.5 ">Cancel</span>
        </SecondaryButton>

        <PrimaryButton onClick={handleSubmit}>
          <span className="px-8 "> Save </span>
        </PrimaryButton>
      </div>
    </Popup>
  );
}

export default NotesModal;
