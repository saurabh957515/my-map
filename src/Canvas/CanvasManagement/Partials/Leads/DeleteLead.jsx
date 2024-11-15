import Popup from '@/Components/Popup';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const DeleteLead = ({
  deleteTeam,
  setDeleteTeam,
  handleDeleteUser,
  userToDelete,
}) => {
  function onClose() {
    setDeleteTeam(false);
  }

  return (
    <Popup
      open={deleteTeam}
      setOpen={onClose}
      header="Delete Lead Confirmation"
      size="sm"
    >
      <div>
        <p className="mb-4">Are you sure you want to delete this Lead?</p>
        <div className="flex justify-end space-x-4">
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

export default DeleteLead;
