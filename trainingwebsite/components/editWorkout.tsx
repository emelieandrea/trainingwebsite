import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../Context/AuthContext";
import { useEffect } from "react";

interface Props {
  workoutId: string;
  onEdit?: () => void;
}

const EditWorkout: React.FC<Props> = ({ workoutId, onEdit }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const EditWorkout = async () => {
    if (!user || loading) return;
    try {
      const workoutsQuery = query(
        collection(db, "workouts"),
        where("owner", "==", user.uid),
        where("finished", "==", false)
      );

      const activeWorkout = await getDocs(workoutsQuery);

      if (!activeWorkout.empty) {
        onOpenChange(); // Open the modal if an active workout is found
      } else {
        try {
          const workoutDocRef = doc(db, "workouts", workoutId);
          await updateDoc(workoutDocRef, {
            finished: false, // Reset the workout to unfinished state
          });
          router.push("/createWorkout"); // Redirect to create workout page
        } catch (error) {
          console.error("Error editing workout:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching workout:", error);
    }
  };

  return (
    <>
      <Button size="sm" className="mx-2" onPress={EditWorkout}>
        Redigera träningspass
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2">
                Redigera träningspass
              </ModalHeader>
              <ModalBody className="py-4">
                <p className="text-base">
                  Träningspasset går ej att redigera eftersom ett annat
                  träningspass håller på att redigeras eller skapas.
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditWorkout;
