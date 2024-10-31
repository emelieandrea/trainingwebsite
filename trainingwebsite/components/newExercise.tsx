"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  Flex,
  IconButton,
  RadioGroup,
  TextField,
} from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "../components/ui/button";

const NewExercise = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(""); // Selected exercise type ID
  const [exerciseTypes, setExerciseTypes] = useState<
    { id: string; name: string }[]
  >([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "exerciseType"),
      (snapshot) => {
        const exerciseTypesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setExerciseTypes(exerciseTypesList);
        if (exerciseTypesList.length > 0) {
          setValue(exerciseTypesList[0].id);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const saveExercise = async () => {
    const name = nameRef.current?.value || ""; // Retrieve the name input value
    const description = descriptionRef.current?.value || ""; // Retrieve the description input value

    if (name && description && value) {
      // Ensure fields are filled
      try {
        await addDoc(collection(db, "exercises"), {
          name,
          description,
          type: value,
        });
        console.log("Exercise saved successfully!");
        setErrorMessage(""); // Clear any error
        setDialogOpen(false); // Close dialog on success
      } catch (error) {
        console.error("Error saving exercise: ", error);
        setErrorMessage("Det gick inte att spara övningen. Försök igen."); // Error handling
      }
    } else {
      setErrorMessage("Du måste fylla i alla fälten."); // Display message if fields are missing
    }
  };
  const closeDialog = () => {
    setErrorMessage(""); // Clear any error
    setDialogOpen(false); // Close dialog on success
  };

  return (
    <div>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Trigger>
          <IconButton className="hover:cursor-pointer" variant="surface">
            <PlusIcon width="18" height="18" />
          </IconButton>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px" minHeight="h-full">
          <Dialog.Title>Lägg till en övning</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Övningen läggs till för alla användare.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <span>Namn</span>
              <TextField.Root
                ref={nameRef}
                placeholder="Lägg till övningens namn"
              />
            </label>
            <label>
              <span>Beskrivning</span>
              <TextField.Root
                ref={descriptionRef}
                placeholder="Lägg till en beskrivning"
              />
            </label>
            <Flex direction="row" gap="2" asChild>
              <RadioGroup.Root
                variant="classic"
                value={value}
                onValueChange={setValue}
              >
                {exerciseTypes.map((type) => (
                  <RadioGroup.Item
                    key={type.id}
                    value={type.id}
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
            <Button color="gray" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={saveExercise}>Save</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default NewExercise;
