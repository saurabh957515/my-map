import React, { useState } from 'react';
import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import ExportModal from './ExportModal';

function Export({ isExportModal, setIsExportModal }) {
  const [modal, setIsModal] = useState(false);
  const [exportId, setExportId] = useState(null);

  function onClose() {
    setIsExportModal(false);
  }

  const startExport = async () => {
    setIsModal(true);
    try {
      const response = await axios.get('/export/canvasLead');
      if (response.data.error) {
        setIsModal(false);
        setIsExportModal(false);
      } else {
        setExportId(response.data);
      }
    } catch (error) {
      console.error('Error starting export', error);
    }
  };

  return (
    <>
      <Popup
        open={isExportModal}
        setOpen={onClose}
        header={'Export'}
        className="sm:max-w-sm"
      >
        <p className="mb-4 text-center text-gray-600">Pick report type:</p>
        <div className="m-6">
          <PrimaryButton
            className="w-full py-2 text-lg font-semibold text-white"
            onClick={() => startExport()}
          >
            Export Data
          </PrimaryButton>
        </div>
      </Popup>

      <ExportModal
        getExportId={exportId}
        modal={modal}
        setIsModal={setIsModal}
        setIsExportModal={setIsExportModal}
      />
    </>
  );
}

export default Export;
