import React from 'react';
import PrimaryButton from './PrimaryButton';

function SidePanel({ title, saveChanges, children }) {
  return (
    <>
      <div className="flex w-full items-center justify-between rounded-xl bg-white px-5 ">
        <h1 className="text-lg font-semibold">{title}</h1>
        <PrimaryButton className="my-5" onClick={() => saveChanges()}>
          Save Changes
        </PrimaryButton>
      </div>
      {children}
    </>
  );
}

export default SidePanel;
