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
      <Button
        size="sm"
        className="mx-2 bg-red-500 text-white py-2 px-4 rounded-md touch-manipulation"
        onPress={onOpen}
      >
        Ta bort
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2">
                Ta bort träningspass
              </ModalHeader>
              <ModalBody className="py-4">
                <p className="text-base">
                  Detta tar bort träningspasset och all information kopplad till
                  det. Borttagningen går inte att ångra.
                </p>
              </ModalBody>
              <ModalFooter className="pt-3">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="p-3 touch-manipulation mr-2"
                >
                  Avbryt
                </Button>
                <Button
                  onPress={remove}
                  className="bg-red-500 text-white p-3 touch-manipulation"
                >
                  Ta bort
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default DeleteWorkout;
