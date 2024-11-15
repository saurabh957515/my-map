import { PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';

function AddListButton({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="w-fit cursor-pointer rounded border border-latisSecondary-600 bg-latisSecondary-500 p-1.5"
    >
      <PlusIcon className=" h-6 w-6 text-latisSecondary-800" />
    </div>
  );
}

export default AddListButton;
