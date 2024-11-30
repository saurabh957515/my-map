import React, { useState } from 'react';
import { route } from '@/Providers/helpers';
import DeleteDialogue from '@/Components/DeleteDialogue';
import { router } from '@inertiajs/react';
import { TrashIcon } from '@heroicons/react/24/outline';

function DeleteStage({ stage }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  function destroy() {
    setDialogIsOpen(true);
  }

  const handleDelete = () => {
    router.delete(route('tenant.canvas.stages.destroy', stage.id));
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
        description={`Are you sure you want to delete ${stage.title} stage?`}
        onDelete={handleDelete}
      />
    </>
  );
}

export default DeleteStage;
