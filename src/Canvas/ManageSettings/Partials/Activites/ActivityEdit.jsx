import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import ActivityModelForm from './ActivityModelForm';
import { PencilIcon } from '@heroicons/react/24/outline';

function ActivityEdit({ activity }) {
  const [isShowFieldEditForm, setIsShowFieldEditForm] = useState(false);

  const { data, setData, errors, setError, clearErrors, reset } = useForm({
    name: activity.name,
    type: activity.type,
    category: activity.category,
    default_duration: activity.default_duration,
    results: activity.results,
    is_default: activity.is_default,
    is_suspendible: activity.is_suspendible,
    is_suspended: activity.is_suspended,
  });

  const onClose = () => {
    setIsShowFieldEditForm(false);
    clearErrors();
  };

  function Save(e) {
    clearErrors();
    e.preventDefault();
    router.patch(route('tenant.canvas.activities.update', activity.id), data, {
      onSuccess: () => {
        clearErrors();
        onClose();
      },
      onError: error => {
        setError(error);
      },
    });
  }

  return (
    <>
      <PencilIcon
        className="h-4 w-4 cursor-pointer text-latisGray-800"
        onClick={() => {
          setIsShowFieldEditForm(true);
        }}
      />
      <Popup
        open={isShowFieldEditForm}
        setOpen={onClose}
        header="Edit Activity"
      >
        <div className="scrollbar-hide max-h-[500px] grid-cols-6 gap-3 overflow-y-auto sm:grid">
          <ActivityModelForm
            data={data}
            setData={setData}
            errors={errors}
            isEdit={true}
          />
        </div>
        <div className="mt-10 flex justify-end space-x-4 border-t border-latisGray-500 pt-5">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="button" className="w-36" onClick={Save}>
            Save
          </PrimaryButton>
        </div>
      </Popup>
    </>
  );
}

export default ActivityEdit;
