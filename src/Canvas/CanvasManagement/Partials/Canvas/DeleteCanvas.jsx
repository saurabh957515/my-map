import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const DeleteCanvas = ({
  officeDeleteDialogOpen,
  setOfficeDeleteDialogOpen,
  userToDelete,
  handleDeleteUser,
}) => {
  function onClose() {
    setOfficeDeleteDialogOpen(false);
  }

  return (
    <Popup
      open={officeDeleteDialogOpen}
      setOpen={onClose}
      header="Delete User Confirmation"
      size="sm"
    >
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-end space-x-3 pt-5">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={() => {
              handleDeleteUser(userToDelete);
            }}
          >
            Delete
          </PrimaryButton>
        </div>
      </div>
    </Popup>
  );
};

export default DeleteCanvas;
