import React from "react";
import { Box } from "@radix-ui/themes/components/box";
import { Text } from "@radix-ui/themes/components/index";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@heroui/react";

interface Props {
  id: string;
  name: string;
  set: { repetitions: number; weight: number }[];
  leftright: boolean;
  level: string | number; // Updated to accept either string or number
  sameSet: boolean;
  sets: number;
  workout: string;
  active: boolean;
}

const ExerciseCard: React.FC<Props> = ({
  id,
  name,
  set,
  leftright,
  level,
  sameSet,
  sets,
  workout,
  active,
}) => {
  const removeExercise = async () => {
    try {
      await deleteDoc(doc(db, "workouts", workout, "exercises", id));
      console.log("Workout deleted successfully");
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  return (
    <Box className="p-3 border rounded-md shadow-sm">
      <Text as="p" weight="bold" className="text-lg md:text-base">
        {name}
      </Text>
      {/* Exercise Sets */}
      <div className="mt-2">
        {set?.map((set, idx) => (
          <div key={idx} className="flex flex-wrap gap-2 md:gap-4 text-sm mb-1">
            <Text as="p" className="leading-snug">
              Set {idx + 1}: {set.repetitions} reps med {set.weight} kg{" "}
              {leftright ? "på varje sida" : ""}
            </Text>
          </div>
        ))}
      </div>
      <Text as="p" className="my-2">
        Nivå:{" "}
        {Number(level) === 1
          ? "Lääätt 🧘"
          : Number(level) === 2
          ? "Stark 🏋"
          : "Tungt.. 🥵"}
      </Text>
      {active ? (
        <Button
          size="sm"
          className="mt-2 bg-red-500 text-white w-full md:w-auto py-2 px-4 rounded-md touch-manipulation"
          onPress={removeExercise}
        >
          Ta bort övning
        </Button>
      ) : null}
    </Box>
  );
};

export default ExerciseCard;
