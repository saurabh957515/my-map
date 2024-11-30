import React, { useState } from 'react';
import { route } from '@/Providers/helpers';
import DeleteDialogue from '@/Components/DeleteDialogue';
import { router } from '@inertiajs/react';
import { TrashIcon } from '@heroicons/react/24/outline';

function DeleteField({ field }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  function destroy() {
    setDialogIsOpen(true);
  }

  const handleDelete = () => {
    router.delete(route('tenant.canvas.fields.destroy', field.id));
    setDialogIsOpen(false);
  };

  return (
    <>
      <TrashIcon
        className="h-4 w-4 text-latisGray-800"
        onClick={e => destroy(e)}
      />
      <DeleteDialogue
        dialogIsOpen={dialogIsOpen}
        setDialogIsOpen={setDialogIsOpen}
        title="Delete"
        description={`Are you sure you want to delete ${field.title} field?`}
        onDelete={handleDelete}
      />
    </>
  );
}

export default DeleteField;
