import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router, useForm } from '@inertiajs/react';
import React from 'react';

import StageForm from './StageForm';

function StageCreate({ open, setOpen }) {
  const { data, setData, errors, clearErrors, processing, setError, reset } =
    useForm({
      name: '',
      canvas_stage_type_id: '',
      color: '',
      reasons: [],
    });

  const onClose = () => {
    reset();
    setOpen(false);
    clearErrors();
  };

  function Save(e) {
    clearErrors();
    e.preventDefault();
    router.post(route('tenant.canvas.stages.store'), data, {
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
    <Popup open={open} setOpen={onClose} header="Add Stage">
      <div className="grid-cols-6 gap-5 sm:grid">
        <StageForm data={data} setData={setData} errors={errors} open={open} />
        <div className="col-span-6 mt-5 flex justify-end space-x-4">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={Save} disabled={processing} className="w-36">
            Save
          </PrimaryButton>
        </div>
      </div>
    </Popup>
  );
}

export default StageCreate;
