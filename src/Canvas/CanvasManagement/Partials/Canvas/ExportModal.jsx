import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ExportModal({
  getExportId,
  modal,
  setIsModal,
  setIsExportModal,
}) {
  const [exportId, setExportId] = useState(null);

  useEffect(() => {
    if (getExportId) {
      setExportId(getExportId);
    }
  }, [getExportId]);

  const checkExportStatus = async () => {
    try {
      if (exportId) {
        const response = await axios.get(`/exports/status/${exportId}`);
        if (response.data != '' && response.data.status === 'completed') {
          setIsModal(false);
          setIsExportModal(false);
          window.location.href = response.data.file_url;
        }
      }
    } catch (error) {
      console.error('Error checking export status', error);
    }
  };

  useEffect(() => {
    let interval;

    if (modal && exportId) {
      interval = setInterval(checkExportStatus, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [modal, exportId]);

  const onClose = () => {
    setIsModal(false);
  };
  const setExportType = async () => {
    try {
      if (exportId) {
        const res = await axios.get(`/export/update-type/${exportId}`);
        if (res.data && res.data == 1) {
          setIsModal(false);
        }
      }
    } catch (error) {
      console.error('Error starting export', error);
    }
  };
  return (
    <Popup
      open={modal}
      setOpen={onClose}
      header={'Exporting...'}
      className="sm:max-w-md"
    >
      <div className="m-6">
        <div className="mb-14 mt-14 flex justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
        </div>
        <p className="mb-6 text-center text-gray-600">
          If you don't have time to wait, you can get the file by email when
          it's ready
        </p>
        <div className="flex-col justify-center space-y-4 ">
          <PrimaryButton
            onClick={() => setExportType()}
            className="w-full px-4 py-2 text-white sm:w-80 "
          >
            Send File To Email
          </PrimaryButton>
          <SecondaryButton
            className="w-full px-4 py-2 text-gray-800 sm:w-80"
            onClick={onClose}
          >
            CANCEL
          </SecondaryButton>
        </div>
      </div>
    </Popup>
  );
}
