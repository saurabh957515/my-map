import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router, useForm } from '@inertiajs/react';
import React from 'react';
import FieldsForm from './FieldsForm';

function FieldsCreate({ open, setOpen }) {
  const { data, setData, errors, setError, clearErrors, processing, reset } =
    useForm({
      name: '',
      input_type: '',
      is_default: false,
      is_read_only: false,
      use_as_filter: false,
      show_in_activity_feed: false,
      options: [],
      required_stages: [],
    });

  const onClose = () => {
    setOpen(false);
    clearErrors();
    reset();
  };

  function Save(e) {
    clearErrors();
    e.preventDefault();
    router.post(route('tenant.canvas.fields.store'), data, {
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
    <Popup open={open} setOpen={onClose} header="Add Field">
      <div className="grid-cols-6 gap-5 sm:grid">
        <FieldsForm data={data} setData={setData} errors={errors} />
        <div className="col-span-6 mt-5 flex justify-end space-x-4">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={e => Save(e)}
            disabled={processing}
            className="w-36"
          >
            Save
          </PrimaryButton>
        </div>
      </div>
    </Popup>
  );
}

export default FieldsCreate;
