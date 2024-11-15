import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import Popup from '@/Components/Popup';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

function EditLead({ isEditLeadModalOpen, setIsEditLeadModalOpen }) {
  const { data, setData, post, errors } = useForm({
    name: '',
    address: '',
  });

  function onClose() {
    setIsEditLeadModalOpen(false);
  }

  return (
    <Popup
      open={isEditLeadModalOpen}
      setOpen={onClose}
      header={'Edit Lead'}
      size="xs"
    >
      <form>
        <div className="grid space-y-5 max-xl:grid-cols-3 sm:grid">
          <div className="col-span-4 max-sm:mb-3">
            <InputLabel forInput="name" value="Lead Name" />
            <TextInput
              type="text"
              name="name"
              value={data.name}
              handleChange={e => setData('name', e.target.value)}
              placeholder="Enter Lead Name"
            />
            <InputError message={errors?.name} className="mt-2" />
          </div>
          <div className="col-span-4 max-sm:mb-3">
            <InputLabel forInput="address" value="Lead Address" />
            <TextInput
              type="text"
              name="address"
              value={data.address}
              handleChange={e => setData('address', e.target.value)}
              placeholder="Enter Lead Address"
            />
            <InputError message={errors?.address} className="mt-2" />
          </div>
        </div>
        <div className="mt-5 flex justify-end space-x-4 border-t pt-5">
          <SecondaryButton onClick={() => onClose()}>
            <span className="px-3.5 ">Cancel</span>
          </SecondaryButton>
          <PrimaryButton>
            <span className="px-8 "> Save </span>
          </PrimaryButton>
        </div>
      </form>
    </Popup>
  );
}

export default EditLead;
