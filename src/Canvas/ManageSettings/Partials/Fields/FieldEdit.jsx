import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import FieldsForm from './FieldsForm';
import { PencilIcon } from '@heroicons/react/24/outline';

function FieldEdit({ field }) {
  const [isShowFieldEditForm, setIsShowFieldEditForm] = useState(false);

  const { data, setData, errors, setError, clearErrors, processing, reset } =
    useForm({
      id: field.id,
      name: field.title,
      is_default: field.is_default,
      input_type: field.input_type,
      is_read_only: field.is_read_only,
      use_as_filter: field.use_as_filter,
      show_in_activity_feed: field.show_in_activity_feed,
      options: field.options,
      required_stages: field.required_stages,
      is_default: field.is_default,
    });

  const onClose = () => {
    setIsShowFieldEditForm(false);
    clearErrors();
  };

  function Save(e) {
    clearErrors();
    e.preventDefault();
    router.patch(route('tenant.canvas.fields.update', field?.id), data, {
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
        className="h-4 w-4 text-latisGray-800"
        onClick={() => {
          setIsShowFieldEditForm(true);
        }}
      />
      <Popup open={isShowFieldEditForm} setOpen={onClose} header="Edit Field">
        <div className="scrollbar-hide max-h-[50vh] grid-cols-6 gap-5 overflow-y-auto sm:grid">
          <FieldsForm
            data={data}
            setData={setData}
            errors={errors}
            isEdit={false}
          />
        </div>
        <div className="col-span-6 mt-5 flex justify-end space-x-4 border-t border-latisGray-400 pt-5">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="button" onClick={Save} className="w-36">
            Save
          </PrimaryButton>
        </div>
      </Popup>
    </>
  );
}

export default FieldEdit;
