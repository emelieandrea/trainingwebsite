"use client";
import {
  Box,
  Card,
  Checkbox,
  Flex,
  RadioCards,
  TextField,
} from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import { CustomButton } from "../components/ui/button";
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
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
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
  const [level, setLevel] = useState("2");
  const [repsInput, setRepsInput] = useState<string[]>([]);
  const [weightsInput, setWeightsInput] = useState<string[]>([]);

  // Move fetchExercises to a named function so it can be reused
  const fetchExercises = async () => {
    try {
      const snapshot = await getDocs(collection(db, "exerciseBank"));
      setExercises(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          ...doc.data(),
        }))
      );
      console.log("Updated fetch of exercises");
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSetChange = (e: { target: { value: string } }) => {
    const value = parseInt(e.target.value) || 1;
    setNumSets(value);
  };

  const handleCheckboxClick = () => {
    setCheckboxChecked((prev) => !prev);
  };

  const handleCheckboxLRClick = () => {
    setCheckboxLRChecked((prev) => !prev);
  };

  const renderedFields = checkboxChecked || !numSets ? 1 : numSets;

  const handleInputChange = (index: number, type: string, value: string) => {
    const updatedArray = type === "reps" ? [...repsInput] : [...weightsInput];
    updatedArray[index] = value;
    if (type === "reps") setRepsInput(updatedArray);
    else setWeightsInput(updatedArray);
  };

  const saveExercise = async () => {
    if (workout) {
      const workoutDocRef = doc(db, "workouts", workout);

      const exercisesCollectionRef = collection(workoutDocRef, "exercises");

      const setsArrayToSave = checkboxChecked
        ? Array.from({ length: numSets }, () => ({
            repetitions: repsInput[0] || 0,
            weight: weightsInput[0] || 0,
          }))
        : Array.from({ length: numSets }, (_, index) => ({
            repetitions: repsInput[index] || 0,
            weight: weightsInput[index] || 0,
          }));

      try {
        await addDoc(exercisesCollectionRef, {
          name: value,
          ref: doc(db, "exercises", value),
          sets: numSets,
          sameSet: checkboxChecked,
          leftright: checkboxLRChecked,
          set: setsArrayToSave,
          level: level,
        });
        console.log("Exercise added successfully!");
        value && setValue("");
        setLevel("2");
        console.log("returned states to default");
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
                  <CustomButton
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[330px] justify-between"
                  >
                    {value
                      ? exercises.find((exercise) => exercise.name === value)
                          ?.name
                      : "Välj övning..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </CustomButton>
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
                            value={exercise.name}
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
                            {exercise.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <NewExercise onExerciseAdded={fetchExercises} />
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
                    onChange={(e) =>
                      handleInputChange(index, "weight", e.target.value)
                    }
                  />
                </label>
                <label>
                  {index === 0 && "Repetitioner/set"}
                  {index === 0 && checkboxLRChecked && "/sida"}
                  <TextField.Root
                    placeholder="Antal repetitioner"
                    style={{ minWidth: "200px" }}
                    onChange={(e) =>
                      handleInputChange(index, "reps", e.target.value)
                    }
                  />
                </label>
              </Flex>
            ))}
            <Box className="w-full">
              <RadioCards.Root
                defaultValue="2"
                size="1"
                style={{
                  display: "flex",
                  width: "100%",
                }}
                value={level}
                onValueChange={setLevel}
              >
                <RadioCards.Item
                  value="1"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <Flex direction="column" width="100%">
                    1
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item
                  value="2"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <Flex direction="column" width="100%">
                    2
                  </Flex>
                </RadioCards.Item>
                <RadioCards.Item
                  value="3"
                  style={{ flex: 1, textAlign: "center" }}
                >
                  <Flex direction="column" width="100%">
                    3
                  </Flex>
                </RadioCards.Item>
              </RadioCards.Root>
            </Box>
            <Flex gap="3" mt="4" justify="end">
              <CustomButton onClick={saveExercise}>
                Lägg till övning
              </CustomButton>
            </Flex>
          </Flex>
        </Card>
      </Box>
    </div>
  );
};

export default AddExercise;
