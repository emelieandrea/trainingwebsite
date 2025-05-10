import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  exerciseId: string;
  onDelete?: () => void;
}

const DeleteExercise: React.FC<Props> = ({ exerciseId, onDelete }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const remove = async () => {
    try {
      await deleteDoc(doc(db, "exerciseBank", exerciseId));
      console.log("Exercise deleted successfully");
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete();
      }
      onOpenChange();
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  return (
    <>
      <Button size="sm" className="mx-2 bg-red-500 text-white" onPress={onOpen}>
        Ta bort övning
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ta bort övning
              </ModalHeader>
              <ModalBody>
                <p>
                  Detta tar bort övningen och all information kopplad till den
                  för ALLA. Borttagningen går inte att ångra.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Avbryt
                </Button>
                <Button onPress={remove}>Ta bort</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default DeleteExercise;
