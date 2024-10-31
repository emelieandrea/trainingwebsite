"use client";
import { Box, Card, Checkbox, Flex, TextField } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import NewExercise from "../components/newExercise";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  workout: string;
}

const AddExercise: React.FC<Props> = ({ workout }) => {
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [checkboxLRChecked, setCheckboxLRChecked] = useState(false);
  const [numSets, setNumSets] = useState(1);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [exercises, setExercises] = useState<
    { id: string; name: string; description: string }[]
  >([]);

  useEffect(() => {
    // Set up a real-time listener for the "exercises" collection
    const unsubscribe = onSnapshot(collection(db, "exercises"), (snapshot) => {
      const exercisesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        ...doc.data(),
      }));
      setExercises(exercisesList); // Update state whenever data changes
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle changes for the "Antal set..." input field
  const handleSetChange = (e: { target: { value: string } }) => {
    const value = parseInt(e.target.value) || 1;
    setNumSets(value);
  };

  // Handle checkbox toggle
  const handleCheckboxClick = () => {
    setCheckboxChecked((prev) => !prev); // Toggle the checkbox state
  };

  const handleCheckboxLRClick = () => {
    setCheckboxLRChecked((prev) => !prev); // Toggle the checkbox state
  };

  // Dynamically calculate the number of fields to display based on conditions
  const renderedFields = checkboxChecked || !numSets ? 1 : numSets;

  const saveExercise = async () => {
    if (workout) {
      // Reference to the specific workout document
      const workoutDocRef = doc(db, "workouts", workout);

      // Reference to the exercises subcollection
      const exercisesCollectionRef = collection(workoutDocRef, "exercises");

      try {
        // Add the new exercise document to the subcollection
        await addDoc(exercisesCollectionRef, {
          name: value,
          ref: doc(db, "exercises", value),
          sets: numSets,
          sameSet: checkboxChecked,
          leftright: checkboxLRChecked,
          set: {
            repetitions: 0,
            weight: 0,
          },
        });
        console.log("Exercise added successfully!");
        value && setValue(""); // Clear the selected exercise
        numSets && setNumSets(1); // Reset the number of sets
        setCheckboxChecked(true); // Reset the checkbox state
        setCheckboxLRChecked(false); // Reset the checkbox state
      } catch (error) {
        console.error("Error adding exercise:", error);
      }
    } else {
      console.error("Error: No workout ID provided.");
    }
  };

  return (
    <div>
      <Box maxWidth="420px">
        <Card>
          <Flex direction="column" gap="3" align="baseline">
            <Flex direction="row" gap="3" align="center">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[330px] justify-between"
                  >
                    {value
                      ? exercises.find((exercise) => exercise.id === value)
                          ?.name
                      : "Välj övning..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[330px] p-0">
                  <Command>
                    <CommandInput placeholder="Sök övning..." />
                    <CommandList>
                      <CommandEmpty>Ingen övning hittad.</CommandEmpty>
                      <CommandGroup>
                        {exercises.map((exercise) => (
                          <CommandItem
                            key={exercise.id}
                            value={exercise.id}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === exercise.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {exercise.name} {/* Display the exercise name */}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <NewExercise />
            </Flex>
            <Flex direction="row" gap="3">
              <label>
                <TextField.Root
                  placeholder="Antal set för övningen"
                  style={{ minWidth: "150px" }}
                  onChange={handleSetChange}
                />
              </label>
              <Flex gap="2" align="center">
                <Checkbox
                  defaultChecked={checkboxChecked}
                  onClick={handleCheckboxClick}
                />
                <a>Samma vikt/antal per set</a>
              </Flex>
            </Flex>
            <Flex gap="2" align="center">
              <Checkbox
                defaultChecked={checkboxLRChecked}
                onClick={handleCheckboxLRClick}
              />
              <a>Dela upp i höger och vänster</a>
            </Flex>
            {Array.from({ length: renderedFields }).map((_, index) => (
              <Flex direction="row" align="center" gap="3" key={index}>
                <label>
                  {index === 0 && "Vikt/set (kg)"}
                  {index === 0 && checkboxLRChecked && "/sida"}
                  <TextField.Root
                    placeholder="Vikt (kg)"
                    style={{ minWidth: "150px" }}
                  />
                </label>
                <label>
                  {index === 0 && "Repetitioner/set"}
                  {index === 0 && checkboxLRChecked && "/sida"}
                  <TextField.Root
                    placeholder="Antal repetitioner"
                    style={{ minWidth: "200px" }}
                  />
                </label>
              </Flex>
            ))}
            <Flex gap="3" mt="4" justify="end">
              <Button onClick={saveExercise}>Lägg till övning</Button>
            </Flex>
          </Flex>
        </Card>
      </Box>
    </div>
  );
};

export default AddExercise;
