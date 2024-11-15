import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

import StageForm from './StageForm';
import { PencilIcon } from '@heroicons/react/24/outline';

function StageEdit({ stage }) {
  const [isShowStageEditForm, setIsShowStageEditForm] = useState(false);

  const { data, setData, errors, clearErrors, setError, processing } = useForm({
    name: stage?.title,
    canvas_stage_type_id: stage?.canvas_stage_type_id,
    color: stage?.color,
    reasons: stage?.reasons,
  });

  const onClose = () => {
    setIsShowStageEditForm(false);
    clearErrors();
  };

  function Save(e) {
    clearErrors();
    e.preventDefault();
    router.patch(route('tenant.canvas.stages.update', stage?.id), data, {
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
        className="h-4 w-4"
        onClick={() => {
          setIsShowStageEditForm(true);
        }}
      />
      <Popup open={isShowStageEditForm} setOpen={onClose} header="Edit Stage">
        <div className="grid-cols-6 gap-5 sm:grid">
          <StageForm data={data} setData={setData} errors={errors} />
          <div className="col-span-6 mt-5 flex justify-end space-x-4">
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={Save}
              disabled={processing}
              className="w-36"
            >
              Save
            </PrimaryButton>
          </div>
        </div>
      </Popup>
    </>
  );
}

export default StageEdit;
