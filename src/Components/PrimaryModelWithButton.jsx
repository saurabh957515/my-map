import React from 'react';
import { PlusIcon } from '@heroicons/react/20/solid';
import Popup from '@/Components/Popup';

export default function PrimaryModelWithButton({
  children,
  title,
  open,
  setOpen,
  classAdd = '',
}) {
  return (
    <div className="flex items-center p-6">
      <button
        onClick={() => setOpen(true)}
        className={`h-fit w-fit rounded-lg bg-mlmblue-700 p-1 text-white ${classAdd}`}
      >
        <span className="sr-only">Open options</span>
        <PlusIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <label className="px-4 text-base font-bold leading-6 text-mlmgray-900">
        {title}
      </label>
      <Popup open={open} setOpen={setOpen} header={title}>
        {children}
      </Popup>
    </div>
  );
}
