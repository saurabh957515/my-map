import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';

export default function ImportModal({
  isImportModalOpen,
  closeImportModal,
  downloadSampleFile,
  handleFileChange,
  selectedFile,
}) {
  const handleImport = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('module', 'CanvasLead');

      router.post(`/import-data`, formData, {
        onSuccess: message => {
          console.log(message);

          closeImportModal();
        },
        onError: message => {
          console.log(message);

          closeImportModal();
        },
      });
    } else {
      console.error('No file selected for import');
    }
  };

  return (
    <Popup
      open={isImportModalOpen}
      setOpen={closeImportModal}
      header="Import Data"
      size="xs"
    >
      <div className="p-4">
        <div className="space-y-4">
          <button
            className="flex items-center space-x-2 text-latisSecondary-800"
            onClick={downloadSampleFile}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Download Sample File</span>
          </button>

          <div>
            <label className="mb-2 block text-sm font-medium text-latisGray-700">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border p-2"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <SecondaryButton onClick={closeImportModal}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleImport} disabled={!selectedFile}>
              <ArrowUpTrayIcon className="inline h-5 w-5" /> Import
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Popup>
  );
}
