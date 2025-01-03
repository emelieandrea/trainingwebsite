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
import { CustomButton } from "../components/ui/button";

const NewExercise = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState("");
  const [toolsList, setTools] = useState<{ id: string; name: string }[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tools"), (snapshot) => {
      const toolsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setTools(toolsList);
    });

    return () => unsubscribe();
  });

  const saveExercise = async () => {
    const name = nameRef.current?.value || "";
    const description = descriptionRef.current?.value || "";

    if (name && description && value) {
      try {
        await addDoc(collection(db, "exercises"), {
          name,
          description,
          type: value,
        });
        console.log("Exercise saved successfully!");
        setErrorMessage("");
        setDialogOpen(false);
      } catch (error) {
        console.error("Error saving exercise: ", error);
        setErrorMessage("Det gick inte att spara övningen. Försök igen.");
      }
    } else {
      setErrorMessage("Du måste fylla i alla fälten.");
    }
  };
  const closeDialog = () => {
    setErrorMessage("");
    setDialogOpen(false);
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
                {toolsList.map((type) => (
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
            <CustomButton color="gray" onClick={closeDialog}>
              Avbryt
            </CustomButton>
            <CustomButton onClick={saveExercise}>Spara</CustomButton>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default NewExercise;
