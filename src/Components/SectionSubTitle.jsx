import React from 'react';

function SectionSubTitle({ title, children }) {
  return (
    <div className="flex items-center justify-between bg-mlmgray-400 p-6 py-4 ">
      <div className="text-base font-semibold">{title}</div>
      <div>{children}</div>
    </div>
  );
}

export default SectionSubTitle;
