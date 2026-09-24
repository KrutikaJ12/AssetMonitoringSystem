import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  itemName: string;
  onDelete: () => void;
  buttonText?: string;
}
const DeleteConfirmationModal = ({isOpen,onClose,title,message,itemName,onDelete,buttonText}:DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <div className="flex justify-center items-center flex-col gap-4">
        {/* Trash Icon */}

        {/* <h2>Delete User</h2> */}

        <h2>
            {title}
        </h2>
        <p>{message}</p>
        <div>
            <p>{itemName}</p>
        </div>

        <div className="flex gap-4">
            <Button variant="outline" size="sm" onClick={()=>onClose()}>
                Cancel
            </Button>

            <Button size="sm"  onClick={()=>onDelete()}>
                Delete 
            </Button>
        </div>
    </div>
</Modal>
  )
}

export default DeleteConfirmationModal;