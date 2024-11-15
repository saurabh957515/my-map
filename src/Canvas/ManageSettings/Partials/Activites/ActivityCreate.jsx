import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router, useForm } from '@inertiajs/react';
import React from 'react';
import ActivityModelForm from './ActivityModelForm';

function ActivityCreate({ open, setOpen }) {
  const { data, setData, errors, setError, clearErrors, reset } = useForm({
    name: '',
    type: '',
    category: '',
    default_duration: '00:00',
    results: [],
    is_default: false,
    is_suspendible: true,
    is_suspended: false,
  });

  const onClose = () => {
    reset();
    setOpen(false);
    clearErrors();
  };

  function Save(e) {
    clearErrors();
    e.preventDefault();
    router.post(route('tenant.canvas.activities.store'), data, {
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
    <Popup open={open} setOpen={onClose} header="Add Activity">
      <div className="grid-cols-6 gap-5 sm:grid">
        <ActivityModelForm
          data={data}
          setData={setData}
          errors={errors}
          isEdit={false}
          reset={reset}
        />
        <div className="col-span-6 mt-5 flex justify-end space-x-4">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="button" className="w-36" onClick={e => Save(e)}>
            Add
          </PrimaryButton>
        </div>
      </div>
    </Popup>
  );
}

export default ActivityCreate;
