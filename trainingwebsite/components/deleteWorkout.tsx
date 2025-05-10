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
  workoutId: string;
  onDelete?: () => void;
}

const DeleteWorkout: React.FC<Props> = ({ workoutId, onDelete }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const remove = async () => {
    try {
      await deleteDoc(doc(db, "workouts", workoutId));
      console.log("Workout deleted successfully");
      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete();
      }
      onOpenChange();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  return (
    <>
      <Button size="sm" className="mx-2 bg-red-500 text-white" onPress={onOpen}>
        Ta bort
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ta bort träningspass
              </ModalHeader>
              <ModalBody>
                <p>
                  Detta tar bort träningspasset och all information kopplad till
                  det. Borttagningen går inte att ångra.
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
export default DeleteWorkout;
