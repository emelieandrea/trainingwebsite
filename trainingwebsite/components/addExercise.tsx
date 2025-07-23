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
import { useIsMobile } from "../hooks/use-mobile";
import { useToast } from "../hooks/use-toast";

interface Props {
  workout: string;
}

const AddExercise: React.FC<Props> = ({ workout }) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // For debugging mobile detection
  useEffect(() => {
    console.log("Is mobile device:", isMobile);
  }, [isMobile]);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [checkboxLRChecked, setCheckboxLRChecked] = useState(false);
  const [numSets, setNumSets] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{
    id: string;
    name: string;
    type?: string;
  } | null>(null);
  const [exercises, setExercises] = useState<
    {
      type: string | undefined;
      id: string;
      name: string;
      description: string;
    }[]
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
          type: doc.data().type,
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
          name: selectedExercise?.name,
          ref: doc(db, "exercises", selectedExercise?.id || ""),
          sets: numSets,
          sameSet: checkboxChecked,
          leftright: checkboxLRChecked,
          set: setsArrayToSave,
          level: level,
        });
        console.log("Exercise added successfully!");
        toast({
          title: "Övning tillagd",
          description: "Övningen har lagts till i ditt träningspass.",
          className:
            "bg-green-100 border-2 border-green-500 text-green-800 shadow-xl",
          duration: 2000,
        });
        setSelectedExercise(null);
        setLevel("2");
        setCheckboxChecked(true);
        setCheckboxLRChecked(false);
        console.log("returned states to default");
      } catch (error) {
        console.error("Error adding exercise:", error);
        // Show desktop error toast
        toast({
          title: "Något gick fel",
          description:
            "Kunde inte lägga till övningen. Se till att alla fält är ifyllda.",
          className:
            "bg-red-100 border-2 border-red-500 text-red-800 shadow-xl",
          duration: 2000,
        });
      }
    } else {
      console.error("Error: No workout ID provided.");
    }
  };

  return (
    <div>
      {isMobile ? (
        <div className="w-full px-0">
          <Box width="100%" className="max-w-full mx-0">
            <Card className="shadow-sm rounded-none">
              <Flex direction="column" gap="4" align="baseline" className="p-1">
                {/* Same content as desktop version */}
                <Flex direction="row" gap="3" align="center" className="w-full">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <CustomButton
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between py-2 px-3 text-base"
                      >
                        {selectedExercise ? (
                          <>
                            {selectedExercise.name}
                            {selectedExercise.type && (
                              <span className="text-gray-400 ml-1">
                                {" - "}
                                {selectedExercise.type}
                              </span>
                            )}
                          </>
                        ) : (
                          "Välj övning..."
                        )}
                        <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                      </CustomButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-screen p-0 max-h-[60vh] overflow-auto border-0 rounded-none">
                      <Command>
                        <CommandInput
                          placeholder="Sök övning..."
                          className="py-3"
                        />
                        <CommandList className="max-h-[50vh]">
                          <CommandEmpty>Ingen övning hittad.</CommandEmpty>
                          <CommandGroup>
                            {exercises.map((exercise) => (
                              <CommandItem
                                key={exercise.id}
                                value={exercise.name}
                                className="py-3 px-3"
                                onSelect={(currentValue) => {
                                  const selected = exercises.find(
                                    (ex) => ex.name === currentValue
                                  );

                                  if (selected) {
                                    setSelectedExercise({
                                      id: selected.id,
                                      name: currentValue,
                                      type: selected.type,
                                    });
                                  } else {
                                    setSelectedExercise(null);
                                  }

                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedExercise?.id === exercise.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {exercise.name}
                                {exercise.type && (
                                  <span className="text-gray-400 ml-1">
                                    {" - "}
                                    {exercise.type}
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <NewExercise
                    onExerciseAdded={(id, name) => {
                      fetchExercises();
                      if (id && name) {
                        setSelectedExercise({ id, name });
                      }
                    }}
                  />
                </Flex>
                <Flex direction="column" gap="4" className="w-full">
                  <div className="w-full">
                    <label className="block mb-1 text-sm font-medium">
                      Antal set för övningen
                    </label>
                    <TextField.Root
                      placeholder="Antal set"
                      className="w-full"
                      onChange={handleSetChange}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>

                  <div className="flex flex-col gap-0 w-full">
                    <Flex
                      gap="2"
                      align="center"
                      className="touch-manipulation py-1"
                    >
                      <Checkbox
                        defaultChecked={checkboxChecked}
                        onClick={handleCheckboxClick}
                        className="h-5 w-5"
                      />
                      <span className="text-sm">Samma vikt/antal per set</span>
                    </Flex>

                    <Flex
                      gap="2"
                      align="center"
                      className="touch-manipulation py-1"
                    >
                      <Checkbox
                        defaultChecked={checkboxLRChecked}
                        onClick={handleCheckboxLRClick}
                        className="h-5 w-5"
                      />
                      <span className="text-sm">
                        Dela upp i höger och vänster
                      </span>
                    </Flex>
                  </div>
                </Flex>

                {Array.from({ length: renderedFields }).map((_, index) => (
                  <Flex
                    direction="column"
                    gap="3"
                    key={index}
                    className="w-full"
                  >
                    <div className="flex flex-col gap-3 w-full">
                      <label className="flex-1">
                        <span className="block mb-1 text-sm font-medium">
                          {index === 0 && "Vikt/set (kg)"}
                          {index === 0 && checkboxLRChecked && "/sida"}
                        </span>
                        <TextField.Root
                          placeholder="Vikt (kg)"
                          className="w-full"
                          onChange={(e) =>
                            handleInputChange(index, "weight", e.target.value)
                          }
                        />
                      </label>
                      <label className="flex-1">
                        <span className="block mb-1 text-sm font-medium">
                          {index === 0 && "Repetitioner/set"}
                          {index === 0 && checkboxLRChecked && "/sida"}
                        </span>
                        <TextField.Root
                          placeholder="Antal reps."
                          className="w-full"
                          onChange={(e) =>
                            handleInputChange(index, "reps", e.target.value)
                          }
                        />
                      </label>
                    </div>
                  </Flex>
                ))}
                <Box className="w-full mt-1">
                  <label className="block mb-2 text-sm font-medium">
                    Svårighetsgrad
                  </label>
                  <RadioCards.Root
                    defaultValue="2"
                    columns="3"
                    className="flex flex-row touch-manipulation"
                    size="1"
                    value={level}
                    onValueChange={setLevel}
                  >
                    <RadioCards.Item
                      value="1"
                      className="flex-1 text-center py-2 text-sm touch-manipulation"
                    >
                      <Flex direction="column" width="100%">
                        Lätt
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item
                      value="2"
                      className="flex-1 text-center py-2 text-sm touch-manipulation"
                    >
                      <Flex direction="column" width="100%">
                        Stark
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item
                      value="3"
                      className="flex-1 text-center py-2 text-sm touch-manipulation"
                    >
                      <Flex direction="column" width="100%">
                        Tungt
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>
                <Flex gap="3" mt="1" justify="center" className="w-full">
                  <CustomButton
                    onClick={saveExercise}
                    className="py-3 px-4 w-full text-base rounded-md touch-manipulation"
                  >
                    Lägg till övning
                  </CustomButton>
                </Flex>
              </Flex>
            </Card>
          </Box>
        </div>
      ) : (
        <div className="w-full px-4 sm:px-0">
          <Box width="100%" className="max-w-full sm:max-w-md mx-auto">
            <Card className="shadow-sm">
              <Flex
                direction="column"
                gap="4"
                align="baseline"
                className="p-2 sm:p-4"
              >
                <Flex direction="row" gap="3" align="center" className="w-full">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <CustomButton
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full sm:w-[330px] justify-between py-2 px-3 text-base"
                      >
                        {selectedExercise ? (
                          <>
                            {selectedExercise.name}
                            {selectedExercise.type && (
                              <span className="text-gray-500 ml-1">
                                {" - "}
                                {selectedExercise.type}
                              </span>
                            )}
                          </>
                        ) : (
                          "Välj övning..."
                        )}
                        <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                      </CustomButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-[90vw] sm:w-[330px] p-0 max-h-[60vh] overflow-auto">
                      <Command>
                        <CommandInput
                          placeholder="Sök övning..."
                          className="py-3"
                        />
                        <CommandList className="max-h-[50vh]">
                          <CommandEmpty>Ingen övning hittad.</CommandEmpty>
                          <CommandGroup>
                            {exercises.map((exercise) => (
                              <CommandItem
                                key={exercise.id}
                                value={exercise.name}
                                className="py-3 px-3"
                                onSelect={(currentValue) => {
                                  const selected = exercises.find(
                                    (ex) => ex.name === currentValue
                                  );

                                  if (selected) {
                                    setSelectedExercise({
                                      id: selected.id,
                                      name: currentValue,
                                      type: selected.type,
                                    }); // Store ID, name, and type in selectedExercise
                                  } else {
                                    setSelectedExercise(null);
                                  }

                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedExercise?.id === exercise.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {exercise.name}
                                {exercise.type && (
                                  <span className="text-gray-500 ml-1">
                                    {" - "}
                                    {exercise.type}
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <NewExercise
                    onExerciseAdded={(id, name) => {
                      fetchExercises();
                      if (id && name) {
                        setSelectedExercise({ id, name });
                      }
                    }}
                  />
                </Flex>
                <Flex direction="column" gap="4" className="w-full">
                  <div className="w-full">
                    <label className="block mb-1 text-sm font-medium">
                      Antal set för övningen
                    </label>
                    <TextField.Root
                      placeholder="Antal set"
                      className="w-full sm:w-auto"
                      onChange={handleSetChange}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Flex
                      gap="2"
                      align="center"
                      className="touch-manipulation py-1"
                    >
                      <Checkbox
                        defaultChecked={checkboxChecked}
                        onClick={handleCheckboxClick}
                        className="h-5 w-5"
                      />
                      <span className="text-sm">Samma vikt/antal per set</span>
                    </Flex>

                    <Flex
                      gap="2"
                      align="center"
                      className="touch-manipulation py-1"
                    >
                      <Checkbox
                        defaultChecked={checkboxLRChecked}
                        onClick={handleCheckboxLRClick}
                        className="h-5 w-5"
                      />
                      <span className="text-sm">
                        Dela upp i höger och vänster
                      </span>
                    </Flex>
                  </div>
                </Flex>

                {Array.from({ length: renderedFields }).map((_, index) => (
                  <Flex
                    direction="column"
                    gap="3"
                    key={index}
                    className="w-full"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <label className="flex-1">
                        <span className="block mb-1 text-sm font-medium">
                          {index === 0 && "Vikt/set (kg)"}
                          {index === 0 && checkboxLRChecked && "/sida"}
                        </span>
                        <TextField.Root
                          placeholder="Vikt (kg)"
                          className="w-full"
                          onChange={(e) =>
                            handleInputChange(index, "weight", e.target.value)
                          }
                        />
                      </label>
                      <label className="flex-1">
                        <span className="block mb-1 text-sm font-medium">
                          {index === 0 && "Repetitioner/set"}
                          {index === 0 && checkboxLRChecked && "/sida"}
                        </span>
                        <TextField.Root
                          placeholder="Antal repetitioner"
                          className="w-full"
                          onChange={(e) =>
                            handleInputChange(index, "reps", e.target.value)
                          }
                        />
                      </label>
                    </div>
                  </Flex>
                ))}
                <Box className="w-full mt-3">
                  <label className="block mb-2 text-sm font-medium">
                    Svårighetsgrad
                  </label>
                  <RadioCards.Root
                    defaultValue="2"
                    size="1"
                    className="flex flex-row touch-manipulation"
                    value={level}
                    onValueChange={setLevel}
                  >
                    <RadioCards.Item
                      value="1"
                      className="flex-1 text-center py-3 touch-manipulation"
                    >
                      <Flex direction="column" width="100%">
                        Lääätt 🧘
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item
                      value="2"
                      className="flex-1 text-center py-3 touch-manipulation"
                    >
                      <Flex direction="column" width="100%">
                        Stark 🏋
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item
                      value="3"
                      className="flex-1 text-center py-3 touch-manipulation"
                    >
                      <Flex direction="column" width="100%">
                        Tungt.. 🥵
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>
                <Flex gap="3" mt="5" justify="center" className="w-full">
                  <CustomButton
                    onClick={saveExercise}
                    className="py-3 px-4 w-full sm:w-auto text-base rounded-md touch-manipulation"
                  >
                    Lägg till övning
                  </CustomButton>
                </Flex>
              </Flex>
            </Card>
          </Box>
        </div>
      )}
    </div>
  );
};

export default AddExercise;
