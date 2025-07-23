import { Button } from "@heroui/react";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { Dialog, Flex, RadioGroup, TextField } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { CustomButton } from "./ui/button";

interface Props {
  exerciseId: string;
  name: string;
  type: string;
  description: string;
  onEdit?: () => void;
}

const EditExercise: React.FC<Props> = ({
  exerciseId,
  name,
  type,
  description,
  onEdit,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(type);
  const [toolsList, setTools] = useState<{ id: string; name: string }[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to set input values when dialog opens
  const handleDialogOpen = (open: boolean) => {
    setDialogOpen(open);
    if (open) {
      // This will run when the dialog opens
      setValue(type);

      // Need to use setTimeout because the refs might not be set immediately
      setTimeout(() => {
        if (nameRef.current) {
          nameRef.current.value = name;
        }
        if (descriptionRef.current) {
          descriptionRef.current.value = description;
        }
      }, 0);
    }
  };

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const tools = await getDocs(collection(db, "tools"));
        setTools(
          tools.docs.map((doc) => ({ id: doc.id, name: doc.data().name }))
        );
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };

    fetchTools();
  }, []);

  const edit = async () => {
    try {
      const exerciseDocRef = doc(db, "exerciseBank", exerciseId);
      await updateDoc(exerciseDocRef, {
        name: nameRef.current?.value || "",
        type: value,
        description: descriptionRef.current?.value || "",
      });
      if (onEdit) {
        onEdit(); // Call the callback function if provided
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Error editing workout:", error);
    }
  };

  const closeDialog = () => {
    setErrorMessage("");
    setDialogOpen(false);
  };

  return (
    <div>
      <Dialog.Root open={dialogOpen} onOpenChange={handleDialogOpen}>
        <Dialog.Trigger>
          <Button size="sm" className="mx-2">
            Redigera övning
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="350px" minHeight="h-full">
          <Dialog.Title>Redigera övning</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Övningen ändras för alla användare.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <span>Namn</span>
              <TextField.Root
                ref={nameRef}
                placeholder="Lägg till övningens namn"
                defaultValue={name}
              />
            </label>
            <label>
              <span>Beskrivning</span>
              <TextField.Root
                ref={descriptionRef}
                placeholder="Lägg till en beskrivning"
                defaultValue={description}
              />
            </label>
            <Flex direction={"column"} gap="2">
              <RadioGroup.Root
                variant="classic"
                value={value}
                onValueChange={setValue}
              >
                {toolsList.map((type) => (
                  <RadioGroup.Item
                    key={type.id}
                    value={type.name}
                    id={type.id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {type.name}
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </Flex>
          </Flex>
          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
          )}
          <Flex gap="3" mt="4" justify="end">
            <CustomButton color="gray" onClick={closeDialog}>
              Avbryt
            </CustomButton>
            <CustomButton onClick={edit}>Spara</CustomButton>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
export default EditExercise;
